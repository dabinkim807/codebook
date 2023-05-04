const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./db/db-connection.js');

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hi! This is Dana's Express JS template");
});

// MVP - log in route; if returning user, will already be in database 
app.get('/api/user/:user_id', cors(), async (req, res) => {
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

    if (users.length !== 1) {
      return res.status(400).send(`No user with user id ${req.params.user_id}`);
    }
    if (users[0].validated) {
      return res.status(200).json({'validated': true});
    }
    
    const url = `https://www.codewars.com/api/v1/users/${users[0].username}/code-challenges/completed`;
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
    
        for (const challenge of data.data) {
          if ((users[0].test_challenge === challenge.id) && (Date.parse(challenge.completedAt) - users[0].test_created <= 600000)) {
            db.query("UPDATE users SET validated = true WHERE user_id = $1", [req.params.user_id]);
            return res.status(200).json({'validated': true});
          }
          res.status(200).json({'validated': false});
        }
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