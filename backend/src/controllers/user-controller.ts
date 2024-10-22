import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Response as FormResponse } from "../entities/response";
import { User } from "../entities/user";

export const getUserResponses = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // make sure user exist
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // fetch all responses submitted by user
    const responseRepository = AppDataSource.getRepository(FormResponse);
    const userResponses = await responseRepository.find({
      where: { user: { id: userId } },
      relations: ["template"], // load template information with responses
    });

    if (userResponses.length === 0) {
      res.status(200).json({ message: "No responses found for this user." });
      return;
    }

    res.status(200).json(userResponses);
  } catch (error) {
    console.error("Error fetching user responses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
