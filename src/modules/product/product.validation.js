import joi from "joi";
import { generalFields } from "../../middleware/validation.js";

export const addProductVal = joi
  .object({
    name: generalFields.name.required(),
    description: generalFields.description.required(),
    category: generalFields.objectId.required(),
    subcategory: generalFields.objectId.required(),
    brand: generalFields.objectId.required(),
    price: generalFields.price.required(),
    discount: generalFields.discount,
    stock: generalFields.stock,
    discountType: generalFields.discountType,
    colors: generalFields.colors,
    sizes: generalFields.sizes,
  })
  .required();

export const updateProductVal = joi.object({
  name: generalFields.name,
  description: generalFields.description,
  category: generalFields.objectId,
  subcategory: generalFields.objectId,
  brand: generalFields.objectId,
  price: generalFields.price,
  discount: generalFields.discount,
  stock: generalFields.stock,
  discountType: generalFields.discountType,
  colors: generalFields.colors,
  sizes: generalFields.sizes,
  productId: generalFields.objectId.required(),
});
