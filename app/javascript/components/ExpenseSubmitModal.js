import React, { useState, useEffect } from 'react';

const ExpenseModal = (props) => {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [expenseDate, setExpenseDate] = useState(new Date());
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [oneOffExpense, setOneOffExpense] = useState(false);

  let costInGBP = value / exchangeRate;

  useEffect(() => {
    props.setIsOpen(props.isOpen)
 }, [props.isOpen]);

  useEffect(() => {
    fetch(`http://localhost:3000/categories/index`, {
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        setCategories(data.categories)
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error:', error);
      });
 }, []);

  const handleSubmit = (e) => {
    e.preventDefault()
    const request_data = {
      category_id: parseInt(category),
      amount: costInGBP,
      description: description,
      expense_date: expenseDate.toISOString(),
      purchase_date: purchaseDate.toISOString(),
      one_off: oneOffExpense
    }

    fetch(`http://localhost:3000/expenses/new_expense`, {
      method: 'POST',
      body: JSON.stringify(request_data),
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) => response.json())
    .then((data) => {
      setIsOpen(false)
    })
    .catch((error) => {
      // Handle any errors
      console.error('Error:', error);
    });

    // Handle form submission logic here
  };

  const closeModal = () => {
    props.setIsOpen(false)
  };

  return (
    <div>
      {
        props.isOpen && (
          <div className="modal">
            <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
              <h2>Add Expense</h2>
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="category">Category:</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                  <option>
                    Set category
                  </option>
                  {categories &&
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="expenseDate">Expense Date:</label>
                  <input
                    type="date"
                    id="expenseDate"
                    value={expenseDate.toISOString().split('T')[0]}
                    onChange={(e) => setExpenseDate(new Date(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="purchaseDate">Purchase Date:</label>
                  <input
                    type="date"
                    id="purchaseDate"
                    value={purchaseDate.toISOString().split('T')[0]}
                    onChange={(e) => setPurchaseDate(new Date(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="value">Value:</label>
                  <input
                    type="number"
                    id="value"
                    value={value}
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="exchangeRate">Exchange Rate:</label>
                  <input
                    type="number"
                    id="exchangeRate"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <label htmlFor="costInGBP">Cost in GBP:</label>
                  <input type="number" id="costInGBP" value={costInGBP} readOnly />
                </div>
                <div>
                <div>
                  <label htmlFor="description">Description:</label>
                  <input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                  <label htmlFor="oneOffExpense">One-off Expense:</label>
                  <input
                    type="checkbox"
                    id="oneOffExpense"
                    checked={oneOffExpense}
                    onChange={(e) => setOneOffExpense(e.target.checked)}
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default ExpenseModal;
