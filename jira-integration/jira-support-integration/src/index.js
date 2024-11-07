import api, { route } from "@forge/api";

// function to get jira account by QuickFormr email
async function getAccountIdByEmail(email, username) {
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
    console.log(
      "User not found, attempting to create new Jira user for email:",
      email
    );

    const createResponse = await api
      .asApp()
      .requestJira(route`/rest/api/3/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailAddress: email,
          displayName: username,
          notification: false,
        }),
      });

    if (createResponse.ok) {
      const newUser = await createResponse.json();
      console.log("Successfully created Jira user:", newUser);
      return newUser.accountId;
    } else {
      const errorText = await createResponse.text();
      console.error("Failed to create Jira user:", errorText);
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
  }
  return "defaultAccountId"; // use placeholder if acct not found and can't be created
}

// creates new issue in jira with ticket type
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
  const accountId = await getAccountIdByEmail(user.email, user.username);

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

// function to fetch Jira tickets created by specific user
export async function fetchTicketsFunction(request) {
  let payload;
  try {
    payload = JSON.parse(request.body);
    console.log("Parsed payload:", payload);
  } catch (err) {
    console.error("Error parsing request body:", err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request payload format." }),
    };
  }

  // validate that userEmail exists in payload
  const userEmail = payload?.userEmail;
  if (!userEmail) {
    console.error("userEmail is missing in the request payload.");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "userEmail is required." }),
    };
  }

  // set up pagination
  const startAt = payload.startAt || 0;
  const maxResults = payload.maxResults || 10;

  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/search`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        jql: `reporter = "${userEmail}" ORDER BY created DESC`,
        fields: [
          "summary",
          "customfield_10042",
          "customfield_10043",
          "priority",
          "status",
        ],
        startAt,
        maxResults,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        statusCode: 200,
        body: JSON.stringify({
          issues: data.issues.map((issue) => ({
            id: issue.id,
            summary: issue.fields.summary,
            template: issue.fields.customfield_10042 || "N/A",
            link: `https://${process.env.JIRA_DOMAIN}/browse/${issue.key}`,
            priority: issue.fields.priority?.name || "N/A",
            status: issue.fields.status?.name || "N/A",
          })),
          startAt: data.startAt,
          maxResults: data.maxResults,
          total: data.total,
        }),
      };
    } else {
      const errorText = await response.text();
      console.error("Failed to fetch tickets:", errorText);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: `Failed to fetch tickets: ${errorText}`,
        }),
      };
    }
  } catch (error) {
    console.error("Error in fetchTicketsFunction:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch Jira tickets." }),
    };
  }
}
