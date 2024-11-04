import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/api/tickets", async (req, res) => {
  const { summary, priority } = req.body;
  const jiraUrl = process.env.JIRA_API_URL;
  const jiraProjectKey = process.env.JIRA_PROJECT_KEY;

  try {
    const response = await axios.post(
      `${jiraUrl}/rest/api/3/issue`,
      {
        fields: {
          project: { key: jiraProjectKey },
          summary,
          priority: { name: priority },
          description: `Support issue created via QuickFormr`,
          issuetype: { name: "Task" },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    const ticketLink = `${jiraUrl}/browse/${response.data.key}`;
    res.status(200).json({ ticketLink });
  } catch (error) {
    res.status(500).json({ error: "Failed to create ticket in Jira" });
  }
});

export default router;
