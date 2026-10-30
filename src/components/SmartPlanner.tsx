import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';

export const SmartPlanner: React.FC = () => {
  const { language } = useI18n() as any;
  const lang = (language || 'ru') as 'ru' | 'kk' | 'en' | 'az';

  const [guests, setGuests] = useState<number>(50);
  const [seatingType, setSeatingType] = useState<string>('banquet');
  const [capacity, setCapacity] = useState<number>(80);

  const dict = {
    ru: {
      title: '🧠 AI Smart Seating Assistant (Умный помощник рассадки)',
      guests: 'Количество гостей:',
      type: 'Тип рассадки / мероприятия:',
      banquet: 'Банкет (Круглые столы)',
      classroom: 'Презентация / Обучение (Ряды)',
      cocktail: 'Фуршет / Коктейль',
      capacity: 'Вместимость выбранного зала (чел.):',
      result: (tables: number, seats: number) => `💡 Результат расчёта: Вам потребуется ${tables} столов (по ${seats} мест).`
    },
    kk: {
      title: '🧠 AI Ақылды отырғызу көмекшісі',
      guests: 'Қонақтар саны:',
      type: 'Отырғызу / іс-шара түрі:',
      banquet: 'Банкет (Дөңгелек үстелдер)',
      classroom: 'Презентация / Оқыту (Қатарлар)',
      cocktail: 'Фуршет / Коктейль',
      capacity: 'Тандалған залдың сыйымдылығы (адам):',
      result: (tables: number, seats: number) => `💡 Есептеу нәтижесі: Сізге ${tables} үстел қажет (${seats} орыннан).`
    },
    en: {
      title: '🧠 AI Smart Seating Assistant',
      guests: 'Guest count:',
      type: 'Seating / event type:',
      banquet: 'Banquet (Round tables)',
      classroom: 'Classroom / Presentation (Rows)',
      cocktail: 'Cocktail / Standing',
      capacity: 'Venue capacity (persons):',
      result: (tables: number, seats: number) => `💡 Calculation result: You will need ${tables} tables (${seats} seats each).`
    },
    az: {
      title: '🧠 AI Ağıllı Oturuş Köməkçisi',
      guests: 'Qonaq sayı:',
      type: 'Oturuş / tədbir növü:',
      banquet: 'Ziyafət (Yumru masalar)',
      classroom: 'Təqdimat / Təlim (Sıralar)',
      cocktail: 'Furşet / Kokteyl',
      capacity: 'Seçilmiş zalın tutumu (nəfər):',
      result: (tables: number, seats: number) => `💡 Hesablama нәticəsi: Sizə ${tables} masa lazım olacaq (hər birində ${seats} yer).`
    }
  };

  const t = dict[lang] || dict.ru;

  const seatsPerTable = seatingType === 'banquet' ? 8 : seatingType === 'classroom' ? 6 : 10;
  const tablesNeeded = Math.ceil(guests / seatsPerTable);

  return (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', backgroundColor: '#ffffff', color: '#0f172a' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>{t.title}</h2>
      
      <div style={{ display: 'grid', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>{t.guests}</label>
          <input type="number" value={guests} onChange={(e) => setGuests(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        </div>

        <div>
          <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>{t.type}</label>
          <select value={seatingType} onChange={(e) => setSeatingType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
            <option value="banquet">{t.banquet}</option>
            <option value="classroom">{t.classroom}</option>
            <option value="cocktail">{t.cocktail}</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '13px', display: 'block', marginBottom: '4px' }}>{t.capacity}</label>
          <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        </div>

        <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', color: '#166534', fontSize: '14px', fontWeight: '500' }}>
          {t.result(tablesNeeded, seatsPerTable)}
        </div>
      </div>
    </div>
  )
}