import express from "express";
import {
  getUserOrders,
  checkoutOrder,
} from "../controllers/userOrderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// USER – checkout (PAYMENT)
router.post("/checkout", protect, checkoutOrder);

// USER – get own orders
router.get("/my-orders", protect, getUserOrders);

export default router;
