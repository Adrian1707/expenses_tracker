import React from "react"
import PropTypes from "prop-types"
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, annotationPlugin);

const BarChart = (props) => {
  ChartJS.overrides.pie.plugins.legend.display = false
  const labels = Object.keys(props.expensesByExpenseDate);

  const data = {
    labels,
    datasets: [
      {
        label: 'Expenses',
        data: labels.map(date => props.expensesByExpenseDate[date].reduce((total, expense) => total + expense.amount, 0)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const handleClick = (event) => {
    console.log("HEY")
  };

  const options = {
    onClick: handleClick,
    scales: {
      x: {
        type: 'category',
      },
      y: {
        type: 'linear',
        beginAtZero: true,
      },
    },
    plugins: {
    annotation: {
      annotations: {
        line1: {
          type: 'line',
          yMin: 80,
          yMax: 80,
          borderColor: 'rgb(255, 0, 0)',
          borderWidth: 2,
          label: {
            enabled: true,
            content: 'Budget',
            position: 'start'
          }
        }
      }
    }
  }
  };

  return(
    <Bar data={data} options={options} />
  )

}

export default BarChart
