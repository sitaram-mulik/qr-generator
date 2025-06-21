import React, { useState, useEffect } from 'react';
import {
  Container,
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
  Checkbox,
  Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import IconButton from '@mui/material/IconButton';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import axiosInstance from '../../utils/axiosInstance';
import {
  getSubscriptionEndDate,
  getSubscriptionStartDate,
  isValidityExpired
} from '../../utils/user';
import ConfirmDelete from '../Lib/ConfirmDelete';
import Progress from '../Lib/Progress';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserName, setDeleteUserName] = useState('');
  const [userStatusLoading, setUserStatusLoading] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user/all');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleEdit = id => {
    navigate(`/users/action/${id}`);
  };

  const handleCreate = () => {
    navigate('/users/action');
  };

  const changeUserStatus = (id, isActive) => {
    setUserStatusLoading(true);
    try {
      axiosInstance.post('/user/toggleStatus', { id, isActive }).then(response => {
        console.log('toggleUserStatus response: ', response);
        fetchUsers();
        setUserStatusLoading(false);
      });
    } catch (err) {
      setUserStatusLoading(false);
      console.log('Failed to change user status', err);
    }
  };

  const openDeleteDialog = _id => {
    setDeleteUserName(_id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      setDeleteInProgress(true);
      try {
        await axiosInstance.delete('/user/delete', {
          params: { userId: deleteUserName }
        });
      } catch (error) {
        console.log('Error while deleting user:', error);
      }
      setDeleteInProgress(false);
      fetchUsers();
    } catch (err) {
      console.log('Delete failed', err);
    }
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
          <Button startIcon={<AddCircleIcon />} onClick={handleCreate}>
            Create
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {users.length === 0 ? (
          <Alert severity="info">No users found. Create your users to get started.</Alert>
        ) : (
          <TableContainer component={Box} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="campaign table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell>UserId</TableCell>
                  <TableCell>UserName</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Subscription period</TableCell>
                  <TableCell>Credits</TableCell>
                  <TableCell>Assets</TableCell>
                  <TableCell>Downloads</TableCell>
                  <TableCell>Super Admin</TableCell>
                  <TableCell>Edit</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Clear</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(
                  ({
                    userName,
                    displayName,
                    domain,
                    credits,
                    totalAssets,
                    downloads,
                    isSuperAdmin,
                    _id,
                    isActive,
                    ...rest
                  }) => {
                    const isSubExpired = isValidityExpired(rest.subscriptionEnds);
                    return (
                      <TableRow
                        key={_id}
                        hover
                        sx={{
                          backgroundColor: isSubExpired
                            ? theme => theme.palette.warning.main + '!important'
                            : 'inherit',
                          '> td': {
                            color: isSubExpired
                              ? theme => theme.palette.warning.contrastText
                              : 'inherit'
                          },
                          '&:hover': {
                            backgroundColor: isSubExpired
                              ? theme => theme.palette.warning.dark + '!important'
                              : 'inherit'
                          }
                        }}
                      >
                        <TableCell component="td" scope="row">
                          {_id}
                        </TableCell>
                        <TableCell component="td" scope="row">
                          {userName}
                        </TableCell>
                        <TableCell component="td" scope="row">
                          {displayName}
                        </TableCell>
                        <TableCell component="td" scope="row">
                          {domain}
                        </TableCell>
                        <TableCell component="td" scope="row">
                          {getSubscriptionStartDate(rest)} - {getSubscriptionEndDate(rest)}
                        </TableCell>
                        <TableCell
                          component="td"
                          scope="row"
                          sx={{
                            color:
                              credits <= 0
                                ? theme => theme.palette.error.main + '!important'
                                : 'inherit'
                          }}
                        >
                          {credits}
                        </TableCell>

                        <TableCell component="td" scope="row">
                          {totalAssets}
                        </TableCell>
                        <TableCell component="td" scope="row">
                          {downloads}
                        </TableCell>
                        <TableCell component="td" scope="row">
                          {isSuperAdmin ? 'Yes' : 'No'}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <IconButton onClick={() => handleEdit(_id)} color="primary">
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                        <TableCell component="td" scope="row">
                          <Checkbox
                            checked={isActive}
                            onChange={() => changeUserStatus(_id, !isActive)}
                            disabled={userStatusLoading || isSuperAdmin}
                          />
                        </TableCell>
                        <TableCell component="td" scope="row">
                          <IconButton
                            onClick={() => openDeleteDialog(_id)}
                            disabled={isSuperAdmin}
                            color="primary"
                          >
                            <DeleteSweepIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <ConfirmDelete
          onDeleteConfirm={handleDelete}
          show={deleteDialogOpen}
          message="This action will clear all data (including assets) of the user."
        />
      </Paper>
      <Progress start={deleteInProgress} />
    </Container>
  );
};

export default UserList;
