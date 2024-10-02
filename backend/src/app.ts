import "reflect-metadata";
import express from "express";
import { authenticateJWT, authorizeRoles } from "./middlewares/auth-middleware";
import authRoutes from "./routes/auth-routes";
import { User } from "./models/user";
import { initializeAuth } from "./services/auth-service";

const app = express();

// middleware
app.use(express.json());
initializeAuth(); // init passport

// routes
app.use("/auth", authRoutes); // authentication routes

// protected route placeholder (only authenticated users can access)
app.get("/protected", authenticateJWT, (req, res) => {
  res.send("This is a protected route.");
  return;
});

// admin route placeholder
// app.get("/admin", authenticateJWT, authorizeRoles("admin"), (req, res) => {
//   const user = req.user as User;
//   if (user.role === "admin") {
//     res.send("Admin page");
//     return;
//   } else {
//     res.status(403).json({ error: "You are not an admin" });
//     return;
//   }
// });

export default app;
