import React, { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

const ScanCompletionPieChart = ({ counts }) => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    const { verifiedCount, totalCount } = counts || {};
    const scanned = verifiedCount || 0;
    const remaining = totalCount ? Math.max(totalCount - scanned, 0) : 0;

    setSeries([
      { label: 'Scanned', value: scanned },
      { label: 'Remaining', value: remaining }
    ]);
  }, [counts]);

  return (
    counts.verifiedCount > 0 && (
      <Paper sx={{ p: 2, mt: 2 }}>
        <PieChart
          height={300}
          width={300}
          series={[
            {
              data: series,
              innerRadius: '50%',
              arcLabelMinAngle: 20
            }
          ]}
          skipAnimation={false}
        />
      </Paper>
    )
  );
};

export default ScanCompletionPieChart;
