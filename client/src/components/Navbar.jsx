import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, ShieldCheck, LogOut, User, Sparkles, ExternalLink } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-cinema-950/80 backdrop-blur-md border-b border-cinema-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo صَنْعة */}
        <div className="flex items-center space-x-4 space-x-reverse">
          <Link to="/" className="flex items-center space-x-3 space-x-reverse group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cinema-gold to-yellow-600 flex items-center justify-center text-black font-bold shadow-lg shadow-cinema-gold/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-arabic text-2xl font-bold tracking-wide text-white group-hover:text-cinema-gold transition-colors">
                صَنْعة
              </span>
              <span className="text-[10px] block text-neutral-400 font-mono uppercase tracking-widest">
                Masterclass Video
              </span>
            </div>
          </Link>

          {/* Badge Studio */}
          <a
            href="http://localhost:4321/ar/sanaa"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center text-xs text-neutral-400 hover:text-cinema-gold bg-cinema-900 border border-cinema-800 px-3 py-1.5 rounded-full transition-colors"
          >
            <span>استوديو عبد الإله بحيحي</span>
            <ExternalLink className="w-3 h-3 mr-1.5" />
          </a>
        </div>

        {/* Liens de Navigation */}
        <nav className="flex items-center space-x-6 space-x-reverse">
          <Link
            to="/catalog"
            className="text-sm text-neutral-300 hover:text-white transition-colors"
          >
            الدروس والبرنامج
          </Link>

          <Link
            to="/subscribe"
            className="text-sm text-neutral-300 hover:text-cinema-gold transition-colors flex items-center space-x-1 space-x-reverse"
          >
            <Sparkles className="w-4 h-4 text-cinema-gold" />
            <span>الانضمام والاشتراك</span>
          </Link>

          {/* Onglet Administrateur réservé */}
          {isAdmin && (
            <Link
              to="/admin"
              className="text-xs bg-red-950/60 border border-red-800 text-red-300 px-3 py-1.5 rounded-md hover:bg-red-900 transition-colors flex items-center space-x-1.5 space-x-reverse"
            >
              <ShieldCheck className="w-4 h-4 text-red-400" />
              <span>لوحة تحكم الأدمن</span>
            </Link>
          )}

          {/* Espace Utilisateur */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-3 space-x-reverse border-r border-cinema-800 pr-4">
              <div className="flex items-center space-x-2.5 space-x-reverse">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-cinema-700 object-cover"
                />
                <div className="hidden md:block text-right">
                  <span className="text-xs font-medium text-white block max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className={`text-[10px] block font-mono ${user.status === 'active' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {user.status === 'active' ? '● مشترك نشط' : '● في انتظار التفعيل'}
                  </span>
                </div>
              </div>

              <button
                onClick={logout}
                title="تسجيل الخروج"
                className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-cinema-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-semibold text-black bg-cinema-gold hover:bg-cinema-goldHover px-4 py-2 rounded-lg transition-all shadow-md shadow-cinema-gold/10"
            >
              تسجيل الدخول
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
