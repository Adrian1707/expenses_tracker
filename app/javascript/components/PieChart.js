import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Pie } from 'react-chartjs-2';
import ExpensesModal from "./ExpensesModal"
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, annotationPlugin, ChartDataLabels);

const PieChart = (props) => {
  const [showExpensesModal, setShowExpensesModal] = useState(false)
  const [modalData, setModalData] = useState([])
  const [month, setMonth] = useState(props.month)

  useEffect(() => {
   setMonth(props.month)
  }, [props.month]);

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

  const handleClick = (event) => {
    console.log("CLICKED")
    fetchData(data.labels[event.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)['0'].index])
  };

  const fetchData = (category) => {
    fetch(`http://localhost:3000/expenses/by_category?category=${category}&month=${month}`, {
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) => response.json())
      .then((data) => {
        setShowExpensesModal(true)
        setModalData(data.expenses_for_category)
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
      });
  };

  const options = {
    animation: {
      animateRotate: true
    },
    onHover: (event, chartElement) => {
      if (chartElement.length === 1) {
        event.native.target.style.cursor = 'pointer';
      } else {
        event.native.target.style.cursor = 'default';
      }
    },
    onClick: handleClick,
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
    <div>
      <ExpensesModal displayModal={showExpensesModal} data={modalData} />
      <div className='expenses-pie-chart'>
        <Pie data={data} options={options} />
      </div>
    </div>
  )

}

export default PieChart
