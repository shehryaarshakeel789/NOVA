import mongoose from "mongoose";

const sizeStockSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ["men", "women"],
    },
    color: { type: String },
    sizes: {
      type: [sizeStockSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Product must have at least one size",
      },
    },
    isNewArrival: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
