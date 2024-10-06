import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserTable from '../components/user-table';
import Toolbar from '../components/admin-tool-bar';
import { deleteUsers, fetchUsers, updateUserStatus } from '../services/admin-service';
import { User } from '../types';
import AppNavBar from '../components/app-nav-bar'; // Import AppNavBar
import { useAuth } from '../context/auth-context'; // Use the Auth context

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<boolean[]>([]);
  const { logout } = useAuth(); // Get data from Auth context
  const navigate = useNavigate();

  // Redirect to login if no token is found
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // get the token from localStorage
    if (!token) {
      navigate('/login'); // redirect to login if no token
    }
  }, [navigate]);

  // Fetch users on component mount
  useEffect(() => {
    const getUsers = async () => {
      try {
        const userData = await fetchUsers();
        setUsers(userData);
        setSelectedUsers(Array(userData.length).fill(false)); // initialize selected users state
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.message === 'Account is blocked or deleted') {
            console.error('User account is blocked or deleted. Redirecting to login...');
            logout(); // log out the user if account is blocked
            navigate('/login'); // redirect on blocked or deleted account
          } else {
            console.error('Error fetching users:', error.message);
          }
        }
      }
    };
    getUsers();
  }, [navigate, logout]);

  // Refresh the list of users
  const refreshUserList = async () => {
    try {
      const userData = await fetchUsers();
      setUsers(userData);
      setSelectedUsers(Array(userData.length).fill(false)); // reset selection
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  // Handle blocking selected users
  const handleBlockSelectedUsers = async () => {
    const usersToBlock = users.filter((_, index) => selectedUsers[index]).map(user => user.id);
    if (usersToBlock.length === 0) {
      console.log('No users selected for blocking.');
      return;
    }

    try {
      await updateUserStatus({ userIds: usersToBlock, action: 'block' });
      console.log('Users blocked successfully.');
      refreshUserList(); // refresh the user list
    } catch (error) {
      console.error('Error blocking users:', error);
    }
  };

  // Handle unblocking selected users
  const handleUnblockSelectedUsers = async () => {
    const usersToUnblock = users.filter((_, index) => selectedUsers[index]).map(user => user.id);
    if (usersToUnblock.length === 0) {
      console.log('No users selected for unblocking.');
      return;
    }

    try {
      await updateUserStatus({ userIds: usersToUnblock, action: 'unblock' });
      console.log('Users unblocked successfully.');
      refreshUserList(); // refresh the user list
    } catch (error) {
      console.error('Error unblocking users:', error);
    }
  };

  // Handle deleting selected users
  const handleDeleteSelectedUsers = async () => {
    const usersToDelete = users.filter((_, index) => selectedUsers[index]).map(user => user.id);
    if (usersToDelete.length === 0) {
      console.log('No users selected for deleting.');
      return;
    }

    try {
      await deleteUsers({ userIds: usersToDelete });
      console.log('Users deleted successfully.');
      refreshUserList(); // refresh the user list
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  return (
    <>
      {/* Render the AppNavBar with the appropriate props */}
      <AppNavBar />

      <div className="container mb-3 mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Pass appropriate handlers to the Toolbar */}
          <Toolbar
            onBlock={handleBlockSelectedUsers}
            onUnblock={handleUnblockSelectedUsers}
            onDelete={handleDeleteSelectedUsers}
          />
        </div>

        {/* Render UserTable */}
        <UserTable
          users={users}
          onRefresh={refreshUserList}
          onSelectedUsersChange={setSelectedUsers}
        />
      </div>
    </>
  );
};

export default AdminPage;
