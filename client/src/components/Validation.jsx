import axios from "axios";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


function Validation(props) {
  const { user, getAccessTokenSilently } = useAuth0();

  const [errorMessage, setErrorMessage] = useState("");

  const getDone = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      const response = await axios.get("/api/done", {
        method: "GET",
        headers: {
          "authorization": `BEARER ${token}`
        },
      });

      if (response.data.errorMessage !== undefined) {
        setErrorMessage(response.data.errorMessage);
        return;
      }
      props.setCurrentUser({...props.currentUser, ...response.data});
    }
  };

  const handleDone = (e) => {
    e.preventDefault();
    getDone();
  };

  return (
    <div className="validation">
      <Typography style={{fontWeight: 'bold', fontSize: "3rem", marginBottom: "1.3em"}} gutterBottom>Validation</Typography>
      <Typography style={{fontWeight: 'bold', fontSize: "1.3rem", marginBottom: "2em"}} gutterBottom>Thank you for signing up, {user.given_name}!</Typography>
      <p>To confirm your account, please complete <a href={"https://www.codewars.com/kata/" + props.currentUser.test_challenge} target="_blank">this Codewars challenge</a> within <b><u>10 minutes</u></b>.</p>
      <p>Click on the "DONE" button once you've passed the challenge!</p>

      {errorMessage !== "" ? <Alert severity="error">{errorMessage}</Alert> : <></>}
      
      <br></br>

      <div id="button-container">
        <Button 
          id="done"
          type="submit"
          onClick={handleDone}
          variant="contained" 
          color="primary"
          size="large"
        >
        Done
        </Button>

      </div>
    </div>
  )
}

export default Validation