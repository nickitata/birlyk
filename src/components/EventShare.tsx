import React, { useState } from 'react';

interface EventShareProps {
  eventId?: string;
  eventName?: string;
}

export const EventShare: React.FC<EventShareProps> = ({
  eventId = 'event-8932',
  eventName = 'Мой праздник'
}) => {
  const [copied, setCopied] = useState(false);

  // Статичная ссылка на базе уникального ID события
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080';
  const shareUrl = `${baseUrl}/event/${eventId}`;

  // Генерация неизменяемого QR-кода через открытый генератор
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Ошибка при копировании ссылки:', err);
    }
  };

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      marginTop: '20px',
      color: '#0f172a'
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
        🔗 Постоянная ссылка и QR-код для гостей
      </h2>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
        Ссылка и QR-код привязаны к <strong>ID события ({eventId})</strong>. Редактируйте даты, место и детали — ссылка и код останутся прежними!
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        {/* Генерация и отображение QR-кода */}
        <div style={{ padding: '12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <img src={qrCodeApiUrl} alt={`QR Code for ${eventName}`} style={{ width: '180px', height: '180px', display: 'block' }} />
        </div>

        {/* Инпут с ссылкой и кнопкой копирования */}
        <div style={{ width: '100%', maxWidth: '450px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value={shareUrl}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                backgroundColor: '#f8fafc',
                outline: 'none'
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                padding: '10px 18px',
                borderRadius: '6px',
                backgroundColor: copied ? '#16a34a' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {copied ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}