// mypageRoutes.js
import express from 'express';
import { renderMyPage, serverMypage } from '../controllers/mypageController.js';

const router = express.Router();

// /navigate-to-mypage 라우트
//router.get('/navigate-to-mypage', renderMyPage);

// /api/mypage 라우트
router.get('/api/mypage', serverMypage);

export default router;
