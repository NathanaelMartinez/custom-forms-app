import express from "express";
import { createTemplate } from "../controllers/template-controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/auth-middleware";

const router = express.Router();

// authenticated users only
router.post(
  "/",
  authenticateJWT,
  authorizeRoles("user", "admin"),
  createTemplate
);

export default router;
