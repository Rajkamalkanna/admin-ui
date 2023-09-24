import React from "react";
import { Form } from "react-bootstrap";

// SearchInput component for user search
function SearchInput({ onSearch }) {
  return (
    <Form.Control
      type="text"
      placeholder="Search By Name, Email or Role"
      onChange={(e) => onSearch(e.target.value)} // Call onSearch function on input change
    />
  );
}

export default SearchInput;
