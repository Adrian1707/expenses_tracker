import React from "react"
import PropTypes from "prop-types"
import { Pie } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, annotationPlugin, ChartDataLabels);

const Dashboard = (props) => {
  ChartJS.overrides.pie.plugins.legend.display = false
  ChartJS.defaults.set('plugins.datalabels', {
    display: false
  });
  const data = {
    labels: Object.keys(props.expensesByCategory),
    datasets: [
      {
        data: Object.values(props.expensesByCategory),
        backgroundColor: [
          '#FF6384', // Red
          '#36A2EB', // Blue
          '#FFCE56', // Yellow
          '#8BC34A', // Green
          '#9370DB', // Purple
          '#FF9800', // Orange
          '#4FC3F7', // Light Blue
          '#E57373', // Red Shade
          '#81C784', // Green Shade
          '#BA68C8', // Purple Shade
          '#FFB74D', // Orange Shade
          '#4DD0E1', // Cyan
          '#E57373', // Red Shade
          '#81C784', // Green Shade
          '#BA68C8'  // Purple Shade
        ]
      },
    ],
  };


  const options = {
    animation: {
      animateRotate: true
    },
    plugins: {
      datalabels: {
        formatter: function(value, context) {
          return value.toFixed(2).toString() + "%";
        },
        backgroundColor: '#ffffff',
        display: true,
        align: 'bottom',
        borderRadius: 3,
        font: {
          size: 10,
        },
      },
    },
  };

  return(
    <div className='expenses-pie-chart'>
      <Pie data={data} options={options} />
    </div>
  )

}

export default Dashboard
