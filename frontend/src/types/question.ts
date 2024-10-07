import { Template } from "./template";

export interface Question {
  id: string;
  type: "text" | "textarea" | "integer" | "checkbox"; // single-line, multiple-line, positive integers, checkboxes
  placeholder: string;
  questionText: string;
  options?: string[]; // used only for checkbox questions
  template: Template; // associated template
}
