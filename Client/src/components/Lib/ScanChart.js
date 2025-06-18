import { Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import Chart from 'react-apexcharts';
import { getChartOptions } from '../../utils/chart';

const ScanChart = ({ selectedCampaign }) => {
  const [chartData, setChartData] = useState({ labels: [], series: [] });

  useEffect(() => {
    if (selectedCampaign) {
      fetchVerifiedAssets();
    }
  }, [selectedCampaign]);

  const fetchVerifiedAssets = async () => {
    try {
      const response = await axiosInstance.get(
        '/assets?campaign=' + selectedCampaign + '&verified=true'
      );
      const scannedAssets = response.data.assets;

      // Helper function to group by date+hour (YYYY-MM-DDTHH)
      const groupByDateHour = assets => {
        return assets.reduce((acc, asset) => {
          const dateHour = new Date(asset.verifiedAt).toISOString().slice(0, 13); // e.g. "2025-06-17T13"
          acc[dateHour] = (acc[dateHour] || 0) + 1;
          return acc;
        }, {});
      };

      // Helper function to group by date only (YYYY-MM-DD)
      const groupByDate = assets => {
        return assets.reduce((acc, asset) => {
          const date = new Date(asset.verifiedAt).toISOString().slice(0, 10); // e.g. "2025-06-17"
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
      };

      let countsByDateHour = groupByDateHour(scannedAssets);
      let labels = Object.keys(countsByDateHour).sort();

      // If too many labels, fallback to date grouping
      if (labels.length > 100) {
        const countsByDate = groupByDate(scannedAssets);
        labels = Object.keys(countsByDate).sort();
        countsByDateHour = countsByDate;
      }

      const seriesData = labels.map(label => countsByDateHour[label]);

      // Format labels to readable date/time strings
      const formatLabel = isoString => {
        let date;
        if (isoString.length === 10) {
          // Date only
          date = new Date(isoString);
          return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } else if (isoString.length === 13) {
          // Date + hour, append minutes, seconds and Z for valid ISO string
          date = new Date(isoString + ':00:00Z');
          return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else {
          // Fallback for unexpected format
          date = new Date(isoString);
          return date.toLocaleString();
        }
      };

      const formattedLabels = labels.map(formatLabel);

      setChartData({
        labels: formattedLabels,
        series: [
          {
            name: 'Scanned Assets',
            data: seriesData
          }
        ]
      });
    } catch (error) {
      console.log('error ', error);
    }
  };

  const chartOptions = getChartOptions(
    'line',
    'Scanned Assets Over Time',
    chartData.labels,
    null,
    null,
    false
  );
  console.log('chartData.series?.data ', chartData.series);
  return (
    chartData.labels.length > 0 && (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Chart options={chartOptions} series={chartData.series} type="line" height={400} />
      </Paper>
    )
  );
};

export default ScanChart;
