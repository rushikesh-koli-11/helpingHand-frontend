import React from "react";
import { Pagination } from "@mui/material";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null; 

  return (
    <div className="pagination-container d-flex justify-content-center">
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => onPageChange(page)}
        color="primary"
      />
    </div>
  );
};

export default PaginationComponent;
