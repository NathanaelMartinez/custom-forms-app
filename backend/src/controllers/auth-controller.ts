import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import {
  comparePasswords,
  createUser,
  findUserByEmail,
} from "../services/user-service";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const user = await createUser(username, email, password);
    if (user) {
      const token = generateToken(user);
      res.json({ token });
      return;
    }
    res.status(500).json({ error: "Failed to create user" });
    return;
  } catch (error: any) {
    if (error.code === "23505") {
      // PostgreSQL unique violation error code
      // check if the error message mentions username or email
      if (error.detail.includes("username")) {
        res
          .status(400)
          .json({ error: "User with selected Username already exists" });
        return;
      } else if (error.detail.includes("email")) {
        res
          .status(400)
          .json({ error: "User with selected Email already exists" });
        return;
      }
    }
    res.status(500).json({ error: "Registration failed" });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // login successful, generate jwt
    const token = generateToken(user);
    res.json({ token });
    return;
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
    return;
  }
};
