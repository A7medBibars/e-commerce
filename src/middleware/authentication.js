import { User } from "../../db/models/user.model.js";
import { AppError } from "../utils/appError.js";
import { status } from "../utils/constant/enums.js";
import { messages } from "../utils/constant/messages.js";
import { verifyToken } from "../utils/token.js";

export const isAuthenticated = () => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    const [bearer, token] = authorization.split(" ")[0];
    let result = "";
    if (bearer == "access-token") {
      result = verifyToken({
        token,
        secretKey: process.env.secretKeyAccessToken,
      });
    } else if (bearer == "reset-pass") {
      result = verifyToken({
        token,
        secretKey: process.env.secretKeyResetPass,
      });
    }

    if (result.message) {
      return next(new AppError(result.message, 401));
    }
    // check user
    const user = await User.findOne({
      _id: result._id,
      status: status.VERIFIED,
    }).select("-password");
    if (!user) {
      return next(new AppError(messages.user.notFound, 404));
    }
    req.authUser = user;
    next();
  };
};
