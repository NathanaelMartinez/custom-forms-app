import axios from "axios";

export const createJiraTicket = async (
  summary: string,
  priority: string
): Promise<string> => {
  try {
    const response = await axios.post("/api/tickets", { summary, priority });
    return response.data.ticketLink;
  } catch (error) {
    console.error("Failed to create ticket in Jira:", error);
    throw new Error("Ticket creation failed. Please try again later.");
  }
};
