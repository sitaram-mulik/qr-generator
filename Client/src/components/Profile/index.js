import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Paper, Alert } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {
  getSubscriptionEndDate,
  getSubscriptionPeriod,
  getSubscriptionStartDate,
  isSubscriptionExpired,
  getSubscriptionDaysRemaining,
  getDeactivationDaysRemaining
} from '../../utils/user';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (user) {
      setProfile(user);
    } else {
      fetchProfile();
    }
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

  const subscriptionEnds = profile.subscriptionEnds;
  const expired = isSubscriptionExpired({ subscriptionEnds });
  const daysRemaining = getSubscriptionDaysRemaining(subscriptionEnds);
  const gracePeriod = profile.gracePeriod || 0;
  const deactivationDaysRemaining = getDeactivationDaysRemaining(subscriptionEnds, gracePeriod);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {expired ? (
          <>
            <Alert severity="error" sx={{ mb: 2 }}>
              Your subscription is ended, please renew it.
              <br />
              <strong>
                {deactivationDaysRemaining > 0
                  ? `Your account will be deactivated in ${deactivationDaysRemaining} day${
                      deactivationDaysRemaining > 1 ? 's' : ''
                    }.`
                  : `Your account will be deactivated any time.`}
              </strong>
            </Alert>
          </>
        ) : daysRemaining > 0 && daysRemaining <= 30 ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Your subscription will expire in {daysRemaining} day{daysRemaining > 1 ? 's' : ''}.
          </Alert>
        ) : (
          <Alert severity="success" sx={{ mb: 2 }}>
            Your subscription is active.
          </Alert>
        )}
        <Typography variant="h4" gutterBottom>
          {profile.displayName}
        </Typography>
        {user ? (
          <List sx={{ width: '100%', maxWidth: 360 }}>
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
                    starts: {getSubscriptionStartDate(profile)}
                    <br />
                    ends:{getSubscriptionEndDate(profile)}
                  </div>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Available credits" secondary={profile.credits} />
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
