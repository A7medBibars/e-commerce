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
export const fileUpload = ({ folder, allowFile = fileValidation.image }) => {
  const storage = diskStorage({
    destination: function (req, file, cb) {
      const fullPath = path.resolve(`uploads/${folder}`);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, `uploads/${folder}`);
    },
    filename: function (req, file, cb) {
      cb(null, nanoid() + "_" + file.originalname);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowFile.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("invalid file format"), false);
  };

  return multer({ storage, fileFilter });
};
