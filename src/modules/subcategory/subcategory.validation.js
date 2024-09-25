import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addSubCatVal = joi.object({
  name: generalFields.name.required(),
  categoryId: generalFields.objectId.required(),
});
