import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Stack,
} from "react-bootstrap";
import SearchInput from "./components/SearchInput";
import Pagination from "./components/Pagination";
import EditUserModal from "./components/EditUserModal";
import "./App.css";

function App() {
  // State variables using useState hook
  const [userList, setUserList] = useState([]); // Store the list of users
  const [filteredUsers, setFilteredUsers] = useState([]); // Store filtered users
  const [searchQuery, setSearchQuery] = useState(""); // Store the search query
  const [selectedUserIds, setSelectedUserIds] = useState([]); // Store selected user IDs
  const [selectAllUsers, setSelectAllUsers] = useState(false); // Indicate if all users are selected
  const [isEditModalVisible, setEditModalVisibility] = useState(false); // Control edit user modal visibility
  const [editUserId, setEditUserId] = useState(null); // Store the ID of the user being edited
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const USERS_PER_PAGE = 10; // Number of users to display per page
  const API_URL = "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"; // API URL to fetch user data

  // Open the edit user modal
  const openEditUserModal = (userId) => {
    setEditUserId(userId);
    setEditModalVisibility(true);
  };

  // Select or deselect all users
  const toggleSelectAllUsers = (event) => {
    let updatedSelectedUserIds = [...selectedUserIds];
    if (event.target.checked) {
      setSelectAllUsers(true);
      updatedSelectedUserIds = filteredUsers.map((user) => user.id);
    } else {
      setSelectAllUsers(false);
      updatedSelectedUserIds = [];
    }
    setSelectedUserIds(updatedSelectedUserIds);
  };

  // Delete selected users
  const deleteSelectedUsers = () => {
    const updatedUserList = userList.filter(
      (user) => !selectedUserIds.includes(user.id)
    );
    setUserList(updatedUserList);
    setSelectAllUsers(false);
  };

  // Select or deselect a user
  const toggleSelectUser = (userId) => {
    let updatedSelectedUserIds = [...selectedUserIds];

    if (updatedSelectedUserIds.includes(userId)) {
      updatedSelectedUserIds = updatedSelectedUserIds.filter(
        (id) => id !== userId
      );
      setSelectAllUsers(false);
    } else {
      updatedSelectedUserIds.push(userId);
    }
    setSelectedUserIds(updatedSelectedUserIds);
  };

  // Delete a user by ID
  const deleteUser = (userId) => {
    const updatedUserList = userList.filter((user) => user.id !== userId);
    setUserList(updatedUserList);
  };

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Filter the users based on the search query
  const filterUsers = useCallback(() => {
    if (searchQuery !== "") {
      const result = userList.filter((user) =>
        Object.values(user).some((value) =>
          value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setFilteredUsers(result);
    } else {
      setFilteredUsers(userList);
    }
  }, [searchQuery, userList]);
  
  useEffect(() => {
    filterUsers();
  }, [userList, searchQuery, filterUsers]);
  

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUserList(response.data);
    } catch (error) {
      console.log("Error in getting users", error);
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update the filtered users when the user list or search query changes
  useEffect(() => {
    filterUsers();
  }, [userList, searchQuery, filterUsers]);
  

  /* Pagination */
  const indexOfLastUser = currentPage * USERS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

  // Function to change the current page
  const changePage = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4">
      {/* Search input */}
      <Row>
        <Col>
          <SearchInput onSearch={handleSearch} />
        </Col>
      </Row>

      {/* User table */}
      <Row>
        <Col className="mt-2">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>
                  {/* Checkbox for selecting all users */}
                  <Form.Check
                    type="checkbox"
                    onChange={toggleSelectAllUsers}
                    checked={selectAllUsers}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Render user rows */}
              {currentUsers.length ? (
                currentUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className={
                        selectedUserIds.includes(user.id) ? "bg-gray" : ""
                      }
                    >
                      <td>
                        {/* Checkbox for selecting individual users */}
                        <Form.Check
                          type="checkbox"
                          value={user.id}
                          onChange={() => toggleSelectUser(user.id)}
                          checked={selectedUserIds.includes(user.id)}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        {/* Edit and Delete buttons */}
                        <Stack direction="horizontal" gap={2}>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => openEditUserModal(user.id)}
                          >
                            Edit
                          </Button>

                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => deleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })
              ) : (
                // Displayed when no users are found
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No User Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Delete selected users button and pagination */}
      {currentUsers.length > 0 ? (
        <Row className="pt-2 pt-md-0">
          <Col xs="12" md="4">
            {/* Button to delete selected users */}
            <Button
              variant="danger"
              size="sm"
              onClick={deleteSelectedUsers}
              disabled={selectedUserIds.length > 0 ? false : true}
            >
              Delete Selected
            </Button>
          </Col>
          <Col xs="12" md="8">
            {/* Pagination component */}
            <Pagination
              currentPage={currentPage}
              changePage={changePage}
              totalPages={totalPages}
            />
          </Col>
        </Row>
      ) : (
        ""
      )}

      {/* Modal for updating a user */}
      {isEditModalVisible ? (
        <EditUserModal
          userList={userList}
          setUserList={setUserList}
          userId={editUserId}
          setModalVisibility={setEditModalVisibility}
          show={isEditModalVisible}
          onHide={() => setEditModalVisibility(false)}
        />
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;
