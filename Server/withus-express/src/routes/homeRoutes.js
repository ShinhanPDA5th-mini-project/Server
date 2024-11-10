import express from 'express';
import { getMainPageData } from '../controllers/homeController.js';

const router = express.Router();
// 메인 페이지 조회
router.get('/main', getMainPageData);

export default router;