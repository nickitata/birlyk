import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

interface EventShareProps {
  eventId?: string;
}

export const EventShare: React.FC<EventShareProps> = ({ eventId = 'event-8932' }) => {
  const i18n = useI18n() as any;
  const rawLang = String(
    i18n?.language || 
    i18n?.lang || 
    i18n?.locale || 
    i18n?.currentLanguage || 
    localStorage.getItem('language') || 
    localStorage.getItem('i18nextLng') || 
    'ru'
  ).toLowerCase();

  let lang: 'ru' | 'kk' | 'en' | 'az' = 'ru';
  if (rawLang.includes('kk') || rawLang.includes('kz')) lang = 'kk';
  else if (rawLang.includes('en')) lang = 'en';
  else if (rawLang.includes('az')) lang = 'az';

  const [copied, setCopied] = useState(false);

  const dict = {
    ru: {
      title: '🔗 Постоянная ссылка и QR-код для гостей',
      desc: `Ссылка и QR-код привязаны к ID события (${eventId}). Изменяйте данные мероприятия — QR-код останется прежним!`,
      copy: 'Копировать',
      copied: '✓ Скопировано'
    },
    kk: {
      title: '🔗 Қонақтарға арналған тұрақты сілтеме мен QR-код',
      desc: `Сілтеме мен QR-код оқиға ID-іне (${eventId}) байланыстырылған. Түзетулер енгізсеңіз де, QR-код өзгермейді!`,
      copy: 'Көшіру',
      copied: '✓ Көшірілді'
    },
    en: {
      title: '🔗 Static Share Link & Guest QR Code',
      desc: `The link and QR code are bound to event ID (${eventId}). Update details anytime — the QR code stays identical!`,
      copy: 'Copy Link',
      copied: '✓ Copied'
    },
    az: {
      title: '🔗 Qonaqlar üçün daimi keçid və QR kod',
      desc: `Keçid və QR kod tədbir ID-sinə (${eventId}) bağlıdır. Məlumatları dəyişsəniz də, QR kod eyni qalacaq!`,
      copy: 'Kopyala',
      copied: '✓ Kopyalandı'
    }
  };

  const t = dict[lang] || dict.ru;
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080';
  const shareUrl = `${baseUrl}/event/${eventId}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', backgroundColor: '#ffffff', marginTop: '20px', color: '#0f172a' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '6px' }}>{t.title}</h2>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{t.desc}</p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
          <img src={qrCodeApiUrl} alt="Event QR Code" style={{ width: '160px', height: '160px' }} />
        </div>

        <div style={{ width: '100%', maxWidth: '450px', display: 'flex', gap: '8px' }}>
          <input type="text" readOnly value={shareUrl} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#f8fafc' }} />
          <button onClick={handleCopy} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: copied ? '#16a34a' : '#2563eb', color: '#ffffff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
            {copied ? t.copied : t.copy}
          </button>
        </div>
      </div>
    </div>
  );
};