import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminTable from "../components/admin/admin-table";
import Toolbar from "../components/admin/admin-tool-bar";
import {
  deleteUsers,
  fetchUsers,
  updateUserStatus,
} from "../services/admin-service";
import { User } from "../types";
import AppNavBar from "../components/common/app-nav-bar";
import { useAuth } from "../context/auth-context";

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<boolean[]>([]);
  const { user, logout, updateUserRole } = useAuth(); // Get data from Auth context
  const navigate = useNavigate();

  // redirect to login if user is not defined (just in case)
  useEffect(() => {
    if (!user) {
      console.warn("User is not defined, redirecting to login.");
      navigate("/login", { state: { returnUrl: "/admin" } });
    }
  }, [user, navigate]);

  // fetch users on component mount
  useEffect(() => {
    const getUsers = async () => {
      try {
        const userData = await fetchUsers();
        // sort users by acct age
        const sortedUsers = userData.sort(
          (a: User, b: User) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setUsers(sortedUsers);
        setSelectedUsers(Array(sortedUsers.length).fill(false)); // initialize selected users state
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.message === "Account is blocked or deleted") {
            console.error(
              "User account is blocked or deleted. Redirecting to login..."
            );
            logout(); // log out the user if account is blocked
            navigate("/login"); // redirect on blocked or deleted account
          } else {
            console.error("Error fetching users:", error.message);
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
      console.error("Error refreshing users:", error);
    }
  };

  // helper function to handle expired token or unauthorized access
  const handleAuthError = (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Session expired or unauthorized. Redirecting to login...");
      logout(); // clear current auth
      navigate("/login", { state: { returnUrl: "/admin" } }); // redirect with returnUrl
    } else {
      console.error("An error occurred:", error);
    }
  };

  // handle blocking selected users
  const handleBlockSelectedUsers = async () => {
    if (!user) return;
    const usersToBlock = users
      .filter((_, index) => selectedUsers[index])
      .map((user) => user.id);
    if (usersToBlock.length === 0) {
      console.log("No users selected for blocking.");
      return;
    }

    try {
      await updateUserStatus({
        userIds: usersToBlock,
        action: "block",
      });
      // Check if the current user blocked themselves
      if (usersToBlock.includes(user.id)) {
        logout();
        navigate("/"); // Redirect to homepage after self-block
      } else {
        refreshUserList(); // refresh the user list
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  // handle unblocking selected users
  const handleUnblockSelectedUsers = async () => {
    const usersToUnblock = users
      .filter((_, index) => selectedUsers[index])
      .map((user) => user.id);
    if (usersToUnblock.length === 0) {
      console.log("No users selected for unblocking.");
      return;
    }

    try {
      await updateUserStatus({
        userIds: usersToUnblock,
        action: "unblock",
      });
      refreshUserList(); // refresh the user list
    } catch (error) {
      handleAuthError(error);
    }
  };

  // handle unblocking selected users
  const handlePromoteSelectedUsers = async () => {
    const usersToPromote = users
      .filter((_, index) => selectedUsers[index])
      .map((user) => user.id);
    if (usersToPromote.length === 0) {
      console.log("No users selected for promoting.");
      return;
    }

    try {
      await updateUserStatus({
        userIds: usersToPromote,
        action: "promote",
      });
      refreshUserList(); // refresh the user list
    } catch (error) {
      handleAuthError(error);
    }
  };

  // handle unblocking selected users
  const handleDemoteSelectedUsers = async () => {
    if (!user) return;
    const usersToDemote = users
      .filter((_, index) => selectedUsers[index])
      .map((user) => user.id);
    if (usersToDemote.length === 0) {
      console.log("No users selected for promoting.");
      return;
    }

    try {
      await updateUserStatus({
        userIds: usersToDemote,
        action: "demote",
      });
      // check if current user demoted themselves
      if (usersToDemote.includes(user.id)) {
        updateUserRole("user");
        navigate("/"); // Redirect to homepage after self-demotion
      } else {
        refreshUserList(); // refresh the user list
      }
    } catch (error) {
      handleAuthError(error);
    }
  };

  // handle deleting selected users
  const handleDeleteSelectedUsers = async () => {
    if (!user) return;
    const usersToDelete = users
      .filter((_, index) => selectedUsers[index])
      .map((user) => user.id);
    if (usersToDelete.length === 0) {
      console.log("No users selected for deleting.");
      return;
    }

    try {
      await deleteUsers({ userIds: usersToDelete });
      // Check if current user deleted themselves
      if (usersToDelete.includes(user.id)) {
        logout();
        navigate("/"); // Redirect to homepage after self-delete
      } else {
        refreshUserList(); // refresh the user list
      }
    } catch (error) {
      handleAuthError(error);
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
            onPromote={handlePromoteSelectedUsers}
            onDemote={handleDemoteSelectedUsers}
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
