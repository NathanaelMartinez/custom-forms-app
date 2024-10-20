import { Question } from "./question";
import { User } from "./user";
import { Response } from "./response";

export interface Template {
  id: string;
  title: string;
  description?: string;
  author: Partial<User>; // user who created template
  topic: string;
  questions: Question[]; // Questions related to this template
  createdAt: Date;
  filledForms?: number; // track how many times template has been filled
  likes?: number;
  comments?: Comment[];
  tags?: string[];
  image?: File | null; // use cloud service later to store uri as string
  responses?: Response[];
}
