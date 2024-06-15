import React, { useState, useEffect } from 'react';

const QuestionModal = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(props.isOpen);
 }, [props]);


  const closeModal = () => {
    setIsOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState('');

   const handleSearchChange = (event) => {
     setSearchQuery(event.target.value);
   };

   const handleSearchSubmit = () => {
     // Perform the search operation with the searchQuery value
     console.log('Search query:', searchQuery);
     fetch(`http://localhost:3000/questions/new?question=${searchQuery}`, {
       headers: {
         'Accept': 'application/json'
       }
     }).then((response) => response.json())
       .then((data) => {
         console.log(data)
       })
       .catch((error) => {
         // Handle any errors
         console.error('Error:', error);
       });
   };

   const handleKeyDown = (event) => {
       if (event.key === 'Enter') {
         event.preventDefault();
         handleSearchSubmit();
       }
     };


  return (
    <div>
      {isOpen && (
        <div className="question-modal">
          <div className="question-modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleSearchSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionModal;
