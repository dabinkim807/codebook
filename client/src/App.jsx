import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Validation from './components/Validation';
import Schedule from './components/Schedule';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
      Log Out
    </button>
  );
};

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  
  // my frontend has access to user data returned from Auth0; I can send the data to the backend
  console.log(user);
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

function App() {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  const [idExists, setIdExists] = useState(false);

  const getRequest = async () => {
    if (user) {
      const token = await getAccessTokenSilently()
      const response = await fetch(`http://localhost:8080/api/user`, {
        method: "GET",
        headers: {
          "authorization": `BEARER ${token}`,
        }
      })
      if (response.status !== 200) {
        return
      }
      const exists = await response.json();
      setIdExists(exists);
    }
	} 
	
  useEffect(() => {getRequest()}, [user ]);

  return (
    <div className="App">
      
      {!isAuthenticated ? (<LoginButton />) : (<LogoutButton />)}

      <Profile />
      {isAuthenticated ? (idExists ? (<Schedule />) : (<Validation />)) : <></>}
    </div>
  )
}

export default App
