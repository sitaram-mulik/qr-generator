import React, { useEffect, useState } from 'react';
import { Paper } from '@mui/material';
import Chart from 'react-apexcharts';

const labels = ['Scanned', 'Remaining'];

const ScanCompletionPieChart = ({ counts }) => {
  const [series, setSeries] = useState([]);
  useEffect(() => {
    console.log('ScanCompletionPieChart counts prop:', counts);
    const { verifiedCount, totalCount } = counts || {};
    const scanned = verifiedCount || 0;
    const remaining = totalCount ? Math.max(totalCount - scanned, 0) : 0;

    setSeries([scanned, remaining]);
  }, [counts]);

  console.log('ScanCompletionPieChart series state:', series);

  // Simplified chart options for debugging
  const chartOptions = (() => {
    return {
      chart: {
        type: 'pie',
        toolbar: {
          show: true
        }
      },
      labels: labels,
      colors: ['#4CAF50', '#F44336'],
      legend: {
        show: true
      },
      dataLabels: {
        enabled: true,
        formatter: function (val, opts) {
          console.log('opts.dataPointIndex ', opts);
          return labels[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
        }
      },
      title: {
        text: 'Scan Completion Percentage',
        align: 'center',
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      }
    };
  })();

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Chart
        key={JSON.stringify(series)}
        options={chartOptions}
        series={series}
        type="pie"
        height={350}
      />
    </Paper>
  );
};

export default ScanCompletionPieChart;
