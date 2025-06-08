export const getChartOptions = (title, labels, onDataPointEvent) => {
    return {
        chart: {
          type: "pie",
          height: 400,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              const index = config.dataPointIndex;
              if(onDataPointEvent) {
                onDataPointEvent(index, config.w.config.labels[index]);
              }
            }, 
          },
        }, 
        labels: labels,
        legend: {
          show: false
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
              height: 300
            }
          }
        }],
        title: {
          text: title,
          align: "center",
          margin: 20,
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.globals.labels[opts.seriesIndex] + ": " + val.toFixed(1) + "%";
          }
        },
      }
}