import Resolver from '@forge/resolver';
import api, { route, variables } from '@forge/api';

const resolver = new Resolver();

// define createTicket function to handle ticket creation requests
resolver.define('createTicket', async (req) => {
  const { summary, priority } = req.payload;

  try {
    // retrieve environment variables securely
    const jiraProjectKey = await variables.get('JIRA_PROJECT_KEY');
    const jiraApiToken = await variables.get('JIRA_API_TOKEN');
    const jiraEmail = await variables.get('JIRA_EMAIL');
    const jiraDomain = await variables.get('JIRA_DOMAIN');

    // make request to Jira API to create new issue
    const response = await api.asApp().requestJira(route`/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          project: { key: jiraProjectKey },
          summary,
          priority: { name: priority },
          description: 'Support issue created via QuickFormr',
          issuetype: { name: 'Task' }
        }
      })
    });

    // handle Jira API response
    if (!response.ok) {
      const errorText = await response.text();
      return { error: `Error creating Jira ticket: ${errorText}` };
    }

    const { key } = await response.json();
    const ticketLink = `https://${jiraDomain}/browse/${key}`;

    return { ticketLink }; // return link to created Jira ticket
  } catch (error) {
    console.error('Error in createTicket:', error);
    return { error: 'Failed to create Jira ticket' };
  }
});

// export resolver’s definitions to be used as handler
export const handler = resolver.getDefinitions();
