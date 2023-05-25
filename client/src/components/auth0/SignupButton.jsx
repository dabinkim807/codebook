import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';


function SignupButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button 
      data-testid="signup" 
      onClick={() => loginWithRedirect()} 
      variant="contained" 
      color="primary"
      style={{marginTop: "10px"}}
      size="large"
    >
    Sign Up
    </Button>
  );
};
  
export default SignupButton