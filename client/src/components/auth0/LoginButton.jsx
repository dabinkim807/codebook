import { useAuth0 } from "@auth0/auth0-react";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';


function LoginButton() {
  const { loginWithRedirect } = useAuth0();

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
        data-testid="login" 
        onClick={() => loginWithRedirect()} 
        variant="contained" 
        color="secondary"
      >
      Log In
      </Button>
    </ThemeProvider>
  );
};
  
export default LoginButton