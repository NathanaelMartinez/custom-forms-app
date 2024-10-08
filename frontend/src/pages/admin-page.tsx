import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminTable from '../components/layout/admin-table';
import Toolbar from '../components/layout/admin-tool-bar';
import { deleteUsers, fetchUsers, updateUserStatus } from '../services/admin-service';
import { User } from '../types';
import AppNavBar from '../components/layout/app-nav-bar';
import { useAuth } from '../context/auth-context';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<boolean[]>([]);
  const { isLoggedIn, logout } = useAuth(); // Get data from Auth context
  const navigate = useNavigate();

  // redirect to login if user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // fetch users on component mount
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

  // refresh list of users - call when action affects list
  const refreshUserList = async () => {
    try {
      const userData = await fetchUsers();
      setUsers(userData);
      setSelectedUsers(Array(userData.length).fill(false)); // reset selection
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };

  // handle blocking selected users
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

  // handle unblocking selected users
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

  // handle deleting selected users
  const handleDeleteSelectedUsers = async () => {
    const usersToDelete = users.filter((_, index) => selectedUsers[index]).map(user => user.id);
    if (usersToDelete.length === 0) {
      console.log('No users selected for deleting.');
      return;
    }

    try {
      await deleteUsers({ userIds: usersToDelete });
      console.log('Users deleted successfully.');
      refreshUserList(); // refresh user list
    } catch (error) {
      console.error('Error deleting users:', error);
    }
  };

  return (
    <>
      <AppNavBar />

      <div className="container mb-3 mt-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* pass handlers to toolbar */}
          <Toolbar
            onBlock={handleBlockSelectedUsers}
            onUnblock={handleUnblockSelectedUsers}
            onDelete={handleDeleteSelectedUsers}
          />
        </div>

        <AdminTable
          users={users}
          onRefresh={refreshUserList}
          onSelectedUsersChange={setSelectedUsers}
        />
      </div>
    </>
  );
};

export default AdminPage;
