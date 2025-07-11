import type { SectionGroup, ChecklistSections } from '../types';

export const ConsumablesGroups: SectionGroup[] = [
  {
    group: "Потрошен материјал за во Кујна",
    sections: ["Кујна"],
  },
  {
    group:
      "Потрошен материјал за во Купатило",
    sections: ["Купатило"],
  },
  {
    group: "Останато",
    sections: [
      "Дневна",
      "Минибар",
      "Ходник",
    ],
  },
];

export const ConsumablesSections: ChecklistSections = {
  Кујна: [
    "Сјај за судови, сунгерчиња",
    "Средства за чистење (Професионално, ДеГрас, Плотна)",
    "Таблети за машина за миење садови",
    "Кеси за ѓубре",
    "Брисачи (ролна хартија)",
    "Влажни марамици",
    "Крпи за прашина (Виледа и памучни)",
    "Сол, шеќер, масло, оцат, зачини",
    "Кафе/Чај/Бомбони/Вода",
  ],
  Купатило: [
    "Тоалетна хартија",
    "Сапун за раце (течен + еднократни)",
    "Четкица и паста за заби (еднократни)",
    "Памучни туфери",
    "Стапчиња за уши",
    "Детерџент/Таблети за перење алишта",
    "Освежувач за воздух (спреј)",
    "Освежувач за ВЦ школка (Bref)",
    "Средство за дезинфекција WC школка (Domestos)",
    "Средство за дезинфекција на површини и предмети (Арис Sanisan)",
    "Средство против каменац (DM)",
    "Средство за чистење на плочки или работни површини",
    "Ракавици за чистење",
  ],
  Дневна: [
    "Батерие за даљинско",
    "Сијалици за Лустер",
    "Сијалица за Столна лампа",
  ],
  Минибар: [
    "5 Вина (700ml секое)",
    "4 Жестоки пијалоци (50ml секое)",
    "2 Мали вина (190ml секое)",
    "3 Грицки (чипс, јаткасти плодови итн.)",
  ],
  Ходник: [
    "Боја за ципеле (2)",
    "Ролер за чистење влакна (1)",
  ],
}; 