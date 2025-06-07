import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Chip,
  Button,
  LinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Backdrop,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
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

          // <Grid container spacing={3}>
          //   {campaigns.map(({ name, _id }) => (
          //     <Grid item xs={12} sm={6} md={4} lg={3} key={_id}>
          //       <Card 
          //         sx={{ 
          //           height: '100%',
          //           transition: 'transform 0.2s',
          //           '&:hover': {
          //             transform: 'translateY(-4px)',
          //             boxShadow: 4
          //           }
          //         }}
          //       >
          //         <CardActionArea 
          //           onClick={() => handleCampaignClick(name)}
          //           sx={{ height: '100%', p: 2 }}
          //         >
          //           <Box 
          //             display="flex" 
          //             flexDirection="column" 
          //             alignItems="center" 
          //             justifyContent="center"
          //             sx={{ py: 2 }}
          //           >
          //             <FolderIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          //             <Typography 
          //               variant="h6" 
          //               component="h2"
          //               align="center"
          //               sx={{
          //                 overflow: 'hidden',
          //                 textOverflow: 'ellipsis',
          //                 width: '100%',
          //                 whiteSpace: 'nowrap'
          //               }}
          //             >
          //               {name}
          //             </Typography>
          //             <Chip 
          //               label="View Assets" 
          //               color="primary" 
          //               size="small"
          //               sx={{ mt: 1 }}
          //             />
          //           </Box>
          //         </CardActionArea>
          //       </Card>
          //     </Grid>
          //   ))}
          // </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default CampaignList;