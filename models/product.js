import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    sku: String,
    brand: String,

    description: {
      type: String,
      required: true,
    },

    images: [String],
    sizes: [Number],

    details: [
      {
        title: String,
        content: String,
      },
    ],

    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },

    category: {
      type: String,
      enum: ["men", "women", "all"],
    },

    type: {
      type: String,
      enum: ["sneakers", "heels", "crocs", "shoes", "chappals"],
    },
    status: {
  type: String,
  enum: ["Available", "Few Left", "Out of Stock"],
  default: "Available",
},


    price: Number,
    stock: Number,
    featured: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
