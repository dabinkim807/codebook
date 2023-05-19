const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./db/db-connection.js');
const { auth } = require('express-oauth2-jwt-bearer');
const cron = require('node-cron');
const sendMail = require('./gmail/gmail.js');

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
      return res.status(200).json({
        idExists: false, 
        validated: false 
      });
    }

    // if user is validated, validated === true
    // show Schedule Page and send frontend: cc_category, cc_rank, cc_frequency, cc_day [fill in / pre-populate Schedule fields]
    if (users[0].validated) {
      return res.status(200).json({
        user_id: users[0].user_id,
        username: users[0].username,
        email: users[0].email,
        test_challenge: users[0].test_challenge,
        test_created: users[0].test_created,
        validated: true,
        cc_category: users[0].cc_category,
        cc_rank: users[0].cc_rank,
        cc_frequency: users[0].cc_frequency,
        cc_day: users[0].cc_day,
        name: users[0].name,
        e_frequency: users[0].e_frequency,
        idExists: true
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
          user_id: users[0].user_id,
          username: users[0].username,
          email: users[0].email,
          test_challenge: users[0].test_challenge,
          test_created: users[0].test_created,
          validated: true,
          cc_category: users[0].cc_category,
          cc_rank: users[0].cc_rank,
          cc_frequency: users[0].cc_frequency,
          cc_day: users[0].cc_day,
          name: users[0].name,
          e_frequency: users[0].e_frequency,
          idExists: true
        });
      }
    }

    // if test is not completed and 10 min hasn't passed yet,
    // re-send user the same test and keep them on Validation Page
    if (Date.now() - users[0].test_created <= 600000) {
      return res.status(200).json({
        user_id: users[0].user_id,
        username: users[0].username,
        email: users[0].email,
        test_challenge: users[0].test_challenge,
        test_created: users[0].test_created,
        validated: false,
        cc_category: users[0].cc_category,
        cc_rank: users[0].cc_rank,
        cc_frequency: users[0].cc_frequency,
        cc_day: users[0].cc_day,
        name: users[0].name,
        e_frequency: users[0].e_frequency,
        idExists: true
      });
    }

    // if user has not passed test and 10 min have passed, validated === false
    // delete user from db and send them back to Sign Up component
    await db.query("DELETE FROM users WHERE user_id = $1", [req.auth.payload.sub]);
    res.status(200).json({
      validated: false, 
      idExists: false 
    });
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// validation route; after post, basic user info is in database
app.get('/api/done', jwtCheck, async (req, res) => {
  try {
    const { rows: users } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.auth.payload.sub]);
    console.log(users)

    // if user tries to run Done route without going through sign up process (i.e. runs request through Postman), user does not exist in db
    if (users.length !== 1) {
      return res.status(200).json({ errorMessage: `No user with user ID ${req.auth.payload.sub}` });
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

    // stretch goal: to handle multiple pages of results, create a function that calls API for length of pages
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${users[0].username}/code-challenges/completed`);
    const cw_data = await cw_response.json();
    console.log(cw_data);

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
    res.status(200).json({
      idExists: false, 
      validated: false 
    });
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// new user sign up + submit codewars username route
app.post('/api/user', jwtCheck, async (req, res) => {
  try {
    // frontend sends: Codewars username

    // if user_id already exists in db and user tries to run Post route again (i.e. runs request through Postman), send error
    const { rows: id } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.auth.payload.sub]);
    if (id.length === 1) {
      return res.status(200).json({ errorMessage: `User with user ID ${req.auth.payload.sub} already exists` });
    }

    // if username already exists in db and another user id tries to submit the same username, send error
    const { rows: username } = await db.query("SELECT * FROM users WHERE username = $1", [req.body.username]);
    if (username.length === 1) {
      return res.status(200).json({ errorMessage: `Username ${req.body.username} already exists` });
    }

    //// call Codewars List of CC API
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${req.body.username}/code-challenges/completed`);
    const cw_data = await cw_response.json();

    // if username does not exist in Codewars API, cw_data.success === false
    //   keep user at Sign Up component
    // otherwise cw_data.success === undefined
    if (cw_data.success === false) {
      return res.status(200).json({ errorMessage: `${req.body.username} is not a valid Codewars username` });
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
      `,
      [req.auth.payload.sub, req.body.username, auth_data[0].email, random_question, time_now, auth_data[0].name]);

    return res.status(200).json({
      test_challenge: random_question,
      test_created: time_now,
      validated: false,
      idExists: true
    });
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// validated user posting/editing/deleting schedule (for delete, frontend can post null values)
app.post('/api/schedule', jwtCheck, async (req, res) => {
  try {
    // frontend sends: cc_category, cc_rank, cc_frequency, cc_day, e_frequency

    // if user tries to run Schedule route without going through sign up process (i.e. runs request through Postman), user does not exist in db
    const { rows: users } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.auth.payload.sub]);
    if (users.length !== 1) {
      return res.status(200).json({ errorMessage: `No user with user ID ${req.auth.payload.sub}` });
    }
    if (users[0].validated === false) {
      return res.status(200).json({ errorMessage: `User with user ID ${req.auth.payload.sub} is not validated` });
    }

    // for simplicity, for now the user has to provide all fields *enforce in the frontend
    // but users can still use Postman to send invalid inputs that are not allowed by frontend
    // db will validate for me
    const cc_inputs = [req.body.cc_category, req.body.cc_rank, req.body.cc_frequency, req.body.cc_day];

    if (!(cc_inputs.every(x => x === null) || cc_inputs.every(x => x !== null))) {
      return res.status(200).json({ errorMessage: "Inputs must either be all completed or all empty" });
    }

    await db.query(
      "UPDATE users SET cc_category = $2, cc_rank = $3, cc_frequency = $4, cc_day = $5, e_frequency = $6 WHERE user_id = $1",
      [req.auth.payload.sub, req.body.cc_category, req.body.cc_rank, req.body.cc_frequency, req.body.cc_day, req.body.e_frequency]
    );

    if (req.body.cc_category === null) {
      await db.query(
        "DELETE FROM users_code_challenges WHERE user_id = $1 AND cc_state = 'In Progress'", [req.auth.payload.sub]
      );
    }

    return res.status(200).json({
      validated: true,
      idExists: true
    });
  } catch (e) {
    return res.status(400).json({ e });
  }
});


// // scheduled job that validates users every 10 min
// cron.schedule("*/10 * * * *", async function () {
//   console.log("---------------------");
//   console.log("running a task every 10 min");

//   // check all users from users table who aren't validated yet
//   const { rows: users } = await db.query("SELECT * FROM users WHERE validated = false");

//   for (const user of users) {
//     const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${user.username}/code-challenges/completed`);
//     const cw_data = await cw_response.json();

//     for (const challenge of cw_data.data) {
//       // if user has completed assigned test_challenge,
//       if (user.test_challenge === challenge.id) {
//         // if 10 min have not passed since test_created, set user to validated === true, show user Scheduling Page when they next log in
//         if (Date.parse(challenge.completedAt) - user.test_created <= 600000) {
//           await db.query("UPDATE users SET validated = true WHERE user_id = $1", [user.user_id]);
//           return;
//         // otherwise, if 10 min have passed, delete user from db, show user Sign Up component
//         } else {
//           await db.query("DELETE FROM users WHERE user_id = $1", [user.user_id]);
//           return;
//         }
//       } 
//     }
//     // otherwise, if the user has not completed test challenge,
//     // if 10 min have passed, delete user from db, show user Sign Up component
//     if (Date.now() - user.test_created > 600000) {
//       await db.query("DELETE FROM users WHERE user_id = $1", [user.user_id]);
//       return;
//     } 
//     // if 10 min haven't passed yet since test_created, do nothing / show user Validation Page
//   }
// });


// // scheduled job that sends automated emails every 24 hrs
// cron.schedule("0 0 * * *", async function () {
//   console.log("---------------------");
//   console.log("running a task every 24 hrs");

//   gradeCC();
//   sendNewCCEmail();
//   sendReminderEmail();
// });


const gradeCC = async () => {
  // check all users from users_code_challenges whose code challenges are "In Progress" (default)
  const { rows: users_cc_state } = await db.query(
    `
    SELECT 
      ucc.user_id,
      ucc.challenge,
      ucc.cc_state,
      ucc.deadline,
      u.username,
      u.email
    FROM 
      users_code_challenges ucc
      JOIN users u ON ucc.user_id = u.user_id
    WHERE cc_state = 'In Progress' 
    `
  );

  for (const user_cc of users_cc_state) {
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${user_cc.username}/code-challenges/completed`);
    const cw_data = await cw_response.json();
    let matched = false;

    for (const challenge of cw_data.data) {
      // if user has completed assigned code challenge,
      if (user_cc.challenge === challenge.id) {
        matched = true;
        // if user has completed assigned code challenge by the deadline, set challenge to passed
        if (Date.parse(challenge.completedAt) <= user_cc.deadline) {
          await db.query("UPDATE users_code_challenges SET cc_state = 'Passed' WHERE user_id = $1", [user_cc.user_id]);
          // otherwise, set challenge to failed
        } else {
          await db.query("UPDATE users_code_challenges SET cc_state = 'Failed' WHERE user_id = $1", [user_cc.user_id]);
        }
        break;
      }
    }
    // if user has not completed assigned code challenge and the deadline has passed, set challenge to failed
    if (!matched && Date.now() > user_cc.deadline) {
      await db.query("UPDATE users_code_challenges SET cc_state = 'Failed' WHERE user_id = $1", [user_cc.user_id]);
    }
  }
};

const convertDay = (day) => {
  const days = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  return days[day];
};

const sendReminderEmail = async () => {
  // check all users from users table where cc_category is not null (already required all cc preferences to be either all null or all not null) and questions are 'In Progress'
  const { rows: users } = await db.query(
    `
    SELECT 
      u.user_id,
      u.username,
      u.email,
      u.cc_category,
      u.cc_rank,
      u.cc_frequency,
      u.cc_day,
      u.name,
      u.e_frequency,
      ucc.challenge
    FROM 
      users u
      JOIN users_code_challenges ucc ON ucc.user_id = u.user_id
    WHERE cc_category IS NOT NULL AND cc_state = 'In Progress'
    `
  );

  for (const user of users) {
    // if cc_day !== current day of the week and user is opted into reminders, send user reminder based on e_frequency (currently only 'Once a day, every day')
    if ((convertDay(user.cc_day) !== new Date().getDay()) && (user.e_frequency === 'Every Day')) {
      const main = async () => {
        const options = {
          to: `${user.email}`,
          replyTo: 'techtonica.codebook@gmail.com',
          subject: 'REMINDER: Complete your scheduled code challenge',
          text: `Don't forget to solve your code challenge! Link to challenge: https://www.codewars.com/kata/${user.challenge}`,
          textEncoding: 'base64',
        };
        const messageId = await sendMail(options);
        return messageId;
      };

      main()
        .then((messageId) => console.log('Message sent successfully:', messageId))
        .catch((err) => console.error(err));
    }
  }
};

