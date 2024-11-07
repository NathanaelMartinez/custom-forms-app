export interface JiraTicket {
  id: string;
  summary: string;
  template: string;
  link: string;
  priority: string;
  status: string;
}

export type BugReport = {
  id: string;
  summary: string;
  template: string;
  link: string;
  priority: string;
  status: string;
};
