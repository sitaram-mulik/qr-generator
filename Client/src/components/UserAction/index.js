import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import Progress from '../Lib/Progress';

const UserAction = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const isEditMode = Boolean(userId);
  console.log('userId ', userId);

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to add months to a date string (YYYY-MM-DD)
  const addMonths = (dateStr, months) => {
    const date = new Date(dateStr);
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    userName: '',
    displayName: '',
    password: '',
    credits: 500,
    domain: '',
    subscriptionStarts: getTodayDate(),
    subscriptionPeriod: 12,
    subscriptionEnds: addMonths(getTodayDate(), 12)
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setLoadingUser(true);
      axios
        .get(`/user/${userId}`)
        .then(response => {
          const data = response.data;
          setFormData({
            userName: data.userName || '',
            displayName: data.displayName || '',
            password: '',
            credits: typeof data.credits === 'undefined' ? 500 : data.credits,
            domain: data.domain || '',
            subscriptionStarts: data.subscriptionStarts
              ? data.subscriptionStarts.split('T')[0]
              : getTodayDate(),
            subscriptionPeriod: data.subscriptionPeriod || 12,
            subscriptionEnds: data.subscriptionEnds
              ? data.subscriptionEnds.split('T')[0]
              : addMonths(getTodayDate(), 12)
          });
          setLoadingUser(false);
        })
        .catch(error => {
          setError(error.response?.data?.message || 'Failed to load user data');
          setLoadingUser(false);
        });
    }
  }, [isEditMode, userId]);

  const handleChange = e => {
    const { name, value } = e.target;

    // If subscriptionPeriod changes, update subscriptionEnds accordingly
    if (name === 'subscriptionPeriod') {
      const period = parseInt(value, 10);
      if (!isNaN(period)) {
        const newSubscriptionEnds = addMonths(formData.subscriptionStarts, period);
        setFormData({
          ...formData,
          subscriptionPeriod: period,
          subscriptionEnds: newSubscriptionEnds
        });
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else if (name === 'credits') {
      // When credits change, update availableCredits to same value only in create mode
      const creditsValue = parseInt(value, 10);
      if (!isNaN(creditsValue)) {
        if (!isEditMode) {
          setFormData({
            ...formData,
            credits: creditsValue
          });
        } else {
          setFormData({
            ...formData,
            credits: creditsValue
          });
        }
      } else {
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEditMode) {
        const data = { ...formData };
        delete data.domain;
        const response = await axios.post('/user/update', data);
        if (response?.data) {
          setSuccess(true);
          navigate('/users');
        }
      } else {
        const response = await axios.post('/user/create', formData);
        if (response?.data) {
          setSuccess(true);
          navigate('/users');
        }
      }
    } catch (error) {
      setError(
        error.response?.data?.message || (isEditMode ? 'Update failed' : 'Registration failed')
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loadingUser) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="UserName"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading || isEditMode}
          />
          <TextField
            fullWidth
            label="Display name"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />
          {!isEditMode && (
            <TextField
              fullWidth
              label="Sub domain name"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
            />
          )}

          <TextField
            type="number"
            fullWidth
            label="Credits"
            name="credits"
            value={formData.credits}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            type="date"
            fullWidth
            label="Subscription Starts"
            name="subscriptionStarts"
            value={formData.subscriptionStarts}
            onChange={e => {
              const newStart = e.target.value;
              const newEnd = addMonths(newStart, formData.subscriptionPeriod);
              setFormData({
                ...formData,
                subscriptionStarts: newStart,
                subscriptionEnds: newEnd
              });
            }}
            margin="normal"
            required
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            fullWidth
            label="Subscription Ends"
            name="subscriptionEnds"
            value={formData.subscriptionEnds}
            onChange={e => setFormData({ ...formData, subscriptionEnds: e.target.value })}
            margin="normal"
            required
            disabled={loading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="number"
            fullWidth
            label="Subscription Period (months)"
            name="subscriptionPeriod"
            value={formData.subscriptionPeriod}
            onChange={handleChange}
            margin="normal"
            required
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required={!isEditMode}
            disabled={loading}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : isEditMode ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserAction;
