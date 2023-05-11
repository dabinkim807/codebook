const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./db/db-connection.js');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const REACT_BUILD_DIR = path.join(__dirname, "..", "client", "dist");
const PORT = process.env.PORT || 8080;

const jwtCheck = auth({
  audience: 'https://codebook/api',
  issuerBaseURL: 'https://dev-y8l2e8exqiihl4qw.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});
const token = process.env.MANAGEMENT_API_ACCESS_TOKEN;

app.use(cors());
app.use(express.json());
app.use(express.static(REACT_BUILD_DIR));
// app.use(jwtCheck);   // applies authorization requirement to access all routes; can be applied to individual routes

app.get('/', (req, res) => {
  res.sendFile(path.join(REACT_BUILD_DIR, "index.html"));
});

app.get('/authorized', jwtCheck, (req, res) => {
  console.log(req.auth.payload);
  res.send('Secured Resource');
});

// this route proves that all req.auth.payload comes from accessToken sent from frontend
app.get('/unauthorized', (req, res) => {
  console.log(req.auth);
  res.send('Unsecured Resource');
});

// log in route; if returning user, will already be in database 
app.get('/api/user', jwtCheck, async (req, res) => {
  try {
    const { rows: users } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.auth.payload.sub]);
    
    // if user is not in db, validated === false
      // show user Sign Up component
    if (users.length !== 1) {
      return res.status(200).json({validated: false});
    }

    // if user is validated, validated === true
      // show Schedule Page and send frontend: cc_category, cc_rank, cc_frequency, cc_day [fill in / pre-populate Schedule fields]
    if (users[0].validated) {
      return res.status(200).json({
        cc_category: users[0].cc_category,
        cc_rank: users[0].cc_rank,
        cc_frequency: users[0].cc_frequency, 
        cc_day: users[0].cc_day,
        validated: true
      });
    }

    // if user is in db but is not validated, test_challenge has already been assigned
    // call CW API, check test_challenge is fully passed (completed within time limit)
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${users[0].username}/code-challenges/completed`);
    const cw_data = await cw_response.json();
      
    for (const challenge of cw_data.data) {
      // if user completed test within time limit, set validated === true, 
        // send user to Schedule Page and send frontend: cc_category, cc_rank, cc_frequency, cc_day [fill in / pre-populate Schedule fields]
      if ((users[0].test_challenge === challenge.id) && (Date.parse(challenge.completedAt) - users[0].test_created <= 600000)) {
        await db.query("UPDATE users SET validated = true WHERE user_id = $1", [req.auth.payload.sub]);
        return res.status(200).json({
          cc_category: users[0].cc_category,
          cc_rank: users[0].cc_rank,
          cc_frequency: users[0].cc_frequency, 
          cc_day: users[0].cc_day,
          validated: true
        });
      }
    }

    // if test is not completed and 10 min hasn't passed yet,
      // re-send user the same test and keep them on Validation Page
    if (Date.now() - users[0].test_created <= 600000) {
      return res.status(200).json({
        test_challenge: users[0].test_challenge, 
        test_created: users[0].test_created,
        validated: false
      });
    }
  
    // if user has not passed test and 10 min have passed, validated === false
      // delete user from db and send them back to Sign Up component
    await db.query("DELETE FROM users WHERE user_id = $1", [req.auth.payload.sub]);
    res.status(200).json({validated: false});
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// validation route; after post, basic user info is in database
app.get('/api/done', jwtCheck, async (req, res) => {
  try {
    const { rows: users } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.auth.payload.sub]);

    // if user tries to run Done route without going through sign up process (i.e. runs request through Postman), user does not exist in db
    if (users.length !== 1) {
      return res.status(400).send(`No user with user id ${req.auth.payload.sub}`);
    }
    // if scheduled job runs before user clicks Done button, validated === true in db
      // send user to Schedule Page and send frontend: cc_category, cc_rank, cc_frequency, cc_day [fill in / pre-populate Schedule fields]
    if (users[0].validated) {
      return res.status(200).json({
        cc_category: users[0].cc_category,
        cc_rank: users[0].cc_rank,
        cc_frequency: users[0].cc_frequency, 
        cc_day: users[0].cc_day,
        validated: true
      });
    }
    
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${users[0].username}/code-challenges/completed`);
    const cw_data = await cw_response.json();
      
    for (const challenge of cw_data.data) {
      // if user completed test within time limit, set validated === true, 
        // send user to Schedule Page and send frontend: cc_category, cc_rank, cc_frequency, cc_day [fill in / pre-populate Schedule fields]
      if ((users[0].test_challenge === challenge.id) && (Date.parse(challenge.completedAt) - users[0].test_created <= 600000)) {
        await db.query("UPDATE users SET validated = true WHERE user_id = $1", [req.auth.payload.sub]);
        return res.status(200).json({
          cc_category: users[0].cc_category,
          cc_rank: users[0].cc_rank,
          cc_frequency: users[0].cc_frequency, 
          cc_day: users[0].cc_day,
          validated: true
        });
      }
    }
    
    // if user clicks Done and test is not completed and 10 min hasn't passed yet,
      // re-send user the same test and keep them on Validation Page
    if (Date.now() - users[0].test_created <= 600000) {
      return res.status(200).json({
        test_challenge: users[0].test_challenge, 
        test_created: users[0].test_created,
        validated: false
      });
    }

    // if user has not passed test and 10 min have passed, validated === false
      // delete user from db and send them back to Sign Up component
    await db.query("DELETE FROM users WHERE user_id = $1", [req.auth.payload.sub]);
    res.status(200).json({validated: false});
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// new user sign up + submit codewars username route
app.post('/api/users', jwtCheck, async (req, res) => {
  try {
    //// call Codewars List of CC API
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${req.body.username}/code-challenges/completed`);
    const cw_data = await cw_response.json();

    // if username does not exist in Codewars API, cw_data.success === false
    //   keep user at Sign Up component
    // otherwise cw_data.success === undefined
    if (cw_data.success === false) {
      return res.status(200).json({validated: false});
    }

    //// call Auth0 API
    // jwtCheck checks the accessToken that the user passes to backend thru frontend request via getAccessTokensSilently and provides the user data automatically
    const params = new URLSearchParams({
      q: `user_id:"${req.auth.payload.sub}"`,
      search_engine: 'v3'
    });
    const auth_response = await fetch(`https://dev-y8l2e8exqiihl4qw.us.auth0.com/api/v2/users?${params}`, {
      method: "GET",
      headers: {
        "authorization": `BEARER ${token}`
      }
    });
    const auth_data = await auth_response.json();
    // console.log(auth_data);

    const { rows: questions } = await db.query("SELECT challenge FROM code_challenges WHERE rank = 'Beginner'");
    // console.log(questions);
    // console.log(questions[0].challenge);

    let question_ids = questions.map(q => q.challenge);
    // console.log(question_ids);

    let done_ids = new Set(cw_data.data.map(q => q.id));

    let not_done_ids = question_ids.filter(q => !done_ids.has(q));
    let random_idx = Math.floor(Math.random() * not_done_ids.length);
    let random_question = not_done_ids[random_idx];
    let time_now = new Date();
    
    await db.query(
      `
      INSERT INTO users (user_id, username, email, test_challenge, test_created, name) 
      VALUES($1, $2, $3, $4, $5, $6);
      `
    , [req.auth.payload.sub, req.body.username, auth_data[0].email, random_question, time_now, auth_data[0].name]);

    return res.status(200).json({
      test_challenge: random_question,
      test_created: time_now,
      validated: false
    });
  } catch (e) {
    return res.status(400).json({e});
  }
});


app.listen(PORT, () => {
  console.log(`Hello, server is listening on ${PORT}`);
});