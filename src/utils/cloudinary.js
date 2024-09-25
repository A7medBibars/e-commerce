import path from "path";

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve("./config/.env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary;

export const deleteCloudImg = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};
