import { useState } from 'react';
import { Camera, Edit3, Mail, Phone, MapPin, Calendar, Plus, ExternalLink } from 'lucide-react';

export function OrganizerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Мерей Алиева",
    role: "Старший организатор мероприятий",
    agency: "Birlyk Events",
    email: "merey@example.com",
    phone: "+7 (777) 123-45-67",
    city: "Алматы / Астана",
    bio: "Организую свадьбы и масштабные частные мероприятия «под ключ». Более 3 лет работы с площадками и интеграцией AI-рассадки гостей.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    tags: ["Свадьбы", "Юбилеи", "VIP-Корпоративы"]
  });

  // Статистические показатели
  const stats = [
    { label: "Всего проектов", value: "28" },
    { label: "Активные", value: "4" },
    { label: "Обработано гостей", value: "1,450+" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-[#33211b] dark:text-[#f7ece9]">
      
      {/* 1. БАННЕР И АВАТАР */}
      <div className="relative bg-[#3f2b24] dark:bg-[#3f2b24] rounded-2xl p-6 border border-[#4d352c] shadow-lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Аватар с кнопкой замены фото */}
          <div className="relative group">
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="w-28 h-28 rounded-full object-cover border-4 border-[#fcd89a] shadow-md"
            />
            <label className="absolute bottom-0 right-0 bg-[#fcd89a] text-[#33211b] p-2 rounded-full cursor-pointer hover:scale-110 transition shadow">
              <Camera size={16} />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {/* Загрузка фото в Supabase Storage */}} />
            </label>
          </div>

          {/* Имя и контакты */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-[#d9d5d4] text-sm">{profile.role} • <span className="text-[#fcd89a]">{profile.agency}</span></p>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#fcd89a] text-[#33211b] font-medium rounded-xl hover:brightness-105 transition"
              >
                <Edit3 size={16} />
                Редактировать
              </button>
            </div>

            {/* Теги специализации */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              {profile.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-[#483129] border border-[#4d352c] text-[#f7ece9] rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. СТАТИСТИКА */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#3f2b24] border border-[#4d352c] rounded-xl p-4 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#fcd89a]">{stat.value}</div>
            <div className="text-xs sm:text-sm text-[#d9d5d4] mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 3. ПОДРОБНАЯ ИНФОРМАЦИЯ И КОНТАКТЫ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Контактный блок */}
        <div className="bg-[#3f2b24] border border-[#4d352c] rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-lg border-b border-[#4d352c] pb-2 text-[#fcd89a]">Контакты</h2>
          
          <div className="space-y-3 text-sm text-[#d9d5d4]">
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-[#fcd89a]" />
              <span>{profile.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-[#fcd89a]" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-[#fcd89a]" />
              <span>{profile.city}</span>
            </div>
          </div>
        </div>

        {/* Описание / Био */}
        <div className="md:col-span-2 bg-[#3f2b24] border border-[#4d352c] rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-lg border-b border-[#4d352c] pb-2 text-[#fcd89a]">О себе</h2>
          <p className="text-sm text-[#d9d5d4] leading-relaxed">
            {profile.bio}
          </p>
        </div>
      </div>

    </div>
  );
}