import { Router } from "express";
import { cloudUpload } from "../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { createBrandVal, updateBrandVal } from "./brand.validation.js";
import {
  createBrand,
  deleteBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from "./brand.controller.js";
import { asyncHandler } from "../../utils/appError.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const brandRouter = Router();

brandRouter.post(
  "/add",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  cloudUpload({}).single("logo"),
  isValid(createBrandVal),
  asyncHandler(createBrand)
);
brandRouter.get("/", asyncHandler(getBrands));
brandRouter.get("/:brandId", asyncHandler(getBrandById));

brandRouter.put(
  "/:brandId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  cloudUpload({}).single("logo"),
  isValid(updateBrandVal),
  asyncHandler(updateBrand)
);

brandRouter.delete(
  "/:brandId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  asyncHandler(deleteBrand)
);

export default brandRouter;
