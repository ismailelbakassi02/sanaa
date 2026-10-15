import { db } from '../services/db.js';

export const getPendingApprovals = (req, res) => {
  const pending = db.getPendingPayments();
  res.status(200).json({
    success: true,
    count: pending.length,
    pending,
  });
};

export const approveUser = (req, res, next) => {
  try {
    const { paymentId } = req.body;
    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Le paramètre paymentId est obligatoire.' });
    }

    const result = db.approvePayment(paymentId, req.user.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Demande de paiement introuvable.' });
    }

    console.log(`✅ [Approbation Admin Réussie]: Paiement ${paymentId} validé par ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Compte étudiant activé avec succès !',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectUser = (req, res, next) => {
  try {
    const { paymentId, reason = 'Reçu illisible ou non conforme.' } = req.body;
    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Le paramètre paymentId est obligatoire.' });
    }

    const result = db.rejectPayment(paymentId, req.user.id, reason);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Demande de paiement introuvable.' });
    }

    res.status(200).json({
      success: true,
      message: 'Paiement rejeté.',
      payment: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = (req, res) => {
  const users = db.getAllUsers();
  res.status(200).json({
    success: true,
    total: users.length,
    users,
  });
};

export const getPlatformMetrics = (req, res) => {
  const users = db.getAllUsers();
  const leadsCount = users.filter((u) => u.status === 'lead').length;
  const pendingCount = users.filter((u) => u.status === 'pending_approval').length;
  const activeCount = users.filter((u) => u.status === 'active' && u.role !== 'admin').length;
  const approvedPayments = db.payments.filter((p) => p.status === 'approved');
  const totalRevenueMAD = approvedPayments.reduce((acc, p) => acc + (p.amount || 0), 0);

  res.status(200).json({
    success: true,
    metrics: {
      totalRegisteredLeads: users.length,
      leadsWaitingToPay: leadsCount,
      pendingVerification: pendingCount,
      activeStudents: activeCount,
      totalRevenueMAD,
    },
  });
};
