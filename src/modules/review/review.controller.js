import { Product, Review } from "../../../db/index.js";
import { roles } from "../../utils/constant/enums.js";
import { messages } from "../../utils/constant/messages.js";

export const addReview = async (req, res, next) => {
  // get data
  const { productId, rate, comment } = req.body;


  // check if user has already reviewed this product
  const reviewExist = await Review.findOneAndUpdate(
    {
      product: productId,
      user: req.authUser._id,
    },
    { rate, comment }
  );
  let data = reviewExist;
  if (!reviewExist) {
    const review = new Review({
      product: productId,
      user: req.authUser._id,
      rate,
      comment,
    });
    const createdReview = await review.save();
    if (!createdReview) {
      return next(new AppError(messages.review.failToCreate, 500));
    }
    data = createdReview;
  }
  //update rate
  const rating = await Review.find({ product: productId }).select("rate");
  let avgRate = rating.reduce((acc, curr) => {
    return (acc += curr);
  }, 0);
  avgRate = avgRate / rating.length;
  await Product.findByIdAndUpdate(productId, { rate: avgRate });
  res.status(201).json({
    message: messages.review.added,
    success: true,
    data,
  });
};

// delete review
export const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const reviewExist = await Review.findById(reviewId);
  if (!reviewExist) {
    return next(new AppError(messages.review.notFound, 404));
  }
  if (
    reviewExist.user.toString() != req.authUser._id.toString() &&
    req.authUser.role != roles.ADMIN
  ) {
    return next(new AppError(messages.review.notAuthorized, 403));
  }
  await Review.deleteOne({ _id: reviewId });
  res.status(200).json({
    message: messages.review.deleted,
    success: true,
  });
};
