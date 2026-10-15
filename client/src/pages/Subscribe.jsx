import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ReceiptUploadModal } from '../components/ReceiptUploadModal';
import { Check, Sparkles, Shield, Building, CreditCard, Lock, Clock } from 'lucide-react';

export const Subscribe = () => {
  const { user, isAuthenticated, isStudentActive } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/subscriptions/plans');
        setPlans(res.data.plans);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPlans();
  }, []);

  const plan = plans[0];

  const handlePaypalCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/subscribe' } } });
      return;
    }

    setPaypalLoading(true);
    try {
      await api.post('/subscriptions/paypal-success', {
        orderId: `PAYPAL_${Date.now()}`,
        amount: 250,
      });
      navigate('/catalog');
    } catch (err) {
      console.error(err);
    } finally {
      setPaypalLoading(false);
    }
  };

  const handleOpenBankModal = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/subscribe' } } });
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 space-x-reverse bg-cinema-gold/10 border border-cinema-gold/30 text-cinema-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <Sparkles className="w-4 h-4" />
          <span>استثمار في مستقبلك الإبداعي</span>
        </div>
        <h1 className="font-arabic text-3xl sm:text-5xl font-bold text-white mb-4">
          انضم إلى صَنْعة مع عبد الإله بحيحي
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          تعلم أسرار الإخراج الوثائقي والإنتاج السينمائي والمحتوى الرقمي عالي القيمة. وصول كامل ومحمي مدى الحياة لجميع ورشات العمل.
        </p>
      </div>

      {/* Si l'utilisateur est déjà actif */}
      {isStudentActive && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-6 text-center mb-8 max-w-xl mx-auto">
          <h3 className="text-emerald-400 font-bold text-lg mb-1">حسابك مفعل بنجاح!</h3>
          <p className="text-xs text-neutral-300 mb-4">أنت مشترك بالفعل ولديك وصول كامل لكافة الدروس.</p>
          <button
            onClick={() => navigate('/catalog')}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            الانتقال إلى مشاهدة الدروس
          </button>
        </div>
      )}

      {/* Si en attente de validation */}
      {user?.status === 'pending_approval' && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-2xl p-6 text-center mb-8 max-w-xl mx-auto">
          <div className="flex items-center justify-center space-x-2 space-x-reverse text-amber-400 font-bold text-lg mb-1">
            <Clock className="w-5 h-5" />
            <span>طلبك قيد المراجعة</span>
          </div>
          <p className="text-xs text-neutral-300">
            تم استلام وصل التحويل الخاص بك بنجاح. سنقوم بتفعيل حسابك فور التحقق من العملية البنكية.
          </p>
        </div>
      )}

      {/* Carte Tarifaire Principale */}
      {plan && (
        <div className="relative max-w-xl mx-auto bg-cinema-900 border-2 border-cinema-gold/40 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-cinema-gold/5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-mono text-cinema-gold uppercase tracking-wider block mb-1">
                الباقة المتكاملة
              </span>
              <h3 className="font-arabic text-2xl font-bold text-white">{plan.name}</h3>
            </div>
            <div className="text-left">
              <span className="text-3xl sm:text-4xl font-extrabold text-cinema-gold block font-mono">
                2,500 <span className="text-lg text-neutral-400">درهم</span>
              </span>
              <span className="text-xs text-neutral-500 block font-mono">أو 250 دولار دولياً</span>
            </div>
          </div>

          <p className="text-sm text-neutral-300 mb-8 leading-relaxed">{plan.description}</p>

          {/* Liste des Avantages */}
          <ul className="space-y-3.5 mb-8 border-t border-b border-cinema-800 py-6 text-sm text-neutral-200">
            {plan.features.map((feat, idx) => (
              <li key={idx} className="flex items-start space-x-3 space-x-reverse">
                <div className="w-5 h-5 rounded-full bg-cinema-gold/15 text-cinema-gold flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{feat}</span>
              </li>
            ))}
          </ul>

          {/* Actions de Paiement */}
          <div className="space-y-3">
            <button
              onClick={handleOpenBankModal}
              className="w-full py-3.5 bg-cinema-gold hover:bg-cinema-goldHover text-black font-bold rounded-xl transition-all shadow-lg shadow-cinema-gold/15 flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Building className="w-5 h-5" />
              <span>الدفع عبر تحويل بنكي / كاش بلوس (المغرب)</span>
            </button>

            <button
              onClick={handlePaypalCheckout}
              disabled={paypalLoading}
              className="w-full py-3.5 bg-cinema-850 hover:bg-cinema-800 border border-cinema-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2 space-x-reverse"
            >
              <CreditCard className="w-5 h-5 text-blue-400" />
              <span>{paypalLoading ? 'جاري الاتصال بـ PayPal...' : 'الدفع السريع بالبطاقة / PayPal (دولي)'}</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs text-neutral-500 flex items-center justify-center space-x-1.5 space-x-reverse">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>معاملات آمنة 100% وموافقة شخصية من عبد الإله بحيحي</span>
          </div>
        </div>
      )}

      {/* Modal d'Upload */}
      <ReceiptUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={plan}
      />
    </div>
  );
};
