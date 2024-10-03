import express from "express";
import {
  editQuestion,
  deleteQuestion,
} from "../controllers/question-controller";
import { authenticateJWT } from "../middlewares/auth-middleware";

const router = express.Router();

// Edit a question (author or admin only)
router.patch("/:id", authenticateJWT, editQuestion);

// Delete a question (author or admin only)
router.delete("/:id", authenticateJWT, deleteQuestion);

export default router;
