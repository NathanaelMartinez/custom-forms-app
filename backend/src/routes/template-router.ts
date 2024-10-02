import express from "express";
import {
  createTemplate,
  viewTemplates,
  editTemplate,
  deleteTemplate,
} from "../controllers/template-controller";
import { authenticateJWT } from "../middlewares/auth-middleware";

const router = express.Router();

// Create a new template (authenticated users only)
router.post("/templates", authenticateJWT, createTemplate);

// View all templates (available to all users)
router.get("/templates", viewTemplates);

// Edit a template (author or admin only)
router.patch("/templates/:id", authenticateJWT, editTemplate);

// Delete a template (author or admin only)
router.delete("/templates/:id", authenticateJWT, deleteTemplate);

export default router;
