import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useI18n } from '@/lib/i18n';

export const AnalyticsDashboard: React.FC = () => {
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

  const [loading, setLoading] = useState<boolean>(true);
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [confirmedGuests, setConfirmedGuests] = useState<number>(85);
  const [pendingGuests, setPendingGuests] = useState<number>(25);
  const [declinedGuests, setDeclinedGuests] = useState<number>(10);
  const [hallCapacity, setHallCapacity] = useState<number>(150);

  const dict = {
    ru: {
      title: '📊 Data Analysis & Event Visualization',
      totalEvents: (count: number) => `Всего событий в системе: ${count}`,
      occupancy: 'Заполняемость зала',
      confirmed: 'Подтвердили (RSVP)',
      pending: 'В ожидании',
      declined: 'Отклонили',
      chartTitle: '📈 Общая диаграмма статусов приглашений',
      confirmedLabel: 'Подтвердили',
      pendingLabel: 'Ожидают',
      declinedLabel: 'Отклонили',
      personUnit: 'чел.',
      simulation: '⚙️ Симуляция данных / Настройка параметров',
      capacityLabel: 'Вместимость зала:'
    },
    kk: {
      title: '📊 Деректерді талдау және визуалдау',
      totalEvents: (count: number) => `Жүйедегі барлық оқиғалар: ${count}`,
      occupancy: 'Залдың толуы',
      confirmed: 'Растады (RSVP)',
      pending: 'Күтілуде',
      declined: 'Бас тартты',
      chartTitle: '📈 Шақыру мәртебелерінің жалпы диаграммасы',
      confirmedLabel: 'Растады',
      pendingLabel: 'Күтуде',
      declinedLabel: 'Бас тартты',
      personUnit: 'адам',
      simulation: '⚙️ Деректерді симуляциялау / Параметрлерді баптау',
      capacityLabel: 'Зал сыйымдылығы:'
    },
    en: {
      title: '📊 Data Analysis & Event Visualization',
      totalEvents: (count: number) => `Total events in system: ${count}`,
      occupancy: 'Hall Occupancy',
      confirmed: 'Confirmed (RSVP)',
      pending: 'Pending',
      declined: 'Declined',
      chartTitle: '📈 Overall Invitation Status Chart',
      confirmedLabel: 'Confirmed',
      pendingLabel: 'Pending',
      declinedLabel: 'Declined',
      personUnit: 'guests',
      simulation: '⚙️ Data Simulation / Parameter Settings',
      capacityLabel: 'Hall Capacity:'
    },
    az: {
      title: '📊 Məlumat Təhlili və Vizualizasiyası',
      totalEvents: (count: number) => `Sistemdəki ümumi tədbirlər: ${count}`,
      occupancy: 'Zalın doluluğu',
      confirmed: 'Təsdiqləndi (RSVP)',
      pending: 'Gözləmədə',
      declined: 'İmtina edildi',
      chartTitle: '📈 Dəvət statuslarının ümumi diaqramı',
      confirmedLabel: 'Təsdiqləndi',
      pendingLabel: 'Gözləyir',
      declinedLabel: 'İmtina edildi',
      personUnit: 'nəfər',
      simulation: '⚙️ Məlumat Simulyasiyası / Parametr Tənzimləmələri',
      capacityLabel: 'Zalın tutumu:'
    }
  };

  const t = dict[lang] || dict.ru;

  useEffect(() => {
    async function loadRealData() {
      try {
        const { data: eventsData } = await supabase.from('events').select('id');
        const { data: guestsData } = await supabase.from('guests').select('status');

        if (eventsData) {
          setTotalEvents(eventsData.length);
        }

        if (guestsData && guestsData.length > 0) {
          const confirmed = guestsData.filter((g: any) => g.status === 'confirmed' || g.status === 'attending').length;
          const pending = guestsData.filter((g: any) => g.status === 'pending' || !g.status).length;
          const declined = guestsData.filter((g: any) => g.status === 'declined').length;

          if (confirmed + pending + declined > 0) {
            setConfirmedGuests(confirmed);
            setPendingGuests(pending);
            setDeclinedGuests(declined);
          }
        }
      } catch (err) {
        console.log('Using fallback analytics data');
      } finally {
        setLoading(false);
      }
    }

    loadRealData();
  }, []);

  const totalInvited = confirmedGuests + pendingGuests + declinedGuests;
  const occupancyRate = hallCapacity > 0 ? Math.round((confirmedGuests / hallCapacity) * 100) : 0;
  const confirmationRate = totalInvited > 0 ? Math.round((confirmedGuests / totalInvited) * 100) : 0;
  const pendingRate = totalInvited > 0 ? Math.round((pendingGuests / totalInvited) * 100) : 0;
  const declinedRate = totalInvited > 0 ? Math.round((declinedGuests / totalInvited) * 100) : 0;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
          {t.title}
        </h2>
        {totalEvents > 0 && (
          <span style={{ fontSize: '12px', padding: '4px 10px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '12px', fontWeight: '600' }}>
            {t.totalEvents(totalEvents)}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{t.occupancy}</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: occupancyRate > 100 ? '#dc2626' : '#2563eb' }}>
            {occupancyRate}%
          </div>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{t.confirmed}</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#16a34a' }}>
            {confirmationRate}%
          </div>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{t.pending}</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#d97706' }}>
            {pendingRate}%
          </div>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>{t.declined}</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#dc2626' }}>
            {declinedRate}%
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
        {t.chartTitle}
      </h3>
      
      <div style={{
        display: 'flex',
        height: '18px',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#e2e8f0',
        marginBottom: '12px'
      }}>
        <div style={{ width: `${confirmationRate}%`, backgroundColor: '#22c55e', transition: 'width 0.3s' }} title={t.confirmedLabel} />
        <div style={{ width: `${pendingRate}%`, backgroundColor: '#f59e0b', transition: 'width 0.3s' }} title={t.pendingLabel} />
        <div style={{ width: `${declinedRate}%`, backgroundColor: '#ef4444', transition: 'width 0.3s' }} title={t.declinedLabel} />
      </div>

      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '3px', display: 'inline-block' }}></span>
          {t.confirmedLabel}: {confirmedGuests} {t.personUnit}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '3px', display: 'inline-block' }}></span>
          {t.pendingLabel}: {pendingGuests} {t.personUnit}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '3px', display: 'inline-block' }}></span>
          {t.declinedLabel}: {declinedGuests} {t.personUnit}
        </div>
      </div>

      <details style={{ marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
        <summary style={{ cursor: 'pointer', fontWeight: '500' }}>{t.simulation}</summary>
        <div style={{ paddingTop: '12px', marginTop: '8px', borderTop: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>{t.confirmedLabel}:</label>
            <input type="number" value={confirmedGuests} onChange={(e) => setConfirmedGuests(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>{t.pendingLabel}:</label>
            <input type="number" value={pendingGuests} onChange={(e) => setPendingGuests(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>{t.declinedLabel}:</label>
            <input type="number" value={declinedGuests} onChange={(e) => setDeclinedGuests(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>{t.capacityLabel}</label>
            <input type="number" value={hallCapacity} onChange={(e) => setHallCapacity(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          </div>
        </div>
      </details>
    </div>
  );
};