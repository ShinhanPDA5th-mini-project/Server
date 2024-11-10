// routes/kakaoAuthRoutes.js
import express from "express";
import { kakaoLogin, logout } from "../controllers/kakaoAuthController.js";
import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

// 카카오 로그인 콜백
router.get('/callback', kakaoLogin);

// 로그아웃
router.post('/logout', authenticate, logout);

export default router;
