import React from 'react';
import { Paper, Typography, Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const LocationsBarCharts = ({ topCountries, topCities }) => {
  console.log('topCountries ', topCountries);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  const countryLabels = topCountries.map(item => item.country);
  const countrySeries = topCountries.map(item => item.count);

  const cityLabels = topCities.map(item => item.city || item.cities);
  const citySeries = topCities.map(item => item.count);

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2 }}>
        {topCountries.length > 0 && (
          <Box mb={4}>
            <BarChart
              xAxis={[{ data: countrySeries, label: 'count' }]}
              yAxis={[{ scaleType: 'band', data: countryLabels }]}
              series={[{ data: countrySeries, label: 'Top Countries' }]}
              layout="horizontal"
              width={isMdUp ? 500 : 300} // Fixed width for md+ and smaller for mobile
              height={Math.max(200, countryLabels.length * 40)}
              sx={{
                '.MuiBarElement-root': { fill: '#1976d2' }
              }}
            />
          </Box>
        )}

        {topCities.length > 0 && (
          <Box>
            <BarChart
              xAxis={[{ data: citySeries, label: 'count' }]}
              yAxis={[{ scaleType: 'band', data: cityLabels }]}
              series={[{ data: citySeries, label: 'Top Cities' }]}
              layout="horizontal"
              width={isMdUp ? 500 : 300}
              height={Math.max(200, cityLabels.length * 40)}
              sx={{
                '.MuiBarElement-root': { fill: '#388e3c' }
              }}
            />
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export default LocationsBarCharts;
