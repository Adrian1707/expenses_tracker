import React, { useState, useEffect } from 'react';

const ChatModal = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [queries, setQueries] = useState([])
  const [answer, setAnswer] = useState(null)
  const [sql, setSql] = useState(null)
  const [sqlIsVisible, setSqlIsVisible] = useState(false)

   const closeModal = () => {
     props.onClose();
   };

   const handleSearchChange = (event) => {
     setSearchQuery(event.target.value);
   };

   const handleSearchSubmit = () => {
     queries.push(searchQuery)
     setQueries(queries)

     // Perform the search operation with the searchQuery value
     console.log('Search query:', searchQuery);
     console.log(queries)
     fetch(`http://localhost:3000/questions/new?conversation=${queries}`, {
       headers: {
         'Accept': 'application/json'
       }
     }).then((response) => response.json())
       .then((data) => {
         setAnswer(data.answer)
         setSql(data.raw_sql)
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
       if (event.key === 'Escape') {
         event.preventDefault();
         closeModal()
       }
     };

    const onChange = () => {
      setSqlIsVisible(!sqlIsVisible)
    }


  return (
    <div>
      {props.isOpen && (
        <div className="chat-modal">
          <div className={ answer === null ? "chat-modal-content" : "chat-modal-content-expanded"}>
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Chat to your data..."
                selected={true}
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            </div>
            <p>{answer}</p>
            {sqlIsVisible
              &&
              <p>{sql}</p>
            }
            {answer &&
              <label>
                View SQL
                <input type="checkbox" checked={sqlIsVisible} onChange={onChange} />
              </label>
            }

          </div>
        </div>
      )}
    </div>
  );
};

export default ChatModal;
