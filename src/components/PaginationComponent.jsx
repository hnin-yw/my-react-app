import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
    <Pagination>
      <Pagination.First onClick={currentPage === 1 ? undefined : () => handlePageChange(1)} />
      <Pagination.Prev onClick={currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)} />
      {[...Array(totalPages)].map((_, index) => (
        <Pagination.Item
          key={index + 1}
          active={index + 1 === currentPage}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next onClick={currentPage === totalPages ? undefined : () => handlePageChange(currentPage + 1)} />
      <Pagination.Last onClick={currentPage === totalPages ? undefined : () => handlePageChange(totalPages)} />
    </Pagination>
    </div>
  );
};

export default PaginationComponent;
