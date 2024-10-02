import "reflect-metadata";
import express from "express";
import { authenticateJWT, authorizeRoles } from "./middlewares/auth-middleware";
import authRoutes from "./routes/auth-router";
import { User } from "./models/user";
import { initializeAuth } from "./services/auth-service";
import dashboardRouter from "./routes/dashboard-router";
import templateRouter from "./routes/template-router";
import adminRouter from "./routes/admin-router";

const app = express();

// middleware
app.use(express.json());
initializeAuth(); // init passport

// routes
app.use("/auth", authRoutes); // authentication routes
app.use("/", dashboardRouter); // public dashboard routes
app.use("/templates", templateRouter); // template routes (may require authentication)
app.use("/admin", adminRouter); // admin user management routes

// error handling
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

export default app;
