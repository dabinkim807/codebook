import SignupButton from './auth0/SignupButton';
import Typography from '@mui/material/Typography';


function Landing() {
  return (
    <div data-testid="landing" className="landing">
      <Typography style={{fontWeight: 'bold', fontSize: "3.2rem", marginBottom: "20px"}} gutterBottom>CodeBook</Typography>
      <Typography style={{fontSize: "1.3rem", marginBottom: "10px"}}>Keep yourself accountable.</Typography>
      <p>Schedule your code challenge today!</p>
      <SignupButton />
    </div>
  )
}

export default Landing