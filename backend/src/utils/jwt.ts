import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth-config";
import { User } from "../entities/user";

// generate jwt token
export const generateToken = (user: User) => {
  const payload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, authConfig.jwtSecret, { expiresIn: "1h" });
};

// verify jwt token
export const verifyToken = (token: string) => {
  return jwt.verify(token, authConfig.jwtSecret);
};
