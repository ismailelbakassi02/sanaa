import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Play, Lock, CheckCircle2, Clock, Film, Sparkles, BookOpen } from 'lucide-react';

export const Catalog = () => {
  const { isStudentActive } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/videos/courses');
        setCourses(res.data.courses);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cinema-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const course = courses[0]; // Masterclass principale

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero du Cours */}
      {course && (
        <div className="relative rounded-3xl overflow-hidden bg-cinema-850 border border-cinema-800 p-8 sm:p-12 mb-12 shadow-2xl">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 space-x-reverse bg-cinema-gold/10 border border-cinema-gold/30 text-cinema-gold text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>البرنامج التدريبي المعتمد لعام 2026</span>
            </div>

            <h1 className="font-arabic text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
              {course.title}
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/watch/vid_01"
                className="bg-cinema-gold hover:bg-cinema-goldHover text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-cinema-gold/15 flex items-center space-x-2 space-x-reverse"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>مشاهدة الدرس الأول (معاينة مجانية)</span>
              </Link>

              {!isStudentActive && (
                <Link
                  to="/subscribe"
                  className="bg-cinema-800 hover:bg-cinema-700 border border-cinema-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                >
                  فتح الدورة كاملة (اشتراك)
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modules & Leçons */}
      <div className="space-y-8">
        <div className="flex justify-between items-center border-b border-cinema-800 pb-4">
          <h2 className="font-arabic text-2xl font-bold text-white flex items-center space-x-2 space-x-reverse">
            <BookOpen className="w-6 h-6 text-cinema-gold" />
            <span>محاور الدورة والدروس</span>
          </h2>
          <span className="text-xs text-neutral-400 font-mono">
            {isStudentActive ? '● جميع الدروس متاحة لك' : '● يتطلب اشتراكاً نشطاً'}
          </span>
        </div>

        {course?.modules.map((mod, idx) => (
          <div key={mod.id} className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6">
            <h3 className="font-arabic text-xl font-bold text-white mb-4 text-cinema-gold">
              {mod.title}
            </h3>

            <div className="divide-y divide-cinema-800/60">
              {mod.videos.map((vid) => {
                const canWatch = isStudentActive || vid.isFreePreview;
                return (
                  <div
                    key={vid.id}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start space-x-3.5 space-x-reverse">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${canWatch ? 'bg-cinema-gold/10 text-cinema-gold' : 'bg-cinema-800 text-neutral-500'}`}>
                        {canWatch ? <Play className="w-5 h-5 fill-current" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <h4 className="text-base font-semibold text-white group-hover:text-cinema-gold transition-colors">
                            {vid.title}
                          </h4>
                          {vid.isFreePreview && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                              مجاني
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                          {vid.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 space-x-reverse self-end sm:self-center">
                      <div className="flex items-center space-x-1.5 space-x-reverse text-xs text-neutral-400 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{Math.round(vid.durationSeconds / 60)} دقيقة</span>
                      </div>

                      {canWatch ? (
                        <Link
                          to={`/watch/${vid.id}`}
                          className="bg-cinema-800 hover:bg-cinema-gold hover:text-black text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                        >
                          مشاهدة الآن
                        </Link>
                      ) : (
                        <Link
                          to="/subscribe"
                          className="bg-cinema-850 hover:bg-cinema-800 text-neutral-400 text-xs px-3.5 py-2 rounded-lg border border-cinema-700/60 transition-colors flex items-center space-x-1 space-x-reverse"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>مغلق</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
