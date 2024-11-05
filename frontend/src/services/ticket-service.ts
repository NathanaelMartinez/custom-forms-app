import axios from "axios";

export const createJiraTicket = async (summary: string, priority: string) => {
  try {
    const forgeApiUrl =
      "https://nathanaelmartinez.atlassian.net/rest/atlassian-connect/1/method/create-ticket";
    // forge app url

    const response = await axios.post(forgeApiUrl, { summary, priority });
    return response.data.ticketLink;
  } catch (error) {
    console.error("Failed to create ticket in Jira:", error);
    throw new Error("Ticket creation failed. Please try again later.");
  }
};
