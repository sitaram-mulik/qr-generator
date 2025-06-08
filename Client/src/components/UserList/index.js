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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import GetAppIcon from "@mui/icons-material/NewLabel";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../utils/axiosInstance';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserName, setDeleteUserName] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/user/all');
      console.log('response.data ', response.data);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load users');
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/users/action?edit=${id}`);
  };

  const handleCreate = () => {
    navigate('/users/action');
  };

  const openDeleteDialog = (userName) => {
    setDeleteUserName(userName);
    setConfirmInput('');
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeleteUserName('');
    setConfirmInput('');
  };

  const handleDelete = async () => {
    if (confirmInput.toLowerCase() !== 'delete') {
      return;
    }
    try {
      const response = (await axiosInstance.delete('/user/delete', {
        params: { userName: deleteUserName }
      }))?.data;
      console.log('deleted ? ', response);
      closeDeleteDialog();
      fetchUsers();
    } catch (err) {
      console.error('Delete failed', err);
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
        <Typography variant="h5" component="h1" gutterBottom>
          Users
        </Typography>
        <Box sx={{mb: 1}}>
            <Button variant="contained" startIcon={<GetAppIcon />} onClick={handleCreate} sx={{ mb: 2 }}>
                Create User
            </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {users.length === 0 ? (
          <Alert severity="info">
            No users found. Create your users to get started.
          </Alert>
        ) : (

        <TableContainer component={Box} sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="campaign table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>                
                <TableCell>User Name</TableCell>
                <TableCell>Display Name</TableCell>
                <TableCell>Domain</TableCell>
                <TableCell>Credits</TableCell>
                <TableCell>Available Credits</TableCell>
                <TableCell>Total assets</TableCell>
                <TableCell>Downloads</TableCell>
                <TableCell>Super Admin</TableCell>
                {/* <TableCell>Edit</TableCell> */}
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(({userId, userName, displayName, domain, credits, availableCredits, totalAssets, downloads,  isSuperAdmin, _id}) => (
                <TableRow key={_id} hover>
                  <TableCell component="th" scope="row">
                    {userId}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {userName}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {displayName}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {domain}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {credits}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {availableCredits}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {totalAssets}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {downloads}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {isSuperAdmin ? "Yes" : "No"}
                  </TableCell>
                  {/* <TableCell component="th" scope="row">
                    <IconButton onClick={handleEdit} color="primary">
                     <EditIcon />
                    </IconButton>
                  </TableCell> */}
                  <TableCell component="th" scope="row">
                    <IconButton onClick={() => openDeleteDialog(userName)} disabled={isSuperAdmin} color="primary">
                     <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}

        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To confirm deletion, please type <b>delete</b> in the box below.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Type 'delete' to confirm"
              fullWidth
              variant="standard"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog}>Cancel</Button>
            <Button onClick={handleDelete} disabled={confirmInput.toLowerCase() !== 'delete'} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default UserList;
