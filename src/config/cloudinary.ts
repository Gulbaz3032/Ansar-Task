import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load env first
dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    "Cloudinary not fully configured. File uploads will fail if env missing."
  );
} else {
  console.log("Cloudinary config loaded:", {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret?.slice(0, 4) + "****", // partial for debug
  });
}

cloudinary.config({
  cloud_name: cloudName!,
  api_key: apiKey!,
  api_secret: apiSecret!,
});

export default cloudinary;
