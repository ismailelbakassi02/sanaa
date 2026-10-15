import express from 'express';
import {
  getPendingApprovals,
  approveUser,
  rejectUser,
  getAllUsers,
  getPlatformMetrics,
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Toutes les routes admin nécessitent l'authentification et le rôle 'admin'
router.use(requireAuth, requireAdmin);

router.get('/pending-approvals', getPendingApprovals);
router.post('/approve-user', approveUser);
router.post('/reject-user', rejectUser);
router.get('/users', getAllUsers);
router.get('/metrics', getPlatformMetrics);

export default router;
