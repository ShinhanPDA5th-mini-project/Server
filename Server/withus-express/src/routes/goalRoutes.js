import express from 'express';
import { getTodayGoal, uploadBeforePhoto, uploadAfterPhoto, submitGoal } from '../controllers/goalController.js';

const router = express.Router();

router.post('/today', getTodayGoal);
router.post('/photos/before', uploadBeforePhoto);
router.post('/photos/after', uploadAfterPhoto);
router.post('/submit', submitGoal);

export default router;
