import express from "express";
import {
  createReview,
  getProductReviews,
  getAllReviews,
  getMyReviews,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// User
router.get("/product/:productId", getProductReviews);
router.post("/:productId", protect, createReview);
router.get("/my", protect, getMyReviews);
router.delete("/:id", protect, deleteReview);
router.put("/:id", protect, updateReview);


// Admin
router.get("/", protect, isAdmin, getAllReviews);

export default router;
