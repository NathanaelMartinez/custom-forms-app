import express from "express";
import {
  createTemplate,
  viewTemplates,
  editTemplate,
  deleteTemplate,
} from "../controllers/template-controller";
import { authenticateJWT } from "../middlewares/auth-middleware";

const router = express.Router();

// create a new template (authenticated users only)
router.post("/templates", authenticateJWT, createTemplate);

// view all templates (available to all users)
router.get("/templates", viewTemplates);

// edit a template (author or admin only)
router.patch("/templates/:id", authenticateJWT, editTemplate);

// delete a template (author or admin only)
router.delete("/templates/:id", authenticateJWT, deleteTemplate);

export default router;
