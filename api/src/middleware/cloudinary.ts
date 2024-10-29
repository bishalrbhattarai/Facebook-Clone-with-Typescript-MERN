import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: "dtq4gpmte",
  api_key: "856723178982475",
  api_secret: "Ks0odBQIl1kjdYdmRL3ELXgluVg",
});

export { cloudinary };
