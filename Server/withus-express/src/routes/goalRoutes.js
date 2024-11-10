import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { getTodayGoal, uploadBeforePhoto, uploadAfterPhoto, submitGoal } from '../controllers/goalController.js';

const router = express.Router();

router.post('/today', authenticate, getTodayGoal);
router.post('/photos/before', authenticate, uploadBeforePhoto);
router.post('/photos/after', authenticate, uploadAfterPhoto);
router.post('/submit', authenticate, submitGoal);

export default router;
