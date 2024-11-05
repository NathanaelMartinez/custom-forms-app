import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const createJiraTicket = async (
  summary: string,
  priority: string,
  user: { email: string; username: string },
  pageLink: string,
  templateTitle: string
) => {
  try {
    const forgeApiUrl = `${SERVER_URL}/api/tickets/create-ticket`;

    const response = await axios.post(forgeApiUrl, {
      summary,
      priority,
      user,
      pageLink,
      templateTitle,
    });
    return response.data.ticketLink;
  } catch (error) {
    console.error("Failed to create ticket in Jira:", error);
    throw new Error("Ticket creation failed. Please try again later.");
  }
};
