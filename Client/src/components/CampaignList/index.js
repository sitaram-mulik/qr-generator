import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import GetAppIcon from "@mui/icons-material/NewLabel";
import { formatTimestamp } from "../../utils/common";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/campaigns');
      setCampaigns(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load campaigns');
      setLoading(false);
    }
  };

  const viewAssets = (campaignName) => {
    navigate(`/assets?campaign=${campaignName}`);
  };

  const handleCreateCampaignClick = () => {
    navigate('/create-campaign');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* <a href="#" onClick={handleCreateCampaignClick} style={{ color: '#1976d2', textDecoration: 'none' }}>Create new campaign</a> */}
        <Typography variant="h5" component="h1" gutterBottom>
          My Campaigns
        </Typography>
        <Box sx={{mb: 1}}>
            <Button variant="contained" startIcon={<GetAppIcon />} onClick={handleCreateCampaignClick} sx={{ mb: 2 }}>
                Create campaign
            </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {campaigns.length === 0 ? (
          <Alert severity="info">
            No campaigns found. Create your first campaign to get started.
          </Alert>
        ) : (



        <TableContainer component={Box} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="campaign table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Valid till</TableCell>
                <TableCell>Created at</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {campaigns.map(({name, validTill, createdAt, _id}) => (
                <TableRow key={_id} hover>
                  <TableCell component="th" scope="row">
                    {name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {formatTimestamp(validTill)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {formatTimestamp(createdAt)}
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained" onClick={() => viewAssets(name)}>
                      View assets
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default CampaignList;