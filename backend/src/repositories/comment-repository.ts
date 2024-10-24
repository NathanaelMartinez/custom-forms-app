import { AppDataSource } from "../config/data-source";
import { Comment } from "../entities/comment";

// get repository for comment
export function getCommentRepository() {
  return AppDataSource.getRepository(Comment);
}

// function to save a comment
export async function saveComment(comment: Comment) {
  const repository = getCommentRepository();
  return await repository.save(comment);
}
