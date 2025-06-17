import { Backdrop, Box, CircularProgress, Typography } from '@mui/material';

const Progress = ({ start, processingStats, progress }) => {
  return (
    start && (
      <Backdrop
        sx={{
          color: '#1976d2',
          backgroundColor: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1,
          flexDirection: 'column'
        }}
        open={start}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          {progress > -1 ? (
            <>
              <CircularProgress
                variant="determinate"
                value={100}
                size={150}
                thickness={5}
                sx={{ color: '#e0e0e0', position: 'absolute', top: 0, left: 0 }}
              />
              <CircularProgress
                variant="determinate"
                value={progress}
                size={150}
                thickness={5}
                sx={{ color: '#1976d2' }}
              />
            </>
          ) : (
            <CircularProgress color="inherit" size={150} />
          )}
        </Box>
        {processingStats && (
          <Typography variant="body1" color="inherit" align="center" sx={{ mt: 1 }}>
            Successful: {processingStats.success} / Failed:{' '}
            {processingStats.failed || processingStats.failure} / Total:
            {processingStats.total}
          </Typography>
        )}
      </Backdrop>
    )
  );
};

export default Progress;
