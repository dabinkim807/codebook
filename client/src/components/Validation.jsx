import axios from "axios";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";


function Validation(props) {
  // currentUser={currentUser} setCurrentUser={setCurrentUser}
  const { user, getAccessTokenSilently } = useAuth0();

  const [errorMessage, setErrorMessage] = useState("");

  const getDone = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      // const response = await fetch("/api/done", {
      const response = await axios.get("/api/done", {
        method: "GET",
        headers: {
          "authorization": `BEARER ${token}`
        },
      });
      // const data = await response.json();
      // if (data.errorMessage !== undefined) {
      //   setErrorMessage(data.errorMessage);
      //   return;
      // }
      // props.setCurrentUser({...props.currentUser, ...data});

      if (response.errorMessage !== undefined) {
        setErrorMessage(response.errorMessage);
        return;
      }
      props.setCurrentUser({...props.currentUser, ...response});
    }
  };

  const handleDone = (e) => {
    e.preventDefault();
    getDone();
  };

  return (
    <div className="Validation">
      <h1>Validation</h1>
      <p>Thank you for signing up to CodeBook!</p> 
      <p>To confirm your account, please complete the Codewars challenge below within 10 minutes.</p>
      <p>Click on the "DONE" button once you've passed the challenge!</p>
      <a href={"https://www.codewars.com/kata/" + props.currentUser.test_challenge} target="_blank">Code Challenge</a>
      <button type="submit" onClick={handleDone}>Done</button>
      {errorMessage !== "" ? <Alert severity="error">{errorMessage}</Alert> : <></>}
    </div>
  )
}

export default Validation