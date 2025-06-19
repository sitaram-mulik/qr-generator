import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [validity, setValidity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { campaign } = useParams();

  useEffect(() => {
    if (campaign) {
      setIsEditMode(true);
      const fetchCampaignDetails = async () => {
        try {
          const response = await axios.get(`/campaigns/${campaign}`);
          const data = response.data;
          setName(data.name || '');
          setTitle(data.title || '');
          setDesc(data.description || '');
          setValidity(data.validity || 1);
        } catch (error) {
          console.error('Failed to fetch campaign details', error);
        }
      };
      fetchCampaignDetails();
    }
  }, [campaign]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditMode) {
        // Update campaign - assuming PUT /campaigns/update
        await axios.put('/campaigns/update', { name, title, description: desc });
      } else {
        // Create new campaign
        await axios.post('/campaigns/create', { name, validity, title, description: desc });
      }
      // Navigate back to campaigns list
      navigate('/campaigns');
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <h2>{isEditMode ? 'Edit Campaign' : 'Create new campaign'}</h2>
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
            disabled={isEditMode}
          />
        </Box>
        <Box
          sx={{
            gap: 2,
            mb: 4
          }}
        >
          <TextField
            label="Title"
            type="text"
            id="title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            disabled={false}
          />
        </Box>

        <Box
          sx={{
            gap: 2,
            mb: 4
          }}
        >
          <TextField
            label="Description"
            multiline
            fullWidth
            rows={4}
            id="desc"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            disabled={false}
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
            disabled={isEditMode}
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
        <Button type="primary" variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading
            ? isEditMode
              ? 'Updating...'
              : 'Creating...'
            : isEditMode
            ? 'Update Campaign'
            : 'Create Campaign'}
        </Button>
      </Paper>
    </Container>
  );
};

export default CreateCampaign;
