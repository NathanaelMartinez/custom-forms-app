import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Template } from "../entities/template";
import { Question } from "../entities/question";
import { User } from "../entities/user";
import { Comment } from "../entities/comment";
import {
  addCommentService,
  createTemplateService,
  deleteTemplateService,
  editTemplateService,
  getTemplateService,
  searchTemplatesService,
  toggleLikeTemplateService,
  viewTemplatesService,
} from "../services/template-service";

// create new template (authenticated users only)
export const createTemplate = async (req: Request, res: Response) => {
  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const newTemplate = await createTemplateService(req.body, user);
    res.status(201).json({
      message: "Template created successfully",
      template: newTemplate,
    });
  } catch (error) {
    console.error("Error creating template:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

// view all templates (for dashboard)
export const viewTemplates = async (req: Request, res: Response) => {
  try {
    const templates = await viewTemplatesService();
    res.status(200).json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error." });
  }
};

// view a specific template by ID
export const getTemplate = async (req: Request, res: Response) => {
  const { templateId } = req.params;

  try {
    const template = await getTemplateService(templateId);

    if (!template) {
      res.status(404).json({ message: "template not found." });
      return;
    }

    res.status(200).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error." });
  }
};

// edit a template (only author or admin)
export const editTemplate = async (req: Request, res: Response) => {
  const { templateId } = req.params;
  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  try {
    const updatedTemplate = await editTemplateService(
      templateId,
      req.body,
      user
    );
    res.status(204).json({ message: "template updated successfully" });
  } catch (error) {
    console.error("Error updating template:", error);
    res.status(500).json({ message: "internal server error." });
  }
};

// delete a template (only author or admin)
export const deleteTemplate = async (req: Request, res: Response) => {
  const { templateId } = req.params;
  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  try {
    await deleteTemplateService(templateId, user);
    res.status(204).json({ message: "template deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "internal server error." });
  }
};

// like/unlike template
export const likeTemplate = async (req: Request, res: Response) => {
  const { templateId } = req.params;
  const user = req.user as User;

  try {
    const { hasLiked, likesCount } = await toggleLikeTemplateService(
      templateId,
      user.id
    );

    res.json({
      message: hasLiked ? "Template liked" : "Template unliked",
      likes: likesCount,
    });
  } catch (error) {
    console.error("Error toggling like for template:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// add a comment to a template
export const addComment = async (req: Request, res: Response) => {
  const { templateId } = req.params;
  const { content } = req.body;
  const user = req.user as User;

  try {
    const newComment = await addCommentService(templateId, content, user);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "server error" });
  }
};

// controller for template search
export async function searchTemplatesController(req: Request, res: Response) {
  try {
    const searchTerm = req.query.q as string; // extract query parameter
    const results = await searchTemplatesService(searchTerm);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error searching templates", error });
  }
}
