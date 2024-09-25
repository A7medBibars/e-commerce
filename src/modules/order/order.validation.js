import joi from "joi";
import { paymentMethods } from "../../utils/constant/enums.js";
import { generalFields } from "../../middleware/validation.js";
export const createOrderVal = joi.object({
  address: joi.string(),
  phone: joi.string(),
  code: joi.string(),
  paymentMethod: joi.string().valid(...Object.values(paymentMethods)),
});
