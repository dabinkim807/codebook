import { useAuth0 } from "@auth0/auth0-react";
import Avatar from '@mui/material/Avatar';


function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth0();
    if (isLoading) {
    return <div data-testid="profile">Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div data-testid="profile">
        <Avatar alt={user.name} src={user.picture} sx={{ width: 45, height: 45 }} />
      </div>
    )
  );
};

export default Profile