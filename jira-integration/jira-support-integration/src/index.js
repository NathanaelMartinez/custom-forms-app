import Resolver from "@forge/resolver";
import api, { route } from "@forge/api";

const resolver = new Resolver();

resolver.define("createTicket", async (req) => {
  const { summary, priority, user, pageLink, templateTitle } = req.payload;

  console.log("Payload received:", req.payload);

  try {
    // retrieve environment variables securely
    const jiraProjectKey = process.env.JIRA_PROJECT_KEY;
    const jiraDomain = process.env.JIRA_DOMAIN;

    // make request to Jira API to create new issue
    const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          project: { key: jiraProjectKey },
          summary,
          priority: { name: priority },
          description: `
            **Reported by:** ${user.email} (${user.username})
            **Template Title:** ${templateTitle || "N/A"}
            **Page Link:** ${pageLink || "N/A"}
            
            ${summary} - Support issue created via QuickFormr
          `,
          issuetype: { name: "Task" },
        },
      }),
    });

    // handle Jira API response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error creating Jira ticket:", errorText);
      return { error: `Error creating Jira ticket: ${errorText}` };
    }

    const { key } = await response.json();
    const ticketLink = `https://${jiraDomain}/browse/${key}`;

    return { ticketLink }; // return link to created Jira ticket
  } catch (error) {
    console.error("Error in createTicket:", error);
    return { error: "Failed to create Jira ticket" };
  }
});

// export resolver’s definitions to be used as handler
export const handler = resolver.getDefinitions();
