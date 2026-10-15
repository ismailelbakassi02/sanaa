import React, { useEffect, useRef, useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

export const DRMPlayer = ({ video, drmData }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [watermarkPos, setWatermarkPos] = useState({ x: 20, y: 30 });

  // 1. Déplacement aléatoire du filigrane toutes les 4 à 6 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      // Calcul de coordonnées aléatoires à l'intérieur du conteneur (en %)
      const randomX = Math.floor(Math.random() * 65) + 5; // Entre 5% et 70%
      const randomY = Math.floor(Math.random() * 70) + 15; // Entre 15% et 85%
      setWatermarkPos({ x: randomX, y: randomY });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 2. Rendu du Canvas pour imprimer le filigrane de manière inaltérable
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !drmData?.watermark) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Style du filigrane
    ctx.font = '13px "Inter", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;

    const posX = (watermarkPos.x / 100) * canvas.width;
    const posY = (watermarkPos.y / 100) * canvas.height;

    const text1 = `صَنْعة • ${drmData.watermark.email}`;
    const text2 = `${drmData.watermark.ip} • ID: #${drmData.watermark.phone}`;

    ctx.fillText(text1, posX, posY);
    ctx.fillText(text2, posX, posY + 18);
  }, [watermarkPos, drmData]);

  // 3. Blocage du clic droit sur la zone vidéo pour déjouer les outils d'inspection
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-cinema-800 select-none group"
      onContextMenu={handleContextMenu}
    >
      {/* Lecteur Vidéo Principal */}
      <video
        ref={videoRef}
        src={drmData?.videoSampleUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
        controls
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        className="w-full h-full object-cover"
      >
        Votre navigateur ne prend pas en charge la lecture vidéo HTML5 protégée.
      </video>

      {/* Couche Canvas du Filigrane Dynamique Forensique */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20 w-full h-full"
      />

      {/* Badge de Sécurité DRM Netflix-Grade */}
      <div className="absolute top-4 right-4 z-30 pointer-events-none flex items-center space-x-1.5 space-x-reverse bg-black/70 backdrop-blur-md border border-cinema-700/60 px-2.5 py-1 rounded text-[11px] text-neutral-300">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span>بث مشفر بتقنية DRM (Widevine/FairPlay)</span>
      </div>

      {/* Filigrane discret en coin fixe */}
      <div className="absolute bottom-14 left-4 z-30 pointer-events-none opacity-40 text-[10px] font-mono text-white/50">
        PROTECTED BY SANAA STUDIO • ENCRYPTED CENC
      </div>
    </div>
  );
};
