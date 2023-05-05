import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  console.log( window.location.origin)
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

function App() {
  

  return (
    <div className="App">
      <LoginButton />
    </div>
  )
}

export default App
