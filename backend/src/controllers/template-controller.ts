import { Request, Response } from "express";

// template creation (authenticated users only)
export const createTemplate = (req: Request, res: Response) => {
  res.send("Success! Template creation page.");
};
