import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Film, Shield, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/catalog';

  // Si déjà authentifié, redirection immédiate
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle(credentialResponse.credential);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  // Mode de démonstration locale (en cas d'absence de Google Client ID)
  const handleDevDemoLogin = async () => {
    setLoading(true);
    setError('');
    const res = await loginWithGoogle('mock_dev_id_token_demo');
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full bg-cinema-900 border border-cinema-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Éclat doré en arrière plan */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cinema-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-tr from-cinema-gold to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-cinema-gold/20">
            <Film className="w-7 h-7 text-black" />
          </div>
          <h1 className="font-arabic text-3xl font-bold text-white mb-2">
            مرحباً بك في صَنْعة
          </h1>
          <p className="text-sm text-neutral-400">
            سجّل دخولك بحساب Google لمتابعة ورشات العمل ومحتواك التعليمي المشفر
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center space-x-2 space-x-reverse bg-red-950/60 border border-red-800 text-red-300 text-xs p-3.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Bouton Officiel Google OAuth 2.0 */}
          <div className="flex justify-center flex-col items-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('فشلت المصادقة مع خوادم Google.')}
              theme="filled_black"
              size="large"
              shape="pill"
              text="continue_with"
              locale="ar"
            />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cinema-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-cinema-900 px-3 text-neutral-500 font-mono">
                أو تجربة سريعة للتطوير
              </span>
            </div>
          </div>

          {/* Bouton de Test / Démo locale */}
          <button
            onClick={handleDevDemoLogin}
            disabled={loading}
            className="w-full py-3 bg-cinema-850 hover:bg-cinema-800 border border-cinema-700 text-neutral-200 text-sm font-semibold rounded-full transition-all flex items-center justify-center space-x-2 space-x-reverse"
          >
            <Sparkles className="w-4 h-4 text-cinema-gold" />
            <span>دخول تجريبي بحساب طالب (Sandbox Mode)</span>
          </button>
        </div>

        {/* Garanties de Sécurité */}
        <div className="mt-8 pt-6 border-t border-cinema-800/80 text-xs text-neutral-400 space-y-2">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>حماية مشددة: الفيديوهات مشفرة ولا تقبل التحميل</span>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <CheckCircle className="w-4 h-4 text-cinema-gold shrink-0" />
            <span>تسجيل فوري بدون الحاجة لحفظ كلمة مرور</span>
          </div>
        </div>
      </div>
    </div>
  );
};
