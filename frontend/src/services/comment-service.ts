import axios from "axios";
import { AddCommentPayload } from "../dtos/comment-payload";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

// fetch comments for a specific template
export const fetchCommentsForTemplate = async (templateId: string) => {
  try {
    const response = await axios.get(
      `${SERVER_URL}/api/templates/${templateId}/comments`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Add a new comment to a specific template
export const addCommentToTemplate = async (
  templateId: string,
  payload: AddCommentPayload
) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No token found, please login again.");
  }

  try {
    const response = await axios.post(
      `${SERVER_URL}/api/templates/${templateId}/comments`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
