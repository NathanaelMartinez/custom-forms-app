import express from "express";
import {
  createTemplate,
  viewTemplates,
  editTemplate,
  deleteTemplate,
  getTemplate,
  searchTemplatesController,
  likeTemplate,
} from "../controllers/template-controller";
import {
  authenticateJWT,
  checkIfNotBlocked,
} from "../middlewares/auth-middleware";
import {
  getResponsesAggregate,
  submitResponse,
} from "../controllers/response-controller";
import {
  addCommentToTemplate,
  getCommentsForTemplate,
} from "../controllers/comment-controller";

const router = express.Router();

// create a new template (authenticated users only)
router.post("/", authenticateJWT, checkIfNotBlocked, createTemplate);

// view all templates (available to all users and non-users)
router.get("/", viewTemplates);

// route for searching templates (must go before generic :id routes)
router.get("/search", searchTemplatesController);

// get a specific template (author or admin only)
router.get("/:templateId", getTemplate);

// edit a template (author or admin only)
router.put("/:templateId", authenticateJWT, checkIfNotBlocked, editTemplate);

// delete a template (author or admin only)
router.delete(
  "/:templateId",
  authenticateJWT,
  checkIfNotBlocked,
  deleteTemplate
);

// submit form responses
router.post("/:templateId/responses", authenticateJWT, submitResponse);
router.get("/:templateId/aggregate", authenticateJWT, getResponsesAggregate);

router.get("/:templateId/comments", getCommentsForTemplate);
router.post("/:templateId/comments", authenticateJWT, addCommentToTemplate);

router.post("/:templateId/like", authenticateJWT, likeTemplate);

export default router;
