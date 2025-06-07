import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxWidth: '90%',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

const ResultModal = ({ open, onClose, title, message, actions }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="result-modal-title"
      aria-describedby="result-modal-description"
    >
      <Box sx={style}>
        <Typography id="result-modal-title" variant="h6" component="h2" gutterBottom>
          {title}
        </Typography>
        <Typography id="result-modal-description" sx={{ mb: 2 }}>
          {message}
        </Typography>
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          {actions && actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "contained"}
              onClick={action.onClick}
              href={action.href}
              target={action.target}
              rel={action.rel}
              sx={{ ml: index > 0 ? 1 : 0 }}
              component={action.href ? "a" : "button"}
            >
              {action.label}
            </Button>
          ))}
          <Button onClick={onClose} sx={{ ml: actions ? 1 : 0 }}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ResultModal;
