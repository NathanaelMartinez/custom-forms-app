import { Request, Response } from "express";

// user administration (admin users only)
export const adminTable = (req: Request, res: Response) => {
  res.send("Success! Admin user management page.");
};
