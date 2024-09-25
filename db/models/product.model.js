import { model, Schema } from "mongoose";
import { discountTypes } from "../../src/utils/constant/enums.js";

//schema
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mainImg: {
      secure_url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    subImgs: [
      {
        secure_url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
    },
    discountType: {
      type: String,
      enum: Object.values(discountTypes),
      default: discountTypes.FIXED_AMOUNT,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    colors: [String],
    sizes: [String],
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.virtual("finalPrice").get(function () {
  return this.price - this.price * ((this.discount || 0) / 100);
});
productSchema.methods.inStock = function (quantity) {
  return this.stock < quantity ? false : true;
};

//model
export const Product = model("Product", productSchema);
