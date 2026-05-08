import Product from "../models/product.js";
import Banner from "../models/banners.js";

export const getHomeData = async (req, res) => {
  try {
    const banners = await Banner.find();
    const products = await Product.find({ featured: true }).limit(4);

    res.json({ banners, products });
  } catch (error) {
    res.status(500).json({ message: "Failed to load home data" });
  }
};
