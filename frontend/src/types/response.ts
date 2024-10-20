import { Template } from "./template";
import { User } from "./user";

type AnswerValue = string | number | boolean | string[];

export interface Response {
  id: string;
  template: Template;
  user: User;
  answers: Record<string, AnswerValue>;
  submittedAt: Date;
}
