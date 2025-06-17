import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';

const ConfirmDelete = ({ onDeleteConfirm, show, message }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setConfirmInput('');
  };

  const onConfirm = () => {
    if (confirmInput.toLowerCase() === 'delete') {
      onDeleteConfirm();
      closeDeleteDialog();
    }
  };

  useEffect(() => {
    if (show) {
      setDeleteDialogOpen(true);
    }
  }, [show]);

  return (
    deleteDialogOpen && (
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {message}
            <br />
            To confirm deletion, please type <b>delete</b> in the box below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Type 'delete' to confirm"
            fullWidth
            variant="standard"
            value={confirmInput}
            onChange={e => setConfirmInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button
            onClick={onConfirm}
            disabled={confirmInput.toLowerCase() !== 'delete'}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
};

export default ConfirmDelete;
