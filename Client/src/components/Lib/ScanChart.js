import { Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { LineChart } from '@mui/x-charts/LineChart';

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

      const groupByDateHour = assets => {
        return assets.reduce((acc, asset) => {
          const dateHour = new Date(asset.verifiedAt).toISOString().slice(0, 13);
          acc[dateHour] = (acc[dateHour] || 0) + 1;
          return acc;
        }, {});
      };

      const groupByDate = assets => {
        return assets.reduce((acc, asset) => {
          const date = new Date(asset.verifiedAt).toISOString().slice(0, 10);
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
      };

      let countsByDateHour = groupByDateHour(scannedAssets);
      let labels = Object.keys(countsByDateHour).sort();

      if (labels.length > 100) {
        const countsByDate = groupByDate(scannedAssets);
        labels = Object.keys(countsByDate).sort();
        countsByDateHour = countsByDate;
      }

      const seriesData = labels.map(label => countsByDateHour[label]);

      const formatLabel = isoString => {
        let date;
        if (isoString.length === 10) {
          date = new Date(isoString);
          return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        } else if (isoString.length === 13) {
          date = new Date(isoString + ':00:00Z');
          return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else {
          date = new Date(isoString);
          return date.toLocaleString();
        }
      };

      let formattedLabels = labels.map(formatLabel);

      // Always add a starting point at 0
      if (formattedLabels.length >= 1) {
        const firstDate = new Date(new Date(formattedLabels[0]).getTime() - 3600 * 1000); // 1 hour before
        const formattedFirstDate = firstDate.toLocaleString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        formattedLabels = [formattedFirstDate, ...formattedLabels];
        seriesData.unshift(0);
      }

      setChartData({
        labels: formattedLabels,
        series: seriesData
      });
    } catch (error) {
      console.log('error ', error);
    }
  };

  return (
    chartData.labels.length > 0 && (
      <LineChart
        xAxis={[{ scaleType: 'point', data: chartData.labels }]}
        series={[{ data: chartData.series, area: true, label: 'Scanned Assets' }]}
        height={400}
        sx={{
          '.MuiLineElement-root': { strokeWidth: 3 },
          '.MuiAreaElement-root': { opacity: 0.2 }
        }}
      />
    )
  );
};

export default ScanChart;
