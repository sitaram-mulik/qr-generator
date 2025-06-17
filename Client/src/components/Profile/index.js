import React, { useContext, useEffect, useState } from 'react';
import { Container, Typography, Paper, Alert } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {
  getSubscriptionEndDate,
  getSubscriptionPeriod,
  getSubscriptionStartDate,
  isSubscriptionExpired,
  getSubscriptionDaysRemaining
} from '../../utils/user';

const Profile = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('user ', user);
  }, [user]);

  const subscriptionEnds = user.subscriptionEnds;
  const expired = isSubscriptionExpired(subscriptionEnds);
  const daysRemaining = getSubscriptionDaysRemaining(subscriptionEnds);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {expired ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            Your subscription is ended, please renew it.
          </Alert>
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
          {user.displayName}
        </Typography>
        {user ? (
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <ListItem>
              <ListItemText primary="UserName" secondary={user.userName} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Domain Name" secondary={user.domain} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Available credits" secondary={user.credits} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Subscription "
                secondary={
                  <div>
                    starts: {getSubscriptionStartDate(user)}
                    <br />
                    ends:{getSubscriptionEndDate(user)}
                  </div>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Generated assets" secondary={user.totalAssets} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Downloads" secondary={user.downloads} />
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
