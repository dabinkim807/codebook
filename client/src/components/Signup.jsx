import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Alert from '@mui/material/Alert';

function Signup(props) {
  // currentUser={currentUser} setCurrentUser={setCurrentUser}
  const { user, getAccessTokenSilently } = useAuth0();

  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const postUser = async () => {
    if (user) {
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
      <h1>Sign up</h1>
      <p>If you don't have a Codewars account, click <a href="https://www.codewars.com/" target="_blank">here</a> to sign up!</p>
      <p>Please enter your Codewars username below.</p>
      <form>
        <label>Codewars username: </label>
        <input
          type="text"
          id="username"
          name="username"
          required
          value={username}
          onChange={handleUsernameChange}
        />
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
      {errorMessage !== "" ? <Alert severity="error">{errorMessage}</Alert> : <></>}
    </div>
  )
}

export default Signup