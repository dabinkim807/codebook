import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Signup from './components/Signup';
import Validation from './components/Validation';
import Schedule from './components/Schedule';
import Landing from './components/Landing';
import MyNavBar from './components/Navbar';


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
      <Landing />
      
      {/* {!isAuthenticated ? (<LoginButton />) : (<LogoutButton />)}

      {isAuthenticated ? (idExists ? (<Schedule currentUser={currentUser} setCurrentUser={setCurrentUser} />) : (<Signup currentUser={currentUser} setCurrentUser={setCurrentUser} />)) : <></>} */}
      {/* {currentUser.test_challenge !== null ? (<Validation currentUser={currentUser} setCurrentUser={setCurrentUser} />) : (<Signup />)} */}
    </div>
  )
}

export default App
