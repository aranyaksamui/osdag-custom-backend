import { Router } from "express";
import { userRegister, userLogin, userMe, userLogout } from "../controllers/user_controller.js";
import { limitLogin, requiresAuth } from "../middlewares/auth_middleware.js";

const router = Router();

// USer routes
router.post("/register", userRegister);
router.post("/login", limitLogin, userLogin);
router.get("/me", requiresAuth, userMe);
router.post("/logout", userLogout);

export default router;
