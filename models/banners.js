import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  buttonText: String,
  image: String, // Cloudinary URL
});

export default mongoose.model("Banner", bannerSchema);
