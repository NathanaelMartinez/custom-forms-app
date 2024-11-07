import axios from "axios";
import { JiraTicket } from "../types";

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
  userEmail: string,
  startAt: number = 0,
  maxResults: number = 10
): Promise<{
  issues: JiraTicket[];
  total: number;
  startAt: number;
  maxResults: number;
}> {
  try {
    const response = await axios.get(`${SERVER_URL}/api/tickets/user`, {
      params: {
        email: userEmail,
        startAt,
        maxResults,
      },
    });

    return {
      issues: response.data.issues.map((issue: JiraTicket) => ({
        id: issue.id,
        summary: issue.summary,
        template: issue.template || "N/A",
        link: issue.link,
        priority: issue.priority,
        status: issue.status,
      })),
      total: response.data.total,
      startAt: response.data.startAt,
      maxResults: response.data.maxResults,
    };
  } catch (error) {
    console.error("Failed to fetch Jira tickets:", error);
    throw new Error("Failed to fetch Jira tickets");
  }
}
