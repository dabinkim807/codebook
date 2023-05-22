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
      const response = await fetch("/api/done", {
        method: "GET",
        headers: {
          "authorization": `BEARER ${token}`
        },
      });
      const data = await response.json();
      if (data.errorMessage !== undefined) {
        setErrorMessage(data.errorMessage);
        return;
      }
      props.setCurrentUser({...props.currentUser, ...data});
    }
  };

  const handleDone = (e) => {
    e.preventDefault();
    getDone();
  };

  return (
    <div className="Validation">
      <Typography style={{fontWeight: 'bold', fontSize: "2.1rem", marginBottom: "25px"}} gutterBottom>Validation</Typography>
      <p>Thank you for signing up, {user.given_name}!</p>       
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
          size="medium"
        >
        Done
        </Button>

      </div>
    </div>
  )
}

export default Validation