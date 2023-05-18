import { useState } from "react";

function Signup(props) {
  // currentUser={currentUser} setCurrentUser={setCurrentUser}
  const [username, setUsername] = useState("");

  const handleUsernameChange = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const postUser = () => {
      fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-type": "application/JSON"
        },
        body: JSON.stringify(username)
      })
        .then((response) => {
          if (response.status === 400) {
            response.text().then((text) => {
              alert(text);
            });
            return null;
          } else {
            return response.json();
          }})
        .then((response) => {
          if (response !== null) {
            let n = [...props.currentUser, response];
            props.setCurrentUser(n);
            setUsername("");
          }
        });
            
    }
    postUser();
  }

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
    </div>
  )
}

export default Signup