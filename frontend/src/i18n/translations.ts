export type Lang = 'RU' | 'KZ';
export function tr(
  lang: Lang,
  key: TranslationKey,
  params?: Record<string, string | number>
): string {
  let str = translations[lang][key] ?? translations.RU[key] ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replaceAll(`{{${k}}}`, String(v));
    });
  }
  return str;
}

const RU = {

 // ── Онбординг ───────────────────────────────────────────────────────────────
appTitle:           'Моя ферма',
farmerName:         'Имя фермера',
start:              'Начать',
welcome:            'Добро пожаловать на нашу ферму!',
welcomeSub:         'Начнём путь фермера прямо сейчас! 🌿',
pwaHint:            'Поделиться → На экран Домой',

  // ── Табы ────────────────────────────────────────────────────────────────────
  tabFarm:            'Ферма',
  tabFish:            'Рыба',
  tabBee:             'Ульи',
  tabMarket:          'Рынок',
  tabProfile:         'Профиль',

 // ── ActionDock ──────────────────────────────────────────────────────────────
 careWater:          '5 раз полить',
 careOxygen:         '5 раз O₂',
 careSyrup:          '5 раз сироп',
 harvestReady:       '🎉 Урожай готов!',
 progressText:       '{{percent}}% · ещё {{days}} д',
 harvestBtn:         '🎁 Собрать',

 // ── SideActions + NutrientsBadge ────────────────────────────────────────────
 sideReward:         'Награда',
 sideChallenge:      'Челлендж',
 sideHousehold:      'Хозяйство',
 sideStorage:        'Склад',
 sideFriends:        'Друзья',
 sideHot:            'Горячее',
 sideCulture:        'Культура',
 nutrientsBadge:     'Удобрение',

 // ── GameScene — BottomSheet ─────────────────────────────────────────────────
  adviceTitle:        'Совет помощницы',
  advicePlan:         '📋 План',
  nutrientsTitle:     'Удобрения',
  nutrientsConfirm:   'Применить 1 удобрение?\nРост ускорится на 3%',
  cancel:             'Отмена',
  apply:              'Применить',
  noResTitle:         'Не хватает',
  noResText:          'Нужно 125 г, у вас {{amount}} г',
  getDayBonus:        'Забрать бонус дня',
  harvestDoneTitle:   '🎉 Урожай собран!',
  harvestDoneText:    'Товар на складе!',
  enterAddress:       'Ввести адрес',

  // ── HUD ─────────────────────────────────────────────────────────────────────
  coins:              'монеты',
  goodness:           'добро',
  goodnessTitle:      'Поток Добра',
  goodnessLevel:      'Уровень {{level}}',
  goodnessRow1:       '✅ Вход каждый день: +10',
  goodnessRow2:       '💧 Уход ×5: +1 (макс 20/день)',
  goodnessRow3:       '🌾 Сбор урожая: +15',
  goodnessRow4:       '⭐ Качество ≥90%: +5',
  goodnessToday:      'Сегодня начислено: {{count}} / 20',

  // ── ProfileScreen ───────────────────────────────────────────────────────────
  profileWarehouse:   '📦 Склад ({{count}})',
  profileEmpty:       'Пусто — соберите урожай!',
  profileOrders:      '📋 Заказы ({{count}})',
  profileNoOrders:    'Нет заказов',
  profileDelivery:    '🚚 Доставка',
  profileCode:        'Код:',
  placeholderFio:     'ФИО',
  placeholderPhone:   'Телефон',
  placeholderCity:    'Город',
  placeholderAddress: 'Адрес',
  productCarrot:      'Морковь',
  productApple:       'Яблоки',
  productTrout:       'Форель',
  productHoney:       'Мёд',
  statusCreated:      'Создан',
  statusConfirmed:    'Подтверждён',
  statusPreparing:    'Готовится',
  statusDelivering:   'Доставка',
  statusDelivered:    'Доставлен',
  statusCancelled:    'Отменён',

  // ── MarketScreen ────────────────────────────────────────────────────────────
  marketTitle:        'Групповые покупки',
  marketSubtitle:     'от фермеров напрямую',
  marketSearch:       'поиск товаров',
  catAll:             'Все',
  catFruits:          'Фрукты',
  catVeggies:         'Овощи',
  catGreens:          'Зелень',
  catHoney:           'Мёд',
  savings:            'Экономия {{amount}}₸',
  participants:       'участников {{count}} из {{max}}',
  join:               'Присоединиться',
  joined:             '✓ Вступил',
  timeLeft:           'до закрытия {{time}} ⏱',

  // ── SingleBuyScreen ─────────────────────────────────────────────────────────
  buyTitle:           'Купить коробку',
  buySubtitle:        'от реального фермера',
  buyFarmerCaption:   'Твой урожай собирает настоящий фермер',
  howItWorks:         'Как это работает',
  chooseBox:          'Выбери коробку',
  buyFor:             'Купить за {{price}}₸',
  orderPlaced:        '✓ Заказ оформлен!',
  stepCareTitle:      'Ты ухаживаешь',
  stepCareDesc:       'Поливаешь и удобряешь растения в игре',
  stepHarvestTitle:   'Фермер собирает',
  stepHarvestDesc:    'Когда урожай готов — реальный фермер собирает твою коробку',
  stepDeliverTitle:   'Мы доставляем',
  stepDeliverDesc:    'Свежий продукт приезжает прямо к тебе домой',
  boxCarrotName:      'Морковь',
  boxCarrotDesc:      'Фермер вырастил — мы доставим',
  boxAppleName:       'Яблоки',
  boxAppleDesc:       'Сорвано в день отправки',
  boxHoneyName:       'Мёд',
  boxHoneyDesc:       'Прямо с пасеки, без посредников',
  boxTroutName:       'Форель',
  boxTroutDesc:       'Охлаждённая, в день вылова',

  // ── Метки игровых объектов ──────────────────────────────────────────────────
  labelCarrot:        'Это морковь',
  labelApple:         'Это яблоня',
  labelTrout:         'Это форель',
  labelBee:           'Это пчёлы',

  // ── aiAdvisor ───────────────────────────────────────────────────────────────
  aiHarvestReady:     'Урожай готов! Нажмите «Собрать».',
  aiLowRes:           'Мало {{res}}. Заберите бонус!',
  aiHasNutrients:     'У вас {{count}} удобрений (+3% каждое).',
  aiAlmostDone:       'Почти готово! {{days}} дн.',
  aiProgress:         'Прогресс {{percent}}%. Ухаживайте регулярно.',
  aiCareMore:         'Полейте ещё {{count}} раз',
  aiCareMax:          'Буст ухода макс!',
  aiNutrientTip:      'Удобрение +3%',
  aiNutrientMax:      'Удобрения на максимуме',
  aiResOk:            'Хватит на {{count}} действий',
  aiResLow:           'Пополните {{res}}',
  aiPlanWater:        'Полить {{count}}×5',
  aiPlanNutrient:     'Удобрение (+3%)',
  aiPlanGoodness:     '+{{count}} Добра',
  aiPlanVisit:        'Зайдите завтра!',
  resWater:           'воды',
  resOxygen:          'кислорода',
  resSyrup:           'сиропа',

  // ── FriendsModal ─────────────────────────────────────────────────────────────
friendsTitle:         'Друзья',
friendsToday:         'Сегодня',
friendsSashaGarden:   'Сад Саши',
friendsAltynaiGarden: 'Сад Алтынай',
friendsVisit:         'Посетить',
friendsInvite:        'Пригласить друзей',
friendsPromo:         'Приглашайте друзей на ферму и получите бонусные очки!',

// ── VisitFriendModal ──────────────────────────────────────────────────────────
visitTitle:      'Поможем другу',
visitGardenOf:   'Это сад {{name}}',
visitMessage:    '{{name}} не заходил в игру больше дня, сад стал портиться. Давай поможем!',
visitWater:      'полить',
visitFertilize:  'удобрить',
visitHelp:       'Помочь',
visitTimeLeft:   'Осталось {{time}}',
visitSendGift:   '🎁отправить подарок',


 
} as const;
 
