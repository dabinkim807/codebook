import React from "react";

function Signup() {
  
  return (
    <div className="Signup">
      <h1>Sign up</h1>
      <p>If you don't have a Codewars account, click <a href="https://www.codewars.com/">here</a> to sign up!</p>
      <p>Please enter your Codewars username below.</p>
      <form>
        <label>Codewars username: </label>
        <input
          type="text"
          id="username"
          required
          // value={null}
          onChange={handleUsernameChange}
        />
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default Signup