import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Alert from '@mui/material/Alert';


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
    setNewSchedule((newSchedule) => ({...newSchedule, cc_rank: e.target.value === "" ? null : e.target.value}));
  }
  const handleCategoryChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_category: e.target.value === "" ? null : e.target.value}));
  }
  const handleFreqChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_frequency: e.target.value === "" ? null : e.target.value}));
  }
  const handleDayChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_day: e.target.value === "" ? null : e.target.value}));
  }
  const handleEmailFreqChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, e_frequency: e.target.value === "" ? null : e.target.value}));
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
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "authorization": `BEARER ${token}`,
          "Content-type": "application/JSON"
        },
        body: JSON.stringify({
          cc_category: newSchedule.cc_category,
          cc_rank: newSchedule.cc_rank,
          cc_frequency: newSchedule.cc_frequency,
          cc_day: newSchedule.cc_day,
          e_frequency: newSchedule.e_frequency
        })
      });
      const data = await response.json();
      if (data.errorMessage !== undefined) {
        setErrorMessage(data.errorMessage);
        setShowSuccess(false);
        setShowInfo(false);
        return;
      }
      if (newSchedule.cc_category !== null) {
        setShowSuccess(true);
      }
      props.setCurrentUser({...props.currentUser, ...data});
    }
  };

  return (
    <div className="Schedule">
      <h1>Schedule</h1>
      <form>
        <h2>Code Challenge Preferences</h2>

        <label htmlFor="cc_rank">Difficulty</label>
        <select name="cc_rank" id="cc_rank" onChange={handleDifficultyChange} defaultValue={newSchedule.cc_rank}>
          <option value="">None</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Professional">Professional</option>
          <option value="Expert">Expert</option>
        </select>

        <label htmlFor="cc_category">Category</label>
        <select name="cc_category" id="cc_category" onChange={handleCategoryChange} defaultValue={newSchedule.cc_category}>
          <option value="">None</option>
          <option value="Algorithms">Algorithms</option>
          <option value="Data Structures">Data Structures</option>
        </select>

        <label htmlFor="cc_frequency">Frequency</label>
        <select name="cc_frequency" id="cc_frequency" onChange={handleFreqChange} defaultValue={newSchedule.cc_frequency}>
          <option value="">None</option>
          <option value="Every Week">Every Week</option>
        </select>

        <label htmlFor="cc_day">Day</label>
        <select name="cc_day" id="cc_day" onChange={handleDayChange} defaultValue={newSchedule.cc_day}>
          <option value="">None</option>
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>

        <h2>Email Preferences</h2>

        <label htmlFor="e_frequency">Frequency</label>
        <select name="e_frequency" id="e_frequency" onChange={handleEmailFreqChange} defaultValue={newSchedule.e_frequency}>
          <option value="">None</option>
          <option value="Every Day">Every Day</option>
        </select>

        <button type="submit" onClick={handleSchedule}>Schedule</button>
      </form>
      {errorMessage !== "" ? <Alert severity="error">{errorMessage}</Alert> : <></>}
      {showSuccess ? <Alert severity="success">Code challenge scheduled! Watch out for the email</Alert> : <></>}
      {showInfo ? <Alert severity="info">Schedule has been cleared</Alert> : <></>}
    </div>
  )
}

export default Schedule