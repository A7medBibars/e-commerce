import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./db/connection.js";
import { asyncHandler, globalErrorHandler } from "./src/utils/appError.js";
import { scheduleJob } from "node-schedule";
// import categoryRouter from "./src/modules/category/category.router.js";
// import subcategoryRouter from "./src/modules/subcategory/subcategory.router.js";
// import brandRouter from "./src/modules/brand/brand.router.js";
// import productRouter from "./src/modules/product/product.router.js";
import * as allRouters from "./src/index.js";
import { Cart, Order, Product } from "./db/index.js";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config({ path: path.resolve("./config/.env") });

connectDB();
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"].toString();
    const stripe = new Stripe(process.env.STRIPE_KEY);
    let event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      "whsec_qrf2bMLixRrrA8TfJvhpVnxgjWC0NVAM"
    );

    if (event.type == "checkout.session.completed") {
      const checkout = event.data.object;
      const orderId = checkout.metadata.orderId;
      const cartId = checkout.metadata.cartId;
      // clear cart
      const cart = await Cart.findByIdAndUpdate(cartId, { products: [] });
      // update order status
      const order = await Order.findByIdAndUpdate(orderId, {
        status: "placed",
      });
      let products = cart.products;
      console.log({ products });

      for (const product of products) {
        const result = await Product.findByIdAndUpdate(product.product, {
          $inc: { stock: -product.quantity },
        });
        console.log({ result });
      }
    }

    // Return a 200 res to acknowledge receipt of the event
    res.json({ message: "WebHookED" });
  })
);

app.use(express.json());
app.use("*", (req, res, next) => {
  return res.json({ message: "invalid url" });
});
app.use("/category", allRouters.categoryRouter);
app.use("/subcategory", allRouters.subcategoryRouter);
app.use("/brand", allRouters.brandRouter);
app.use("/product", allRouters.productRouter);
app.use("/auth", allRouters.authRouter);
app.use("/review", allRouters.reviewRouter);
app.use("/wishlist", allRouters.wishlistRouter);
app.use("/cart", allRouters.cartRouter);
app.use("/coupon", allRouters.couponRouter);
app.use("/order", allRouters.orderRouter);
app.use("/user", allRouters.userRouter);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


const job = scheduleJob("1 1 1 * * *", async function () {
  const deletedUsers = await User.find({
    status: "deleted",
    updatedAt: { $lte: Date.now() - 3 * 30 * 24 * 60 * 60 * 1000 },
  }); // [{}],[]
  const userIds = deletedUsers.map((user) => user._id);
  console.log(deletedUsers);

  await User.deleteMany({ _id: { $in: userIds } });
});