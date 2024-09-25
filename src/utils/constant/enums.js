export const discountTypes = {
  PERCENTAGE: "percentage",
  FIXED_AMOUNT: "fixedAmount",
};
Object.freeze(discountTypes);

export const roles = {
  USER: "user",
  ADMIN: "admin",
  SELLER: "seller",
};
Object.freeze(roles);

export const status = {
  // ACTIVE: "active",
  PENDING: "pending",
  VERIFIED: "verified",
  BLOCKED: "blocked",
};
Object.freeze(status);

export const orderStatus = {
  PLACED: "placed",
  SHIPPING: "shipping",
  DELIVERED: "delivered",
  CANCELED: "canceled",
  REFUNDED: "refunded",
};
Object.freeze(orderStatus);

export const paymentMethods = {
  CASH: "cash",
  VISA: "visa",
};
Object.freeze(paymentMethods);
