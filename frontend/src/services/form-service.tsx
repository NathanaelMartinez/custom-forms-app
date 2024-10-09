import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const fetchTemplate = async (id: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
};
