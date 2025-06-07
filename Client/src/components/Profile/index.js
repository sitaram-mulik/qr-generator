import React, { useContext, useEffect, useState } from "react";
import { Container, Typography, Paper } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/user/profile');
      setProfile(response.data);
      console.log(response.data);
    } catch (error) {
        console.error(error);
    }
  };

  

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        {user ? (
          <>
            <Typography variant="body1" gutterBottom>
              <strong>Name:</strong> {profile.displayName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Username:</strong> {profile.userName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Domain:</strong> {profile.domain}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Total credits:</strong> {profile.credits}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Generated assets:</strong> {profile.totalAssets}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Downloads:</strong> {profile.downloads}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>available credits:</strong> {profile.credits - (profile.downloads + profile.totalAssets)}
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
