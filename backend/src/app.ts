import "reflect-metadata";
import express from "express";
import authRoutes from "./routes/auth-routes";
import { initializeAuth } from "./services/auth-service";
import templateRouter from "./routes/template-routes";
import adminRouter from "./routes/admin-routes";

const app = express();

// middleware
app.use(express.json());
initializeAuth(); // init passport

// routes
app.use("/auth", authRoutes); // authentication routes
app.use("/templates", templateRouter); // template and question routes (may require authentication)
app.use("/admin", adminRouter); // admin user management routes

// error handling
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

export default app;
