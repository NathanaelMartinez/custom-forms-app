import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Comment } from "../entities/comment";
import { Template } from "../entities/template";
import { User } from "../entities/user";

export const getCommentsForTemplate = async (req: Request, res: Response) => {
  const { templateId } = req.params;

  try {
    // fetch comments for a specific template
    const commentRepository = AppDataSource.getRepository(Comment);
    const comments = await commentRepository.find({
      where: { template: { id: templateId } },
      relations: ["author"], // load related author for username
    });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Failed to fetch comments." });
  }
};

export const addCommentToTemplate = async (req: Request, res: Response) => {
  const { templateId } = req.params;
  const { content } = req.body;
  const user = req.user as User;

  try {
    const commentRepository = AppDataSource.getRepository(Comment);
    const templateRepository = AppDataSource.getRepository(Template);

    const template = await templateRepository.findOne({
      where: { id: templateId },
    });

    if (!user || !template) {
      res.status(404).json({ message: "User or Template not found." });
      return;
    }

    const newComment = commentRepository.create({
      content,
      author: user,
      template,
    });

    await commentRepository.save(newComment);

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Failed to add comment." });
  }
};
