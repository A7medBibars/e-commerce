import { Cart, Product } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";

export const addToCart = async (req, res, next) => {
  // get data
  const { productId, quantity } = req.body;

  // check existence
  const productExist = await Product.findById(productId);
  if (!productExist) {
    return next(new AppError(messages.product.notFound, 404));
  }
  //check stock
  if (!productExist.inStock(quantity)) {
    return next(new AppError("out Of Stock", 400));
  }
  let data = "";
  const productInCart = await Cart.findOneAndUpdate(
    {
      user: req.authUser._id,
      "products.product": productId,
    },
    {
      $set: { "products.$.quantity": quantity },
    },
    { new: true }
  );
  let message = messages.cart.updated;
  data = productInCart;
  if (!productInCart) {
    const cart = await Cart.findOneAndUpdate(
      { user: req.authUser._id },
      { $push: { products: { product, quantity } } },
      { new: true }
    );
    message = "product add to cart";
    data = cart;
  }

  return res.status(200).json({
    message,
    success: true,
    data,
  });
};
