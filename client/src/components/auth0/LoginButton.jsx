import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';


function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
      <Button 
        data-testid="login" 
        id="loginButton"
        onClick={() => loginWithRedirect()} 
        variant="contained" 
        color="secondary"
        size="small"
      >
      Login
      </Button>
  );
};
  
export default LoginButton