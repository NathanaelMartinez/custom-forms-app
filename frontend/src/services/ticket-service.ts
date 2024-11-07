import axios from "axios";
import { BugReport, JiraTicket } from "../types";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const createJiraTicket = async (
  summary: string,
  priority: string,
  user: { email: string; username: string },
  pageLink: string,
  templateTitle: string
) => {
  try {
    const forgeApiUrl = `${SERVER_URL}/api/tickets`;

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

export async function fetchUserJiraTickets(
  userEmail: string
): Promise<BugReport[]> {
  try {
    const response = await axios.get(`${SERVER_URL}/api/tickets/user`, {
      params: { email: userEmail },
    });

    return response.data.issues.map((issue: JiraTicket) => ({
      id: issue.id,
      summary: issue.fields.summary,
      template: issue.fields.customfield_10042 || "N/A",
      link: issue.fields.customfield_10043,
      priority: issue.fields.priority.name,
      status: issue.fields.status.name,
    }));
  } catch (error) {
    console.error("Failed to fetch Jira tickets:", error);
    throw new Error("Failed to fetch Jira tickets");
  }
}
