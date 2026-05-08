import express from "express";
import Coupon from "../models/coupon.js"; // ✅ REQUIRED

import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon, // 👈 ADD
} from "../controllers/couponController.js";


import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

/**
 * PUBLIC – User coupons
 */
router.get("/public", protect, async (req, res) => {
  try {
    const coupons = await Coupon.find({
      isActive: true,
      expiry: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/**
 * ADMIN routes
 */
router.get("/", protect, isAdmin, getCoupons);
router.post("/", protect, isAdmin, createCoupon);
router.put("/:id", protect, isAdmin, updateCoupon);
router.delete("/:id", protect, isAdmin, deleteCoupon);
router.post("/validate", protect, validateCoupon);


export default router;
