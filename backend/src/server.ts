import dotenv from "dotenv";
import app from "./app";
import db from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

// test connection to PostgreSQL database
db.connect()
  .then(() => {
    console.log("Connected to PostgreSQL database");

    // start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1); // exit if db connection fails
  });
