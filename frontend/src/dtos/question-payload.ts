export interface QuestionPayload {
  id: string;
  type: "text" | "textarea" | "integer" | "checkbox";
  questionText: string;
  options?: string[];
  displayInTable: boolean;
  templateId: string; // only template ID for API
}
