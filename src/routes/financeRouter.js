import {
  createFinance,
  deleteFinance,
  getFinance,
  updateFinance,
} from "../controllers/financeController.js";
import { Router } from "express";

const router = Router();

router.get("/finances", getFinance);
router.post("/finances", createFinance);
router.put("/finances/:id", updateFinance);
router.delete("/finances/:id", deleteFinance);

export default router;
