import { User } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { messages } from "../../utils/constant/messages.js";
import { comparePassword, hashPassword } from "../../utils/password.js";

export const resetPassword = async (req, res, next) => {
  //get data
  const { oldPass, newPass } = req.body;
  const userId = req.authUser._id;

  //check old pass
  const match = comparePassword({
    password: oldPass,
    hashPassword: req.authUser.password,
  });

  if (!match) {
    return next(new AppError(messages.user.invalidCredentials, 400));
  }
  // new pass
  const newHashPassword = hashPassword({ password: newPass });

  //update
  const updatedUser = await User.updateOne(
    { _id: userId },
    { password: newHashPassword },
    { new: true }
  );

  if (!updatedUser) {
    return next(new AppError(messages.user.failToUpdate, 400));
  }

  return res.status(200).json({
    success: true,
    message: messages.user.passwordUpdated,
  });
};
