import { Router } from "express";
import { isValid } from "../../middleware/validation.js";
import { asyncHandler } from "../../utils/appError.js";
import {
  login,
  signup,
  verifyAcc,
  forgetPassword,
  changePassword,
} from "./auth.controller.js";
import { loginVal, signupVal } from "./auth.validation.js";

const authRouter = Router();

authRouter.post("/signup", isValid(signupVal), asyncHandler(signup));
authRouter.get("/verify/:token", asyncHandler(verifyAcc));
authRouter.post("/login", isValid(loginVal), asyncHandler(login));

authRouter.post("/forget-password", asyncHandler(forgetPassword));
authRouter.put("/change-password", asyncHandler(changePassword));

export default authRouter;
