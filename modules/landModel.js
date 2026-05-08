import mongoose from "mongoose";

const landSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  buttonText: String,
  videoUrl: String,
});

export default mongoose.model("Landing", landSchema);
