import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user";
import { In } from "typeorm";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;

    // only allow access to admins
    if (user.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Admin access required." });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository
      .createQueryBuilder("user")
      .addSelect("user.email") // admins can see emails in dashboard
      .getMany();

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// modify user (block/unblock, promote/demote)
export const modifyUser = async (req: Request, res: Response) => {
  const { action } = req.body;
  const { id } = req.params;

  const VALID_ACTIONS = ["block", "unblock", "promote", "demote"];
  if (!VALID_ACTIONS.includes(action)) {
    res.status(400).json({ message: "Invalid action." });
    return;
  }

  try {
    // fetch user
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // action logic
    switch (action) {
      case "block":
        if (user.status !== "blocked") {
          user.status = "blocked"; // block user
        } else {
          res.status(204).send(); // 204 no content
          return;
        }
        break;

      case "unblock":
        if (user.status === "blocked") {
          user.status = "active"; // unblock user
        } else {
          res.status(204).send();
          return;
        }
        break;

      case "promote":
        if (user.role !== "admin") {
          user.role = "admin"; // promote user to admin
        } else {
          res.status(204).send();
          return;
        }
        break;

      case "demote":
        if (user.role === "admin") {
          user.role = "user"; // demote user to regular user
        } else {
          res.status(204).send();
          return;
        }
        break;

      default:
        res.status(400).json({ message: "Invalid action." });
        return;
    }
    await userRepository.save(user);
    res.status(200).json({ message: `User has been ${action}ed.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// modify multiple users (block/unblock, promote/demote)
export const modifyUsersBatch = async (req: Request, res: Response) => {
  const { action, userIds } = req.body;

  console.log("Received action:", action);
  console.log("Received userIds:", userIds);

  const VALID_ACTIONS = ["block", "unblock", "promote", "demote"];
  if (!VALID_ACTIONS.includes(action)) {
    console.log("Invalid action received");
    res.status(400).json({ message: "Invalid action." });
    return;
  }

  if (!Array.isArray(userIds) || userIds.length === 0) {
    console.log("No userIds provided or not an array");
    res.status(400).json({ message: "userIds must be a non-empty array." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.findBy({ id: In(userIds) });
    console.log("Fetched users:", users);

    if (users.length === 0) {
      console.log("No users found with provided IDs");
      res.status(404).json({ message: "No users found." });
      return;
    }

    users.forEach((user) => {
      switch (action) {
        case "block":
          if (user.status !== "blocked") user.status = "blocked";
          break;
        case "unblock":
          if (user.status !== "active") user.status = "active";
          break;
        case "promote":
          if (user.role !== "admin") user.role = "admin";
          break;
        case "demote":
          if (user.role === "admin") user.role = "user";
          break;
      }
    });

    await userRepository.save(users);
    console.log("Users updated successfully");
    res.status(200).json({ message: `Users have been ${action}ed.` });
  } catch (error) {
    console.error("Error in modifyUsersBatch:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: req.params.id });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    await userRepository.remove(user);
    res.status(200).json({ message: "User has been deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// delete multiple users
export const deleteUsersBatch = async (req: Request, res: Response) => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    res.status(400).json({ message: "userIds must be a non-empty array." });
    return;
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.findBy({ id: In(userIds) });

    if (users.length === 0) {
      res.status(404).json({ message: "No users found." });
      return;
    }

    await userRepository.remove(users); // delete all users at once
    res.status(200).json({ message: "Users have been deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
