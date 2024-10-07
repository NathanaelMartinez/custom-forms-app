import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('token'); // get token from localStorage
        const response = await axios.get(`${SERVER_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`, // put token in header for auth
            },
        });
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        // needs to be axioserror
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // handle known errors
                if (error.response.status === 403 || error.response.status === 404) {
                    console.error('Access forbidden:', error.response.data);
                    throw new Error('Account is blocked or deleted');
                } else {
                    console.error('Error fetching users:', error.response.data);
                }
            } else {
                // handle general errors with no response
                console.error('Error fetching users:', error.message);
            }
        } else {
            console.error('An unexpected error occurred:', error);
        }
        throw error; // rethrow the error to be handled in the component
    }
};

// Update user status function with string[] for userIds
export const updateUserStatus = async (payload: { userIds: string[]; action: 'block' | 'unblock' }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${SERVER_URL}/api/admin/users`, payload, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error; 
    }
};

// Delete users function with string[] for userIds
export const deleteUsers = async (payload: { userIds: string[] }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${SERVER_URL}/api/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
            data: payload,
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting users:', error);
        throw error; 
    }
};
