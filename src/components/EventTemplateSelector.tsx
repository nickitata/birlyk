import { useState } from 'react';
import { EVENT_TEMPLATES, TemplateId, Lang } from '../lib/eventTemplates';
import { Check, Plus } from 'lucide-react';

interface Props {
  currentLang?: Lang;
  onSelectTemplate: (templateId: TemplateId, customFields: any[]) => void;
}

const selectorTranslations = {
  ru: {
    sectionTitle: 'Выберите тип мероприятия / Выбор сценария',
    includedFields: 'Включённые поля для гостей',
    customNotice: 'В кастомном шаблоне вы можете добавить любые уникальные поля вручную.',
    addField: '+ Добавить своё поле',
  },
  en: {
    sectionTitle: 'Select Event Type / Template',
    includedFields: 'Included Guest Fields',
    customNotice: 'In a custom template, you can manually add any unique fields.',
    addField: '+ Add custom field',
  },
  kk: {
    sectionTitle: 'Іс-шара түрін / Сценарийді таңдаңыз',
    includedFields: 'Қонақтарға арналған енгізілген өрістер',
    customNotice: 'Кастомды шаблонда кез келген бірегей өрістерді қолмен қоса аласыз.',
    addField: '+ Өз өрісіңді қосу',
  },
  az: {
    sectionTitle: 'Tədbir növünü / Ssenarini seçin',
    includedFields: 'Qonaqlar üçün daxil edilmiş sahələr',
    customNotice: 'Fərdi şablonda istənilən unikal sahələri əl ilə əlavə edə bilərsiniz.',
    addField: '+ Öz sahəni əlavə et',
  },
};

export function EventTemplateSelector({ currentLang = 'ru', onSelectTemplate }: Props) {
  const t = selectorTranslations[currentLang] || selectorTranslations.ru;
  const [selected, setSelected] = useState<TemplateId>('wedding');
  const [activeFields, setActiveFields] = useState(EVENT_TEMPLATES.wedding.fields);

  const handleSelect = (id: TemplateId) => {
    setSelected(id);
    setActiveFields(EVENT_TEMPLATES[id].fields);
    onSelectTemplate(id, EVENT_TEMPLATES[id].fields);
  };

  return (
    <div className="space-y-6 text-[#f7ece9]">
      <h3 className="text-lg font-bold text-[#fcd89a]">
        {t.sectionTitle}
      </h3>

      {/* Карточки типов */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(EVENT_TEMPLATES).map((tpl) => {
          const isSelected = selected === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelect(tpl.id as TemplateId)}
              className={`p-4 rounded-xl text-left border transition relative flex items-start gap-3 ${
                isSelected
                  ? 'bg-[#3f2b24] border-[#fcd89a] ring-1 ring-[#fcd89a]'
                  : 'bg-[#33211b] border-[#4d352c] hover:bg-[#3f2b24]/50'
              }`}
            >
              <span className="text-2xl">{tpl.icon}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{tpl.title[currentLang]}</h4>
                <p className="text-xs text-[#d9d5d4] mt-1">{tpl.description[currentLang]}</p>
              </div>
              {isSelected && (
                <span className="bg-[#fcd89a] text-[#33211b] p-1 rounded-full">
                  <Check size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Список включённых полей выбранного шаблона */}
      <div className="bg-[#3f2b24] p-4 rounded-xl border border-[#4d352c] space-y-3">
        <h4 className="text-sm font-semibold text-[#fcd89a] flex justify-between items-center">
          <span>{t.includedFields} ({activeFields.length})</span>
          {selected === 'custom' && (
            <button type="button" className="text-xs text-[#fcd89a] underline flex items-center gap-1">
              <Plus size={12} /> {t.addField}
            </button>
          )}
        </h4>

        {activeFields.length === 0 ? (
          <p className="text-xs text-[#d9d5d4]">В кастомном шаблоне вы можете добавить любые уникальные поля вручную.</p>
        ) : (
          <div className="space-y-2">
            {activeFields.map((field) => (
              <div key={field.id} className="flex items-center justify-between text-xs bg-[#33211b] p-2.5 rounded-lg border border-[#4d352c]">
                <span>{field.title[currentLang]}</span>
                <span className="text-[#d9d5d4] uppercase text-[10px] bg-[#483129] px-2 py-0.5 rounded">
                  {field.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}