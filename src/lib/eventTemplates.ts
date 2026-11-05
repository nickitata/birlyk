export type Lang = 'ru' | 'en' | 'kk' | 'az';

export type TemplateId = 'wedding' | 'academic' | 'meeting' | 'custom';

export interface TemplateOption {
  id: string;
  labels: Record<Lang, string>;
}

export interface PresetField {
  id: string;
  title: Record<Lang, string>;
  type: 'select' | 'checkbox' | 'text' | 'number' | 'tags';
  enabled: boolean;
  options?: TemplateOption[];
}

export interface EventTemplate {
  id: TemplateId;
  icon: string;
  title: Record<Lang, string>;
  description: Record<Lang, string>;
  fields: PresetField[];
}

export const EVENT_TEMPLATES: Record<TemplateId, EventTemplate> = {
  // 1. СВАДЬБА / TOY
  wedding: {
    id: 'wedding',
    icon: '💍',
    title: {
      ru: 'Свадьба / Узату / Той',
      en: 'Wedding / Reception',
      kk: 'Той / Ұзату / Үйлену тойы',
      az: 'Toy / Nişan рәсмі',
    },
    description: {
      ru: 'Родственные связи, предпочтения в еде, учет детей для детской зоны и плюсы',
      en: 'Kinship, dietary restrictions, kids zone tracking and plus-ones',
      kk: 'Тұстық/Ағайындық байланыс, тамақ таңдауы, балалар аймағы мен қонақтар',
      az: 'Qohumluq əlaqələрі, yemək seçimləri, uşaq zonası və qonaqlar',
    },
    fields: [
      {
        id: 'family_relation',
        type: 'select',
        enabled: true,
        title: {
          ru: 'Сторона / Родственная связь',
          en: 'Family Side / Relation',
          kk: 'Қай тарап / Тұстық қатынас',
          az: 'Tərəf / Qohumluq dərəcəsi',
        },
        options: [
          { id: 'groom_family', labels: { ru: 'Сторона жениха', en: "Groom's family", kk: 'Күйеу тарап', az: 'Bəy tərəfi' } },
          { id: 'bride_family', labels: { ru: 'Сторона невесты', en: "Bride's family", kk: 'Келін тарап', az: 'Gəlin tərəfi' } },
          { id: 'friends', labels: { ru: 'Друзья / Коллеги', en: 'Friends / Colleagues', kk: 'Достар / Әріптестер', az: 'Dostlar / Həmkar' } },
        ],
      },
      {
        id: 'dietary_pref',
        type: 'select',
        enabled: true,
        title: {
          ru: 'Предпочтения в еде и аллергии',
          en: 'Dietary Preferences & Allergies',
          kk: 'Тамақ қалаулары мен аллергия',
          az: 'Yemək üstünlükləri və allergiyalar',
        },
        options: [
          { id: 'standard', labels: { ru: 'Без ограничений', en: 'Standard / No restrictions', kk: 'Шектеусіз', az: 'Məhdudiyyətsiz' } },
          { id: 'halal', labels: { ru: 'Халяль', en: 'Halal', kk: 'Халал', az: 'Halal' } },
          { id: 'vegetarian', labels: { ru: 'Вегетарианское', en: 'Vegetarian', kk: 'Вегетариандық', az: 'Vegetarian' } },
          { id: 'allergies', labels: { ru: 'Есть аллергии (указать)', en: 'Has allergies (specify)', kk: 'Аллергиясы бар', az: 'Allergiyası var' } },
        ],
      },
      {
        id: 'kids_count',
        type: 'number',
        enabled: true,
        title: {
          ru: 'Количество детей (для игровой зоны)',
          en: 'Number of children (for kids zone)',
          kk: 'Балалар саны (балалар аймағы үшін)',
          az: 'Uşaq sayı (oyun zonası üçün)',
        },
      },
      {
        id: 'plus_ones_names',
        type: 'text',
        enabled: true,
        title: {
          ru: 'Имена сопровождающих (+1)',
          en: 'Names of plus-ones',
          kk: 'Сүйемелдеуші қонақтардың есімдері',
          az: 'Müşayiət edən şəxslərin adları',
        },
      },
    ],
  },

  // 2. УЧЕБА / АКАДЕМИЧЕСКОЕ
  academic: {
    id: 'academic',
    icon: '🎓',
    title: {
      ru: 'Школьное / Университетское',
      en: 'School / University Event',
      kk: 'Мектеп / Университет шарасы',
      az: 'Məktəb / Universitet tədbiri',
    },
    description: {
      ru: 'Разбивка по интересам, факультетам и пожеланиям «с кем сидеть»',
      en: 'Grouping by interests, faculties, and seating preferences',
      kk: 'Қызығушылықтар, факультеттер және «кіммен отыру» қалаулары',
      az: 'Maraqlar, fakültələr və "kiminlə oturmaq" istəkləri',
    },
    fields: [
      {
        id: 'faculty_class',
        type: 'text',
        enabled: true,
        title: {
          ru: 'Класс / Факультет / Группа',
          en: 'Class / Faculty / Group',
          kk: 'Сынып / Факультет / Топ',
          az: 'Sinif / Fakültə / Qrup',
        },
      },
      {
        id: 'interests',
        type: 'tags',
        enabled: true,
        title: {
          ru: 'Интересы и хобби',
          en: 'Interests & Hobbies',
          kk: 'Қызығушылықтар мен хобби',
          az: 'Maraqlar və hobbilər',
        },
      },
      {
        id: 'sit_with_preference',
        type: 'text',
        enabled: true,
        title: {
          ru: 'С кем предпочтительно сидеть рядом',
          en: 'Preferred seating partners',
          kk: 'Кіммен қатар отырғысы келеді',
          az: 'Kiminlə yanaşı oturmaq istəyir',
        },
      },
    ],
  },

  // 3. СОБРАНИЕ / МЕРОПРИЯТИЕ
  meeting: {
    id: 'meeting',
    icon: '💼',
    title: {
      ru: 'Деловое собрание / Конференция',
      en: 'Business Meeting / Conference',
      kk: 'Іскерлік жиын / Конференция',
      az: 'Biznes iclası / Konfrans',
    },
    description: {
      ru: 'Должности, названия компаний и вопросы к повестке дня',
      en: 'Job titles, company names, and agenda items',
      kk: 'Лауазымдар, компания атаулары және күн тәртібі',
      az: 'Vəzifələr, şirkət adları və gündəlik məsələlər',
    },
    fields: [
      {
        id: 'company_role',
        type: 'text',
        enabled: true,
        title: {
          ru: 'Компания и Должность',
          en: 'Company & Position',
          kk: 'Компания және Лауазымы',
          az: 'Şirkət və Vəzifə',
        },
      },
    ],
  },

  // 4. КАСТОМНЫЙ КОНСТРУКТОР
  custom: {
    id: 'custom',
    icon: '⚙️',
    title: {
      ru: 'Свой сценарий (Конструктор)',
      en: 'Custom Event (Constructor)',
      kk: 'Жеке сценарий (Конструктор)',
      az: 'Xüsusi ssenari (Konstruktor)',
    },
    description: {
      ru: 'Полностью ручная настройка: включайте любые опции и создавайте свои поля',
      en: 'Full manual setup: toggle options and build your own fields',
      kk: 'Толық қолмен баптау: кез келген опцияны қосып, өз өрістеріңізді жасаңыз',
      az: 'Tam əllə tənzimləmə: istənilən seçimləri qoşun və öz sahələrinizi yaradın',
    },
    fields: [],
  },
};