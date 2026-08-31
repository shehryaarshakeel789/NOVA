import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          if (this.discountType === "flat" && this.minOrderAmount) {
            return value <= this.minOrderAmount;
          }
          return true;
        },
        message: "Flat discount value cannot exceed the minimum order amount",
      },
    },
    minOrderAmount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Promo = mongoose.model("Promo", promoSchema);

export default Promo;
