import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Promo from "../models/Promo.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { orderPlacedEmail } from "../utils/emailTemplates.js";
import { orderStatusEmail, lowStockEmail } from "../utils/emailTemplates.js";
import stripe from "../config/stripe.js";

export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, promoCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orphaned = cart.items.some((item) => !item.product);
    if (orphaned) {
      return res
        .status(400)
        .json({ message: "Some items in your cart are no longer available" });
    }

    const insufficientStock = [];
    for (const item of cart.items) {
      const sizeEntry = item.product.sizes.find((s) => s.size === item.size);
      if (!sizeEntry || sizeEntry.stock < item.quantity) {
        insufficientStock.push(`${item.product.name} (${item.size})`);
      }
    }
    if (insufficientStock.length > 0) {
      return res.status(400).json({
        message: `Not enough stock for: ${insufficientStock.join(", ")}. Please update your cart.`,
      });
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0],
      price: item.product.price,
      quantity: item.quantity,
      size: item.size,
    }));

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let discountAmount = 0;
    let appliedPromoCode = null;

    if (promoCode) {
      const promo = await Promo.findOne({ code: promoCode.toUpperCase() });

      if (!promo) {
        return res.status(400).json({ message: "Invalid promo code" });
      }
      if (!promo.isActive || promo.expiryDate < new Date()) {
        return res
          .status(400)
          .json({ message: "This promo code is no longer valid" });
      }
      if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
        return res
          .status(400)
          .json({ message: "This promo code has reached its usage limit" });
      }
      if (subtotal < promo.minOrderAmount) {
        return res.status(400).json({
          message: `This code requires a minimum order of $${promo.minOrderAmount}`,
        });
      }

      discountAmount =
        promo.discountType === "percentage"
          ? (subtotal * promo.discountValue) / 100
          : promo.discountValue;
      discountAmount = Math.min(discountAmount, subtotal);
      appliedPromoCode = promo.code;

      promo.usedCount += 1;
      await promo.save();
    }

    const totalAmount = subtotal - discountAmount;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      promoCode: appliedPromoCode,
      discountAmount,
      totalAmount,
    });

    const affectedProductIds = cart.items.map((item) => item.product._id);

    for (const item of cart.items) {
      await Product.updateOne(
        { _id: item.product._id, "sizes.size": item.size },
        { $inc: { "sizes.$.stock": -item.quantity } },
      );
    }

    cart.items = [];
    await cart.save();

    res.status(201).json(order);

    sendEmail({
      to: req.user.email,
      subject: "Your NOVA order is confirmed",
      html: orderPlacedEmail(order),
    });

    checkLowStockAndNotify(affectedProductIds);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { shippingAddress, promoCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orphaned = cart.items.some((item) => !item.product);
    if (orphaned) {
      return res
        .status(400)
        .json({ message: "Some items in your cart are no longer available" });
    }

    const insufficientStock = [];
    for (const item of cart.items) {
      const sizeEntry = item.product.sizes.find((s) => s.size === item.size);
      if (!sizeEntry || sizeEntry.stock < item.quantity) {
        insufficientStock.push(`${item.product.name} (${item.size})`);
      }
    }
    if (insufficientStock.length > 0) {
      return res.status(400).json({
        message: `Not enough stock for: ${insufficientStock.join(", ")}. Please update your cart.`,
      });
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    let discountAmount = 0;
    let appliedPromoCode = null;

    if (promoCode) {
      const promo = await Promo.findOne({ code: promoCode.toUpperCase() });
      if (!promo)
        return res.status(400).json({ message: "Invalid promo code" });
      if (!promo.isActive || promo.expiryDate < new Date()) {
        return res
          .status(400)
          .json({ message: "This promo code is no longer valid" });
      }
      if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
        return res
          .status(400)
          .json({ message: "This promo code has reached its usage limit" });
      }
      if (subtotal < promo.minOrderAmount) {
        return res.status(400).json({
          message: `This code requires a minimum order of $${promo.minOrderAmount}`,
        });
      }
      discountAmount =
        promo.discountType === "percentage"
          ? (subtotal * promo.discountValue) / 100
          : promo.discountValue;
      discountAmount = Math.min(discountAmount, subtotal);
      appliedPromoCode = promo.code;
    }

    const lineItems = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: `${item.product.name} (${item.size})` },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    let discounts = [];
    if (discountAmount > 0) {
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100),
        currency: "usd",
        duration: "once",
        name: `Promo ${appliedPromoCode}`,
      });
      discounts = [{ coupon: coupon.id }];
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      discounts,
      success_url: `${process.env.CLIENT_URL}/order-confirmation/pending?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user._id.toString(),
        cartId: cart._id.toString(),
        promoCode: appliedPromoCode || "",
        shippingAddress: JSON.stringify(shippingAddress),
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Something went wrong creating checkout session" });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    try {
      const { userId, cartId, promoCode, shippingAddress } = session.metadata;

      const cart = await Cart.findById(cartId).populate("items.product");
      if (!cart || cart.items.length === 0) {
        console.log("Webhook: cart already processed or empty, skipping");
        return res.status(200).json({ received: true });
      }

      const orderItems = cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0],
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
      }));

      const subtotal = orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      let discountAmount = 0;
      if (promoCode) {
        const promo = await Promo.findOne({ code: promoCode });
        if (promo) {
          discountAmount =
            promo.discountType === "percentage"
              ? (subtotal * promo.discountValue) / 100
              : promo.discountValue;
          discountAmount = Math.min(discountAmount, subtotal);
          promo.usedCount += 1;
          await promo.save();
        }
      }

      const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress: JSON.parse(shippingAddress),
        promoCode: promoCode || null,
        discountAmount,
        totalAmount: subtotal - discountAmount,
        paymentMethod: "card",
        isPaid: true,
        stripeSessionId: session.id,
      });

      for (const item of cart.items) {
        await Product.updateOne(
          { _id: item.product._id, "sizes.size": item.size },
          { $inc: { "sizes.$.stock": -item.quantity } },
        );
      }

      cart.items = [];
      await cart.save();

      const user = await User.findById(userId);

      sendEmail({
        to: user.email,
        subject: "Your NOVA order is confirmed",
        html: orderPlacedEmail(order),
      });

      checkLowStockAndNotify(orderItems.map((i) => i.product));

      res.status(200).json({ received: true });
    } catch (err) {
      console.log("Webhook processing error:", err);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  } else {
    res.status(200).json({ received: true });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).populate("user", "email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);

    sendEmail({
      to: order.user.email,
      subject: "Your NOVA order status has changed",
      html: orderStatusEmail(order),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

async function checkLowStockAndNotify(productIds) {
  try {
    const products = await Product.find({ _id: { $in: productIds } });

    const alerts = [];
    for (const product of products) {
      for (const sizeEntry of product.sizes) {
        if (sizeEntry.stock < 5) {
          alerts.push({
            name: product.name,
            size: sizeEntry.size,
            stock: sizeEntry.stock,
          });
        }
      }
    }

    if (alerts.length > 0) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "NOVA: Low stock alert",
        html: lowStockEmail(alerts),
      });
    }
  } catch (err) {
    console.log("Low stock check failed:", err.message);
  }
}

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const formatted = topProducts.map((p) => ({
      productId: p._id,
      name: p.name,
      totalSold: p.totalSold,
      totalRevenue: p.totalRevenue,
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOrdersByStatus = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const formatted = stats.map((entry) => ({
      status: entry._id,
      count: entry.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getRevenueStats = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formatted = stats.map((entry) => ({
      date: entry._id,
      totalRevenue: entry.totalRevenue,
      orderCount: entry.orderCount,
    }));

    res.json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getOrderBySessionId = async (req, res) => {
  try {
    const order = await Order.findOne({
      stripeSessionId: req.params.sessionId,
    });
    if (!order) return res.status(404).json({ message: "Not found yet" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
