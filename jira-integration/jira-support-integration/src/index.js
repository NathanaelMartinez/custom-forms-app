import api, { route } from "@forge/api";

async function getAccountIdByEmail(email) {
  try {
    const response = await api
      .asApp()
      .requestJira(route`/rest/api/3/user/search?query=${email}`, {
        method: "GET",
      });

    if (response.ok) {
      const users = await response.json();
      if (users.length > 0) {
        return users[0].accountId; // return accountId of first matched user
      }
    }
    console.log("User not found with email:", email);
  } catch (error) {
    console.error("Error fetching user by email:", error);
  }

  // TODO: account creation logic (get permissions???)
  return "defaultAccountId"; // use placeholder if acct not found
}

export async function createTicketFunction(request) {
  let payload;
  try {
    payload = JSON.parse(request.body).payload;
    console.log("Parsed payload:", payload);
  } catch (err) {
    console.error("Error parsing request body:", err);
    return { error: "Failed to parse request body." };
  }

  if (!payload) {
    console.error("Payload is missing in the request.");
    return { error: "Payload is missing in the request" };
  }

  const {
    // payload obj
    summary = "No summary provided",
    priority = "Medium",
    user = { email: "unknown", username: "unknown" },
    pageLink = "No page link provided",
    templateTitle = "N/A",
  } = payload;

  // Retrieve accountId using email
  const accountId = await getAccountIdByEmail(user.email);

  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          project: { key: process.env.JIRA_PROJECT_KEY },
          summary: summary,
          priority: { name: priority },
          customfield_10043: pageLink,
          customfield_10044: [{ accountId }], // reported by field
          ...(templateTitle && { customfield_10042: templateTitle }), // include template title if exists
          description: {
            // structure as jira expects
            type: "doc",
            version: 1,
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    // placeholder desc
                    text: `Reported by: ${user.email} (${user.username})\nTemplate: ${templateTitle}\nLink: ${pageLink}`,
                  },
                ],
              },
            ],
          },
          // new ticket entity
          issuetype: { name: "Ticket" },
        },
      }),
    });

    if (response.ok) {
      const { key } = await response.json();
      const ticketLink = `https://${process.env.JIRA_DOMAIN}/browse/${key}`; // send back ticket link
      console.log("Ticket created successfully with link:", ticketLink);
      return {
        statusCode: 200,
        body: JSON.stringify({ ticketLink }),
      };
    } else {
      const errorText = await response.text();
      console.error("Failed to create Jira ticket:", errorText);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Failed to create ticket: ${errorText}`,
        }),
      };
    }
  } catch (error) {
    console.error("Error in createTicketFunction:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create Jira ticket due to an internal error.",
      }),
    };
  }
}
