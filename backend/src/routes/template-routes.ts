import express from "express";
import {
  createTemplate,
  viewTemplates,
  editTemplate,
  deleteTemplate,
} from "../controllers/template-controller";
import { authenticateJWT } from "../middlewares/auth-middleware";
import {
  addQuestion,
  deleteQuestion,
  editQuestion,
} from "../controllers/question-controller";

const router = express.Router();

// create a new template (authenticated users only)
router.post("/", authenticateJWT, createTemplate);

// view all templates (available to all users)
router.get("/", viewTemplates);

// edit a template (author or admin only)
router.patch("/:id", authenticateJWT, editTemplate);

// delete a template (author or admin only)
router.delete("/:id", authenticateJWT, deleteTemplate);

// add a new question to a specific template (authenticated users only)
router.post("/:templateId/questions", authenticateJWT, addQuestion);

// edit a question of a template (author or admin only)
router.patch(
  "/:templateId/questions/:questionId",
  authenticateJWT,
  editQuestion
);

// delete a question of a template (author or admin only)
router.delete(
  "/:templateId/questions/:questionId",
  authenticateJWT,
  deleteQuestion
);

export default router;
