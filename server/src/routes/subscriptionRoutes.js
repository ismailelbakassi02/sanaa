import express from 'express';
import { getPlans, uploadReceipt, instantPayPalSuccess } from '../controllers/subscriptionController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';
import { uploadReceipt as uploadMiddleware } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/plans', getPlans);
router.post('/upload-receipt', requireAuth, uploadMiddleware.single('receipt'), uploadReceipt);
router.post('/paypal-success', requireAuth, instantPayPalSuccess);

export default router;
