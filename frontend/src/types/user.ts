import { Template } from "./template";

// Interface for the User entity
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  templates: Template[]; // templates created by user
  createdAt: Date;
}
