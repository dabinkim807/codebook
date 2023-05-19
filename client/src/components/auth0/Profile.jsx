import { useAuth0 } from "@auth0/auth0-react";


function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
    if (isLoading) {
    return <div data-testid="profile">Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div data-testid="profile">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default Profile