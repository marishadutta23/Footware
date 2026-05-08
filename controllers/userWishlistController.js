import User from "../models/User.js";

// GET wishlist
export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
};

// ADD to wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findById(req.user._id);

if (user.wishlist.some(id => id.toString() === productId)) {
  return res.status(400).json({ message: "Already in wishlist" });
}


  user.wishlist.push(productId);
  await user.save();

  res.json({ message: "Added to wishlist" });
};

// REMOVE from wishlist
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.params;

  await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishlist: productId },
  });

  res.json({ message: "Removed from wishlist" });
};
