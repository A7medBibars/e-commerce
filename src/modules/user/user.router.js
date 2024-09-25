import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../utils/appError.js";
import { isValid } from "../../middleware/validation.js";
import { resetPassword } from "./user.controller.js";

const userRouter = Router();

//reset pass
userRouter.put(
  "/reset-password",
  isAuthenticated(),
  asyncHandler(resetPassword)
);

export default userRouter;
