import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress, Box, Card, AlertTitle, Paper, Typography } from '@mui/material';

const ProtectedRoute = ({ children, checkSuperAdmin }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If user is authenticated and trying to access login page, redirect to home
  if (location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  if(checkSuperAdmin && !user.isSuperAdmin) {
    return <Paper elevation={3} sx={{p: 2, m: 2}}>
      <Typography color="error">
        You are not authorized to access this resource!
      </Typography>
    </Paper>;
  }

  return children;
}

export default ProtectedRoute;