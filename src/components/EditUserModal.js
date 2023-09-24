import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

// EditUserModal component for editing user details
function EditUserModal({
  userList,
  setUserList,
  userId,
  setModalVisibility,
  ...props
}) {
  const userToEdit = userList.find((user) => user.id === userId);

  const [formValues, setFormValues] = useState({
    name: userToEdit.name,
    email: userToEdit.email,
    role: userToEdit.role,
  });

  const { name, email, role } = formValues;

  const handleChange = (event) => {
    const { id, value } = event.target;
    // Update the form values when input fields change
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
  };

  const handleSubmit = () => {
    // Update the user's information in the list of users
    const updatedList = userList.map((user) =>
      user.id === userId ? { ...user, ...formValues } : user
    );
    setUserList(updatedList);
    setModalVisibility(false); // Close the modal
  };

  return (
    <Modal {...props} size="sm" centered>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              id="name"
              placeholder="Name"
              onChange={handleChange}
              value={name}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="email"
              id="email"
              placeholder="Email Address"
              onChange={handleChange}
              value={email}
              autoFocus
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              id="role"
              placeholder="Role"
              onChange={handleChange}
              value={role}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Button to close the modal */}
        <Button variant="light" onClick={() => setModalVisibility(false)}>
          Close
        </Button>
        {/* Button to submit the form and update user information */}
        <Button variant="primary" onClick={handleSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditUserModal;
