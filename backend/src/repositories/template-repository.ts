import { AppDataSource } from "../config/data-source";
import { Template } from "../entities/template";

// function to get Template repository
export function getTemplateRepository() {
  return AppDataSource.getRepository(Template);
}

// function to perform full-text search
export async function searchTemplatesRepository(searchTerm: string) {
  const repository = getTemplateRepository();

  // construct full-text search query
  const results = await repository
    .createQueryBuilder("template")
    .where("template.search_vector @@ to_tsquery('english', :query)", {
      query: searchTerm,
    })
    .getMany();

  return results;
}
