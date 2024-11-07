export interface JiraTicket {
  id: string;
  fields: {
    summary: string;
    customfield_10042?: string; // Template field, optional
    customfield_10043: string; // Link field
    priority: { name: string };
    status: { name: string };
  };
}

export type BugReport = {
  id: string;
  summary: string;
  template: string;
  link: string;
  priority: string;
  status: string;
};
