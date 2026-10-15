import { db } from '../services/db.js';

export const getPlans = (req, res) => {
  const plans = [
    {
      id: 'plan_masterclass_lifetime',
      name: 'صَنْعة: ماستركلاس الإخراج الوثائقي (Accès Complet à Vie)',
      priceMAD: 2500,
      priceUSD: 250,
      description: 'الوصول الكامل إلى جميع ورشات العمل، تحليلات المشاهد، ملفات العمل، وتحديثات الدورة مدى الحياة.',
      features: [
        'أكثر من 15 ساعة من التدريب السينمائي والوثائقي المكثف',
        'مشغل محمي بأعلى جودة مع علامة مائية لمنع السرقة',
        'ملفات مشاريع تطبيقية وقوالب إنتاج جاهزة (PDF / Assets)',
        'شهادة إتمام معتمدة من استوديو عبد الإله بحيحي',
        'ولوج حصري إلى مجتمع صناع الأفلام الخاص بصَنْعة',
      ],
      paymentOptions: {
        bankTransfer: {
          bankName: 'CIH Bank',
          accountName: 'Abdelilah Bhihi',
          rib: '230 780 0001234567890123 45',
        },
        cashPlus: {
          beneficiaryName: 'Abdelilah Bhihi',
          cin: 'AB123456',
        },
        paypal: {
          email: 'paypal@bhihi.studio',
        },
      },
    },
  ];

  res.status(200).json({ success: true, plans });
};

export const uploadReceipt = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez joindre la photo ou le scan de votre reçu de paiement (Bordereau).',
      });
    }

    const { planId = 'plan_masterclass_lifetime', method = 'bank_transfer', phoneWhatsapp } = req.body;

    if (phoneWhatsapp) {
      db.updateUser(req.user.id, { phoneWhatsapp });
    }

    // URL locale de consultation du reçu
    const receiptImageUrl = `/uploads/${req.file.filename}`;

    // Enregistrement du paiement en attente
    const payment = db.createPayment({
      userId: req.user.id,
      planId,
      amount: 2500,
      currency: 'MAD',
      method,
      receiptImageUrl,
    });

    // Mise à jour de l'état de l'utilisateur
    db.updateUser(req.user.id, { status: 'pending_approval' });

    console.log(`📩 [Nouveau Reçu Uploadé]: Utilisateur ${req.user.email} (${req.file.filename})`);

    res.status(201).json({
      success: true,
      message: 'Votre reçu a été transmis avec succès. Votre accès sera activé dès validation.',
      payment,
      userStatus: 'pending_approval',
    });
  } catch (error) {
    next(error);
  }
};

export const instantPayPalSuccess = async (req, res, next) => {
  try {
    const { orderId, amount = 250 } = req.body;

    // Enregistrement du paiement approuvé automatiquement
    const payment = db.createPayment({
      userId: req.user.id,
      planId: 'plan_masterclass_lifetime',
      amount,
      currency: 'USD',
      method: 'paypal',
      transactionReference: orderId || `paypal_${Date.now()}`,
      status: 'approved',
    });

    // Activation immédiate du compte
    db.updateUser(req.user.id, { status: 'active' });

    res.status(200).json({
      success: true,
      message: 'Paiement PayPal validé avec succès ! Votre accès est actif.',
      payment,
      userStatus: 'active',
    });
  } catch (error) {
    next(error);
  }
};
