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
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  const [idExists, setIdExists] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const getRequest = async () => {
    if (user) {
      const token = await getAccessTokenSilently()
      const response = await fetch("/api/user", {
        method: "GET",
        headers: {
          "authorization": `BEARER ${token}`
        }
      })
      if (response.status !== 200) {
        return
      }
      const data = await response.json();
      setIdExists(data.idExists);
      setCurrentUser(data);
    }
	} 
	
  useEffect(() => {getRequest()}, [user]);

  
  return (
    <div className="App">
      <MyNavBar />
      {!isAuthenticated ?  <Landing /> : <></>}
      {isAuthenticated && idExists && isValidated ? <Schedule currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <></>}
      {isAuthenticated && idExists && !isValidated ? <Validation currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <></>}
      {isAuthenticated && !idExists ? <Signup currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <></>}
    </div>
  )
}

export default App
