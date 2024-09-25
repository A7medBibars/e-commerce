import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addCatVal = joi.object({
  name: generalFields.name.required(),
});

export const updateCatVal = joi.object({
  name: generalFields.name,
  categoryId: generalFields.objectId.required(),
});

export const deleteCatVal = joi.object({
  categoryId: generalFields.objectId.required(),
});