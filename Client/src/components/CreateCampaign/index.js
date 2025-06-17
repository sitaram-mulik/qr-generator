import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { Alert, Box, Button, Container, MenuItem, Paper, TextField } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

const validTillOptions = [
  { id: 1, name: '1 Year' },
  { id: 2, name: '2 Year' },
  { id: 3, name: '3 Year' }
];

const CreateCampaign = () => {
  const [name, setName] = useState('');
  const [validity, setValidity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/campaigns/create', { name, validity });
      // Navigate back to campaigns list
      navigate('/campaigns');
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <h2>Create new campaign</h2>
        <Box
          sx={{
            gap: 2,
            mb: 4
          }}
        >
          <TextField
            label="Campaign Name"
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            fullWidth
          />
        </Box>
        <Box
          sx={{
            gap: 2,
            mb: 2
          }}
        >
          <TextField
            select
            label="Campaign validity *"
            value={validity}
            onChange={e => setValidity(e.target.value)}
            sx={{ minWidth: 300 }}
          >
            {validTillOptions.map(v => (
              <MenuItem key={v.id} value={v.id}>
                {v.name}
              </MenuItem>
            ))}
          </TextField>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Note: Assets created under this campaign will be deleted automatically,{' '}
            {user.gracePeriod} days after the Campaign validity ends.
          </Alert>
        </Box>
        <Button type="primary" variant="contained" onClick={handleSubmit}>
          {loading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </Paper>
    </Container>
  );
};

export default CreateCampaign;
