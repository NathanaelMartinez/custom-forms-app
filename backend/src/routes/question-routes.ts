import express from "express";
import {
  editQuestion,
  deleteQuestion,
} from "../controllers/question-controller";
import { authenticateJWT } from "../middlewares/auth-middleware";

const router = express.Router();

// add a new question to a specific template (authenticated users only)
router.post("/templates/:templateId/questions", authenticateJWT, addQuestion);

// Edit a question (author or admin only)
router.patch(
  "/templates/:templateId/questions/:questionId",
  authenticateJWT,
  editQuestion
);

// Delete a question (author or admin only)
router.delete(
  "/templates/:templateId/questions/:questionId",
  authenticateJWT,
  deleteQuestion
);

export default router;
