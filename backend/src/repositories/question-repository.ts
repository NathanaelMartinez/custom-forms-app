import { AppDataSource } from "../config/data-source";
import { Question } from "../entities/question";

// get repository for question
export function getQuestionRepository() {
  return AppDataSource.getRepository(Question);
}

// function to save questions
export async function saveQuestions(questions: Question[]) {
  const repository = getQuestionRepository();
  return await repository.save(questions);
}
