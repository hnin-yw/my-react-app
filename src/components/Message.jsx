import React from 'react';

const Message = ({ isError, message }) => {
  return (
    <div className={isError ? "alert alert-danger alert-dismissible" : "alert alert-success alert-dismissible"}>
      <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
      <strong>{message}</strong>
    </div>
  );
};

export default Message;
