import React, { useContext } from "react";
import { Container, Typography, Paper } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        {user ? (
          <>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {user.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Domain:</strong> {user.domain}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Total credits:</strong> {user.credits}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Generated assets:</strong> {user.totalAssets}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Downloads:</strong> {user.downloads}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>available credits:</strong> {user.credits - (user.downloads + user.totalAssets)}
            </Typography>
          </>
        ) : (
          <Typography variant="body1">
            No user information available.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
