import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import LoginButton from './auth0/LoginButton';
import LogoutButton from './auth0/LoginButton';
import Profile from './auth0/Profile';


function MyNavBar(props) {

  return (
    <>
    <Navbar data-testid="navbar" bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand href="/">
        <img
          // src={Logo}
          height="30"
          className="d-lg-inline-block"
          // alt="React Bootstrap logo"
        />
        </Navbar.Brand>
        <Nav.Link >Your Link</Nav.Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Profile />
          <LoginButton />
          <LogoutButton />
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  );
};

export default MyNavBar;