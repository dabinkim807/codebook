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
    res.json(users.length === 1);
    // user is not in DB
      // show user Sign Up component

    // user is validated
      // if true, then show Schedule Page and send frontend: cc_category, cc_rank, cc_frequency, cc_day [fill in / pre-populate Schedule fields]
    // otherwise, test_challenge has already been assigned
      // call CW API, check test_challenge is passed
        // if true, send user to Schedule Page
        // otherise, has 10 min passed from test_created?
          // if true, then send user back to Sign Up component
          // otherwise, show user Validation Page and send test_challenge and/or test_created

  } catch (e) {
    return res.status(400).json({ e });
  }
});
// validation route; after post, basic user info is in database
app.get('/api/done', jwtCheck, async (req, res) => {
  try {
    const { rows: users } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.auth.payload.sub]);

    if (users.length !== 1) {
      return res.status(400).send(`No user with user id ${req.auth.payload.sub}`);
    }
    if (users[0].validated) {
      return res.status(200).json({'validated': true});
    }
    
    fetch(`https://www.codewars.com/api/v1/users/${users[0].username}/code-challenges/completed`)
      .then((response) => response.json())
      .then((data) => {
    
        for (const challenge of data.data) {
          if ((users[0].test_challenge === challenge.id) && (Date.parse(challenge.completedAt) - users[0].test_created <= 600000)) {
            db.query("UPDATE users SET validated = true WHERE user_id = $1", [req.auth.payload.sub]);
            return res.status(200).json({'validated': true});
          }
          res.status(200).json({'validated': false});
        }
      }); 
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// new user sign up + submit codewars username route
app.post('/api/users', jwtCheck, async (req, res) => {
  try {
    // frontend will send name, id, email, CW username

    // call Auth0 API
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
    console.log(auth_data);

    // choose a random code challenge from db
    // after adding more hardcoded code challenges to db, increase limit to ~5
    const { rows: random } = await db.query("SELECT * FROM code_challenges WHERE rank = 'Beginner' ORDER BY random() LIMIT 1");
    console.log(random);
    console.log(random[0].challenge);

    // call Codewars List of CC API
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${req.body.username}/code-challenges/completed`);
    const cw_data = await cw_response.json();
    if (cw_data.success === false) {
      return res.status(200).json({'validated': false});
    }

    for (const challenge of data.data) {
      if (challenge.id !== random[0].challenge) {
        // on conflict -- user might try to sign in twice without validating
        const { rows: test } = await db.query(
          `
          INSERT INTO users (user_id, username, email, test_challenge, test_created, name) 
          VALUES($1, $2, $3, $4, $5, $6) 
          ON CONFLICT (user_id) DO UPDATE SET username = Excluded.username
          WHERE user_id = $1
          `
        , [req.auth.payload.sub, req.body.username, auth_data[0].email, challenge.id, NOW(), auth_data[0].name]);

        const returnObj = {
          test_challenge: test.rows[0].test_challenge,
          test_created: test.rows[0].test_created,
        }
        return res.status(200).json(returnObj);
      }
    }

    res.status(200).json({'validated': false});
  } catch (e) {
    return res.status(400).send(String(e));
  }
});


app.listen(PORT, () => {
  console.log(`Hello, server is listening on ${PORT}`);
});