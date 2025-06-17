import React from 'react';
import Chart from 'react-apexcharts';
import { Paper, Box, Typography } from '@mui/material';
import { getChartOptions } from '../../utils/chart';

const LocationsBarCharts = ({ topCountries, topCities }) => {
  // Prepare data for countries bar chart
  const countryLabels = topCountries.map(item => item.country);
  const countrySeries = [
    {
      name: 'Count',
      data: topCountries.map(item => item.count)
    }
  ];

  // Prepare data for cities bar chart
  const cityLabels = topCities.map(item => item.city || item.cities); // handle key name variation
  const citySeries = [
    {
      name: 'Count',
      data: topCities.map(item => item.count)
    }
  ];

  // Chart options for horizontal bar chart
  const countryOptions = {
    ...getChartOptions('bar', 'Top 5 Countries', countryLabels),
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      categories: countryLabels
    }
  };

  const cityOptions = {
    ...getChartOptions('bar', 'Top 5 Cities', cityLabels),
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'top'
        }
      }
    },
    xaxis: {
      categories: cityLabels
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
      <Paper sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Top 5 Countries
        </Typography>
        <Chart options={countryOptions} series={countrySeries} type="bar" height={300} />
      </Paper>
      <Paper sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Top 5 Cities
        </Typography>
        <Chart options={cityOptions} series={citySeries} type="bar" height={300} />
      </Paper>
    </Box>
  );
};

export default LocationsBarCharts;
