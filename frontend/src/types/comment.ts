import { User } from "./user";

export interface Comment {
  id: string;
  author: User | null; // user who made comment
  content: string;
  createdAt: Date;
  //   updatedAt?: Date; // TODO: comments can be edited?
}
