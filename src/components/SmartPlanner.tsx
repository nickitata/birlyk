import React, { useState } from 'react';

export const SmartPlanner: React.FC = () => {
  // 1. Ввод данных от пользователя (Receive Input)
  const [guests, setGuests] = useState<number>(50);
  const [eventType, setEventType] = useState<string>('banquet');
  const [capacity, setCapacity] = useState<number>(80);

  // 2. Обработка ввода и расчёты (Process Input)
  const calculateLayout = () => {
    let tablesNeeded = 0;
    let recommendation = '';
    let warning = '';

    if (eventType === 'banquet') {
      tablesNeeded = Math.ceil(guests / 8); // 8 человек за круглым столом
      recommendation = `Вам потребуется ${tablesNeeded} круглых столов (по 8 мест).`;
      
      // Условие 1: Рекомендация по зонированию для больших мероприятий
      if (guests > 60) {
        recommendation += ' Для комфорта рекомендуется выделить VIP-зону у сцены.';
      }
    } else if (eventType === 'conference') {
      const rowsNeeded = Math.ceil(guests / 12);
      recommendation = `Вам потребуется ${rowsNeeded} рядов кресел (по 12 мест в ряду).`;
    } else if (eventType === 'cocktail') {
      tablesNeeded = Math.ceil(guests / 15);
      recommendation = `Рекомендуется расставить ${tablesNeeded} высоких фуршетных столов.`;
    }

    // Условие 2: Предупреждение о превышении вместимости зала
    if (guests > capacity) {
      warning = `⚠️ Внимание: Зал рассчитан на ${capacity} чел., а у вас ${guests} гостей! Превышение на ${guests - capacity} чел.`;
    }

    return { tablesNeeded, recommendation, warning };
  };

  const result = calculateLayout();

  // 3. Вывод результата (Produce Result)
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
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        🧠 AI Smart Seating Assistant (Умный помощник рассадки)
      </h2>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
            Количество гостей:
          </label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
            Тип рассадки / мероприятия:
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="banquet">Банкет (Круглые столы)</option>
            <option value="conference">Конференция (Ряды)</option>
            <option value="cocktail">Фуршет / Коктейль (Стоячие столы)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500 }}>
            Вместимость выбранного зала (чел.):
          </label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>
      </div>

      {/* Вывод результатов */}
      <div style={{ marginTop: '16px' }}>
        {result.warning && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '12px',
            fontWeight: 500
          }}>
            {result.warning}
          </div>
        )}

        <div style={{
          backgroundColor: '#f0fdf4',
          color: '#166534',
          padding: '12px',
          borderRadius: '6px',
          fontWeight: 500
        }}>
          💡 <strong>Результат расчёта:</strong> {result.recommendation}
        </div>
      </div>
    </div>
  );
};