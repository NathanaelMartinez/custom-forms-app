import { Router } from "express";
import { getUserResponses } from "../controllers/user-controller";
import { authenticateJWT } from "../middlewares/auth-middleware";

const router = Router();

router.get("/:userId/responses", authenticateJWT, getUserResponses);

export default router;
