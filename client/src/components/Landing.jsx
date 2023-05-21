import LoginButton from './auth0/LoginButton';


function Landing() {
  return (
    <div data-testid="landing" className="Landing">
      <h1>CodeBook</h1>
      <span>[slogan]</span>
      <span>Book your code challenge today!</span>
      <LoginButton />
    </div>
  )
}

export default Landing