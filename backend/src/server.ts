import dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./config/data-source";

// get .env variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// initialize connection to PostgreSQL database
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to PostgreSQL database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });
