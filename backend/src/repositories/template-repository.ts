import { AppDataSource } from "../config/data-source";
import { Template } from "../entities/template";

// function to get Template repository
export function getTemplateRepository() {
  return AppDataSource.getRepository(Template);
}

// function to perform full-text search
export async function searchTemplatesRepository(searchTerm: string) {
  const repository = getTemplateRepository();

  const processedSearchTerm = searchTerm.trim().split(/\s+/).join(" & ");

  try {
    const results = await repository
      .createQueryBuilder("template")
      .addSelect(
        "ts_rank(template.search_vector, to_tsquery('english', :query))", // because different search vectors have different weights
        "rank"
      )
      .where("template.search_vector @@ to_tsquery('english', :query)", {
        query: processedSearchTerm,
      })
      .orderBy("rank", "DESC")
      .getMany();

    return results;
  } catch (error) {
    console.error("Error executing search query: ", error);
    throw error;
  }
}

// function to get all templates
export async function getAllTemplates() {
  const repository = getTemplateRepository();
  return await repository.find({
    relations: ["author", "questions", "comments"],
    cache: 60000,
  });
}

// function to get a template by ID
export async function getTemplateById(templateId: string) {
  const repository = getTemplateRepository();
  return await repository.findOne({
    where: { id: templateId },
    relations: ["questions", "comments", "author"],
    order: { questions: { order_index: "ASC" } },
  });
}

// function to remove a template by entity
export async function removeTemplate(template: Template) {
  const repository = getTemplateRepository();
  return await repository.remove(template);
}
