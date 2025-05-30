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
              <strong>Usage:</strong> {user.usageLimit}
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
