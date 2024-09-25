import { User } from "../../../db/index.js";

export const addToWishlist = async (req, res, next) => {
  // get data
  const { productId } = req.body;

  // add to wishlist
  const updatedUser = await User.findByIdAndUpdate(
    req.authUser._id,
    { $addToSet: { wishlist: productId } },
    { new: true }
  );
  res.status(200).json({
    message: `${productId} add to wishlist successfully`,
    data: updatedUser,
    success: true,
  });
};

//get logged in wishlist

export const getWishlist = async (req, res, next) => {
  const user = await User.findById(
    req.authUser._id,
    { wishlist: 1 },
    { populate: [{ path: "wishlist" }] }
  );
  res.status(200).json({
    message: "Get wishlist successfully",
    data: user,
    success: true,
  });
};

//remove from wishlist

export const removeFromWishlist = async (req, res, next) => {
  const { productId } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    req.authUser._id,
    { $pull: { wishlist: productId } },
    { new: true }
  ).select("wishlist");

  res.status(200).json({
    message: `${productId} removed from wishlist successfully`,
    data: updatedUser,
    success: true,
  });
};
