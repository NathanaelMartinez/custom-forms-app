import { Template } from "../types";
import { QuestionPayload } from "./question-payload";

export interface TemplatePayload {
  title: string;
  description?: string;
  authorId: string;
  topic: string;
  questions: QuestionPayload[];
  tags?: string[];
  image?: string | null;
  createdAt: Date;
}

export const mapTemplateToPayload = (template: Template): TemplatePayload => ({
  title: template.title,
  description: template.description,
  authorId: template.author?.id ?? "",
  topic: template.topic,
  questions: template.questions.map((question) => ({
    id: question.id,
    type: question.type,
    questionText: question.questionText,
    options: question.options,
    displayInTable: question.displayInTable,
    templateId: template.id,
  })),
  createdAt: template.createdAt || new Date(),
  tags: template.tags || [],
  image: template.image,
});

export const mapPayloadToTemplate = (payload: TemplatePayload): Template => ({
  id: "",
  title: payload.title,
  description: payload.description,
  author: { id: payload.authorId }, // map back to User object
  topic: payload.topic,
  questions: payload.questions.map((q) => ({
    id: q.id,
    type: q.type,
    questionText: q.questionText,
    options: q.options,
    displayInTable: q.displayInTable,
    template: { id: q.templateId }, // map back to full Template entity
  })),
  createdAt: new Date(),
  tags: payload.tags || [],
  image: payload.image,
});
