import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { asyncHandler } from "../../utils/appError.js";
import { roles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";
import { addCouponVal } from "./coupon.validation.js";
import { addCoupon } from "./coupon.controller.js";

const couponRouter = Router();

couponRouter.post(
  "/",
  isAuthenticated(),
  isAuthorized([roles.ADMIN]),
  isValid(addCouponVal),
  asyncHandler(addCoupon)
);

export default couponRouter;
