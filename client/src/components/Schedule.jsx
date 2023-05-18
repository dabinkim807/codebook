import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Alert from '@mui/material/Alert';


function Schedule(props) {
  // currentUser={currentUser} setCurrentUser={setCurrentUser}
  const { user, getAccessTokenSilently } = useAuth0();

  const defaultSchedule = {
		cc_rank: null,
    cc_category: null,
		cc_frequency: null,
		cc_day: null,
    e_reminder: false,
    e_frequency: null,
    validated: false
  }
  const [newSchedule, setNewSchedule] = useState(defaultSchedule);
  const [successMessage, setSuccessMessage] = useState("");

  const handleDifficultyChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_rank: e.target.value}));
  }
  const handleCategoryChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_category: e.target.value}));
  }
  const handleFreqChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_frequency: e.target.value}));
  }
  const handleDayChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, cc_day: e.target.value}));
  }
  const handleReminderChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, e_reminder: e.target.value}));
  }
  const handleEmailFreqChange = (e) => {
    e.preventDefault();
    setNewSchedule((newSchedule) => ({...newSchedule, e_frequency: e.target.value}));
  }

  const handleSchedule = (e) => {
    e.preventDefault();
    setSuccessMessage("");
    postSchedule();
  }

  const postSchedule = async () => {
    if (user) {
      console.log(user);

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
          e_reminder: newSchedule.e_reminder,
          e_frequency: newSchedule.e_frequency
        })
      });
      const data = await response.json();
      if (data.errorMessage !== undefined) {
        setErrorMessage(data.errorMessage);
        setNewSchedule(defaultSchedule);
        return;
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
        <select name="cc_rank" id="cc_rank" onChange={handleDifficultyChange}>
          <option value="default" selected disabled hidden >Select an Option</option>
          <option value=""></option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Professional">Professional</option>
          <option value="Expert">Expert</option>
        </select>

        <label htmlFor="cc_category">Category</label>
        <select name="cc_category" id="cc_category" onChange={handleCategoryChange}>
          <option value="default" selected disabled hidden >Select an Option</option>
          <option value=""></option>
          <option value="Algorithms">Algorithms</option>
          <option value="Data Structures">Data Structures</option>
        </select>

        <label htmlFor="cc_frequency">Frequency</label>
        <select name="cc_frequency" id="cc_frequency" onChange={handleFreqChange}>
          <option value="default" selected disabled hidden >Select an Option</option>
          <option value=""></option>
          <option value="Every Week">Every Week</option>
        </select>

        <label htmlFor="cc_day">Day</label>
        <select name="cc_day" id="cc_day" onChange={handleDayChange}>
          <option value="default" selected disabled hidden >Select an Option</option>
          <option value=""></option>
          <option value="Sunday">Sunday</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
          <option value="Saturday">Saturday</option>
        </select>


        <h2>Email Preferences</h2>

        <fieldset>
          <legend>Reminders</legend>
          <div>
            <input
              type="radio"
              id="true"
              name="e_reminder"
              required
              value="true"
              onChange={handleReminderChange}
            />
            <label htmlFor="true">Yes</label>
          </div>
          <div>
            <input
              type="radio"
              id="false"
              name="e_reminder"
              required
              value="false"
              onChange={handleReminderChange}
            />
            <label htmlFor="false">No</label>
          </div>
        </fieldset>

        <label htmlFor="e_frequency">Frequency</label>
        <select name="e_frequency" id="e_frequency" onChange={handleEmailFreqChange}>
          <option value="default" selected disabled hidden >Select an Option</option>
          <option value=""></option>
          <option value="Every Day">Every Day</option>
        </select>

        <button type="submit" onClick={handleSchedule}>Schedule</button>
      </form>
      {successMessage !== "" ? <Alert severity="success">Code challenge scheduled! Watch out for the email.</Alert> : <></>}
    </div>
  )
}

export default Schedule