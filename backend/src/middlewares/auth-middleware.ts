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

export const checkIfNotBlocked = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as User;
  if (user.status === "blocked") {
    res.status(403).json({
      error:
        "Your account has been blocked. Please contact the QuickFormr administrator if you think this is an error.",
    });
    return;
  }
  next(); // user is not blocked, proceed
};
