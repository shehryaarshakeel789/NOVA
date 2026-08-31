import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const {
      category,
      page = 1,
      limit = 12,
      sort,
      isNewArrival,
      isOnSale,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (isNewArrival === "true") filter.isNewArrival = true;
    if (isOnSale === "true") filter.isOnSale = true;

    const sortMap = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      newest: { createdAt: -1 },
    };
    const sortOption = sortMap[sort] || {};

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const products = await Product.find({
      "sizes.stock": { $lt: threshold },
    });

    const alerts = [];
    for (const product of products) {
      for (const sizeEntry of product.sizes) {
        if (sizeEntry.stock < threshold) {
          alerts.push({
            productId: product._id,
            name: product.name,
            image: product.images?.[0],
            size: sizeEntry.size,
            stock: sizeEntry.stock,
          });
        }
      }
    }

    alerts.sort((a, b) => a.stock - b.stock);

    res.json(alerts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
