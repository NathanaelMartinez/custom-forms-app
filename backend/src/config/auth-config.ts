import dotenv from "dotenv";

// load environment variables from .env
dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || "default-secret-key", // default needed
};
