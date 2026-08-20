import { Router } from "express";
import { userRegister, userLogin, userMe } from "../controllers/user_controller.js";
import { limitLogin, requireAuth } from "../middlewares/auth_middleware.js";

const router = Router();

// USer routers
router.post("/register", userRegister);
router.post("/login", limitLogin, userLogin);
router.get("/me", requireAuth, userMe);

export default router;
