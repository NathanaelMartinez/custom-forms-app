import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const fetchUsers = async () => {
    try {
        const token = localStorage.getItem('token'); // get token from localStorage
        const response = await axios.get(`${SERVER_URL}/`, {
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

export const loginUser = async (credentials: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${SERVER_URL}/login`, credentials);
        console.log('Login response:', response.data); // for debugging
        const { token, user } = response.data; // get JWT and user from response
        localStorage.setItem('token', token); // store token in localStorage
        localStorage.setItem('userName', user.name); // this is for displaying user's name
        localStorage.setItem('userId', user.id); // Assuming user ID is a string (UUID)
        return user.name;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // handle specific error messages
            console.error('Login failed:', error.response.data.message);
            throw new Error(error.response.data.message);
        } else {
            console.error('Login failed:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
};

export const registerUser = async (credentials: { name: string; email: string; password: string }) => {
    try {
        const response = await axios.post(`${SERVER_URL}/register`, credentials);
        console.log('Register response:', response.data); // for debugging
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

// Update user status function with string[] for userIds
export const updateUserStatus = async (payload: { userIds: string[]; action: 'block' | 'unblock' }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${SERVER_URL}/block`, payload, {
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
        const response = await axios.delete(`${SERVER_URL}/`, {
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
