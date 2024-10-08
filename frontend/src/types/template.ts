import { Question } from "./question";
import { User } from "./user";

export interface Template {
  id: string;
  title: string;
  description?: string;
  author: User; // user who created template
  topic?: string;
  questions: Question[]; // Questions related to this template
  createdAt: Date;
  filledForms?: number; // track how many times template has been filled
  likes?: number;
  comments?: Comment[];
}
