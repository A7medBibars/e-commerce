import { Coupon } from "../../../db/index.js";
import { AppError } from "../../utils/appError.js";
import { discountTypes } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";

export const addCoupon = async (req, res, next) => {
  // get data
  let { code, discount, couponType, validFrom, validTo } = req.body;

  //check code existence
  const couponExist = await Coupon.findOne({ code });
  if (couponExist) {
    return next(new AppError(messages.coupon.alreadyExist, 409));
  }

  //check amount
  if (couponType == discountTypes.PERCENTAGE && discount < 100) {
    return next(new AppError("must be between 0 , 100", 400));
  }

  const coupon = new Coupon({
    code,
    discount,
    couponType,
    validFrom,
    validTo,
    createdBy: req.authUser._id,
  });
  const createdCoupon = await coupon.save();
  if (!createdCoupon) {
    return next(new AppError(messages.coupon.failToCreate, 500));
  }
  res.status(201).json({
    message: messages.coupon.added,
    success: true,
    data: createdCoupon,
  });
};
