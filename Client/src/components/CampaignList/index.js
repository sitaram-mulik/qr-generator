import React, { useState, useEffect } from 'react';
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { formatTimestamp } from '../../utils/common';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDelete from '../Lib/ConfirmDelete';
import Progress from '../Lib/Progress';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { isValidityExpired } from '../../utils/user';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCampaignName, setDeleteCampaignName] = useState('');

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

  const viewAssets = campaignName => {
    navigate(`/assets?campaign=${campaignName}`);
  };

  const handleCreateCampaignClick = () => {
    navigate('/campaigns/action');
  };

  const handleDelete = async () => {
    setDeleteInProgress(true);
    try {
      await axios.delete('/campaigns', {
        data: { campaignName: deleteCampaignName }
      });
    } catch (error) {
      console.log('Error deleting campaign:', error);
    }
    setDeleteInProgress(false);
    setDeleteDialogOpen(false);
    setDeleteCampaignName('');
    fetchCampaigns();
  };

  const openDeleteDialog = campaignName => {
    setDeleteCampaignName(campaignName);
    setDeleteDialogOpen(true);
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
        <Box
          sx={{
            pb: 2,
            display: 'flex',
            justifyContent: { xs: 'flex-start', md: 'flex-end' }
          }}
        >
          <Button startIcon={<AddCircleIcon />} onClick={handleCreateCampaignClick}>
            Create
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
                  <TableCell>UserId</TableCell>
                  <TableCell>Valid till</TableCell>
                  <TableCell>Created at</TableCell>
                  <TableCell>Assets</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {campaigns.map(({ name, userId, validTill, createdAt, _id }) => {
                  const validityExpired = isValidityExpired(validTill);
                  return (
                    <TableRow
                      key={_id}
                      hover
                      sx={{
                        backgroundColor: validityExpired
                          ? theme => theme.palette.warning.main + '!important'
                          : 'inherit',
                        '> td': {
                          color: validityExpired
                            ? theme => theme.palette.warning.contrastText
                            : 'inherit'
                        },
                        '&:hover': {
                          backgroundColor: validityExpired
                            ? theme => theme.palette.warning.dark + '!important'
                            : 'inherit'
                        }
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {userId}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {formatTimestamp(validTill)}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {formatTimestamp(createdAt)}
                      </TableCell>
                      <TableCell component="td" scope="row">
                        <IconButton color="primary" onClick={() => viewAssets(name)}>
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <IconButton
                          onClick={() => navigate(`/campaigns/action/${name}`)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell component="td" scope="row">
                        <IconButton onClick={() => openDeleteDialog(name)} color="primary">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <ConfirmDelete
          show={deleteDialogOpen}
          onDeleteConfirm={handleDelete}
          message="This action will delete all assets associated with this campaign permanently."
        />
      </Paper>
      <Progress start={deleteInProgress} />
    </Container>
  );
};

export default CampaignList;