const sendNewCCEmail = async () => {
  // check all users from users table where cc_category is not null (already required all cc preferences to be either all null or all not null) and questions are 'In Progress'
  const { rows: users } = await db.query("SELECT * FROM users WHERE cc_category IS NOT NULL");

  for (const user of users) {
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${user.username}/code-challenges/completed`);
    const cw_data = await cw_response.json();

    // if cc_day === current day of the week, randomly assign users a cc from db that matches their preferences
    if (convertDay(user.cc_day) === new Date().getDay()) {
      const { rows: questions } = await db.query(
        'SELECT challenge FROM code_challenges WHERE category = $1 AND rank = $2',
      [user.cc_category, user.cc_rank]);

      let question_ids = questions.map(q => q.challenge);
      let done_ids = new Set(cw_data.data.map(q => q.id));
      let not_done_ids = question_ids.filter(q => !done_ids.has(q));

      let random_idx = Math.floor(Math.random() * not_done_ids.length);
      let random_question = not_done_ids[random_idx];
      let new_deadline = new Date();
      new_deadline.setDate(new_deadline.getDate() + 7);


      // insert challenge id, cc_state to "In Progress" (default), and deadline in db
      await db.query(
        `INSERT INTO users_code_challenges(user_id, challenge, deadline) VALUES ($1, $2, $3)`,
      [user.user_id, random_question, new_deadline]);


      // send user email containing link to code challenge
      const main = async () => {
        const options = {
          to: `${user.email}`,
          replyTo: 'techtonica.codebook@gmail.com',
          subject: 'CodeBook Code Challenge',
          text: `New coding challenge! Link to challenge: https://www.codewars.com/kata/${random_question}`,
          textEncoding: 'base64',
        };

        const messageId = await sendMail(options);
        return messageId;
      };

      main()
        .then((messageId) => console.log('Message sent successfully:', messageId))
        .catch((err) => console.error(err));
    
    } 
  }
};



