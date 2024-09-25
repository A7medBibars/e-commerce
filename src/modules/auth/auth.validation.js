import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const signupVal = joi.object({
  userName: generalFields.name.required(),
  email: generalFields.email.required(),
  phone: generalFields.phone.required(),
  password: generalFields.password.required(),
  confirmPassword: generalFields.password.required(),
  // DOB: generalFields.DOB.optional(),
});

export const loginVal = joi.object({
  phone: generalFields.phone.when('email',{
    is:joi.exist(),
    then:joi.optional(),
    otherwise:joi.required()
  }),
  email: generalFields.email.required(),
  password: generalFields.password.required(),
});