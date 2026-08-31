import express from "express";
import {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo,
  validatePromo,
} from "../controllers/promoController.js";
import { isAuth } from "../middleware/auth.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

router.use(isAuth);

router.post("/validate", validatePromo);

router.get("/", authorize("admin"), getPromos);
router.post("/", authorize("admin"), createPromo);
router.put("/:id", authorize("admin"), updatePromo);
router.delete("/:id", authorize("admin"), deletePromo);

export default router;
