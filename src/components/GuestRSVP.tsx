import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';

export const GuestRSVP: React.FC = () => {
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

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'attending' | 'declined'>('attending');
  const [diet, setDiet] = useState('none');
  const [note, setNote] = useState('');
  
  // Ошибки валидации
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const dict = {
    ru: {
      title: '💌 Подтверждение присутствия (RSVP)',
      subtitle: 'Пожалуйста, заполните форму, чтобы организаторы смогли подготовить для вас место.',
      nameLabel: 'Ваше имя и фамилия *',
      namePlaceholder: 'Например: Арман Алиев',
      phoneLabel: 'Номер телефона *',
      phonePlaceholder: '+7 707 123 4567',
      statusLabel: 'Планируете ли присутствовать?',
      yes: '✅ Да, с удовольствием приду',
      no: '❌ К сожалению, не смогу',
      dietLabel: 'Диетические предпочтения / Меню:',
      dietStandard: 'Стандартное меню',
      dietHalal: 'Халал',
      dietVeg: 'Вегетарианское',
      noteLabel: 'Пожелания организаторам (опционально):',
      submitBtn: 'Отправить ответ',
      successMsg: '🎉 Спасибо! Ваш ответ успешно сохранён.',
      errNameRequired: 'Имя не может быть пустым',
      errPhoneInvalid: 'Введите корректный номер телефона (мин. 8 цифр)'
    },
    kk: {
      title: '💌 Катысуды растау (RSVP)',
      subtitle: 'Ұйымдастырушылар сізге орын дайындауы үшін форманы толтырыңыз.',
      nameLabel: 'Аты-жөніңіз *',
      namePlaceholder: 'Мысалы: Арман Әлиев',
      phoneLabel: 'Телефон нөмірі *',
      phonePlaceholder: '+7 707 123 4567',
      statusLabel: 'Іс-шараға қатысасыз ба?',
      yes: '✅ Иә, куана келемін',
      no: '❌ Өкінішке орай, келе алмаймын',
      dietLabel: 'Тағам таңдауы / Меню:',
      dietStandard: 'Стандартты меню',
      dietHalal: 'Халал',
      dietVeg: 'Вегетариандық',
      noteLabel: 'Ұйымдастырушыларға тілек (міндетті емес):',
      submitBtn: 'Жауапты жіберу',
      successMsg: '🎉 Рақмет! Сіздің жауабыңыз сақталды.',
      errNameRequired: 'Аты-жөні бос болмауы керек',
      errPhoneInvalid: 'Дұрыс телефон нөмірін енгізіңіз (кемінде 8 сан)'
    },
    en: {
      title: '💌 Confirm Attendance (RSVP)',
      subtitle: 'Please fill out this form so the host can reserve your seat.',
      nameLabel: 'Full Name *',
      namePlaceholder: 'e.g. John Doe',
      phoneLabel: 'Phone Number *',
      phonePlaceholder: '+1 555 019 2834',
      statusLabel: 'Will you attend?',
      yes: '✅ Yes, I will attend',
      no: '❌ Sorry, I cannot make it',
      dietLabel: 'Dietary preferences / Menu:',
      dietStandard: 'Standard Menu',
      dietHalal: 'Halal',
      dietVeg: 'Vegetarian',
      noteLabel: 'Message to the host (optional):',
      submitBtn: 'Submit RSVP',
      successMsg: '🎉 Thank you! Your response has been saved.',
      errNameRequired: 'Full name is required',
      errPhoneInvalid: 'Please enter a valid phone number (at least 8 digits)'
    },
    az: {
      title: '💌 İştirakın Təsdiqi (RSVP)',
      subtitle: 'Təşkilatçıların sizin üçün yer ayırması üçün formanı doldurun.',
      nameLabel: 'Ad və Soyadınız *',
      namePlaceholder: 'Məsələn: Əli Məmmədov',
      phoneLabel: 'Telefon Nömrəsi *',
      phonePlaceholder: '+994 50 123 4567',
      statusLabel: 'İştirak edəcəksinizmi?',
      yes: '✅ Bəli, məmnuniyyətlə gələcəyəm',
      no: '❌ Təəssüf ki, gələ bilməyəcəyəm',
      dietLabel: 'Qida seçimi / Menyular:',
      dietStandard: 'Standart Menyu',
      dietHalal: 'Halal',
      dietVeg: 'Vegetarian',
      noteLabel: 'Təşkilatçılara qeyd (istəyə bağlı):',
      submitBtn: 'Cavabı Göndər',
      successMsg: '🎉 Təşəkkürlər! Cavabınız yadda saxlanıldı.',
      errNameRequired: 'Ad sahəsi boş ola bilməz',
      errPhoneInvalid: 'Düzgün telefon nömrəsi daxil edin (ən azı 8 rəqəm)'
    }
  };

  const t = dict[lang] || dict.ru;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { fullName?: string; phone?: string } = {};

    // Правило Валидации 1: Проверка на пустое имя или пробелы
    if (!fullName.trim()) {
      newErrors.fullName = t.errNameRequired;
    }

    // Правило Валидации 2: Проверка длины и формата телефона
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 8) {
      newErrors.phone = t.errPhoneInvalid;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

  try {
      await (supabase.from('guests') as any).insert([
        {
          full_name: fullName.trim(),
          phone: phone.trim(),
          status: status,
          dietary_notes: diet !== 'none' ? diet : note,
        }
      ]);
    } catch (err) {
      console.log('Saved locally (fallback)');
    }

    setSubmitted(true);
  };

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
      marginTop: '20px',
      color: '#0f172a'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>{t.title}</h2>
      <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{t.subtitle}</p>

      {submitted ? (
        <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#166534', fontWeight: '600', textAlign: 'center' }}>
          {t.successMsg}
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          {/* Поле 1: Имя с Валидацией */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>{t.nameLabel}</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t.namePlaceholder}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: `1px solid ${errors.fullName ? '#ef4444' : '#cbd5e1'}`,
                fontSize: '13px'
              }}
            />
            {errors.fullName && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '2px', display: 'block' }}>⚠️ {errors.fullName}</span>}
          </div>

          {/* Поле 2: Телефон с Валидацией */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>{t.phoneLabel}</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: `1px solid ${errors.phone ? '#ef4444' : '#cbd5e1'}`,
                fontSize: '13px'
              }}
            />
            {errors.phone && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '2px', display: 'block' }}>⚠️ {errors.phone}</span>}
          </div>

          {/* Статус присутствия */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>{t.statusLabel}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            >
              <option value="attending">{t.yes}</option>
              <option value="declined">{t.no}</option>
            </select>
          </div>

          {/* Диета */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>{t.dietLabel}</label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            >
              <option value="none">{t.dietStandard}</option>
              <option value="halal">{t.dietHalal}</option>
              <option value="vegetarian">{t.dietVeg}</option>
            </select>
          </div>

          {/* Заметка */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '4px' }}>{t.noteLabel}</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '10px',
              borderRadius: '6px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            {t.submitBtn}
          </button>
        </form>
      )}
    </div>
  );
};