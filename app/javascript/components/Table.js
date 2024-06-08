import React from "react"

const Table = (props) => {
  return(
    <div>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(props.categoryValues).map(([category, amount]) => (
            <tr key={category}>
              <td>{category}</td>
              <td>£{amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

}

export default Table
