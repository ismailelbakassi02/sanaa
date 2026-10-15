import { ENV } from '../config/env.js';

export const generatePlaybackCredentials = async (drmVideoId, user, clientIp = '105.158.20.12') => {
  // Payload du filigrane dynamique forensique
  const watermarkPayload = {
    email: user.email,
    name: user.name,
    phone: user.phoneWhatsapp || 'Non renseigné',
    ip: clientIp,
    timestamp: new Date().toISOString(),
  };

  // Si une clé secrète VdoCipher est configurée, appel à l'API officielle
  if (ENV.VDOCIPHER_API_SECRET_KEY) {
    try {
      const response = await fetch(`https://dev.vdocipher.com/api/videos/${drmVideoId}/otp`, {
        method: 'POST',
        headers: {
          Authorization: `Apisecret ${ENV.VDOCIPHER_API_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ttl: 300, // 5 minutes de validité
          annotate: JSON.stringify([
            {
              type: 'rtext',
              text: `${user.email} • ${clientIp}`,
              alpha: '0.6',
              color: '0xFFFFFF',
              size: '14',
              interval: '5000',
            },
          ]),
        }),
      });

      const data = await response.json();
      return {
        otp: data.otp,
        playbackInfo: data.playbackInfo,
        watermark: watermarkPayload,
      };
    } catch (error) {
      console.error('❌ [VdoCipher API Error]:', error.message);
    }
  }

  // Mode de démonstration locale / Sandbox
  return {
    otp: `mock_otp_drm_${Date.now()}`,
    playbackInfo: `eyJ2aWRlb0lkIjoi${Buffer.from(drmVideoId).toString('base64')}`,
    videoSampleUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    watermark: watermarkPayload,
  };
};
