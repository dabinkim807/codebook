import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Validation from './components/Validation';
import Schedule from './components/Schedule';
import Signup from './components/Signup';
import MyNavBar from './components/Navbar';

// const LoginButton = () => {
//   const { loginWithRedirect } = useAuth0();
//   return <button onClick={() => loginWithRedirect()}>Log In</button>;
// };

// const LogoutButton = () => {
//   const { logout } = useAuth0();

//   return (
//     <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
//       Log Out
//     </button>
//   );
// };

// const Profile = () => {
//   const { user, isAuthenticated, isLoading } = useAuth0();
  
//   // my frontend has access to user data returned from Auth0; I can send the data to the backend
//   console.log(user);
//   if (isLoading) {
//     return <div>Loading ...</div>;
//   }

//   return (
//     isAuthenticated && (
//       <div>
//         <img src={user.picture} alt={user.name} />
//         <h2>{user.name}</h2>
//         <p>{user.email}</p>
//       </div>
//     )
//   );
// };

function App() {
//   const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

//   const [idExists, setIdExists] = useState(false);
  const [currentUser, setCurrentUser] = useState();

//   const getRequest = async () => {
//     if (user) {
//       const token = await getAccessTokenSilently()
//       const response = await fetch("/api/user", {
//         method: "GET",
//         headers: {
//           "authorization": `BEARER ${token}`
//         }
//       })
//       if (response.status !== 200) {
//         return
//       }
//       const exists = await response.json();
//       setIdExists(exists);
//     }
// 	} 
	
//   useEffect(() => {getRequest()}, [user ]);

  return (
    <div className="App">
      <MyNavBar />
      {/* {!isAuthenticated ? (<LoginButton />) : (<LogoutButton />)}

      <Profile />
      {isAuthenticated ? (idExists ? (<Schedule currentUser={currentUser} setCurrentUser={setCurrentUser} />) : (<Signup currentUser={currentUser} setCurrentUser={setCurrentUser} />)) : <></>} */}
      {/* {currentUser.test_challenge !== null ? (<Validation currentUser={currentUser} setCurrentUser={setCurrentUser} />) : (<Signup />)} */}
    </div>
  )
}

export default App
