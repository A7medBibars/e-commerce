import { model, Schema } from "mongoose";
import { orderStatus, paymentMethods } from "../../src/utils/constant/enums.js";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: Number,
        finalPrice: Number,
      },
    ],
    address: { type: String, required: true },
    phone: { type: String, required: true },
    coupon: {
      couponId: { type: Schema.Types.ObjectId, ref: "Coupon" },
      code: String,
      discount: Number,
    },
    status: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.PLACED,
    },
    orderPrice: Number,
    finalPrice: Number,
    paymentMethod: {
      type: String,
      enum: Object.values(paymentMethods),
      default: paymentMethods.CASH,
    },
  },
  { timestamps: true }
);

export const Order = model("Order", orderSchema);
