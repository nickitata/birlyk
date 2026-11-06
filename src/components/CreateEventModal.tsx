import { useState } from 'react';
import { EventTemplateSelector } from './EventTemplateSelector';
import { TemplateId, PresetField, Lang } from '../lib/eventTemplates';
import { X, Calendar, MapPin, Sparkles, Check, Plus } from 'lucide-react';
import { useI18n } from '../lib/i18n';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (newEvent: any) => void;
}

// Переводы для заголовков и кнопок формы
const modalTranslations = {
  ru: {
    modalTitle: 'Создать новое мероприятие',
    nameLabel: 'Название мероприятия *',
    namePlaceholder: 'Например: Свадьба Айдара и Динары / Выпускной 2026',
    dateLabel: 'Дата проведения',
    locationLabel: 'Локация / Зал',
    locationPlaceholder: 'Ресторан, город...',
    cancelBtn: 'Отмена',
    submitBtn: 'Создать мероприятие',
    submittingBtn: 'Создание...',
  },
  en: {
    modalTitle: 'Create New Event',
    nameLabel: 'Event Title *',
    namePlaceholder: 'e.g., Aidar & Dinara Wedding / Graduation 2026',
    dateLabel: 'Event Date',
    locationLabel: 'Location / Venue',
    locationPlaceholder: 'Restaurant, city...',
    cancelBtn: 'Cancel',
    submitBtn: 'Create Event',
    submittingBtn: 'Creating...',
  },
  kk: {
    modalTitle: 'Жаңа іс-шара құру',
    nameLabel: 'Іс-шараның атауы *',
    namePlaceholder: 'Мысалы: Айдар мен Динараның тойы / Түлектер 2026',
    dateLabel: 'Өткізілу күні',
    locationLabel: 'Орны / Зал',
    locationPlaceholder: 'Ресторан, қала...',
    cancelBtn: 'Бас тарту',
    submitBtn: 'Іс-шараны құру',
    submittingBtn: 'Құрылуда...',
  },
  az: {
    modalTitle: 'Yeni tədbir yarat',
    nameLabel: 'Tədbirin adı *',
    namePlaceholder: 'Məsələn: Aydar və Dinara toyu / Məzuniyyət 2026',
    dateLabel: 'Keçirilmə tarixi',
    locationLabel: 'Məkan / Zal',
    locationPlaceholder: 'Restoran, şəhər...',
    cancelBtn: 'Ləğv et',
    submitBtn: 'Tədbiri yarat',
    submittingBtn: 'Yaradılır...',
  },
};

export function CreateEventModal({
  isOpen,
  onClose,
  onSubmitSuccess,
}: CreateEventModalProps) {
  const { lang } = useI18n();
  const t = modalTranslations[lang] || modalTranslations.ru;

  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('wedding');
  const [templateFields, setTemplateFields] = useState<PresetField[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectTemplate = (templateId: TemplateId, fields: PresetField[]) => {
    setSelectedTemplate(templateId);
    setTemplateFields(fields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newEventData = {
      title,
      event_date: eventDate,
      location,
      template_id: selectedTemplate,
      custom_fields_schema: templateFields,
      created_at: new Date().toISOString(),
    };

    console.log('Created event:', newEventData);

    setLoading(false);
    if (onSubmitSuccess) onSubmitSuccess(newEventData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#33211b] border border-[#4d352c] text-[#f7ece9] rounded-2xl p-6 shadow-2xl my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#d9d5d4] hover:text-[#fcd89a] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-[#fcd89a] mb-6">
          <Sparkles size={24} />
          <h2 className="text-xl font-bold">{t.modalTitle}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#d9d5d4] mb-1">
                {t.nameLabel}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.namePlaceholder}
                className="w-full px-4 py-2.5 bg-[#3f2b24] border border-[#4d352c] rounded-xl text-[#f7ece9] placeholder-[#d9d5d4]/50 focus:outline-none focus:border-[#fcd89a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#d9d5d4] mb-1 flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#fcd89a]" /> {t.dateLabel}
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#3f2b24] border border-[#4d352c] rounded-xl text-[#f7ece9] focus:outline-none focus:border-[#fcd89a]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#d9d5d4] mb-1 flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#fcd89a]" /> {t.locationLabel}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t.locationPlaceholder}
                  className="w-full px-4 py-2.5 bg-[#3f2b24] border border-[#4d352c] rounded-xl text-[#f7ece9] placeholder-[#d9d5d4]/50 focus:outline-none focus:border-[#fcd89a]"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#4d352c]" />

          <EventTemplateSelector
            currentLang={lang}
            onSelectTemplate={handleSelectTemplate}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#4d352c] text-[#d9d5d4] hover:bg-[#3f2b24] transition-colors text-sm font-medium"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#fcd89a] text-[#33211b] rounded-xl font-bold hover:brightness-105 transition shadow-lg text-sm"
            >
              {loading ? t.submittingBtn : t.submitBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}