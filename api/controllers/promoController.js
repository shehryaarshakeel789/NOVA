import Promo from "../models/Promo.js";

// Admin: list all promos
export const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find().sort({ createdAt: -1 });
    res.json(promos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin: create
export const createPromo = async (req, res) => {
  try {
    const promo = await Promo.create(req.body);
    res.status(201).json(promo);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "This promo code already exists" });
    }
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin: update
export const updatePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!promo) {
      return res.status(404).json({ message: "Promo not found" });
    }
    res.json(promo);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Admin: delete
export const deletePromo = async (req, res) => {
  try {
    const promo = await Promo.findByIdAndDelete(req.params.id);
    if (!promo) {
      return res.status(404).json({ message: "Promo not found" });
    }
    res.json({ message: "Promo deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Any logged-in user: validate a code against their cart total
export const validatePromo = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    const promo = await Promo.findOne({ code: code.toUpperCase() });

    if (!promo) {
      return res.status(404).json({ message: "Invalid promo code" });
    }
    if (!promo.isActive) {
      return res
        .status(400)
        .json({ message: "This promo code is no longer active" });
    }
    if (promo.expiryDate < new Date()) {
      return res.status(400).json({ message: "This promo code has expired" });
    }
    if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
      return res
        .status(400)
        .json({ message: "This promo code has reached its usage limit" });
    }
    if (cartTotal < promo.minOrderAmount) {
      return res.status(400).json({
        message: `This code requires a minimum order of $${promo.minOrderAmount}`,
      });
    }

    const discountAmount =
      promo.discountType === "percentage"
        ? (cartTotal * promo.discountValue) / 100
        : promo.discountValue;

    res.json({
      code: promo.code,
      discountAmount: Math.min(discountAmount, cartTotal), // never discount below $0
      discountType: promo.discountType,
      discountValue: promo.discountValue,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
