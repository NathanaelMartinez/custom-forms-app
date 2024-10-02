import { Request, Response } from "express";

// dashboard (accessible to all users)
export const getDashboard = (req: Request, res: Response) => {
  res.send("Success! This is the dashboard.");
};
