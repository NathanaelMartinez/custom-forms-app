import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth-routes";
import { initializeAuth } from "./services/auth-service";
import templateRouter from "./routes/template-routes";
import adminRouter from "./routes/admin-routes";
import passport from "passport";

const app = express();

// get .env variables
dotenv.config();

// allow local development
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "http://localhost:5173",
];

// cors config
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Postman has no origin
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "DELETE", "PATCH", "PUT"],
  credentials: true,
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));

// middleware
app.use(express.json());
initializeAuth(); // init passport
app.use(passport.initialize());

// routes
app.use("/api/auth", authRoutes); // authentication routes
app.use("/api/templates", templateRouter); // template and question routes (may require authentication)
app.use("/api/admin", adminRouter); // admin user management routes

// error handling
app.use((req, res, next) => {
  res.status(404).send("Page not found");
});

export default app;
