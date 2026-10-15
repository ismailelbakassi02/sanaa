import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [pending, setPending] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('approvals'); // approvals | users
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricsRes, pendingRes, usersRes] = await Promise.all([
        api.get('/admin/metrics'),
        api.get('/admin/pending-approvals'),
        api.get('/admin/users'),
      ]);
      setMetrics(metricsRes.data.metrics);
      setPending(pendingRes.data.pending);
      setAllUsers(usersRes.data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (paymentId) => {
    if (!window.confirm('هل أنت متأكد من استلام المبلغ وتفعيل حساب هذا المشترك؟')) return;
    setActionLoading(true);
    try {
      await api.post('/admin/approve-user', { paymentId });
      await fetchData();
    } catch (err) {
      alert('فشل تفعيل الحساب: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (paymentId) => {
    const reason = window.prompt('سبب الرفض:', 'وصل غير واضح أو الحساب البنكي لم يتلق التحويل');
    if (!reason) return;
    setActionLoading(true);
    try {
      await api.post('/admin/reject-user', { paymentId, reason });
      await fetchData();
    } catch (err) {
      alert('فشل رفض الطلب: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Admin */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-cinema-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 space-x-reverse text-xs text-red-400 bg-red-950/60 border border-red-800 px-3 py-1 rounded-full mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة التحكم الإدارية الخاصة بـ عبد الإله بحيحي</span>
          </div>
          <h1 className="font-arabic text-3xl font-bold text-white">إدارة منصة صَنْعة</h1>
        </div>

        <button
          onClick={fetchData}
          className="bg-cinema-850 hover:bg-cinema-800 text-neutral-300 text-xs px-4 py-2.5 rounded-xl border border-cinema-700 flex items-center space-x-2 space-x-reverse transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث البيانات</span>
        </button>
      </div>

      {/* Cartes Métriques */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-cinema-900 border border-cinema-800 p-5 rounded-2xl">
            <div className="flex justify-between items-start text-neutral-400 mb-2">
              <span className="text-xs">المسجلين بـ Google (Leads)</span>
              <Users className="w-4 h-4 text-cinema-gold" />
            </div>
            <div className="text-2xl font-bold text-white font-mono">{metrics.totalRegisteredLeads}</div>
            <span className="text-[11px] text-neutral-500 mt-1 block">عملاء محتملين في الـ CRM</span>
          </div>

          <div className="bg-cinema-900 border border-amber-900/50 p-5 rounded-2xl">
            <div className="flex justify-between items-start text-amber-400 mb-2">
              <span className="text-xs">وصولات في انتظار الموافقة</span>
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-amber-400 font-mono">{metrics.pendingVerification}</div>
            <span className="text-[11px] text-amber-500/80 mt-1 block">تتطلب مراجعتك الشخصية</span>
          </div>

          <div className="bg-cinema-900 border border-cinema-800 p-5 rounded-2xl">
            <div className="flex justify-between items-start text-neutral-400 mb-2">
              <span className="text-xs">الطلاب المشتركين النشطين</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono">{metrics.activeStudents}</div>
            <span className="text-[11px] text-neutral-500 mt-1 block">يتابعون الدروس حالياً</span>
          </div>

          <div className="bg-cinema-900 border border-cinema-800 p-5 rounded-2xl">
            <div className="flex justify-between items-start text-neutral-400 mb-2">
              <span className="text-xs">إجمالي المداخيل المحققة</span>
              <DollarSign className="w-4 h-4 text-cinema-gold" />
            </div>
            <div className="text-2xl font-bold text-cinema-gold font-mono">
              {metrics.totalRevenueMAD.toLocaleString()} <span className="text-xs text-neutral-400 font-sans">درهم</span>
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">مداخيل صافية وموثقة</span>
          </div>
        </div>
      )}

      {/* Onglets */}
      <div className="flex space-x-2 space-x-reverse border-b border-cinema-800 mb-6">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'approvals'
              ? 'border-cinema-gold text-cinema-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          طلبات التحويل البنكي المعلقة ({pending.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'users'
              ? 'border-cinema-gold text-cinema-gold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          قائمة العملاء والـ Leads المسجلين ({allUsers.length})
        </button>
      </div>

      {/* Contenu Onglet 1: Approbations */}
      {activeTab === 'approvals' && (
        <div className="bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden">
          {pending.length === 0 ? (
            <div className="text-center py-16 text-neutral-400">
              <CheckCircle className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-sm">لا توجد أي طلبات معلقة حالياً. جميع الاشتراكات تمت معالجتها!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-cinema-850 text-neutral-400 uppercase font-mono text-[11px]">
                  <tr>
                    <th className="p-4">الطالب</th>
                    <th className="p-4">البريد الموثق</th>
                    <th className="p-4">رقم الواتساب</th>
                    <th className="p-4">طريقة الأداء</th>
                    <th className="p-4">وصل التحويل</th>
                    <th className="p-4 text-center">إجراءات التحقق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cinema-800 text-neutral-200">
                  {pending.map((item) => (
                    <tr key={item.id} className="hover:bg-cinema-850/50 transition-colors">
                      <td className="p-4 font-semibold text-white flex items-center space-x-2.5 space-x-reverse">
                        <img
                          src={item.user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=50&q=80'}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-cinema-700"
                        />
                        <span>{item.user?.name || 'مستخدم غير معروف'}</span>
                      </td>
                      <td className="p-4 font-mono text-neutral-300">{item.user?.email}</td>
                      <td className="p-4 font-mono">
                        {item.user?.phoneWhatsapp ? (
                          <a
                            href={`https://wa.me/${item.user.phoneWhatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 space-x-reverse text-emerald-400 hover:underline"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{item.user.phoneWhatsapp}</span>
                          </a>
                        ) : (
                          <span className="text-neutral-500">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-cinema-800 px-2.5 py-1 rounded text-neutral-300">
                          {item.method === 'bank_transfer' ? 'تحويل CIH' : 'كاش بلوس'}
                        </span>
                      </td>
                      <td className="p-4">
                        {item.receiptImageUrl ? (
                          <button
                            onClick={() => setSelectedReceipt(item.receiptImageUrl)}
                            className="text-cinema-gold hover:underline flex items-center space-x-1 space-x-reverse"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>معاينة صورة الوصل</span>
                          </button>
                        ) : (
                          <span className="text-neutral-500">لا يوجد وصل</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleApprove(item.id)}
                            disabled={actionLoading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1 space-x-reverse"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>تفعيل (Approve)</span>
                          </button>

                          <button
                            onClick={() => handleReject(item.id)}
                            disabled={actionLoading}
                            className="bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-300 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Contenu Onglet 2: Tous les utilisateurs / Leads */}
      {activeTab === 'users' && (
        <div className="bg-cinema-900 border border-cinema-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-cinema-850 text-neutral-400 uppercase font-mono text-[11px]">
                <tr>
                  <th className="p-4">الاسم الكامل</th>
                  <th className="p-4">بريد Google الموثق</th>
                  <th className="p-4">رقم الواتساب</th>
                  <th className="p-4">الرتبة</th>
                  <th className="p-4">حالة الحساب</th>
                  <th className="p-4">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-800 text-neutral-200">
                {allUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-cinema-850/50 transition-colors">
                    <td className="p-4 font-semibold text-white flex items-center space-x-2.5 space-x-reverse">
                      <img src={u.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-cinema-700" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-4 font-mono text-neutral-300">{u.email}</td>
                    <td className="p-4 font-mono">
                      {u.phoneWhatsapp ? (
                        <a
                          href={`https://wa.me/${u.phoneWhatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline flex items-center space-x-1 space-x-reverse"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{u.phoneWhatsapp}</span>
                        </a>
                      ) : (
                        <span className="text-neutral-500">—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] ${u.role === 'admin' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-cinema-800 text-neutral-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${u.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : u.status === 'pending_approval' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-neutral-800 text-neutral-400'}`}>
                        {u.status === 'active' ? 'مشترك نشط' : u.status === 'pending_approval' ? 'في انتظار المراجعة' : 'عميل مسجل (Lead)'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-neutral-400">
                      {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal d'agrandissement de reçu */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-cinema-900 border border-cinema-800 rounded-2xl p-6 shadow-2xl">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 left-4 text-white bg-cinema-800 hover:bg-cinema-700 px-3 py-1.5 rounded-lg text-xs"
            >
              إغلاق
            </button>
            <h3 className="font-arabic text-lg font-bold text-white mb-4">معاينة وصل التحويل البنكي</h3>
            <div className="max-h-[75vh] overflow-auto rounded-xl border border-cinema-800 bg-black flex items-center justify-center">
              <img src={selectedReceipt} alt="Reçu de virement" className="w-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
