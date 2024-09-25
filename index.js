import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./db/connection.js";
import { globalErrorHandler } from "./src/utils/appError.js";
import { scheduleJob } from "node-schedule";
// import categoryRouter from "./src/modules/category/category.router.js";
// import subcategoryRouter from "./src/modules/subcategory/subcategory.router.js";
// import brandRouter from "./src/modules/brand/brand.router.js";
// import productRouter from "./src/modules/product/product.router.js";
import * as allRouters from "./src/index.js";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config({ path: path.resolve("./config/.env") });

connectDB();

app.use(express.json());
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

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
