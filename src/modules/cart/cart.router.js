import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../utils/appError.js";
import { addToCart } from "./cart.controller.js";

const cartRouter = Router();

cartRouter.post("/",
    isAuthenticated(),
    isAuthorized([roles.USER]),
    asyncHandler(addToCart)
)


export default cartRouter;
