const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const db = require('./db/db-connection.js');
const { Configuration, OpenAIApi } = require("openai");
const { auth } = require("express-oauth2-jwt-bearer");
const { AuthenticationClient } = require("auth0");

const app = express();
const PORT = process.env.PORT || 8080;

const jwtCheck = auth({
  audience: process.env.VITE_IDENTIFIER,
  issuerBaseURL: process.env.VITE_AUTH0_DOMAIN,
  tokenSigningAlg: 'RS256'
});
const auth0 = new AuthenticationClient({
  domain: process.env.VITE_AUTH0_DOMAIN,
  clientId: process.env.VITE_AUTH0_CLIENT_ID
});

app.use(cors());
app.use(express.json());
// app.use(jwtCheck);   // applies authorization requirement to access all routes; can be applied individually

app.get('/', (req, res) => {
  res.send("Hi! This is Dana's Express JS template");
});

// shows "UnauthorizedError: Unauthorized" when logged out and logged in (should only show for logged out)
app.get('/authorized', jwtCheck, (req, res) => {
  res.send('Secured Resource');
});

// MVP - log in route; if returning user, will already be in database 
app.get('/api/user/:user_id', jwtCheck, async (req, res) => {
  try {
    const { rows: users } = await db.query("SELECT * FROM users WHERE user_id = $1", [req.params.user_id]);
    console.log(users.length === 1)
    res.json(users.length === 1);
  } catch (e) {
    return res.status(400).json({ e });
  }
});
// MVP - validation route; after post, basic user info is in database
app.get('/api/done/:user_id', jwtCheck, async (req, res) => {
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
app.post('/api/users', jwtCheck, async (req, res) => {
  try {
    // call Auth0 API
    // Auth0 return data = {
    //   given_name: 'Dana', 
    //   family_name: 'Kim',
    //   nickname: 'dabinkim807', 
    //   name: 'Dana Kim', 
    //   picture: 'https://lh3.googleusercontent.com/a/AGNmyxa2gCzcpNHziuFs8bC0ErSUEttDTPi-x2UZG7Sl-Q=s96-c',
    //   email: "dabinkim807@gmail.com"
    //   email_verified: true,
    //   locale: "en",
    //   sub: "google-oauth2|115940204927970477883",
    //   updated_at: "2023-05-08T13:24:52.523Z"
    // }

    // if user_id is valid Auth0 ID,

      // call Codewars API

      // if username is valid Codewars username,
        // if test is passed within 10 min, (*** do I just want to check this? or do I also want to check done / check done first?)
          // user is valid
        // otherwise,
          // user is invalid, resubmit test (or restart whole validation process??)
        // otherwise, 
          // user is invalid; resubmit test
      // otherwise,
        // user is invalid; resubmit Codewars username and/or Auth0 ID (email?)
    // otherwise, 
      // user is invalid; resubmit Auth0 ID


    await db.query(
      "INSERT INTO users(user_id, username, email) VALUES($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET username = Excluded.username", 
      [req.body.user_id, req.body.username, req.body.email]
    );
    // on conflict -- user might try to sign in twice without validating

    res.status(200).json({'validated': false});
  } catch (e) {
    return res.status(400).send(String(e));
  }
});


app.listen(PORT, () => {
  console.log(`Hello, server is listening on ${PORT}`);
});