import { Router } from "express";
import { userRegister, userLogin, userMe } from "../controllers/user_controller.js";


const router = Router();

// USer routers
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/me", userMe);

export default router;
