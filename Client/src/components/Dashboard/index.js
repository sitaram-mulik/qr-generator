import React, { useEffect, useState } from "react";
import axios from "../../utils/axiosInstance";
import { Box, Grid, Paper, Typography, CircularProgress, useTheme, useMediaQuery, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    totalCount: 0,
    downloadedCount: 0,
    verifiedCount: 0,
  });
  const [locationData, setLocationData] = useState([]);
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
        const {totalCount, downloadedCount, verifiedCount} = response?.data || {};
        setCounts({
          totalCount,
          downloadedCount, // Placeholder until API updated
          verifiedCount,   // Placeholder until API updated
        });
        const locationsRes = await axios.get("/locations");
        console.log('locationsRes ', locationsRes.data);
        setLocationData(locationsRes.data);
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

  // Aggregate location data by country
  const countryData = locationData.reduce((acc, loc) => {
    const country = loc.country || "Unknown";
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});

  // Prepare data for Highcharts pie chart
  const pieData = Object.entries(countryData).map(([country, count]) => ({
    name: country,
    y: count,
  }));

  const colors = [
    "#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9",
    "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"
  ];

  const options = {
    chart: {
      type: "pie",
      height: 300,
    },
    title: {
      text: "Products scanned by Country",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b> ({point.y})",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        colors: colors,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Countries",
        colorByPoint: true,
        data: pieData,
      },
    ],
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
      <Box sx={{ mb: 3, mt: 3 }}>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </Box>
    </Box>
  );
};

export default Dashboard;
