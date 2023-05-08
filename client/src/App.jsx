import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

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
  const { isAuthenticated } = useAuth0();

  return (
    <div className="App">
      <Profile />

      {!isAuthenticated ? (<LoginButton />) : (<LogoutButton />)}
     {/* { ? <ValidationPage /> : <SchedulePage />} */}
    </div>
  )
}

export default App
