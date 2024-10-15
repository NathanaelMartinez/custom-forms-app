import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Template } from "../entities/template";
import { Question } from "../entities/question";
import { User } from "../entities/user";
import { Comment } from "../entities/comment";

// create new template (authenticated users only)
export const createTemplate = async (req: Request, res: Response) => {
  const { title, description, questions, tags, image } = req.body;
  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const questionRepository = AppDataSource.getRepository(Question);

    const template = templateRepository.create({
      title,
      description,
      author: user, // pass full user object here
      image: image || null,
      tags: tags || [], // default to empty array if tags not provided
    });

    const savedTemplate = await templateRepository.save(template);

    if (questions && Array.isArray(questions)) {
      const createdQuestions = questions.map((q: any) =>
        questionRepository.create({
          questionText: q.questionText,
          type: q.type,
          displayInTable: q.displayInTable,
          template: savedTemplate, // associate question with saved template
          options: q.options,
        })
      );

      await questionRepository.save(createdQuestions);
    }

    res.status(201).json({
      message: "Template created successfully",
      template: savedTemplate,
    });
    return;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating template:", error.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
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
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

// view a specific template by ID
export const getTemplate = async (req: Request, res: Response) => {
  const { templateId } = req.params;

  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const template = await templateRepository.findOne({
      where: { id: templateId }, // find template by its ID
      relations: ["questions"], // include related questions
    });

    if (!template) {
      res.status(404).json({ message: "Template not found." });
      return;
    }

    res.status(200).json(template);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

// edit a template (only author or admin)
export const editTemplate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, tags, image } = req.body;
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

    template.title = title || template.title;
    template.description = description || template.description;
    template.tags = tags || template.tags;
    template.image = image || template.image;

    await templateRepository.save(template);
    res
      .status(200)
      .json({ message: "Template updated successfully.", template });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

// delete a template (only author or admin)
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

    // only author or admin can delete
    if (template.author.id !== user.id && user.role !== "admin") {
      res
        .status(403)
        .json({ message: "Unauthorized to delete this template." });
      return;
    }

    await templateRepository.remove(template);
    res.status(200).json({ message: "Template deleted successfully." });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
    return;
  }
};

// like a template
export const likeTemplate = async (req: Request, res: Response) => {
  const { templateId } = req.params;

  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const template = await templateRepository.findOneBy({ id: templateId });

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    // increment likes count
    template.likes += 1;
    await templateRepository.save(template);

    res.json({ message: "Template liked", likes: template.likes });
    return;
  } catch (error) {
    console.error("Error liking template:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// add a comment to a template
export const addComment = async (req: Request, res: Response) => {
  const { templateId } = req.params;
  const { content } = req.body;

  try {
    const templateRepository = AppDataSource.getRepository(Template);
    const commentRepository = AppDataSource.getRepository(Comment);

    const template = await templateRepository.findOneBy({ id: templateId });

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    const user = req.user as User; // get authenticated user

    // create new comment
    const newComment = new Comment();
    newComment.content = content;
    newComment.template = { id: templateId } as Template; // pass only the ID
    newComment.author = user; // full user object

    // save comment
    await commentRepository.save(newComment);

    res.status(201).json(newComment);
    return;
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
