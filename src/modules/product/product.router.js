import { Router } from "express";
import { cloudUpload } from "./../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { addProductVal } from "./product.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
} from "./product.controller.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";

const productRouter = Router();

productRouter.post(
  "/add",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  cloudUpload({ folder: "product" }).fields([
    { name: "mainImg", maxCount: 1 },
    { name: "subImgs", maxCount: 10 },
  ]),
  isValid(addProductVal),
  asyncHandler(addProduct)
);
//getters
productRouter.get("/", asyncHandler(getAllProducts));
productRouter.get("/:productId", asyncHandler(getProductById));

// todo authen & autho (update product)

// todo authen & autho (delete product)

export default productRouter;
