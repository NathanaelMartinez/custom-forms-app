import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Template } from "../entities/template";
import { Question } from "../entities/question";
import { User } from "../entities/user";

// create new template (authenticated users only)
export const createTemplate = async (req: Request, res: Response) => {
  const { name, description, questions } = req.body;

  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const questionRepository = AppDataSource.getRepository(Question);

    const template = templateRepository.create({
      name,
      description,
      author: user,
    });

    if (questions && Array.isArray(questions)) {
      const createdQuestions = questions.map((q: Question) =>
        questionRepository.create({
          title: q.title,
          description: q.description,
          type: q.type,
          displayInTable: q.displayInTable || false,
          template,
        })
      );
      template.questions = createdQuestions;
    }

    await templateRepository.save(template);
    res
      .status(201)
      .json({ message: "Template created successfully", template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// view all templates (for dashboard)
export const viewTemplates = async (req: Request, res: Response) => {
  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const templates = await templateRepository.find({
      relations: ["author", "questions"], // fetch associated questions and authors
    });
    res.status(200).json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// edit a template
export const editTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const template = await templateRepository.findOneBy({ id });

    if (!template) {
      res.status(404).json({ message: "Template not found." });
      return;
    }

    // only author or an admin can edit
    if (template.author.id !== user.id && user.role !== "admin") {
      res.status(403).json({ message: "Unauthorized to edit this template." });
      return;
    }

    template.name = name || template.name;
    template.description = description || template.description;

    await templateRepository.save(template);
    res
      .status(200)
      .json({ message: "Template updated successfully.", template });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// delete a template
export const deleteTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const template = await templateRepository.findOneBy({ id });

    if (!template) {
      res.status(404).json({ message: "Template not found." });
      return;
    }

    // only author or an admin can delete
    if (template.author.id !== user.id && user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Unauthorized to delete this template." });
      return;
    }

    await templateRepository.remove(template);
    res.status(200).json({ message: "Template deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};
