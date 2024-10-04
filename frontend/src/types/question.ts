import { Template } from "./template";

// Interface for the Question entity
export interface Question {
  id: string;
  title: string;
  description?: string;
  type: string; // single-line, multiple-line, integer, checkbox, etc.
  template: Template; // The template to which this question belongs
  displayInTable: boolean; // Whether this question will be shown in the table of filled forms
}
