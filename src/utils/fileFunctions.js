import fs from "fs";
import path from "path";

export const deleteFile = (filePath) => {
  let fullPath = path.resolve(filePath);
  fs.unlinkSync(fullPath);
};

export const deleteCloud = async (public_id) => {
  await cloudinary.uploader.destroy(public_id);
};
