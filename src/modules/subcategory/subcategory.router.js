import { Router } from "express";
import { fileUpload } from "../../utils/multer.js";
import { isValid } from "../../middleware/validation.js";
import { addSubCatVal } from "./subcategory.validation.js";
import {
  addSubCategory,
  deleteSubCategory,
  getSubCategory,
  updateSubCategory,
} from "./subcategory.controller.js";
import { asyncHandler } from "../../utils/appError.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const subcategoryRouter = Router();

subcategoryRouter.post(
  "/add",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  fileUpload({ folder: "subcategory" }).single("image"),
  isValid(addSubCatVal),
  asyncHandler(addSubCategory)
);
// get sub cat
subcategoryRouter.get("/:categoryId", asyncHandler(getSubCategory));
// update sub cat
subcategoryRouter.put(
  "/:categoryId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  asyncHandler(updateSubCategory)
);
// delete sub cat
subcategoryRouter.delete(
  "/:categoryId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  asyncHandler(deleteSubCategory)
);

export default subcategoryRouter;
