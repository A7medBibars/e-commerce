import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { isValid } from "../../middleware/validation.js";
import { roles } from "../../utils/constant/enums.js";
import { asyncHandler } from "../../utils/appError.js";
import { createOrder } from "./order.controller.js";
import { createOrderVal } from "./order.validation.js";

const orderRouter = Router()

orderRouter.post(
    "/",
    isAuthenticated(),
    isAuthorized([roles.USER]),
    isValid(createOrderVal),
    asyncHandler(createOrder)
)


export default orderRouter