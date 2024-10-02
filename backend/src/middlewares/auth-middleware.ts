import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { User } from "../entities/user";

export const authenticateJWT = passport.authenticate("jwt", { session: false });

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;
    if (!roles.includes(user.role)) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }
    next(); // user is authorized, proceed
  };
};
