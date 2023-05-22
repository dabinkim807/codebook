import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


function Signup(props) {
  // currentUser={currentUser} setCurrentUser={setCurrentUser}
  const { user, getAccessTokenSilently } = useAuth0();

  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const postUser = async () => {
    if (user) {
      console.log(user);

      const token = await getAccessTokenSilently();
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "authorization": `BEARER ${token}`,
          "Content-type": "application/JSON"
        },
        body: JSON.stringify({username: username})
      });
      const data = await response.json();
      if (data.errorMessage !== undefined) {
        setErrorMessage(data.errorMessage);
        setUsername("");
        return;
      }
      props.setCurrentUser({...props.currentUser, ...data});
    }
  };
  
  const handleUsernameChange = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("");
    postUser();
  };

  return (
    <div className="Signup">
      <Typography style={{fontWeight: 'bold', fontSize: "2.1rem", marginBottom: "25px"}} gutterBottom>Sign Up</Typography>
      <p>If you don't have a Codewars account, click <a href="https://www.codewars.com/" target="_blank">here</a> to sign up!</p>
      <p>Please enter your Codewars username below.</p>
      <form>

        <Box sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
          <TextField 
            id="username" 
            label="Codewars username" 
            required
            variant="outlined" 
            value={username}
            onChange={handleUsernameChange}
          />
        </Box>

        <br></br>

        {errorMessage !== "" ? <Alert severity="error">{errorMessage}</Alert> : <></>}

        <div id="button-container">
          <Button 
            id="submit"
            type="submit"
            onClick={handleSubmit}
            variant="contained" 
            color="primary"
            size="medium"
          >
          Submit
          </Button>

          {/* <button type="submit" onClick={handleSubmit}>Submit</button> */}
        </div>

      </form>
      
    </div>
  )
}

export default Signup