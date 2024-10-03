import { Router } from "express";
import { register, login } from "../controllers/auth-controller";

const router = Router();

// user registration route
router.post("/register", register);

// user login route
router.post("/login", login);

export default router;
