import express from "express";
import {
  getDashboardStats,
  getSalesOverview,
  getSalesByCountry,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/adminController.js";


import { isAdmin } from "../middleware/adminMiddleware.js";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import { getAllCustomers } from "../controllers/adminController.js";



const router = express.Router();

router.get("/profile", protect, getProfile);
router.get("/dashboard/stats", protect, isAdmin, getDashboardStats);
router.get("/dashboard/sales", protect, isAdmin, getSalesOverview);
router.get("/dashboard/country-sales", protect, isAdmin, getSalesByCountry);
router.get("/customers", protect, isAdmin, getAllCustomers);


// ================================
// ADMIN ORDER MANAGEMENT
// ================================
router.get("/orders", protect, isAdmin, getAllOrders);
router.put("/orders/:id/status", protect, isAdmin, updateOrderStatus);


router.put(
  "/profile",
  protect,
  isAdmin,
  upload.single("profilePicture"),
  updateProfile
);

export default router;
