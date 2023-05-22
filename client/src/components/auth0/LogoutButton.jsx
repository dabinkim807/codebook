import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';


function LogoutButton() {
  const { logout } = useAuth0();

  return (
      <Button 
        data-testid="logout" 
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
        variant="contained"
        color="secondary"
        size="small"
      >
      Logout
      </Button>
  );
};

export default LogoutButton