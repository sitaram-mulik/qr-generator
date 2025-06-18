import React from 'react';
import { Card, Typography, Grid, Box } from '@mui/material';

const Statistics = ({ stats }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        width: { md: '50%', xs: '100%' },
        mb: { xs: 2, md: 0 }
      }}
    >
      {stats.map((stat, index) => (
        <Card
          sx={{
            p: { xs: 1, sm: 2 },
            textAlign: 'center',
            borderRadius: 2,
            boxShadow: 2,
            backgroundColor: stat.color || '#f5f5f5',
            width: '18%'
          }}
          key={stat.label}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontSize: { xs: '0.8rem', sm: '1rem' } }}
            color="text.secondary"
          >
            {stat.label}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
            fontWeight="bold"
          >
            {stat.value}
          </Typography>
        </Card>
      ))}
    </Box>
  );
};

export default Statistics;
