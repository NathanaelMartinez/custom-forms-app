import { AppDataSource } from "../config/data-source";
import { Template } from "../entities/template";
import { Question } from "../entities/question";
import { User } from "../entities/user";
import { Comment } from "../entities/comment";
import {
  getAllTemplates,
  getTemplateById,
  getTemplateRepository,
  searchTemplatesRepository,
} from "../repositories/template-repository";
import { getQuestionRepository } from "../repositories/question-repository";
import { Tag } from "../entities/tag";

export const createTemplateService = async (data: any, user: User) => {
  const { title, description, questions, topic, tags, image } = data;

  const templateRepository = AppDataSource.getRepository(Template);
  const questionRepository = AppDataSource.getRepository(Question);
  const tagRepository = AppDataSource.getRepository(Tag);

  // Process tags: find existing or create new tags
  const tagEntities = [];
  for (const tagName of tags) {
    const formattedTag = tagName
      .toLowerCase()
      .replace(/\b(a|an|the)\b/g, "")
      .trim();
    let tag = await tagRepository.findOne({ where: { name: formattedTag } });
    if (!tag) {
      tag = tagRepository.create({ name: formattedTag });
      await tagRepository.save(tag);
    }
    tagEntities.push(tag);
  }

  const template = templateRepository.create({
    title,
    description,
    author: user,
    image: image || null,
    topic: topic || "other",
    tags: tagEntities, // Set the processed tags
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

export const getTemplateService = async (templateId: string) => {
  try {
    const template = await getTemplateById(templateId);
    if (!template) {
      throw new Error("Template not found.");
    }
    return template;
  } catch (error) {
    console.error("Error fetching template:", error);
    throw error;
  }
};

// service: view all templates
export const editTemplateService = async (
  templateId: string,
  data: any,
  user: User
) => {
  const { title, description, topic, tags = [], image, questions } = data; // default to empty array

  const templateRepository = getTemplateRepository();
  const questionRepository = getQuestionRepository();

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
  template.tags = Array.isArray(tags) ? tags : []; // Ensure it's always an array
  template.image = image || template.image;

  // handle existing and new questions
  const existingQuestionsMap = template.questions.reduce((acc, question) => {
    acc[question.id] = question;
    return acc;
  }, {} as Record<string, Question>);

  const updatedQuestionIds = questions.map((q: Question) => q.id);

  // remove old questions not included in update
  for (const questionId in existingQuestionsMap) {
    if (!updatedQuestionIds.includes(questionId)) {
      await questionRepository.remove(existingQuestionsMap[questionId]);
    }
  }

  // update existing and add new questions
  const updatedQuestions = [];
  for (const questionData of questions) {
    const questionIndex =
      questions.findIndex((q: Question) => q.id === questionData.id) + 1;

    if (questionData.id && existingQuestionsMap[questionData.id]) {
      // update existing question
      const questionToUpdate = existingQuestionsMap[questionData.id];
      questionToUpdate.questionText =
        questionData.questionText || questionToUpdate.questionText;
      questionToUpdate.type = questionData.type || questionToUpdate.type;
      questionToUpdate.displayInTable =
        questionData.displayInTable ?? questionToUpdate.displayInTable;
      questionToUpdate.order_index = questionIndex;
      updatedQuestions.push(await questionRepository.save(questionToUpdate));
    } else {
      // Add new question
      const newQuestion = questionRepository.create({
        questionText: questionData.questionText,
        type: questionData.type,
        displayInTable: questionData.displayInTable,
        template: template,
        options: questionData.options || [],
        order_index: questionIndex,
      });
      updatedQuestions.push(await questionRepository.save(newQuestion));
    }
  }

  template.questions = updatedQuestions; // Set updated questions
  return templateRepository.save(template); // Save the updated template
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

export const viewTemplatesService = async () => {
  try {
    const templates = await getAllTemplates();
    if (!templates) {
      throw new Error("No templates found.");
    }
    return templates;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
};

// logic for searching templates
export async function searchTemplatesService(searchTerm: string) {
  const results = await searchTemplatesRepository(searchTerm);
  // potentially other operations done here
  return results;
}
