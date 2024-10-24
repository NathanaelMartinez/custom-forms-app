import { AppDataSource } from "../config/data-source";
import { Template } from "../entities/template";
import { Question } from "../entities/question";
import { User } from "../entities/user";
import { Comment } from "../entities/comment";
import {
  getTemplateRepository,
  searchTemplatesRepository,
} from "../repositories/template-repository";

export const createTemplateService = async (data: any, user: User) => {
  const { title, description, questions, topic, tags, image } = data;

  const templateRepository = AppDataSource.getRepository(Template);
  const questionRepository = AppDataSource.getRepository(Question);

  const template = templateRepository.create({
    title,
    description,
    author: user,
    image: image || null,
    topic: topic || "other",
    tags: tags || [],
  });

  const savedTemplate = await templateRepository.save(template);

  if (questions && Array.isArray(questions)) {
    const createdQuestions = questions.map((q: Question, index: number) =>
      questionRepository.create({
        questionText: q.questionText,
        type: q.type,
        displayInTable: q.displayInTable,
        template: savedTemplate,
        options: q.options,
        order_index: index + 1,
      })
    );
    await questionRepository.save(createdQuestions);
  }

  return savedTemplate;
};

// service: view all templates
export const viewTemplatesService = async () => {
  const templateRepository = AppDataSource.getRepository(Template);
  const templates = await templateRepository.find({
    relations: ["author", "questions", "comments"],
    cache: 60000,
  });
  return templates;
};

// service: get a specific template
export const getTemplateService = async (templateId: string) => {
  const templateRepository = AppDataSource.getRepository(Template);
  const template = await templateRepository.findOne({
    where: { id: templateId },
    relations: ["questions"],
    order: { questions: { order_index: "ASC" } },
  });
  return template;
};

// service: edit template
export const editTemplateService = async (
  templateId: string,
  data: any,
  user: User
) => {
  const { title, description, topic, tags, image, questions } = data;

  const templateRepository = AppDataSource.getRepository(Template);
  const questionRepository = AppDataSource.getRepository(Question);

  const template = await templateRepository.findOne({
    where: { id: templateId },
    relations: ["questions"],
  });

  if (!template) {
    throw new Error("Template not found.");
  }

  if (template.author.id !== user.id && user.role !== "admin") {
    throw new Error("Unauthorized to edit this template.");
  }

  // update template fields
  template.title = title || template.title;
  template.description = description || template.description;
  template.topic = topic || template.topic;
  template.tags = tags || template.tags;
  template.image = image || template.image;

  const existingQuestions = template.questions.reduce((acc, question) => {
    acc[question.id] = question;
    return acc;
  }, {} as Record<string, Question>);

  const updatedQuestionIds = questions.map((q: Question) => q.id);

  // remove old questions
  for (const questionId in existingQuestions) {
    if (!updatedQuestionIds.includes(questionId)) {
      await questionRepository.remove(existingQuestions[questionId]);
    }
  }

  const newQuestionsToReturn = [];
  for (const questionData of questions) {
    const questionIndex =
      questions.findIndex((q: Question) => q.id === questionData.id) + 1;
    if (
      questionData.id &&
      !questionData.id.startsWith("temp-") &&
      existingQuestions[questionData.id]
    ) {
      const questionToUpdate = existingQuestions[questionData.id];
      questionToUpdate.questionText =
        questionData.questionText || questionToUpdate.questionText;
      questionToUpdate.type = questionData.type || questionToUpdate.type;
      questionToUpdate.displayInTable =
        questionData.displayInTable ?? questionToUpdate.displayInTable;
      questionToUpdate.order_index = questionIndex;
      await questionRepository.save(questionToUpdate);
    } else if (template) {
      const newQuestion = questionRepository.create({
        questionText: questionData.questionText,
        type: questionData.type,
        displayInTable: questionData.displayInTable,
        template: template,
        options: questionData.options || [],
        order_index: questionIndex,
      });
      const savedQuestion = await questionRepository.save(newQuestion);
      newQuestionsToReturn.push(savedQuestion);
    }
  }

  template.questions = [...template.questions, ...newQuestionsToReturn];
  return templateRepository.save(template);
};

// service: delete template
export const deleteTemplateService = async (templateId: string, user: User) => {
  const templateRepository = AppDataSource.getRepository(Template);

  const template = await templateRepository.findOneBy({ id: templateId });

  if (!template) {
    throw new Error("Template not found.");
  }

  if (template.author.id !== user.id && user.role !== "admin") {
    throw new Error("Unauthorized to delete this template.");
  }

  return await templateRepository.remove(template);
};

// service: like template
export const likeTemplateService = async (templateId: string) => {
  const templateRepository = AppDataSource.getRepository(Template);
  const template = await templateRepository.findOneBy({ id: templateId });

  if (!template) {
    throw new Error("Template not found.");
  }

  template.likes += 1;
  return templateRepository.save(template);
};

// service: add comment to template
export const addCommentService = async (
  templateId: string,
  content: string,
  user: User
) => {
  const templateRepository = AppDataSource.getRepository(Template);
  const commentRepository = AppDataSource.getRepository(Comment);

  const template = await templateRepository.findOneBy({ id: templateId });

  if (!template) {
    throw new Error("Template not found.");
  }

  const newComment = new Comment();
  newComment.content = content;
  newComment.template = { id: templateId } as Template;
  newComment.author = user;

  return await commentRepository.save(newComment);
};

// logic for searching templates
export async function searchTemplates(searchTerm: string) {
  const results = await searchTemplatesRepository(searchTerm);
  // potentially other operations done here
  return results;
}
