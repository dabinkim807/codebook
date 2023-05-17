import React from "react";

function Validation(props) {
  // currentUser={currentUser} setCurrentUser={setCurrentUser}

  const handleDone = (e) => {
    e.preventDefault();
    const getDone = () => {
      fetch("/api/done")
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
          }
        });
    }
    getDone();
  }

  return (
    <div className="Validation">
      <h1>Validation</h1>
      <p>Thank you for signing up to CodeBook!</p> 
      <p>To confirm your account, please complete the Codewars challenge below within 10 minutes.</p>
      <p>Click on the "DONE" button once you've passed the challenge!</p>
      <a href={"https://www.codewars.com/kata/" + props.currentUser.test_challenge}>Code Challenge</a>
      <button type="submit" onClick={handleDone}>Done</button>
    </div>
  )
}

export default Validation