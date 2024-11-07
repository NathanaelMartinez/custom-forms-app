import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  const { summary, priority, user, pageLink, templateTitle } = req.body;

  console.log("request payload:", {
    summary,
    priority,
    user,
    pageLink,
    templateTitle,
  });

  try {
    // endpoint of forge app
    const forgeApiUrl = process.env.JIRA_API_CREATE_TICKET_WEBTRIGGER!;

    console.log("forge api url:", forgeApiUrl);

    // send request to forge app
    const response = await axios.post(
      forgeApiUrl,
      {
        payload: { summary, priority, user, pageLink, templateTitle },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("forge app response:", response.data);

    // return ticket link from forge app response
    res.status(200).json({ ticketLink: response.data.ticketLink });
  } catch (error) {
    console.error("Failed to create ticket via Forge app:", error);
    res
      .status(500)
      .json({ error: "ticket creation failed. please try again later." });
  }
});

// fetch tickets for a user
router.get("/user", async (req, res) => {
  const { email, startAt = 0, maxResults = 10 } = req.query; // get email from params

  try {
    const forgeApiUrl = process.env.JIRA_API_FETCH_TICKETS_WEBTRIGGER!;

    const response = await axios.post(
      forgeApiUrl,
      {
        userEmail: email,
        startAt: Number(startAt),
        maxResults: Number(maxResults),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data); // send data back to frontend
  } catch (error) {
    console.error("Failed to fetch Jira tickets:", error);
    res
      .status(500)
      .json({ error: "Failed to retrieve tickets. Try again later." });
  }
});

export default router;
