import mongoose from "mongoose";

import Product from "../models/product.js";
import cloudinary from "../config/cloudinary.js";

// GET all products
export const getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
};

// GET single product by ID
export const getProductById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};


// CREATE product (with image)
export const createProduct = async (req, res) => {
  try {
    console.log("HEADERS 👉", req.headers["content-type"]);
    console.log("BODY 👉", req.body);
    console.log("FILES 👉", JSON.stringify(req.files, null, 2));

    const body = req.body || {};

    if (!body.name || !body.sku || !body.description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!body.category || !body.type) {
      return res.status(400).json({ message: "Category and type are required" });
    }

    let sizes = [];
    try {
      sizes = body.sizes ? JSON.parse(body.sizes) : [];
    } catch {
      sizes = [];
    }

    let details = [];
    try {
      details = body.details ? JSON.parse(body.details) : [];
    } catch {
      details = [];
    }

    const imageUrls =
      req.files?.map((file) => file.path || file.secure_url) || [];

    if (!imageUrls.length) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const product = await Product.create({
      name: body.name,
      sku: body.sku,
      brand: body.brand || "",
      description: body.description.trim(),
      details,
      category: body.category,
      type: body.type,
      price: Number(body.price),
      stock: Number(body.stock),
      sizes,
      images: imageUrls,
      status: body.status || "Available",
      rating: 0,
      reviewsCount: 0,
    });

    res.status(201).json(product);
  } catch (err) {
  console.error("CREATE PRODUCT ERROR 👉", err);

  res.status(500).json({
    message: err?.message || JSON.stringify(err),
  });
}

};




// UPDATE product (optional image update)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Append new images (already uploaded by multer)
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map((file) => file.path);
      product.images.push(...imageUrls);
    }

    // ✅ Update fields
// Update only if field exists in body
if (req.body.name !== undefined) product.name = req.body.name;
if (req.body.sku !== undefined) product.sku = req.body.sku;
if (req.body.brand !== undefined) product.brand = req.body.brand;
if (req.body.description !== undefined) product.description = req.body.description;
if (req.body.category !== undefined) product.category = req.body.category;
if (req.body.type !== undefined) product.type = req.body.type;
if (req.body.price !== undefined) product.price = Number(req.body.price);
if (req.body.stock !== undefined) product.stock = Number(req.body.stock);

    if (req.body.sizes) {
      product.sizes = JSON.parse(req.body.sizes);
    }

    if (req.body.details) {
      product.details = JSON.parse(req.body.details);
    }

    await product.save();
    res.json(product);

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR 👉", err.message);
    res.status(500).json({ message: err.message });
  }
};


// DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: "Product deleted" });
  } catch (err) {
  console.error("ERROR 👉", err.message);
  res.status(500).json({ message: err.message });
}

};

