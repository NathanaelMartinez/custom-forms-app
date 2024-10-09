import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Response as FormResponse } from "../entities/response";
import { User } from "../entities/user";
import { Template } from "../entities/template";

export const submitResponse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user as User;
  const { answers } = req.body;

  try {
    // get template
    const templateRepository = AppDataSource.getRepository(Template);
    const template = await templateRepository.findOne({
      where: { id },
      relations: ["questions"], // load related questions
    });

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    // validate that each answer corresponds to valid question in template
    for (const [questionId, answer] of Object.entries(answers)) {
      const question = template.questions.find((q) => q.id === questionId);
      if (!question) {
        res.status(400).json({ message: `Invalid question ID: ${questionId}` });
        return;
      }

      // TODO: validate answer based on question type (string, number, array)
    }

    // create and save the response
    const responseRepository = AppDataSource.getRepository(FormResponse);
    const newResponse = responseRepository.create({
      template,
      user,
      answers,
    });

    await responseRepository.save(newResponse);

    res.status(201).json(newResponse);
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export const getResponsesAggregate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // get template
    const templateRepository = AppDataSource.getRepository(Template);
    const template = await templateRepository.findOne({
      where: { id },
    });

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    const responseRepository = AppDataSource.getRepository(FormResponse);
    const responses = await responseRepository.find({
      where: { template: { id } }, // filter by templateId
    });

    // init aggregate data object
    const data: Record<string, any> = {};

    for (const response of responses) {
      // iterate over each answer in response's answers object
      for (const [questionId, answer] of Object.entries(response.answers)) {
        // init questionId if does not exist in data object
        if (!data[questionId]) {
          data[questionId] = {
            values: [], // numeric calculations
            counts: {}, // counts for text answers or checkboxes
            optionCounts: {}, // counts for checkbox options
          };
        }

        /* handle different question types */
        if (typeof answer === "number") {
          data[questionId].values.push(answer);
        } else if (typeof answer === "string") {
          // if answer doesn't have count, init count
          if (!data[questionId].counts[answer]) {
            data[questionId].counts[answer] = 0;
          }
          // increment count
          data[questionId].counts[answer]++;
        } else if (Array.isArray(answer)) {
          // iterate over selected options in the checkbox answer
          for (const option of answer) {
            // if option doesn't have count, inti count
            if (!data[questionId].optionCounts[option]) {
              data[questionId].optionCounts[option] = 0;
            }
            // increment count
            data[questionId].optionCounts[option]++;
          }
        }
      }
    }

    // calculate numerical aggregates
    for (const [questionId, details] of Object.entries(data)) {
      if (details.values.length && typeof details.values[0] === "number") {
        const values = details.values as number[];
        const sum = values.reduce((acc, val) => acc + val, 0);
        const average = sum / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        // store calculations in data
        data[questionId].average = average;
        data[questionId].min = min;
        data[questionId].max = max;
      }
    }

    // return aggregated data as JSON
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
