import React from 'react';
import Chart from 'react-apexcharts';
import { Paper, Box, Typography, Grid } from '@mui/material';
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
    ...getChartOptions('bar', 'Top Countries', countryLabels),
    dataLabels: { enabled: false },
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
    ...getChartOptions('bar', 'Top Cities', cityLabels),
    dataLabels: { enabled: false },
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
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper sx={{ p: 2 }}>
        {topCountries.length > 0 && (
          <Chart options={countryOptions} series={countrySeries} type="bar" height={200} />
        )}
        {topCities.length > 0 && (
          <Chart options={cityOptions} series={citySeries} type="bar" height={200} />
        )}
      </Paper>
    </Grid>
  );
};

export default LocationsBarCharts;
