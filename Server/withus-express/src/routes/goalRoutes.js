import express from 'express';
import goalController from '../controllers/goalController.js';

const router = express.Router();

router.post('/today', goalController.getTodayGoal);
router.post('/photos/before', goalController.uploadBeforePhoto);
router.post('/photos/after', goalController.uploadAfterPhoto);
router.post('/submit', goalController.submitGoal);

module.exports = router;
