const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./db/db-connection.js');
// const moment = require('moment');
const moment = require('moment-timezone');

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hi! This is Dana's Express JS template");
});

// MVP - log in route; if returning user, will already be in database 
app.get('/api/user/:user_id', cors(), async (req, res) => {
  console.log(req.params.user_id)
  try {
    const { rows: users } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.params.user_id]);
    res.send(users);
  } catch (e) {
    return res.status(400).json({ e });
  }
});
// MVP - validation route; after post, basic user info is in database
app.get('/api/done/:user_id', cors(), async (req, res) => {
  try {
    const { rows: users } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.params.user_id]);
    // test_challenge and test_created will be generated from backend, separate from route
    const { rows: timestamp } = await db.query("SELECT test_created FROM users WHERE user_id = $1", [req.params.user_id]);

    // Codewars' List Completed Challenges API returns timestamp challenge was completed ("completedAt")

    // check that test_challenge is in list of completed challenges
    // check that completedAt - timestamp <= 10 minutes or else fail
    
    console.log(users[0].username)
    const url = `https://www.codewars.com/api/v1/users/${users[0].username}/code-challenges/completed`;
    console.log(url);
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        
        console.log(data.data)
        for (const challenge of data.data) {
          console.log(challenge.id);
          if (users[0].test_challenge === challenge.id) {
            // test_challenge = '5dd462a573ee6d0014ce715b'
            console.log("test challenge passed, almost validated");

            console.log(timestamp[0].test_created)

            // console.log(Date.parse('2023-05-03 19:34:06.500939-04') - timestamp[0].test_created)
            console.log(challenge.completedAt);
            console.log(Date.parse(challenge.completedAt) - timestamp);

            if (Date.parse(challenge.completedAt) - timestamp <= 600000) {
            // if (Date.parse('2023-05-03 19:34:06.500939-04') - timestamp[0].test_created <= 600000) {
              console.log("validated")
              break;
              // if true, user has passed validation
                // in db, update validation = true
                // send validation status to frontend to show schedule page
              
              // if false, user has failed validation
            } else {
              console.log("test challenge passed but timed out, not validated");
              break;
            }
          }
          // test_challenge = '643af0fa9fa6c406b47c5399'
          console.log("test challenge failed, not validated")
        }

        // res.send(data)
      }); 
  } catch (e) {
    return res.status(400).json({ e });
  }
});

// MVP - new user sign up + submit codewars username route
app.post('/api/users', async (req, res) => {
  try {
    await db.query("INSERT INTO users(user_id, username, email) VALUES($1, $2, $3)", [req.body.user_id, req.body.username, req.body.email]);
    const returnObj = {
      user_id: req.body.user_id,
      username: req.body.username,
      email: req.body.email
    }
    return res.status(200).json(returnObj);
} catch (e) {
    return res.status(400).send(String(e));
  }
});


// console.log that your server is up and running
app.listen(PORT, () => {
  console.log(`Hello, server is listening on ${PORT}`);
});