import React from "react";
import { Pagination } from "react-bootstrap";

// Pagination component for user list
function PaginationComponent({ currentPage, changePage, totalPages }) {
  const pageNumbers = [];

  // Generate an array of page numbers from 1 to totalPages
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="float-md-end d-flex justify-content-center pt-2">
      {/* First Page button */}
      <Pagination.First
        className={currentPage === 1 ? "disabled" : ""}
        onClick={() => changePage(1)}
      />
      {/* Previous Page button */}
      <Pagination.Prev
        className={currentPage === 1 ? "disabled" : ""}
        onClick={() => changePage(currentPage - 1)}
      />
      {/* Render individual page number buttons */}
      {pageNumbers.map((number) => (
        <Pagination.Item
          className={number === currentPage ? "active" : ""}
          onClick={() => changePage(number)}
          key={number}
        >
          {number}
        </Pagination.Item>
      ))}
      {/* Next Page button */}
      <Pagination.Next
        className={currentPage === totalPages ? "disabled" : ""}
        onClick={() => changePage(currentPage + 1)}
      />
      {/* Last Page button */}
      <Pagination.Last
        className={currentPage === totalPages ? "disabled" : ""}
        onClick={() => changePage(totalPages)}
      />
    </Pagination>
  );
}

export default PaginationComponent;
