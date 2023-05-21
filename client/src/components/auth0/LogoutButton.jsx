import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function LogoutButton() {
  const { logout } = useAuth0();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#212121",
      },
      secondary: {
        main: '#eeeeee',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Button 
        data-testid="logout" 
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} 
        variant="contained"
        color="secondary"
      >
      Log Out
      </Button>
    </ThemeProvider>
  );
};

export default LogoutButton