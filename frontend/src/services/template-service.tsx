import axios from "axios";
import { TemplatePayload } from "../dtos/template-payload";

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