// ─────────────────────────────────────────────────────────────────────────────
// Экспортируемый тип ключа — используется в useTranslation для автодополнения
// ─────────────────────────────────────────────────────────────────────────────
export type TranslationKey = keyof typeof RU;
 
const KZ: Record<TranslationKey, string> = {
 
  // ── Онбординг ───────────────────────────────────────────────────────────────
  appTitle:           'Менің фермам',
  farmerName:         'Фермер аты',
  start:              'Бастау',
  welcome:            'Біздің фермаға қош келдіңіз!',
  welcomeSub:         'Фермердің жолын қазір бастайық! 🌿',
  pwaHint:            'Бөлісу → Негізгі экранға',
 
  // ── Табы ────────────────────────────────────────────────────────────────────
  tabFarm:            'Ферма',
  tabFish:            'Балық',
  tabBee:             'Ара',
  tabMarket:          'Базар',
  tabProfile:         'Профиль',
 
  // ── ActionDock ──────────────────────────────────────────────────────────────
  careWater:          '5 рет суару',
  careOxygen:         '5 рет O₂',
  careSyrup:          '5 рет шәрбат',
  harvestReady:       '🎉 Өнім дайын!',
  progressText:       '{{percent}}% · тағы {{days}} күн',
  harvestBtn:         '🎁 Жинау',

  // ── SideActions + NutrientsBadge ────────────────────────────────────────────
sideReward:       'Сыйлық',
sideChallenge:    'Тапсырма',
sideHousehold:    'Шаруашылық',
sideStorage:      'Қойма',
sideFriends:      'Достар',
sideHot:          'Ыстық',
sideCulture:      'Дақыл',
nutrientsBadge:   'Тыңайтқыш',

 
  // ── GameScene — BottomSheet ─────────────────────────────────────────────────
  adviceTitle:        'Көмекшінің кеңесі',
  advicePlan:         '📋 Жоспар',
  nutrientsTitle:     'Тыңайтқыштар',
  nutrientsConfirm:   '1 тыңайтқыш қолдану?\nӨсу 3%-ға жылдамдайды',
  cancel:             'Болдырмау',
 apply:              'Қолдану',
  noResTitle:         'Жеткіліксіз',
  noResText:          '125 г қажет, сізде {{amount}} г',
  getDayBonus:        'Күн бонусын алу',
  harvestDoneTitle:   '🎉 Өнім жиналды!',
  harvestDoneText:    'Тауар қоймада!',
  enterAddress:       'Мекенжай енгізу',
 
 // ── HUD ─────────────────────────────────────────────────────────────────────
  coins:              'монета',
  goodness:           'қайырым',
  goodnessTitle:      'Қайырымдылық',
  goodnessLevel:      '{{level}} деңгей',
  goodnessRow1:       '✅ Күн сайын кіру: +10',
  goodnessRow2:       '💧 Күтім ×5: +1 (макс 20/күн)',
  goodnessRow3:       '🌾 Өнім жинау: +15',
  goodnessRow4:       '⭐ Сапасы ≥90%: +5',
  goodnessToday:      'Бүгін есептелді: {{count}} / 20',
 
  // ── ProfileScreen ───────────────────────────────────────────────────────────
  profileWarehouse:   '📦 Қойма ({{count}})',  profileEmpty:       'Бос — өнімді жинаңыз!',
  profileOrders:      '📋 Тапсырыстар ({{count}})',
  profileNoOrders:    'Тапсырыс жоқ',
  profileDelivery:    '🚚 Жеткізу',
  profileCode:        'Код:',
  placeholderFio:     'Аты-жөні',
  placeholderPhone:   'Телефон',
  placeholderCity:    'Қала',
  placeholderAddress: 'Мекенжай',
  productCarrot:      'Сәбіз',
  productApple:       'Алма',
  productTrout:       'Форель',
  productHoney:       'Бал',
  statusCreated:      'Жасалды',
  statusConfirmed:    'Расталды',
  statusPreparing:    'Дайындалуда',
  statusDelivering:   'Жеткізілуде',
  statusDelivered:    'Жеткізілді',
  statusCancelled:    'Болдырылмады',
 
  // ── MarketScreen ────────────────────────────────────────────────────────────
  marketTitle:        'Топтық сатып алу',
  marketSubtitle:     'фермерлерден тікелей',
  marketSearch:       'тауарларды іздеу',
  catAll:             'Барлығы',
  catFruits:          'Жемістер',
  catVeggies:         'Көкөністер',
  catGreens:          'Жасыл',
  catHoney:           'Бал',
  savings:            'Үнемдеу {{amount}}₸',
  participants:       '{{count}} / {{max}} қатысушы',
  join:               'Қосылу',
  joined:             '✓ Қосылды',
  timeLeft:           'жабылуға {{time}} қалды ⏱',
 
  // ── SingleBuyScreen ─────────────────────────────────────────────────────────
  buyTitle:           'Қорап сатып алу',
  buySubtitle:        'нақты фермерден',
  buyFarmerCaption:   'Нақты фермер сенің өніміңді жинайды',
  howItWorks:         'Бұл қалай жұмыс істейді',
  chooseBox:          'Қорапты таңда',
  buyFor:             '{{price}}₸-ға сатып алу',
  orderPlaced:        '✓ Тапсырыс рәсімделді!',
  stepCareTitle:      'Сен күтесің',
  stepCareDesc:       'Ойында өсімдіктерді суарып, тыңайтасың',
  stepHarvestTitle:   'Фермер жинайды',
  stepHarvestDesc:    'Өнім дайын болғанда — нақты фермер сенің қорабыңды жинайды',
  stepDeliverTitle:   'Біз жеткіземіз',
  stepDeliverDesc:    'Жаңа өнім тікелей үйіңе жетеді',
  boxCarrotName:      'Сәбіз',
  boxCarrotDesc:      'Фермер өсірді — біз жеткіземіз',
  boxAppleName:       'Алма',
  boxAppleDesc:       'Жіберілген күні жиналған',
  boxHoneyName:       'Бал',
  boxHoneyDesc:       'Тікелей арадан, делдалсыз',
  boxTroutName:       'Форель',
  boxTroutDesc:       'Суытылған, аулаған күні',
 
  // ── Метки игровых объектов ──────────────────────────────────────────────────
  labelCarrot:        'Бұл сәбіз',
  labelApple:         'Бұл алма ағашы',
  labelTrout:         'Бұл форель',
  labelBee:           'Бұл аралар',
 
  // ── aiAdvisor ───────────────────────────────────────────────────────────────
  aiHarvestReady:     'Өнім дайын! «Жинау» батырмасын басыңыз.',
  aiLowRes:           '{{res}} аз. Бонусты алыңыз!',
  aiHasNutrients:     'Сізде {{count}} тыңайтқыш (+3% әрқайсысы).',
  aiAlmostDone:       'Дерлік дайын! {{days}} күн.',
  aiProgress:         'Прогресс {{percent}}%. Күтімді жүйелі жүргізіңіз.',
  aiCareMore:         'Тағы {{count}} рет суарыңыз',
  aiCareMax:          'Күтім бусты макс!',
  aiNutrientTip:      'Тыңайтқыш +3%',  aiNutrientMax:      'Тыңайтқыштар максимумда',
  aiResOk:            '{{count}} әрекетке жетеді',
  aiResLow:           '{{res}} толтырыңыз',
  aiPlanWater:        '{{count}}×5 суарыңыз',
  aiPlanNutrient:     'Тыңайтқыш (+3%)',
  aiPlanGoodness:     '+{{count}} қайырым',
  aiPlanVisit:        'Ертең кіріңіз!',
  resWater:           'су',
  resOxygen:          'оттегі',
  resSyrup:           'шәрбат',

  // ── FriendsModal ─────────────────────────────────────────────────────────────
friendsTitle:         'Достар',
friendsToday:         'Бүгін',
friendsSashaGarden:   'Сашаның бағы',
friendsAltynaiGarden: 'Алтынайдың бағы',
friendsVisit:         'Бару',
friendsInvite:        'Достарды шақыру',
friendsPromo:         'Достарыңды фермаға шақыр және бонустық ұпай ал!',

// ── VisitFriendModal ──────────────────────────────────────────────────────────
visitTitle:      'Досқа көмектесейік',
visitGardenOf:   'Бұл {{name}} бағы',
visitMessage:    '{{name}} бір күннен астам ойынға кірмеді, бағы бүліне бастады. Көмектесейік!',
visitWater:      'суару',
visitFertilize:  'тыңайту',
visitHelp:       'Көмектесу',
visitTimeLeft:   'Қалды {{time}}',
visitSendGift:   '🎁сыйлық жіберу',

 
};
 
export const translations: Record<Lang, Record<TranslationKey, string>> = { RU, KZ };
 