import fs from "fs";
import { deleteCloud, deleteFile } from "./fileFunctions.js";
import { deleteCloudImg } from "./cloudinary.js";
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// asyncHandler
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return next(new AppError(err.message, err.statusCode));
    });
  };
};

// global error handling
export const globalErrorHandler = async (err, req, res, next) => {
  if (req.file) {
    // deleteFile(req.file.path);
    deleteCloud(req.file.path);
  }
  if (req.failImage) {
    for (const public_id of failImage) {
      await deleteCloud(public_id);
    }
  }
  return res.status(err.statusCode || 500).json({
    message: err.message,
    success: false,
  });
};
