export const generateMessages = (entity) => ({
  alreadyExist: `${entity} already exist`,
  notFound: `${entity} not found`,
  deleted: `${entity} deleted successfully`,
  added: `${entity} added successfully`,
  updated: `${entity} updated successfully`,
  failToCreate: `fail to create ${entity}`,
  failToUpdate: `fail to update ${entity}`,
  failToDelete: `fail to delete ${entity}`,
  notAuthorized: `${entity} not authorized to perform this action`,
});

export const messages = {
  category: generateMessages("category"),
  subcategory: generateMessages("subcategory"),
  file: { required: "file is required" },
  brand: generateMessages("brand"),
  product: generateMessages("product"),
  user: {
    ...generateMessages("user"),
    verified: "user verified successfully",
    invalidCredentials: "Invalid Credentials",
    loginSuccessfully: "logged in Successfully",
  },
  review: generateMessages("review"),
  cart: generateMessages("cart"),
  coupon: generateMessages("coupon"),
};
