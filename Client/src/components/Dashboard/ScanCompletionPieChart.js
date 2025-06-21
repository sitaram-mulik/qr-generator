import React, { useEffect, useState } from 'react';
import { Paper, useMediaQuery } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import theme, { BoxGrid } from '../../theme';

const ScanCompletionPieChart = ({ counts }) => {
  const [series, setSeries] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const { verifiedCount, totalCount } = counts || {};
    const scanned = verifiedCount || 0;
    const remaining = totalCount ? Math.max(totalCount - scanned, 0) : 0;

    setSeries([
      { label: 'Scanned', value: scanned },
      { label: 'Pending', value: remaining }
    ]);
  }, [counts]);

  return (
    counts.verifiedCount > 0 && (
      <BoxGrid size={{ xs: 12, md: 4 }}>
        <PieChart
          height={300}
          width={isMobile ? 200 : 420}
          series={[
            {
              data: series,
              innerRadius: '50%',
              arcLabelMinAngle: 20
            }
          ]}
          skipAnimation={false}
        />
      </BoxGrid>
    )
  );
};

export default ScanCompletionPieChart;
