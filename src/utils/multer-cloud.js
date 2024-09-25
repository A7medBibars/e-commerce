import fs from "fs";
import path from "path";
import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";

const fileValidation = {
  image: ["image/jpeg", "image/png"],
  pdf: ["application/pdf"],
  doc: ["application/msword"],
  vid: ["video/mp4"],
};
export const cloudUpload = ({ allowFile = fileValidation.image }) => {
  const storage = diskStorage({});

  const fileFilter = (req, file, cb) => {
    if (allowFile.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("invalid file format"), false);
  };

  return multer({ storage, fileFilter });
};
