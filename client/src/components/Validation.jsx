import React from "react";

function Validation() {

  return (
    <div className="Validation">
      <h1>Validation</h1>
      <p>Thank you for signing up to CodeBook!</p> 
      <p>To confirm your account, please complete the Codewars challenge below within 10 minutes.</p>
      <p>Click on the "DONE" button once you've passed the challenge!</p>
      {/* `https://www.codewars.com/kata/${user.test_challenge}` */}
      <a href="">Code Challenge</a>
      <button type="submit" onClick={handleDone}>Done</button>
    </div>
  )
}

export default Validation