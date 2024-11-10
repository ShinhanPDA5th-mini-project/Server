import express from 'express';
import { getMyPageData } from '../controllers/mypageController.js';
import authenticate from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/mypage', authenticate, getMyPageData);

export default router;
