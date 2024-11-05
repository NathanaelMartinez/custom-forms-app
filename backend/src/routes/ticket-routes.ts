import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/create-ticket", async (req, res) => {
  const { summary, priority, user, pageLink, templateTitle } = req.body;

  try {
    // endpoint of Forge app
    const forgeApiUrl = process.env.JIRA_API_URL;

    // send request to Forge app
    const response = await axios.post(
      `${forgeApiUrl}/createTicket`,
      {
        summary,
        priority,
        user,
        pageLink,
        templateTitle,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JIRA_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    // return ticket link from Forge app response
    res.status(200).json({ ticketLink: response.data.ticketLink });
  } catch (error) {
    console.error("Failed to create ticket via Forge app:", error);
    res
      .status(500)
      .json({ error: "Ticket creation failed. Please try again later." });
  }
});

export default router;
