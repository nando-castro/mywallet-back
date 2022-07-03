import { createFinance, deleteFinance, getFinance, updateFinance } from "../controllers/financeController.js";
import { Router } from 'express';

const router = Router();

router.get("/finances", getFinance);
router.post("/finances", createFinance);
router.delete("/finances/:id", deleteFinance);
router.put("/finances/:id", updateFinance);

export default router;
