import { model, Schema } from "mongoose";

//Schema
const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    couponType: {
      type: String,
      enum: ["fixed", "percentage"],
      //   required: true,
      default: "fixed",
    },
    validFrom: {
      type: String,
      required: true,
    },
    validTo: {
      type: String,
      required: true,
    },
    assignedUsers: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        maxUse: {
          type: Number,
          max: 5,
        },
        usedCount: {
          type: Number,
          default: 0,
        },
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    //   required: true,
    },
  },
  { timestamps: true }
);

//model

export const Coupon = model("Coupon", couponSchema);
