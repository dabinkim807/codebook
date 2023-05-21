import SignupButton from './auth0/SignupButton';


function Landing() {
  return (
    <div data-testid="landing" className="Landing">
      <h1>CodeBook</h1>
      <span>Keep yourself accountable.</span>
      <span>Schedule your coding challenge today!</span>
      <SignupButton />
    </div>
  )
}

export default Landing