import axios from "axios";
import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


function Schedule(props) {
  // currentUser={currentUser} setCurrentUser={setCurrentUser}
  const { user, getAccessTokenSilently } = useAuth0();

  const [newSchedule, setNewSchedule] = useState({
    ...props.currentUser
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const cc_inputs = [newSchedule.cc_category, newSchedule.cc_rank, newSchedule.cc_frequency, newSchedule.cc_day];

  const handleDifficultyChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_rank: e.target.value === "None" ? null : e.target.value}));
  }
  const handleCategoryChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_category: e.target.value === "None" ? null : e.target.value}));
  }
  const handleFreqChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_frequency: e.target.value === "None" ? null : e.target.value}));
  }
  const handleDayChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_day: e.target.value === "None" ? null : e.target.value}));
  }
  const handleEmailFreqChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, e_frequency: e.target.value === "None" ? null : e.target.value}));
  }

  const handleSchedule = (e) => {
    e.preventDefault();
    setShowSuccess(false);
    setErrorMessage("");
    setShowInfo(false);

    if (!(cc_inputs.every(x => x === null) || cc_inputs.every(x => x !== null))) {
      setErrorMessage("Inputs must either be all completed or all empty");
      return;
    }
    if (cc_inputs.every(x => x === null)) {
      setShowInfo(true);
    }

    postSchedule();
  }

  const postSchedule = async () => {
    if (user) {
      if (props.currentUser.cc_category ===  newSchedule.cc_category &&
        props.currentUser.cc_rank ===  newSchedule.cc_rank &&
        props.currentUser.cc_frequency === newSchedule.cc_frequency &&
        props.currentUser.cc_day === newSchedule.cc_day &&
        props.currentUser.e_frequency === newSchedule.e_frequency) {
          setErrorMessage("Preferences unchanged");
          setShowInfo(false);
          return;
      }

      const token = await getAccessTokenSilently();
      // const response = await fetch("/api/schedule", {
      const data = {
        cc_category: newSchedule.cc_category,
        cc_rank: newSchedule.cc_rank,
        cc_frequency: newSchedule.cc_frequency,
        cc_day: newSchedule.cc_day,
        e_frequency: newSchedule.e_frequency
      };
      const response = await axios.post("/api/schedule", data, {
        method: "POST",
        headers: {
          "authorization": `BEARER ${token}`,
          "Content-type": "application/JSON"
        },
        // body: JSON.stringify({
        //   cc_category: newSchedule.cc_category,
        //   cc_rank: newSchedule.cc_rank,
        //   cc_frequency: newSchedule.cc_frequency,
        //   cc_day: newSchedule.cc_day,
        //   e_frequency: newSchedule.e_frequency
        // })
      });
      // const data = await response.json();
      // if (data.errorMessage !== undefined) {
      //   setErrorMessage(data.errorMessage);
      //   setShowSuccess(false);
      //   setShowInfo(false);
      //   return;
      // }
      // if (newSchedule.cc_category !== null) {
      //   setShowSuccess(true);
      // }
      // props.setCurrentUser({...props.currentUser, ...data});

      if (response.data.errorMessage !== undefined) {
        setErrorMessage(response.data.errorMessage);
        setShowSuccess(false);
        setShowInfo(false);
        return;
      }
      if (newSchedule.cc_category !== null) {
        setShowSuccess(true);
      }
      props.setCurrentUser({...props.currentUser, ...response.data});
    }
  };

  return (
    <div className="schedule">
      <Typography style={{fontWeight: 'bold', fontSize: "2.1rem", marginBottom: "15px"}} gutterBottom>Schedule</Typography>
     
      <form>
        <Typography style={{fontWeight: 'bold', fontSize: "1.2rem", marginBottom: "20px"}} gutterBottom>Challenge Preferences</Typography>

        <Box sx={{ minWidth: 100 }}>
          <FormControl fullWidth>
            <InputLabel id="cc_rank">Difficulty</InputLabel>
            <Select
              labelId="cc_rank"
              id="cc_rank"
              defaultValue={newSchedule.cc_rank}
              label="cc_rank"
              onChange={handleDifficultyChange}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Professional">Professional</MenuItem>
              <MenuItem value="Expert">Expert</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <br></br>
        <Box sx={{ minWidth: 100 }}>
          <FormControl fullWidth>
            <InputLabel id="cc_category">Category</InputLabel>
            <Select
              labelId="cc_category"
              id="cc_category"
              defaultValue={newSchedule.cc_category}
              label="cc_category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Algorithms">Algorithms</MenuItem>
              <MenuItem value="Data Structures">Data Structures</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <br></br>
        <Box sx={{ minWidth: 100 }}>
          <FormControl fullWidth>
            <InputLabel id="cc_frequency">Frequency</InputLabel>
            <Select
              labelId="cc_frequency"
              id="cc_frequency"
              defaultValue={newSchedule.cc_frequency}
              label="cc_frequency"
              onChange={handleFreqChange}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Every Week">Every Week</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <br></br>
        <Box sx={{ minWidth: 100 }}>
          <FormControl fullWidth>
            <InputLabel id="cc_day">Day</InputLabel>
            <Select
              labelId="cc_day"
              id="cc_day"
              defaultValue={newSchedule.cc_day}
              label="cc_day"
              onChange={handleDayChange}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Sunday">Sunday</MenuItem>
              <MenuItem value="Monday">Monday</MenuItem>
              <MenuItem value="Tuesday">Tuesday</MenuItem>
              <MenuItem value="Wednesday">Wednesday</MenuItem>
              <MenuItem value="Thursday">Thursday</MenuItem>
              <MenuItem value="Friday">Friday</MenuItem>
              <MenuItem value="Saturday">Saturday</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <br></br>
        <br></br>
        
        <Typography style={{fontWeight: 'bold', fontSize: "1.2rem", marginBottom: "20px"}} gutterBottom>Email Preferences</Typography>

        <Box sx={{ minWidth: 100 }}>
          <FormControl fullWidth>
            <InputLabel id="e_frequency">Frequency</InputLabel>
            <Select
              labelId="e_frequency"
              id="e_frequency"
              defaultValue={newSchedule.e_frequency}
              label="e_frequency"
              onChange={handleEmailFreqChange}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="Every Day">Every Day</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <br></br>

        {errorMessage !== "" ? <Alert severity="error">{errorMessage}</Alert> : <></>}
        {showSuccess ? <Alert severity="success">Code challenge scheduled! Look out for the email</Alert> : <></>}
        {showInfo ? <Alert severity="info">Schedule has been cleared</Alert> : <></>}

        <Button 
          id="button_schedule"
          type="submit"
          onClick={handleSchedule}
          variant="contained" 
          color="primary"
          size="medium"
        >
        Schedule
        </Button>
              
      </form>

    </div>
  )
}

export default Schedule