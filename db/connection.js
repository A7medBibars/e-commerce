import mongoose from "mongoose";

export const connectDB = () => {
  return mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("fail to connect to db "));
};
