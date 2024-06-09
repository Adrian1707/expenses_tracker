import React, { useState } from "react"
import BarChart from './BarChart'
import PieChart from './PieChart'
import Table from './Table'

const Dashboard = (props) => {
  const [month, setMonth] = useState(props.month);
  const [expensesToday, setExpensesToday] = useState(props.expensesToday)
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(props.totalMonthlyExpenses)
  const [expensesByExpenseDate, setExpensesByExpenseDate] = useState(props.expensesByExpenseDate)
  const [expensesByCategory, setExpensesByCategory] = useState(props.expensesByCategory)
  const [categoryValues, setCategoryValues] = useState(props.categoryValues)
  const [includeOneOffs, setIncludeOneOffs] = useState(false)

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
    fetchData(month, includeOneOffs);
  };

  const fetchData = (month, chart_type) => {
    fetch(`http://localhost:3000/expenses/index?month=${month}&chart_type=${chart_type}`, {
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

  return(
    <div>
        <div className="navigation-tabs">
        <div className="tab" onClick={() => fetchData(month, 'regulars')}>
          Regular
        </div>
        <div className="tab" onClick={() => fetchData(month, 'totals')}>
          Total
        </div>
        <div className="tab" onClick={() => fetchData(month, 'one_offs')}>
          One Offs
        </div>
        </div>
      {
          <h3>{`Non-accomodation expenses today: £${10}`}</h3>
      }
      {
        totalMonthlyExpenses &&
        <h3>{`Total monthly expenses so far: £${totalMonthlyExpenses}`} </h3>
      }
      <select value={month} onChange={handleMonthChange}>
        <option value="">Select a month</option>
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      <BarChart expensesByExpenseDate={expensesByExpenseDate} />
      <PieChart expensesByCategory={expensesByCategory} />
      <Table categoryValues={categoryValues} />
    </div>
  )

}

export default Dashboard
