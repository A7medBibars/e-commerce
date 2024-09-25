import { model, Schema } from "mongoose";

//schema
const reviewSchema = new Schema(
  {
    comment: { type: String, required: true },
    rate: { type: Number, min: 1, max: 5, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

//model

export const Review = model("Review", reviewSchema);
