import { Router } from "express";
import { isAuthorized } from "../../middleware/authorization.js";
import { isAuthenticated } from "../../middleware/authentication.js";
import { roles } from "../../utils/constant/enums.js";
import { addReview, deleteReview } from "./review.controller.js";
import { asyncHandler } from "../../utils/appError.js";

const reviewRouter = Router();

reviewRouter.post(
  "/add",
  isAuthenticated(),
  isAuthorized(Object.values(roles.USER)),
  asyncHandler(addReview)
);
reviewRouter.delete(
  "/:reviewId",
  isAuthenticated(),
  isAuthorized([roles.ADMIN, roles.SELLER]),
  asyncHandler(deleteReview)
);

export default reviewRouter;
