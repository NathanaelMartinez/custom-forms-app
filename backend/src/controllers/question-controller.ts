import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Question } from "../entities/question";
import { User } from "../entities/user";
import { Template } from "../entities/template";

// add a new question to an existing template
export const addQuestion = async (req: Request, res: Response) => {
  const { questionText, type, displayInTable } = req.body;
  const { templateId } = req.params;

  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const questionRepository = AppDataSource.getRepository(Question);

    // find template
    const template = await templateRepository.findOneBy({ id: templateId });
    if (!template) {
      res.status(404).json({ message: "Template not found." });
      return;
    }

    // create new question
    const question = questionRepository.create({
      questionText,
      type,
      displayInTable: displayInTable || false,
      template,
    });

    // save question
    await questionRepository.save(question);
    res.status(201).json({ message: "Question added successfully", question });
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// edit an existing question
export const editQuestion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { questionText, type, displayInTable } = req.body;
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
    question.questionText = questionText || question.questionText;
    question.type = type || question.type;
    question.displayInTable = displayInTable ?? question.displayInTable;

    await questionRepository.save(question);
    res
      .status(200)
      .json({ message: "Question updated successfully.", question });
  } catch (error) {
    console.error("Error editing question:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// delete a question
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
    return;
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
