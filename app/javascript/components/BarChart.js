import React, { useState } from "react"
import PropTypes from "prop-types"
import { Bar } from 'react-chartjs-2';
import ExpensesModal from "./ExpensesModal"
import annotationPlugin from 'chartjs-plugin-annotation';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend, annotationPlugin);

const BarChart = (props) => {
  const [showExpensesModal, setShowExpensesModal] = useState(false)
  const [modalData, setModalData] = useState([])
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
    console.log("HANDLING CLICK IN BAR CHART")
    fetchData(labels[event.chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true)['0'].index])
  };

  const fetchData = (date) => {
    fetch(`http://localhost:3000/expenses/by_date?date=${date}`, {
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) => response.json())
      .then((data) => {
        setShowExpensesModal(true)
        setModalData(data.expenses_for_date)
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
      });
  };

  const options = {
    onHover: (event, chartElement) => {
      if (chartElement.length === 1) {
        event.native.target.style.cursor = 'pointer';
      } else {
        event.native.target.style.cursor = 'default';
      }
    },
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
    <div>
      <ExpensesModal displayModal={showExpensesModal} data={modalData} />
      <Bar data={data} options={options} />
    </div>
  )

}

export default BarChart
