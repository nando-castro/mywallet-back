import { getUser, signIn, signUp } from "../controllers/authController.js";
import { Router } from 'express';

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);

router.get("/sign-in", getUser);

export default router;