import axios, { AxiosError } from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const registerUser = async (username: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/register`, {
      username,
      email,
      password,
    });
    return response.data; // Return token or other data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ error: string }>;
      const message = err.response?.data?.error || 'Registration failed';
      throw message;  // Propagate the error to be handled by the calling function
    } else {
      throw 'Registration failed. Please try again.';
    }
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${SERVER_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error as AxiosError<{ error: string }>;
      const message = err.response?.data?.error || 'Login failed';
      throw message; // Propagate the error to be handled by the calling function
    } else {
      throw 'Login failed. Please try again.';
    }
  }
};
