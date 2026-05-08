import Review from "../models/reviews.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
/**
 * CREATE review (User)
 */
export const createReview = async (req, res) => {
  const { rating, feedback } = req.body;
  const productId = req.params.productId;

  try {
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      feedback,
    });

    // ✅ Recalculate product rating
const reviews = await Review.find({ product: productId });

const avgRating =
  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

await Product.findByIdAndUpdate(productId, {
  rating: avgRating,
  reviewsCount: reviews.length,
});


    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * GET reviews for a product
 */
//import mongoose from "mongoose";

export const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const reviews = await Review.find({ product: productId })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("GET PRODUCT REVIEWS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET all reviews (Admin)
 */
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "fullName email")
      .populate("product", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// controllers/reviewController.js

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("product", "name images price")

      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Not found" });
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  const productId = review.product;

  await review.deleteOne();

  // ✅ Recalculate rating after delete
const reviews = await Review.find({ product: productId });
const avg =
  reviews.reduce((a, r) => a + r.rating, 0) / reviews.length || 0;

await Product.findByIdAndUpdate(productId, {
  rating: avg,
  reviewsCount: reviews.length
});


  res.json({ message: "Review deleted" });
};


export const updateReview = async (req, res) => {
  const { rating, feedback } = req.body;

  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  review.rating = rating;
  review.feedback = feedback;

  await review.save();

  res.json(review);
};
