import axios from "axios";
import { TemplatePayload } from "../dtos/template-payload";
import { FormResponsePayload } from "../dtos/form-response-payload";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const createTemplate = async (templateData: TemplatePayload) => {
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

export const fetchTemplateById = async (id: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw error;
  }
};

export const updateTemplate = async (
  templateId: string,
  updatedTemplateData: TemplatePayload
) => {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No token found");

  try {
    const response = await axios.put(
      `${SERVER_URL}/api/templates/${templateId}`,
      updatedTemplateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update template:", error);
    throw error;
  }
};

export const fetchTemplate = async (id: string) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/templates/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw error;
  }
};

export const submitForm = async (formData: FormResponsePayload) => {
  // retrieve the token from local storage
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No token found, please login again.");
  }

  try {
    const response = await axios.post(
      `${SERVER_URL}/api/templates/${formData.templateId}/responses`,
      formData, // form data being sent (templateId and answers)
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios-specific error handling
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        alert(`Error: ${error.response.data.message || "Unknown error"}`);
      } else if (error.request) {
        // No response was received
        console.error("Error request:", error.request);
        alert("No response received from the server.");
      } else {
        // Something else happened while setting up the request
        console.error("Error message:", error.message);
        alert(`Request failed: ${error.message}`);
      }
    } else {
      // Non-Axios error handling
      console.error("Error submitting form:", error);
      alert(`Unexpected error: ${error}`);
    }
    throw error; // rethrow error to handle in calling function
  }
};

export const fetchAggregateResponses = async (id: string) => {
  // retrieve the token from local storage
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No token found, please login again.");
  }
  
  try {
    const response = await axios.get(
      `${SERVER_URL}/api/templates/${id}/aggregate`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching aggregated data:", error);
    throw error;
  }
};