// // ********* demo for final presentation *********

// scheduled job that validates users 
cron.schedule("* * * * *", async function () {
  console.log("---------------------");
  console.log("running a task every minute");

  // check all users from users table who aren't validated yet
  const { rows: users } = await db.query("SELECT * FROM users WHERE validated = false");

  for (const user of users) {
    const cw_response = await fetch(`https://www.codewars.com/api/v1/users/${user.username}/code-challenges/completed`);
    const cw_data = await cw_response.json();

    for (const challenge of cw_data.data) {
      // if user has completed assigned test_challenge,
      if (user.test_challenge === challenge.id) {
        // if 10 min have not passed since test_created, set user to validated === true, show user Scheduling Page when they next log in
        if (Date.parse(challenge.completedAt) - user.test_created <= 600000) {
          await db.query("UPDATE users SET validated = true WHERE user_id = $1", [user.user_id]);
          return;
        // otherwise, if 10 min have passed, delete user from db, show user Sign Up component
        } else {
          await db.query("DELETE FROM users WHERE user_id = $1", [user.user_id]);
          return;
        }
      } 
    }
    // otherwise, if the user has not completed test challenge,
    // if 10 min have passed, delete user from db, show user Sign Up component
    if (Date.now() - user.test_created > 600000) {
      await db.query("DELETE FROM users WHERE user_id = $1", [user.user_id]);
      return;
    } 
    // if 10 min haven't passed yet since test_created, do nothing / show user Validation Page
  }
});

// scheduled job that sends automated emails 
cron.schedule("* * * * *", async function () {
  console.log("---------------------");
  console.log("running a task every minute");

  gradeCC();
  sendNewCCEmail();
  sendReminderEmail();
});


app.listen(PORT, () => {
  console.log(`Hello, server is listening on ${PORT}`);
});