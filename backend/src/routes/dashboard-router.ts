import express from "express";
import { getDashboard } from "../controllers/dashboard-controller";

const router = express.Router();

// accessible to all users
router.get("/home", getDashboard);

export default router;
