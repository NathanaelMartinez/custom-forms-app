import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/create-ticket", async (req, res) => {
  console.log("received request at /create-ticket");

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
    const forgeApiUrl = process.env.JIRA_API_WEBTRIGGER!;

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

export default router;
