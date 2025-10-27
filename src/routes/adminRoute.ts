import { Router } from "express";
import { uploadCSV } from "../controllers/adminController";
import { authMiddleware, adminOnly } from "../middlewares/authMiddleware";

const router = Router();

// Admin-only routes
router.post("/upload-csv", authMiddleware, adminOnly, uploadCSV);
router.post("/regenerate-password/:userId", authMiddleware, adminOnly);

export default router;
