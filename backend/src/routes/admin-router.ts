import express from "express";
import { adminTable } from "../controllers/admin-controller";
import {
  authenticateJWT,
  authorizeRoles,
} from "../middlewares/auth-middleware";

const router = express.Router();

// admin only
router.get("/users", authenticateJWT, authorizeRoles("admin"), adminTable);

export default router;
