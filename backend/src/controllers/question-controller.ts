import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Question } from "../entities/question";
import { User } from "../entities/user";

export const editQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, type, displayInTable } = req.body;
  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const questionRepository = AppDataSource.getRepository(Question);
    const question = await questionRepository.findOne({
      where: { id },
      relations: ["template", "template.author"], // fetch associated template and its author
    });

    if (!question) {
      res.status(404).json({ message: "Question not found." });
      return;
    }

    // check if user is author of template or an admin
    if (question.template.author.id !== user.id && user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized to edit this question." });
      return;
    }

    // update and save
    question.title = title || question.title;
    question.description = description || question.description;
    question.type = type || question.type;
    question.displayInTable = displayInTable || question.displayInTable;

    await questionRepository.save(question);
    res
      .status(200)
      .json({ message: "Question updated successfully.", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const questionRepository = AppDataSource.getRepository(Question);
    const question = await questionRepository.findOne({
      where: { id },
      relations: ["template", "template.author"], // fetch associated template and its author
    });

    if (!question) {
      res.status(404).json({ message: "Question not found." });
      return;
    }

    // check if user is author of template or an admin
    if (question.template.author.id !== user.id && user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Unauthorized to delete this question." });
      return;
    }

    // delete from db
    await questionRepository.remove(question);
    res.status(200).json({ message: "Question deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
