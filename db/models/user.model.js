import { model, Schema } from "mongoose";
import { roles, status } from "../../src/utils/constant/enums.js";

// schema
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.USER,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.PENDING,
    },
    active: {
      type: Boolean,
      default: false,
    },
    DOB: {
      type: String,
      default: Date.now(),
    },
    image: {
      secure_url: { type: String, required: false },
      public_id: { type: String, required: false },
    },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    otp: Number,
    otpExpiry: Date,
  },
  { timestamps: true }
);

// model
export const User = model("User", userSchema);
