import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '../../utils/axiosInstance';
import {
  Box,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Alert,
  Grid,
  Container
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Locations from './Locations';
import Statistics from '../Lib/Statistics';
import CampaignSelector from '../Lib/CampaignSelector';
import ScanChart from '../Lib/ScanChart';
import ScanCompletionPieChart from './ScanCompletionPieChart';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalCount: 0,
    downloadedCount: 0,
    verifiedCount: 0,
    campaignCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchParams] = useSearchParams();
  const selectedCampaign = searchParams.get('campaign') || 'all';

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/assets/statistics?campaign=${selectedCampaign}`);
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
  }, [selectedCampaign]);

  const stats = useMemo(
    () => [
      { label: 'Campaigns', value: counts?.campaignCount || 0 },
      { label: 'Assets', value: counts?.totalCount || 0 },
      { label: 'Scans', value: counts?.verifiedCount || 0 },
      { label: 'Downloads', value: counts?.downloadedCount || 0 }
    ],
    [counts]
  );

  const handleCardClick = type => {
    // Placeholder for click action, e.g., navigate or filter
  };

  const setCampaignsData = useCallback(campaigns => {
    console.log('campaignscampaigns ', campaigns);
    setCounts(state => ({ ...state, campaignCount: campaigns?.length || 0 }));
  }, []);

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

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' }
        }}
      >
        <Statistics stats={stats || []} />
        <CampaignSelector setCampaignsData={setCampaignsData} />
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ScanChart selectedCampaign={selectedCampaign} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ScanCompletionPieChart counts={counts} />
        </Grid>

        <Locations selectedCampaign={selectedCampaign} counts={counts} />
      </Grid>
    </Container>
  );
};

export default Dashboard;
