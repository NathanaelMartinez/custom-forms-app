import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Response as FormResponse } from "../entities/response";
import { User } from "../entities/user";
import { Template } from "../entities/template";
import { Question } from "../entities/question";

export const submitResponse = async (req: Request, res: Response) => {
  const { templateId } = req.params;
  const user = req.user as User;
  const { answers } = req.body;

  try {
    // get template
    const templateRepository = AppDataSource.getRepository(Template);
    const template = await templateRepository.findOne({
      where: { id: templateId },
      relations: ["questions"], // load related questions
    });

    if (!template) {
      return;
    }
    console.log("Loaded template ID: ", template.id);
    console.log("Submitted template ID: ", templateId);
    console.log(
      "Loaded question types: ",
      template.questions.map((q) => q.type)
    );
    console.log("Submitted answers: ", Object.keys(answers));

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    // validate that each answer corresponds to valid question in template
    for (const [questionId, answer] of Object.entries(answers)) {
      const question = template.questions.find((q) => q.id === questionId);

      console.log(
        "Evaluating question with type:",
        question?.type,
        "and ID:",
        questionId
      );
      console.log("Answer:", answer);

      if (!question) {
        console.log("Question not found for ID:", questionId);
        res.status(400).json({
          message: `Question not found for ID: ${questionId}`,
        });
        return;
      }

      switch (question.type) {
        case "integer":
          console.log("Validating integer type answer:", answer);

          // answer arrives as string
          const numericAnswer = Number(answer); // make into number
          if (isNaN(numericAnswer)) {
            // if can't be made into number
            res.status(400).json({
              message: `Expected a valid number for question ID: ${questionId}`,
            });
            return;
          }
          answers[questionId] = numericAnswer;
          break;

        case "text":
        case "textarea":
          console.log("Validating text/textarea type answer:", answer);
          if (typeof answer !== "string") {
            res.status(400).json({
              message: `Expected text for question ID: ${questionId}`,
            });
            return;
          }
          break;
        case "checkbox":
          console.log("Validating checkbox type answer:", answer);
          if (!Array.isArray(answer)) {
            console.log("Invalid checkbox answer (not array):", answer);
            res.status(400).json({
              message: `Expected array for checkbox question ID: ${questionId}`,
            });
            return;
          }
          console.log("Valid checkbox answer received:", answer);
          break;
        default:
          console.log(`Unknown question type: ${question?.type}`);
          res.status(400).json({
            message: `Unsupported question type: ${question?.type}`,
          });
          return;
      }

      console.log(`Finished processing question ID: ${questionId}`);
    }

    console.log("Finished processing all questions");

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
  const { templateId } = req.params;

  try {
    // get template
    const templateRepository = AppDataSource.getRepository(Template);
    const template = await templateRepository.findOne({
      where: { id: templateId },
      relations: ["questions"], // fetch related questions
    });

    if (!template) {
      res.status(404).json({ message: "Template not found" });
      return;
    }

    // filter out questions that should not be displayed in the table
    const validQuestions = template.questions.filter(
      (question) => question.displayInTable
    );

    if (validQuestions.length === 0) {
      res
        .status(400)
        .json({ message: "No questions available for aggregation" });
      return;
    }

    const responseRepository = AppDataSource.getRepository(FormResponse);
    const responses = await responseRepository.find({
      where: { template: { id: templateId } }, // filter by templateId
    });

    const responseCount = responses.length;

    // init data objects by type
    const numericData: Record<string, any> = {};
    const textData: Record<string, any> = {};
    const checkboxData: Record<string, any> = {};

    for (const response of responses) {
      for (const [questionId, answer] of Object.entries(response.answers)) {
        const question = validQuestions.find(
          (q: Question) => q.id === questionId
        );
        if (!question) continue;

        /* categorize question types */
        if (typeof answer === "number") {
          if (!numericData[questionId]) {
            numericData[questionId] = {
              questionText: question.questionText,
              values: [],
              average: null,
              min: null,
              max: null,
            };
          }
          numericData[questionId].values.push(answer);
        } else if (typeof answer === "string") {
          // Normalize the answer by converting to lowercase and trimming
          const normalizedAnswer = answer.trim().toLowerCase();

          if (!textData[questionId]) {
            textData[questionId] = {
              questionText: question.questionText,
              counts: {},
            };
          }
          if (!textData[questionId].counts[normalizedAnswer]) {
            textData[questionId].counts[normalizedAnswer] = 0;
          }
          textData[questionId].counts[normalizedAnswer]++;
        } else if (Array.isArray(answer)) {
          if (!checkboxData[questionId]) {
            checkboxData[questionId] = {
              questionText: question.questionText,
              optionCounts: {},
            };
          }
          for (const option of answer) {
            const normalizedOption = option.trim().toLowerCase(); // Normalize checkbox options as well
            if (!checkboxData[questionId].optionCounts[normalizedOption]) {
              checkboxData[questionId].optionCounts[normalizedOption] = 0;
            }
            checkboxData[questionId].optionCounts[normalizedOption]++;
          }
        }
      }
    }

    // calculate numeric data
    for (const [questionId, details] of Object.entries(numericData)) {
      if (details.values.length) {
        const sum = details.values.reduce(
          (acc: number, val: number) => acc + val,
          0
        );
        numericData[questionId].average = sum / details.values.length;
        numericData[questionId].min = Math.min(...details.values);
        numericData[questionId].max = Math.max(...details.values);
      }
    }

    // return grouped data
    res.status(200).json({
      responseCount,
      numericData,
      textData,
      checkboxData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
