import React from 'react';
import { Card, Typography, Grid } from '@mui/material';

const Statistics = ({ stats }) => {
  return (
    <Grid container spacing={2}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Card
            sx={{
              p: { xs: 1, sm: 2 },
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: stat.color || '#f5f5f5',
            }}
          >
            <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }} color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} fontWeight="bold">
              {stat.value}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Statistics;
