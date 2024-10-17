import { Router } from "express";
import { cloudUpload } from "./../../utils/multer-cloud.js";
import { isValid } from "../../middleware/validation.js";
import { addProductVal, updateProductVal } from "./product.validation.js";
import { asyncHandler } from "../../utils/appError.js";
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
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

//update product
productRouter.put(
  "/:productId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  cloudUpload({ folder: "product" }).fields([
    { name: "mainImg", maxCount: 1 },
    { name: "subImgs", maxCount: 10 },
  ]),
  isValid(updateProductVal),
  asyncHandler(updateProduct)
);

//delete product

productRouter.delete(
  "/:productId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  asyncHandler(deleteProduct)
);

export default productRouter;
