import { Template } from "../types";
import { QuestionPayload } from "./question-payload";

export interface TemplatePayload {
  title: string;
  description?: string;
  authorId: string;
  topic?: string;
  questions: QuestionPayload[]; // Use QuestionPayload[] for questions
  tags?: string[];
  image?: File | null;
}

export const mapTemplateToPayload = (template: Template): TemplatePayload => ({
  title: template.title,
  description: template.description,
  authorId: template.author?.id ?? "", // Fallback to an empty string or handle null author
  topic: template.topic,
  questions: template.questions.map((question) => ({
    id: question.id,
    type: question.type,
    questionText: question.questionText,
    options: question.options,
    displayInTable: question.displayInTable,
    templateId: template.id, // Only pass template ID in payload
  })),
  tags: template.tags,
  image: template.image,
});

export const mapPayloadToTemplate = (payload: TemplatePayload): Template => ({
  id: "",
  title: payload.title,
  description: payload.description,
  author: { id: payload.authorId }, // Map back to User object (you can fetch user separately if needed)
  topic: payload.topic,
  questions: payload.questions.map((q) => ({
    id: q.id,
    type: q.type,
    questionText: q.questionText,
    options: q.options,
    displayInTable: q.displayInTable,
    template: { id: q.templateId }, // Map back to full Template entity (you can fetch template separately if needed)
  })),
  createdAt: new Date(),
  tags: payload.tags,
  image: payload.image,
});
