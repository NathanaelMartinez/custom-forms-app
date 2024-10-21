import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUD_API_KEY;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

export const uploadImageToCloudinary = async (file: File) => {
  try {
    // fetch signature and timestamp from backend
    const { data } = await axios.post(`${SERVER_URL}/api/upload-signature`);
    const { signature, timestamp } = data;

    // reate payload upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET!);
    formData.append("api_key", CLOUDINARY_API_KEY!);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    // upload to cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // return URL of uploaded image for saving in db
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary", error);
    throw error;
  }
};
