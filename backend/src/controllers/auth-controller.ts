import { Request, Response } from "express";
import { generateToken } from "../utils/jwt";
import {
  comparePasswords,
  createUser,
  findUserByEmail,
} from "../services/user-service";
import { QueryFailedError } from "typeorm";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    console.log("Creating user with:", { username, email });

    // attempt to create user
    const user = await createUser(username, email, password);

    if (!user) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }

    // if user created, generate and return the JWT token to login
    const token = generateToken(user);
    console.log("Token generated:", token);
    res.json({ token });
  } catch (error) {
    console.error("Error creating user:", error);

    // handle PostgreSQL unique constraint violation error (code 23505)
    if (
      error instanceof QueryFailedError &&
      error.driverError.code === "23505"
    ) {
      const detail = error.driverError.detail || "";
      let message = "Unique constraint violation. Please check your data.";

      // username or email found on error detail
      if (detail.includes("username")) {
        message = `Username '${username}' is already taken.`;
      } else if (detail.includes("email")) {
        message = `Email '${email}' is already registered.`;
      }

      console.log("Unique constraint violation:", message);
      res.status(400).json({ error: message });
    } else {
      console.error("Registration failed for another reason:", error);
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // check if the user is blocked
    if (user.status === "blocked") {
      res.status(403).json({
        error:
          "Your account has been blocked. Please contact the QuickFormr administrator if you think this is an error.",
      });
      return;
    }

    // login successful, generate and return jwt
    const token = generateToken(user);
    res.json({ token });
    return;
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
    return;
  }
};
