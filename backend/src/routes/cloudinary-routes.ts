import { v2 as cloudinary } from "cloudinary";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/upload-signature", (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  res.json({ signature, timestamp });
});

export default router;
