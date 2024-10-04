import { Question } from "./question";
import { User } from "./user";

// Interface for the Template entity
export interface Template {
  id: string;
  name: string;
  description?: string;
  author: User; // The user who created the template
  questions: Question[]; // Questions related to this template
  createdAt: Date;
}
