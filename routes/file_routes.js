import { Router } from "express";
import { requiresAuth } from "../middlewares/auth_middleware.js";
import { filesDownloadById, filesGet, filesGetById } from "../controllers/file_controller.js";

const router = Router();

// File routes
router.get("/", requiresAuth, filesGet);
router.get("/:id", requiresAuth, filesGetById);
router.get("/:id/download", requiresAuth, filesDownloadById);

export default router;