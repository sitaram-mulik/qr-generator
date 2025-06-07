import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Box, Grid, Paper, Typography, CircularProgress, useTheme, useMediaQuery, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalCount: 0,
    downloadedCount: 0,
    verifiedCount: 0,
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
        const response = await axios.get("/assets/statistics");
        console.log('response ', response.data);
        const {totalCount, downloadedCount, verifiedCount} = response?.data || {};
        setCounts({
          totalCount,
          downloadedCount, // Placeholder until API updated
          verifiedCount,   // Placeholder until API updated
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to load asset counts");
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const handleCardClick = (type) => {
    // Placeholder for click action, e.g., navigate or filter
    alert(`Clicked on ${type}`);
  };

  return (
    <Box sx={{ flexGrow: 1, p: isSmallScreen ? 1 : 2 }}>
      <Grid container spacing={isSmallScreen ? 1 : 2} justifyContent="flex-start">
        <Grid item xs={12} sm={4} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: isSmallScreen ? 1.5 : 2,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              width: '100%',
              boxSizing: 'border-box',
            }}
            onClick={() => handleCardClick("Total Assets")}
          >
            <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom>
              Total Assets
            </Typography>
            <Typography variant={isSmallScreen ? "h5" : "h4"}>{counts.totalCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: isSmallScreen ? 1.5 : 2,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              width: '100%',
              boxSizing: 'border-box',
            }}
            onClick={() => handleCardClick("Downloaded Assets")}
          >
            <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom>
              Downloaded Assets
            </Typography>
            <Typography variant={isSmallScreen ? "h5" : "h4"}>{counts.downloadedCount}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: isSmallScreen ? 1.5 : 2,
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { boxShadow: 6 },
              width: '100%',
              boxSizing: 'border-box',
            }}
            onClick={() => handleCardClick("Verified Assets")}
          >
            <Typography variant={isSmallScreen ? "subtitle1" : "h6"} gutterBottom>
              Verified Assets
            </Typography>
            <Typography variant={isSmallScreen ? "h5" : "h4"}>{counts.verifiedCount}</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{mb: 1}}>
            <Button variant="contained" startIcon={<AddCircleOutlineIcon />} onClick={() => navigate('/generate')} sx={{ mt: 2 }}>
                Generate assets
            </Button>
        </Box>
    </Box>
  );
};

export default Dashboard;
