import React, { useState } from 'react';

export const AnalyticsDashboard: React.FC = () => {
  // Исходные данные для анализа
  const [confirmedGuests, setConfirmedGuests] = useState<number>(85);
  const [pendingGuests, setPendingGuests] = useState<number>(25);
  const [declinedGuests, setDeclinedGuests] = useState<number>(10);
  const [hallCapacity, setHallCapacity] = useState<number>(150);

  // 1. Data Analysis (Математические вычисления и метрики)
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
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        📊 Data Analysis & Event Visualization (Аналитика мероприятия)
      </h2>

      {/* Метрики аналитики */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Заполняемость зала</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: occupancyRate > 100 ? '#dc2626' : '#2563eb' }}>
            {occupancyRate}%
          </div>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Подтвердили (RSVP)</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#16a34a' }}>
            {confirmationRate}%
          </div>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>В ожидании</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#d97706' }}>
            {pendingRate}%
          </div>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Отклонили</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#dc2626' }}>
            {declinedRate}%
          </div>
        </div>
      </div>

      {/* 2. Data Visualization (Визуализация статусов) */}
      <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px' }}>
        📈 Диаграмма статусов приглашений
      </h3>
      
      {/* Пропорциональная шкала */}
      <div style={{
        display: 'flex',
        height: '20px',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#e2e8f0',
        marginBottom: '12px'
      }}>
        <div style={{ width: `${confirmationRate}%`, backgroundColor: '#22c55e', transition: 'width 0.3s' }} title="Подтвердили" />
        <div style={{ width: `${pendingRate}%`, backgroundColor: '#f59e0b', transition: 'width 0.3s' }} title="В ожидании" />
        <div style={{ width: `${declinedRate}%`, backgroundColor: '#ef4444', transition: 'width 0.3s' }} title="Отклонили" />
      </div>

      {/* Легенда диаграммы */}
      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#22c55e', borderRadius: '3px', display: 'inline-block' }}></span>
          Подтвердили: {confirmedGuests} чел.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '3px', display: 'inline-block' }}></span>
          Ожидают: {pendingGuests} чел.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '3px', display: 'inline-block' }}></span>
          Отклонили: {declinedGuests} чел.
        </div>
      </div>

      {/* Интерактивная панель изменения значений */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Подтвердили:</label>
          <input type="number" value={confirmedGuests} onChange={(e) => setConfirmedGuests(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>В ожидании:</label>
          <input type="number" value={pendingGuests} onChange={(e) => setPendingGuests(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Отклонили:</label>
          <input type="number" value={declinedGuests} onChange={(e) => setDeclinedGuests(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '4px' }}>Вместимость зала:</label>
          <input type="number" value={hallCapacity} onChange={(e) => setHallCapacity(Number(e.target.value))} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
      </div>
    </div>
  )
}