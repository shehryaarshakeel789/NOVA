import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from "../controllers/productController.js";
import { isAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.get("/", getProducts);
router.get(
  "/alerts/low-stock",
  isAuth,
  authorize("admin"),
  getLowStockProducts,
);
router.get("/:id", getProductById);

router.post("/", isAuth, authorize("admin"), createProduct);
router.put("/:id", isAuth, authorize("admin"), updateProduct);
router.delete("/:id", isAuth, authorize("admin"), deleteProduct);

export default router;
