export const getChartOptions = (
  type,
  title,
  labels,
  onDataPointEvent,
  size = 300,
  isPercentage = true
) => {
  return {
    chart: {
      type,
      height: 400,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          const index = config.dataPointIndex;
          if (onDataPointEvent) {
            onDataPointEvent(index, config.w.config.labels[index]);
          }
        }
      }
    },
    labels: labels,
    legend: {
      show: false
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: size,
            height: size
          }
        }
      }
    ],
    title: {
      text: title,
      align: 'center',
      margin: 20,
      style: {
        fontSize: '16px',
        fontWeight: 'bold'
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        if (isPercentage) {
          return opts.w.globals.labels[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
        } else {
          return val.toFixed(0);
        }
      }
    }
  };
};
