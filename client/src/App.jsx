import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Landing from './components/Landing';
import Signup from './components/Signup';
import Validation from './components/Validation';
import Schedule from './components/Schedule';
import MyNavBar from './components/Navbar';


function App() {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [currentUser, setCurrentUser] = useState({});

  const getRequest = async () => {
    if (user) {
      const token = await getAccessTokenSilently();
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "authorization": `BEARER ${token}`
        }
      });
      if (response.status !== 200) {
        return;
      }
      const data = await response.json();
      console.log({...currentUser, ...data});
      setCurrentUser({...currentUser, ...data});
    }
	}
	
  useEffect(() => {getRequest()}, [user]);

  
  return (
    <div className="App">
      <MyNavBar />
      <div className='main-page'>
        {!isAuthenticated ? <Landing /> : <></>}
        {isAuthenticated && !currentUser.idExists ? <Signup currentUser={currentUser} setCurrentUser={setCurrentUser}/> : <></>}
        {isAuthenticated && currentUser.idExists && !currentUser.validated ? <Validation currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <></>}
        {isAuthenticated && currentUser.idExists && currentUser.validated ? <Schedule currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <></>}
      </div>
    </div>
  )
}

export default App
