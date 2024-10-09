import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// Define the structure for creating a template
interface CreateTemplatePayload {
  title: string;
  description: string;
  authorId: string;
  topic?: string;
  questions: {
    type: "textarea" | "text" | "checkbox" | "integer";
    questionText: string;
    options?: string[];
  }[];
}

export const createTemplate = async (templateData: CreateTemplatePayload) => {
  // retrieve the token from local storage
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No token found, please login again.");
  }

  try {
    const response = await axios.post(
      `${SERVER_URL}/api/templates`,
      templateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error creating template:", error);
    throw error; // rethrow error to handle in calling function
  }
};

export const fetchTemplate = async (id: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
};
