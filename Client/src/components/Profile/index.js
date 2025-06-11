import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {
  getSubscriptionEndDate,
  getSubscriptionPeriod,
  getSubscriptionStartDate
} from '../../utils/user';

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
      console.log(error);
    }
  };

  let availableCredits = profile.credits - (profile.downloads + profile.totalAssets);
  if (availableCredits < 0) {
    availableCredits = 0;
  }

  availableCredits = `${availableCredits} out of ${profile.credits}`;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        {user ? (
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem>
              <ListItemText primary="Display Name" secondary={profile.displayName} />
            </ListItem>
            <ListItem>
              <ListItemText primary="UserName" secondary={profile.userName} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Domain Name" secondary={profile.domain} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Subscription "
                secondary={
                  <div>
                    {getSubscriptionPeriod(profile)}
                    <br />
                    starts: {getSubscriptionStartDate(profile)}
                    <br />
                    ends:{getSubscriptionEndDate(profile)}
                  </div>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Available credits" secondary={availableCredits} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Generated assets" secondary={profile.totalAssets} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Downloads" secondary={profile.downloads} />
            </ListItem>
          </List>
        ) : (
          <Typography variant="body1">No user information available.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;
