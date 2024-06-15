import React, { useState, useEffect } from 'react';

const ExpensesModal = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(props.data);

  useEffect(() => {
   setIsOpen(props.displayModal);
   setData(props.data);
 }, [props.data]);


  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <table>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((cell, index) => (
                      <td key={index}>{cell.toString()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesModal;
