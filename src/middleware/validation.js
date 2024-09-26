import joi from "joi";
import { AppError } from "../utils/appError.js";
import { discountTypes } from "../utils/constant/enums.js";

const parseArr = (value, helper) => {
  let parsedValue = JSON.parse(value);
  let schema = joi.array().items(joi.string());
  const { error } = schema.validate(parsedValue, { abortEarly: false });
  if (error) {
    return helper("invalid data");
  }
  return true;
};

export const generalFields = {
  name: joi.string(),
  objectId: joi.string().hex().length(24),
  description: joi.string().max(1000),
  price: joi.number().positive().min(0),
  discount: joi.number(),
  stock: joi.number().positive(),
  discountType: joi.string().valid(...Object.values(discountTypes)),
  colors: joi.custom(parseArr),
  sizes: joi.custom(parseArr),
  email: joi.string().email(),
  phone: joi
    .string()
    .pattern(new RegExp(/^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/)),
  password: joi
    .string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ),
  confirmPassword: joi.string().valid(joi.ref("password")),
  DOB: joi.string(),
};

export const isValid = (schema) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      const errArr = [];
      error.details.forEach((err) => {
        errArr.push(err.message);
      });
      return next(new AppError(errArr, 400));
    }
    next();
  };
};
