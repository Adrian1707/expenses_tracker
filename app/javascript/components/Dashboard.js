import React, { useState, useEffect, useCallback } from "react"
import BarChart from './BarChart'
import PieChart from './PieChart'
import Table from './Table'
import ExpenseSubmitModal from './ExpenseSubmitModal'
import QuestionModal from './QuestionModal'

const Dashboard = (props) => {
  const [month, setMonth] = useState(props.month);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  const [expensesToday, setExpensesToday] = useState(props.expensesToday)
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(props.totalMonthlyExpenses)
  const [expensesByExpenseDate, setExpensesByExpenseDate] = useState(props.expensesByExpenseDate)
  const [expensesByCategory, setExpensesByCategory] = useState(props.expensesByCategory)
  const [categoryValues, setCategoryValues] = useState(props.categoryValues)
  const [chartType, setChartType] = useState('regulars')
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false)

  const toggleQuestionModal = useCallback(() => {
    setIsQuestionModalOpen(!isQuestionModalOpen)
  }, []);


 useEffect(() => {
    const handleKeyPress = e => {
      if (e.metaKey && e.key === 'k') {
        console.log("HEY")
        toggleQuestionModal()
      }
    }

    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const handleMonthChange = (event) => {
    const month = event.target.value;
    setMonth(month);
    fetchData(month, chartType);
  };

  const fetchData = (month, chartType) => {
    setChartType(chartType)
    fetch(`http://localhost:3000/expenses/index?month=${month}&chart_type=${chartType}`, {
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) => response.json())
      .then((data) => {
        setExpensesByExpenseDate(data.expenses_by_expense_date)
        setExpensesByCategory(data.expenses_by_category_percentages)
        setCategoryValues(data.category_values)
        setExpensesToday(data.expensesToday)
        setTotalMonthlyExpenses(data.totalMonthlyExpenses)
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
      });
  };

  const openExpenseModal = () => {
    setIsExpenseModalOpen(true)
  }

  return(
    <div>
      <ExpenseSubmitModal isOpen={isExpenseModalOpen} setIsOpen={setIsExpenseModalOpen} />
      <QuestionModal isOpen={isQuestionModalOpen} setIsOpen={setIsQuestionModalOpen} />
      <div className="navigation-tabs">
        <div className="tab" onClick={() => openExpenseModal()}>
          New Expense
        </div>
        <div className={chartType === "regulars" ? "selected-tab" : "tab"} onClick={() => fetchData(month, 'regulars')}>
          Regular
        </div>
        <div className={chartType === "totals" ? "selected-tab" : "tab"} onClick={() => fetchData(month, 'totals')}>
          Total
        </div>
        <div className={chartType === "one_offs" ? "selected-tab" : "tab"} onClick={() => fetchData(month, 'one_offs')}>
          One Offs
        </div>
      </div>
      <div className='regular-expenses-bar-chart'>
        {
            <h3>{`Non-accomodation expenses today: £${10}`}</h3>
        }
        {
          totalMonthlyExpenses &&
          <h3>{`Total monthly expenses s far: £${totalMonthlyExpenses}`} </h3>
        }
        <select value={month} onChange={handleMonthChange}>
          <option value="">Select a month</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        <BarChart expensesByExpenseDate={expensesByExpenseDate} month={month} />
        <PieChart expensesByCategory={expensesByCategory} month={month} />
        <Table categoryValues={categoryValues} />
      </div>
    </div>
  )

}

export default Dashboard
