import React, { ChangeEvent, useEffect, useState } from 'react';
import { User } from '../../types';
  
interface AdminTableProps {
    users: User[];
    onRefresh: () => void;
    onSelectedUsersChange: (selected: boolean[]) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ users, onSelectedUsersChange }) => {
    const [selectedUsers, setSelectedUsers] = useState<boolean[]>([]);

    useEffect(() => {
        // initialize selected users state when users are updated
        setSelectedUsers(Array(users.length).fill(false));
    }, [users]);

    const handleUserSelect = (index: number) => {
        const updatedSelection = [...selectedUsers];
        updatedSelection[index] = !updatedSelection[index];
        setSelectedUsers(updatedSelection);
        onSelectedUsersChange(updatedSelection); // notify usermanagementpage
    };

    const handleSelectAll = (event: ChangeEvent<HTMLInputElement>): void => {
        const isChecked = event.target.checked;
        const newSelection = Array(users.length).fill(isChecked);
        setSelectedUsers(newSelection);
        onSelectedUsersChange(newSelection); // notify usermanagementpage
    };

    return (
        <div>
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                id="select-all"
                                onChange={handleSelectAll}
                                checked={selectedUsers.length > 0 && selectedUsers.every(Boolean)} // ensure checked only if there are users
                            />
                        </th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.email}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={!!selectedUsers[index]}
                                    onChange={() => handleUserSelect(index)}
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;
