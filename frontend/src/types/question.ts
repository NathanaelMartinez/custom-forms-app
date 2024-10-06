import { Template } from "./template";

export interface Question {
  id: string;
  title: string;
  description?: string;
  type: string; // single-line, multiple-line, integer, checkbox, etc.
  template: Template; // question belongs to this template
  displayInTable: boolean; // whether this question will be shown in the table of filled forms
}
