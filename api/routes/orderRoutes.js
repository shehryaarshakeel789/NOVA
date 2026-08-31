import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getTopProducts,
  getOrdersByStatus,
  getRevenueStats,
  getOrderBySessionId,
} from "../controllers/orderController.js";
import { isAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";
import { createCheckoutSession } from "../controllers/orderController.js";

const router = express.Router();

router.use(isAuth);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/stats/top-products", authorize("admin"), getTopProducts);
router.get("/stats/by-status", authorize("admin"), getOrdersByStatus);
router.get("/stats/revenue", authorize("admin"), getRevenueStats);
router.post("/create-checkout-session", createCheckoutSession);
router.get("/by-session/:sessionId", getOrderBySessionId);
router.get("/:id", getOrderById);

router.get("/", authorize("admin"), getAllOrders);
router.put("/:id/status", authorize("admin"), updateOrderStatus);

export default router;
