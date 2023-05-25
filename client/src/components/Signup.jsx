import axios from "axios";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


function Signup(props) {
  const { user, getAccessTokenSilently } = useAuth0();

  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const postUser = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      const data = {username: username};
      const response = await axios.post("/api/user", data, {
        method: "POST",
        headers: {
          "authorization": `BEARER ${token}`,
          "Content-type": "application/JSON"
        },
      });

      if (response.data.errorMessage !== undefined) {
        setErrorMessage(response.data.errorMessage);
        setUsername("");
        return;
      }
      props.setCurrentUser({...props.currentUser, ...response.data});
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
    <div data-testid="signup" className="signup">
      <Typography style={{fontWeight: 'bold', fontSize: "3rem", marginBottom: "1.3em"}} gutterBottom>Sign Up</Typography>
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
            size="large"
          >
          Submit
          </Button>

        </div>

      </form>
    </div>
  )
}

export default Signup