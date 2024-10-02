import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { User } from "../models/user";

export const authenticateJWT = passport.authenticate("jwt", { session: false });

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next(); // user is authorized, proceed
  };
};
