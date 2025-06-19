import React, { useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Box,
  Backdrop,
  Chip,
  Stack,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { keyframes } from '@mui/system';

const Progress = ({ start, processingStats, progress = 0, onClose }) => {
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const failed = processingStats?.failed || processingStats?.failure || 0;

  useEffect(() => {
    if (start) {
      setDisplayedProgress(0);
      setVisible(true);
      setShowFlash(false);
    }
  }, [start]);

  useEffect(() => {
    if (!start) return;

    const interval = setInterval(() => {
      setDisplayedProgress(prev => {
        if (prev < 99) {
          return prev + 1;
        }
        return prev;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [start]);

  useEffect(() => {
    if (progress > displayedProgress) {
      setDisplayedProgress(progress);
    }
  }, [progress, displayedProgress]);

  useEffect(() => {
    if (!start && visible && displayedProgress < 100) {
      setDisplayedProgress(100);
      setShowFlash(true);
    } else if (!start && visible) {
      setShowFlash(true);
    }
  }, [start, visible, displayedProgress]);

  // Prevent page close/refresh when scanning
  useEffect(() => {
    const handleBeforeUnload = e => {
      if (start) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [start]);

  // MUI animations
  const scanAnimation = keyframes`
    0% { top: 0%; }
    50% { top: 90%; }
    100% { top: 0%; }
  `;

  const flashAnimation = keyframes`
    0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
    50% { box-shadow: 0 0 20px 10px rgba(0, 255, 0, 0.7); }
    100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
  `;

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Loader Backdrop */}
      <Backdrop
        open={visible}
        sx={{
          zIndex: theme => theme.zIndex.drawer + 1,
          backgroundColor: '#FFF'
        }}
      >
        {/* Close Icon */}
        {!start && (
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: '#f0f0f0',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          {/* QR Code Box */}
          <Box
            position="relative"
            width={320}
            height={320}
            overflow="hidden"
            borderRadius={2}
            sx={showFlash ? { animation: `${flashAnimation} 2s ease-out infinite` } : {}}
          >
            {/* Grey Base QR */}
            <Box position="absolute" top={0} left={0} width="100%" height="100%" opacity={0.2}>
              <QRCodeCanvas size={320} fgColor="#888888" />
            </Box>

            {/* Dark QR with progressive reveal */}
            <Box
              position="absolute"
              top={0}
              left={0}
              width="100%"
              height="100%"
              overflow="hidden"
              sx={{
                clipPath: `inset(0 0 ${100 - displayedProgress}% 0)`,
                transition: 'clip-path 0.2s ease-out'
              }}
            >
              <QRCodeCanvas size={320} fgColor="#000000" />
            </Box>

            {/* Scan Line */}
            {start && (
              <Box
                width="100%"
                height="4px"
                sx={{
                  position: 'absolute',
                  animation: `${scanAnimation} 2s linear infinite`,
                  borderRadius: '4px',
                  background:
                    'linear-gradient(to right, rgba(0,255,255,0) 0%, rgba(0,255,255,0.7) 50%, rgba(0,255,255,0) 100%)',
                  boxShadow: '0 0 10px 4px rgba(0,255,255,0.6)'
                }}
              />
            )}

            {/* Percentage Display */}
            <Typography
              variant="h6"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                borderRadius: 1,
                px: 1.5,
                py: 0.5
              }}
            >
              {`${Math.floor(Math.min(displayedProgress, 100))}%`}
            </Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            {processingStats &&
              !start &&
              (failed > 0 ? (
                <Alert severity="warning">
                  Data processed with some failures. <br />
                  {failed} items out of ${processingStats.success} was not processed.
                </Alert>
              ) : (
                <Alert security="success">
                  Data processed successfully. <br /> {processingStats.success} items processed. You
                  can now close the screen.
                </Alert>
              ))}
            {start && (
              <Alert severity="warning">
                Processing data... Please do not leave or refresh this screen
              </Alert>
            )}
          </Box>
        </Box>
      </Backdrop>
    </>
  );
};

export default Progress;
