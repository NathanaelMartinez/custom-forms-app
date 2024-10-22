import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const fetchUserResponses = async (id: string) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No token found, please login again.");
  }

  try {
    const response = await axios.get(
      `${SERVER_URL}/api/users/${id}/responses`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user responses:", error);
    throw error;
  }
};
