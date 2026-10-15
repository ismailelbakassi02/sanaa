import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { DRMPlayer } from '../components/DRMPlayer';
import { Play, Lock, FileDown, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const Watch = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaybackAndCurriculum = async () => {
      setLoading(true);
      setError('');
      try {
        const [playbackRes, coursesRes] = await Promise.all([
          api.get(`/videos/${id}/playback`),
          api.get('/videos/courses'),
        ]);

        setData(playbackRes.data);
        setCourses(coursesRes.data.courses);
      } catch (err) {
        console.error(err);
        if (err.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
          setError('هذا الدرس يتطلب اشتراكاً نشطاً. يرجى الاشتراك لتفعيل الوصول.');
        } else {
          setError(err.response?.data?.message || 'تعذر تحميل الفيديو.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaybackAndCurriculum();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cinema-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-cinema-900 border border-cinema-800 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-arabic text-2xl font-bold text-white mb-2">محتوى حصري للمشتركين</h2>
          <p className="text-sm text-neutral-400 mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-col space-y-3">
            <Link
              to="/subscribe"
              className="w-full py-3 bg-cinema-gold text-black font-bold rounded-xl hover:bg-cinema-goldHover transition-colors"
            >
              الاشتراك وتفعيل الحساب
            </Link>
            <Link
              to="/catalog"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              ← العودة إلى قائمة الدروس
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { video, drm } = data;
  const currentCourse = courses[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Breadcrumb */}
      <div className="mb-6 flex items-center space-x-2 space-x-reverse text-xs text-neutral-400">
        <Link to="/catalog" className="hover:text-cinema-gold transition-colors">
          صَنْعة
        </Link>
        <span>/</span>
        <span className="text-neutral-200">{video.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Principale: Lecteur Vidéo DRM */}
        <div className="lg:col-span-2 space-y-6">
          <DRMPlayer video={video} drmData={drm} />

          {/* Métadonnées de la leçon */}
          <div className="bg-cinema-900 border border-cinema-800 rounded-2xl p-6">
            <h1 className="font-arabic text-2xl font-bold text-white mb-3">{video.title}</h1>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">{video.description}</p>

            {video.resourcesPdfUrl && (
              <div className="pt-4 border-t border-cinema-800 flex items-center justify-between">
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-neutral-400">
                  <CheckCircle2 className="w-4 h-4 text-cinema-gold" />
                  <span>دليل عملي وملخص ملحق بالدرس</span>
                </div>
                <a
                  href={video.resourcesPdfUrl}
                  download
                  className="inline-flex items-center space-x-1.5 space-x-reverse bg-cinema-800 hover:bg-cinema-700 text-white text-xs px-4 py-2 rounded-lg border border-cinema-700 transition-colors"
                >
                  <FileDown className="w-4 h-4 text-cinema-gold" />
                  <span>تحميل المرفق (PDF)</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Colonne Latérale: Playlist & Curriculum */}
        <div className="bg-cinema-900 border border-cinema-800 rounded-2xl p-5 h-fit max-h-[85vh] overflow-y-auto">
          <h3 className="font-arabic text-lg font-bold text-white mb-4 pb-3 border-b border-cinema-800">
            قائمة دروس الماستركلاس
          </h3>

          <div className="space-y-4">
            {currentCourse?.modules.map((mod) => (
              <div key={mod.id}>
                <span className="text-[11px] font-semibold text-cinema-gold block mb-2">
                  {mod.title}
                </span>

                <div className="space-y-1">
                  {mod.videos.map((v) => {
                    const isCurrent = v.id === id;
                    return (
                      <Link
                        key={v.id}
                        to={`/watch/${v.id}`}
                        className={`w-full p-2.5 rounded-xl text-right flex items-center space-x-3 space-x-reverse transition-all ${
                          isCurrent
                            ? 'bg-cinema-gold/10 border border-cinema-gold/40 text-white font-medium'
                            : 'hover:bg-cinema-850 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                            isCurrent ? 'bg-cinema-gold text-black' : 'bg-cinema-800'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <div className="text-xs truncate">{v.title}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
