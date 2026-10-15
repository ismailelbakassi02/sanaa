import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle2, Building, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ReceiptUploadModal = ({ isOpen, onClose, plan, onSuccess }) => {
  const { user, refreshUser } = useAuth();
  const [method, setMethod] = useState('bank_transfer');
  const [phone, setPhone] = useState(user?.phoneWhatsapp || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('يرجى إرفاق صورة وصل التحويل البنكي أو كاش بلوس.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('receipt', file);
      formData.append('method', method);
      formData.append('planId', plan?.id || 'plan_masterclass_lifetime');
      formData.append('phoneWhatsapp', phone);

      await api.post('/subscriptions/upload-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      await refreshUser();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'تعذر رفع الوصل. يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-cinema-900 border border-cinema-800 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Bouton de Fermeture */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-cinema-800"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="font-arabic text-2xl font-bold text-white mb-2">
              تم إرسال وصل الأداء بنجاح!
            </h3>
            <p className="text-neutral-300 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              طلبك الآن قيد المراجعة لدى الأستاذ عبد الإله بحيحي. سيتم تفعيل حسابك مباشرة بعد التحقق، وستتلقى إشعاراً عبر الواتساب والبريد الإلكتروني.
            </p>
            <button
              onClick={onClose}
              className="bg-cinema-gold text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-cinema-goldHover transition-colors"
            >
              العودة إلى المنصة
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-xs font-mono text-cinema-gold uppercase tracking-wider block mb-1">
                الدفع اليدوي المباشر
              </span>
              <h2 className="font-arabic text-2xl font-bold text-white">
                تأكيد الاشتراك عبر التحويل البنكي
              </h2>
            </div>

            {error && (
              <div className="flex items-center space-x-2 space-x-reverse bg-red-950/50 border border-red-800 text-red-300 text-xs p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Choix de la méthode */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMethod('bank_transfer')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  method === 'bank_transfer'
                    ? 'border-cinema-gold bg-cinema-gold/5 text-white'
                    : 'border-cinema-800 bg-cinema-850 text-neutral-400'
                }`}
              >
                <Building className="w-5 h-5 mb-1.5 text-cinema-gold" />
                <div className="text-sm font-semibold">تحويل بنكي (CIH)</div>
                <div className="text-[11px] text-neutral-500">من تطبيقك البنكي المفضل</div>
              </button>

              <button
                type="button"
                onClick={() => setMethod('cashplus')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  method === 'cashplus'
                    ? 'border-cinema-gold bg-cinema-gold/5 text-white'
                    : 'border-cinema-800 bg-cinema-850 text-neutral-400'
                }`}
              >
                <div className="text-lg font-bold mb-1 text-cinema-gold">CashPlus</div>
                <div className="text-sm font-semibold">كاش بلوس / وفاكاش</div>
                <div className="text-[11px] text-neutral-500">عبر أقرب وكالة إليك</div>
              </button>
            </div>

            {/* Détails du RIB */}
            <div className="bg-cinema-850 border border-cinema-800 p-4 rounded-xl text-xs space-y-2">
              <div className="flex justify-between items-center text-neutral-300">
                <span>المستفيد:</span>
                <span className="font-semibold text-white">Abdelilah Bhihi</span>
              </div>
              {method === 'bank_transfer' ? (
                <>
                  <div className="flex justify-between items-center text-neutral-300">
                    <span>البنك:</span>
                    <span className="text-white">CIH Bank</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-300">
                    <span>رقم الحساب (RIB):</span>
                    <span className="font-mono bg-cinema-900 px-2 py-1 rounded text-cinema-gold font-bold">
                      230 780 0001234567890123 45
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between items-center text-neutral-300">
                  <span>رقم البطاقة الوطنية (CIN):</span>
                  <span className="font-mono bg-cinema-900 px-2 py-1 rounded text-cinema-gold font-bold">
                    AB123456
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-neutral-300 pt-2 border-t border-cinema-800">
                <span>المبلغ المطلوب:</span>
                <span className="text-base font-bold text-cinema-gold">2,500 درهم مغربي</span>
              </div>
            </div>

            {/* Téléphone WhatsApp */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                رقم هاتفك على واتساب (للتواصل والتفعيل):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+212 6XX-XXXXXX"
                dir="ltr"
                required
                className="w-full bg-cinema-850 border border-cinema-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cinema-gold"
              />
            </div>

            {/* Zone d'Upload du Reçu */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                صورة وصل الأداء (Capture ou Photo du Bordereau):
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-cinema-700 hover:border-cinema-gold rounded-xl cursor-pointer bg-cinema-850/50 hover:bg-cinema-850 transition-colors">
                {preview ? (
                  <img src={preview} alt="Aperçu reçu" className="h-full object-contain p-2 rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-neutral-400">
                    <UploadCloud className="w-8 h-8 mb-2 text-cinema-gold" />
                    <p className="text-xs">اضغط هنا لرفع صورة الوصل (JPG, PNG, PDF)</p>
                    <p className="text-[10px] text-neutral-500">الحد الأقصى: 5 ميغابايت</p>
                  </div>
                )}
                <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
              </label>
            </div>

            {/* Bouton de Soumission */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cinema-gold hover:bg-cinema-goldHover text-black font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50"
            >
              {loading ? (
                <span>جاري رفع الوصل وتأكيد الطلب...</span>
              ) : (
                <span>تأكيد وإرسال الوصل للمراجعة</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
