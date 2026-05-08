import express from "express";
import multer from "multer";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";

const router = express.Router();
//const upload = multer({ dest: "uploads/" });

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", upload.array("images", 6), createProduct);

router.put("/:id", upload.array("images", 6), updateProduct);

router.delete("/:id", deleteProduct);

export default router;
