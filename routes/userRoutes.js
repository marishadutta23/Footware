import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfileController.js";

import { getUserOrders } from "../controllers/userOrderController.js";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../controllers/userWishlistController.js";

const router = express.Router();

router.get("/orders", protect, getUserOrders);

router.get("/profile", protect, getUserProfile);




router.put(
  "/profile",
  protect,
  upload.single("profilePicture"),
  updateUserProfile
);

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

export default router;
