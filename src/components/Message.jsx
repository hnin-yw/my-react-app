import React, { useState, useEffect } from 'react';

function Message({ isError, message }) {
  const [show, setShow] = useState(true);
  
  // Reset show state when message prop changes
  useEffect(() => {
    setShow(true);
  }, [message]);

  // Hide message when show state changes
  // useEffect(() => {
  //   if (!show) {
  //     setShow(true); // Reset show state for next render
  //   }
  // }, [show]);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      {show && (
        <div className={isError ? "alert alert-danger alert-dismissible" : "alert alert-success alert-dismissible"}>
          <button type="button" className="close" onClick={handleClose} aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <strong>{message}</strong>
        </div>
      )}
    </>
  );
}

export default Message;
