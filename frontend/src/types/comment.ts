import { User } from "./user";

export interface Comment {
  id: string;
  user: User; // user who made comment
  content: string;
  createdAt: Date;
  //   updatedAt?: Date; // TODO: comments can be edited?
}
