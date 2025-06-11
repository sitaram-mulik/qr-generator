import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../utils/axiosInstance';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Button,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LocationChart from './LocationChart';
import Statistics from '../Lib/Statistics';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalCount: 0,
    downloadedCount: 0,
    verifiedCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/assets/statistics');
        const { totalCount, downloadedCount, verifiedCount } = response?.data || {};
        setCounts({
          totalCount,
          downloadedCount, // Placeholder until API updated
          verifiedCount // Placeholder until API updated
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load statistics');
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const stats = useMemo(
    () => [
      { label: 'Total Assets', value: counts?.totalCount || 0 },
      { label: 'Scanned Assets', value: counts?.verifiedCount || 0 },
      { label: 'Downloaded Assets', value: counts?.downloadedCount || 0 }
    ],
    [counts]
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        {error}
      </Alert>
    );
  }

  const handleCardClick = type => {
    // Placeholder for click action, e.g., navigate or filter
  };

  return (
    <Box sx={{ flexGrow: 1, p: isSmallScreen ? 1 : 2 }}>
      <Statistics stats={stats || []} />
      <Box sx={{ mb: 3, mt: 3 }}>
        <LocationChart />
      </Box>
    </Box>
  );
};

export default Dashboard;
