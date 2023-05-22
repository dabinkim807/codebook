import SignupButton from './auth0/SignupButton';
import Typography from '@mui/material/Typography';
import Logo from '../assets/logo_w.png'; 

function Landing() {

  return (
    <div data-testid="landing" className="landing">
      <div>
        <img
          id="logo_w"
          src={Logo}
          alt="CodeBook logo white bg"
        />
      </div>
      <Typography style={{fontSize: "1.3rem", marginBottom: "10px"}}>Keep yourself accountable.</Typography>
      <p>Schedule your code challenge today!</p>
      <SignupButton />
    </div>
  )
}

export default Landing