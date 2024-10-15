import { Template } from "./template";

export interface Question {
  id: string;
  type: "text" | "textarea" | "integer" | "checkbox"; // single-line, multiple-line, positive integers, checkboxes
  questionText: string; // the actual text of the question that will be displayed to the user
  options?: string[]; // used only for checkbox questions
  template: Partial<Template>; // associated template
  displayInTable: boolean; // defines if the question will appear in the table view
}
