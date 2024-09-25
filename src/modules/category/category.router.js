import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import {
  addCatVal,
  deleteCatVal,
  updateCatVal,
} from "./category.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import {
  addCategory,
  deleteCategory,
  getCategory,
  getCategoryById,
  updateCategory,
} from "./category.controller.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";

const categoryRouter = Router();

categoryRouter.post(
  "/add",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  fileUpload({ folder: "category" }).single("image"),
  isValid(addCatVal),
  asyncHandler(addCategory)
);

categoryRouter.get("/", asyncHandler(getCategory));

categoryRouter.get("/:categoryId", asyncHandler(getCategoryById));

categoryRouter.put(
  "/:categoryId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  fileUpload({ folder: "category" }).single("image"),
  isValid(updateCatVal),
  asyncHandler(updateCategory)
);

categoryRouter.delete(
  "/:categoryId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  isValid(deleteCatVal),
  asyncHandler(deleteCategory)
);

export default categoryRouter;
