import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCouponVal = joi.object({
  code: joi.string().required(),
  discount: joi.number().required(),
  couponType: generalFields.discountType.required(),
  validFrom: joi
    .date()
    .greater(Date.now() - (24 * 60 * 60 * 1000))
    .required(),
  validTo: joi.date().greater(joi.ref("validFrom")).required(),
});
