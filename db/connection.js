import mongoose from "mongoose";

export const connectDB = () => {
  return mongoose
    .connect("mongodb://localhost:27017/e-comm")
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("fail to connect to db "));
};
