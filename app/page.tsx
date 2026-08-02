"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Day = {
  date: string;
  city: string;
  title: string;
  kind: "дорога" | "горы" | "море" | "пауза";
  tempo: string;
  intro: string;
  stops: string[];
  risk: string;
};

type Highlight = {
  place: string;
  tag: string;
  image: string;
  credit: string;
  lead: string;
  picks: [name: string, priority: string, description: string][];
  source: string;
  sourceLabel: string;
  guide: {
    location: string;
    famousFor: string;
    story: string[];
    facts: string[];
    details: [title: string, note: string][];
    route: [stop: string, note: string][];
    routeTime: string;
    choice: string;
    sources?: [label: string, url: string][];
  };
};

const days: Day[] = [
  { date: "06.08", city: "Златибор", title: "Белград - Златибор", kind: "дорога", tempo: "переезд", intro: "Первый ритм поездки: спокойно добраться, заселиться в Pine Cabins Zlatibor и оставить вечер свободным.", stops: ["Старт из Белграда", "Заезд после 14:00", "Короткая прогулка и ужин"], risk: "Маршрут дороги, остановки и парковка требуют проверки." },
  { date: "07.08", city: "Златибор", title: "День над соснами", kind: "горы", tempo: "средний", intro: "Gold Gondola остается главным событием. После нее только легкая программа, без гонки по достопримечательностям.", stops: ["Gold Gondola Zlatibor", "Прогулка на Tornik", "Отдых и подготовка к границе"], risk: "Проверить погоду, режим работы, билеты и парковку." },
  { date: "08.08", city: "Гусине", title: "Через границу к Проклетие", kind: "дорога", tempo: "переезд", intro: "Длинная дорога к Hotel Rosi. Вечер нужен для восстановления перед главным горным днем.", stops: ["Выезд из Pine Cabins", "Граница Сербия - Черногория", "Заселение и ранний ужин"], risk: "Пункт перехода и продолжительность дороги требуют проверки." },
  { date: "09.08", city: "Проклетие", title: "Три вершины", kind: "горы", tempo: "интенсивно", intro: "Единственный сложный поход: Popadija, Talijanka и Volusnica, круговой маршрут 10,89 км и около 960 м набора.", stops: ["Ранний выезд в Dolja", "Cafa - Popadija - Talijanka - Volusnica", "Возвращение в Гусине"], risk: "Гроза, жара, крутые участки, граница и отсутствие связи." },
  { date: "10.08", city: "Гусине", title: "Вода и восстановление", kind: "пауза", tempo: "легкий", intro: "Короткие переезды, источники и начало долины Ropojana после сложного похода.", stops: ["Ali-pašini izvori", "Vodopad Grlja", "Oko Skakavice", "Plavsko jezero - только по силам"], risk: "Не продолжать по плохой грунтовке и к государственной границе." },
  { date: "11.08", city: "Бока", title: "К морю", kind: "дорога", tempo: "переезд", intro: "Переезд из Гусине к Apartments SOUTH NEST. В этот день Боку лучше увидеть из окна, а не пытаться успеть все.", stops: ["Выезд из Hotel Rosi", "Дорога к побережью", "Заселение и ужин рядом"], risk: "Летний трафик и точный адрес жилья пока требуют проверки." },
  { date: "12.08", city: "Котор", title: "Крепость до жары", kind: "море", tempo: "ранний старт", intro: "Подъем к Kotor Fortress утром, затем Старый город и свободный остаток дня у воды.", stops: ["Kotor Fortress", "Stari Grad Kotor", "Поздний завтрак или ранний обед", "Отдых у воды"], risk: "Мало тени, каменные ступени, круизные группы и парковка." },
  { date: "13.08", city: "Пераст", title: "Камень, остров, море", kind: "море", tempo: "спокойно", intro: "Ранний Пераст, короткая лодка к Gospa od Škrpjela и Kraken только при подтвержденной брони.", stops: ["Пераст к 08:00", "Gospa od Škrpjela", "Набережная и музей", "Kraken или спокойное купание"], risk: "Парковка, лодки, цена Kraken и водитель без алкоголя." },
  { date: "14.08", city: "Ловчен", title: "Бока с высоты", kind: "горы", tempo: "средний", intro: "Канатная дорога Dub-Kuk, короткая прогулка, Alpine Coaster и неспешный вечер в Тивате.", stops: ["Станция Dub", "Kuk и смотровые", "Alpine Coaster", "Тиват / Porto Montenegro"], risk: "Ветер, гроза, очереди и прохлада на верхней станции." },
  { date: "15.08", city: "Златар", title: "Обратно в Сербию", kind: "дорога", tempo: "транзит", intro: "Главная задача - спокойно доехать до Vila Plava Zlatar. Небольшая точка у воды возможна только при раннем прибытии.", stops: ["Выезд до 11:00", "Граница", "Заселение", "Златарское озеро - только при свете и по времени"], risk: "Не добавлять большой крюк к Uvac: день уже занят дорогой." },
  { date: "16.08", city: "Тара", title: "Финальный горизонт", kind: "горы", tempo: "длинный день", intro: "Banjska Stena, спуск к Дрине, домик на реке и возвращение в Белград.", stops: ["Banjska Stena", "Баина-Башта", "Drina River Small House", "Белград"], risk: "Дороги, пеший доступ, парковка и общая длительность требуют проверки." },
];

const checklist = [
  "Адреса всех четырех мест ночевки",
  "Документы автомобиля и страховка",
  "Офлайн-карты и трек похода",
  "Прогноз для Проклетие",
  "Парковка и вход Kotor Fortress",
  "Лодка и парковка в Перасте",
  "Бронь Kraken или отказ от нее",
  "Статус Kotor Cable Car",
];

const highlights: Highlight[] = [
  { place: "Златибор", tag: "06-08 августа · 2 ночи", image: "/images/zlatibor.jpg", credit: "Grati / CC0", lead: "Главное - Gold Gondola. Если канатная дорога закрыта или захочется заменить ее, соберите спокойную дугу из двух точек, а не пытайтесь взять все три.", picks: [
    ["Stopića pećina", "обязательно как запасной план", "Пещера с травертиновыми ваннами; около 19 км от туристического центра."],
    ["Staro selo Sirogojno", "желательно", "Музей под открытым небом о жизни златиборского края."],
    ["Vodopad Gostilje", "дополнительно", "Благоустроенная природная остановка; удобно объединять с Sirogojno."],
  ], source: "https://www.zlatibor.org.rs/sr/sta-raditi/izleti/stopica-pecina-sirogojno-gostilje/", sourceLabel: "Туристическая организация Златибора", guide: {
    location: "Западная Сербия, район Чаетины. Основные точки этой карточки лежат к востоку от туристического центра Златибора.",
    famousFor: "Сосновые плато, длинная Gold Gondola и удобная цепочка из пещеры, старого села и водопада.",
    story: [
      "Златибор интересен не только как курорт. В окрестных селах сохранился понятный срез жизни горного края: деревянные дома, ремесла, водяные мельницы и традиция ручного вязания.",
      "О Stopića pećina научное сообщество писало уже в 1901 году, а Йован Цвиич исследовал ее в 1909-1913 годах. Главная особенность пещеры - крупные травертиновые ванны, которые наполняет текущий внутри Trnavski potok.",
    ],
    facts: ["Stopića pećina находится в 19 км от туристического центра.", "Пещера охраняется как памятник природы с 2005 года.", "Staro selo Sirogojno показывает быт Златибора XIX и начала XX века."],
    details: [["Травертиновые ванны", "Их ступенчатая форма создана отложениями минералов из проточной воды, а вид заметно меняется в зависимости от ее уровня."], ["Златиборская брвнара", "В Sirogojno обратите внимание, как деревянные дома собраны вокруг хозяйственного двора и приспособлены к снежной зиме."], ["Шерстяные изделия", "Сирогойнские вязальщицы превратили местное ремесло в узнаваемый культурный символ края."],],
    route: [["Stopića pećina", "Начните с пещеры, пока группа свежая."], ["Staro selo Sirogojno", "После пещеры переключитесь с природы на историю и ремесла."], ["Vodopad Gostilje", "Завершите день короткой прогулкой у водопада высотой около 22 м."]],
    routeTime: "Половина или почти целый день, если смотреть все три точки без спешки.",
    choice: "В основной план уже входит Gold Gondola. Эту дугу лучше оставить запасным сценарием или выбрать из нее только две точки.",
  } },
  { place: "Проклетие", tag: "08-11 августа · 3 ночи", image: "/images/prokletije.jpg", credit: "Marko Randjic / CC BY-SA 4.0", lead: "Самая дикая часть поездки. Один день отдан сложному маршруту, второй - воде, коротким прогулкам и восстановлению вокруг Гусине.", picks: [
    ["Popadija - Talijanka - Volusnica", "обязательно", "Полный горный день: 10,89 км, около 960 м набора и 6-7 часов с остановками."],
    ["Ropojana и Oko Skakavice", "обязательно в день восстановления", "Короткая прогулка по началу долины без продолжения к государственной границе."],
    ["Ali-pašini izvori и Grlja", "желательно", "Две короткие природные остановки, которые не перегружают восстановительный день."],
  ], source: "https://www.montenegro.travel/ru/unikalnaya-chernogoriya/nacionalnye-parki-chernogorii/nacionalnyj-park-prokletie", sourceLabel: "Официальный туризм Черногории", guide: {
    location: "Северо-восток Черногории, муниципалитеты Плав и Гусине, у границ с Албанией и Косово.",
    famousFor: "Самый альпийский рельеф поездки: острые гребни, ледниковые долины, карстовые источники и более двадцати вершин выше 2500 м.",
    story: [
      "Название Prokletije обычно переводят как «Проклятые горы»: оно передает не легенду об одном событии, а характер массива - труднодоступные вершины, резкие скалы и переменчивую погоду.",
      "Национальный парк создан в 2009 году и остается самым молодым в Черногории. При этом окрестности Плава и Гусине - не пустая горная декорация: здесь рядом живут православные монастыри, старые башни и мечети османского периода.",
    ],
    facts: ["Zla Kolata, 2534 м, считается высшей вершиной Черногории.", "Парк занимает около 1660 га.", "Маршруты начинаются и со стороны Плава, и со стороны Гусине."],
    details: [["Форма долин", "Grebaje и Ropojana имеют ледниковый профиль: широкое дно резко зажато известняковыми стенами."], ["Смена пейзажа", "За один день здесь проходят лес, альпийские луга, осыпи и открытый гребень. Эта смена важнее самой отметки вершины."], ["Культурное соседство", "В Плаве и Гусине горный ландшафт соседствует с башнями, мечетями и монастырями разных эпох."],],
    route: [["Grebaje", "Посмотрите форму долины и оцените погоду перед выходом."], ["Popadija - Talijanka - Volusnica", "Главный сложный маршрут, только при надежном прогнозе."], ["Ali-pašini izvori - Grlja - Ropojana", "На следующий день оставьте короткие водные точки и восстановительную прогулку."]],
    routeTime: "Два разных дня: 6-7 часов на вершины и отдельный легкий день вокруг Гусине.",
    choice: "Если погода закрывает гребень, не заменяйте его другим сложным походом. Оставьте долину, источники и Плавское озеро.",
  } },
  { place: "Котор", tag: "12 августа · ранний старт", image: "/images/kotor-bay.jpg", credit: "Alexander Klink / CC BY 4.0", lead: "Крепость лучше встречать до жары, а Старый город - уже после спуска. Вторая половина дня намеренно остается свободной.", picks: [
    ["Kotor Fortress", "обязательно", "Подъем на 2,5-3,5 часа; маршрут, вход и состояние тропы проверить перед поездкой."],
    ["Stari Grad Kotor", "обязательно", "Каменные улицы, площади и поздний завтрак после крепости без спешки."],
    ["Отдых у воды", "желательно", "После 13:00 не добавлять еще одну большую достопримечательность."],
  ], source: "https://whc.unesco.org/en/list/125", sourceLabel: "UNESCO: регион Котора", guide: {
    location: "В глубине Бока-Которской бухты, между морем и почти отвесными склонами Ловчена.",
    famousFor: "Средневековый город-крепость, морская торговля, романские церкви и стены, которые поднимаются по склону к San Giovanni.",
    story: [
      "В Средние века естественная гавань Котора стала важным торговым и художественным центром. Здесь работали известные школы каменной кладки и иконописи, а город связывал Адриатику с внутренними Балканами.",
      "Землетрясение 1979 года серьезно повредило стены, церкви и другие памятники. В том же году регион вошел в список Всемирного наследия UNESCO, после чего город восстанавливали при международной поддержке.",
    ],
    facts: ["Объект UNESCO охватывает не только Старый город, но и связанную с ним часть бухты.", "В наследие входят четыре романские церкви и городские стены.", "Котор ценят за редкое единство архитектуры, моря и горного ландшафта."],
    details: [["Каменные слои", "Смотрите на разные формы окон, арок и кладки: в тесном городе романская основа соседствует с готическими, ренессансными и барочными деталями."], ["Городские проходы", "Улицы намеренно быстро выводят к маленьким площадям. Так тесная крепость получает свет, воздух и общественные пространства."], ["Стены на склоне", "Снизу хорошо видно, что укрепления защищали не только берег: они замыкали треугольник между морем и горой."],],
    route: [["Sea Gate и Trg od Oružja", "Войдите через главные ворота и начните с городской планировки."], ["St. Tryphon и узкие площади", "Ищите романские и венецианские слои, а не только сувенирные улицы."], ["Kotor Fortress", "Поднимайтесь рано утром, отдельно проверив официальный вход."], ["Набережная", "После спуска завершите прогулку у воды без новой большой цели."]],
    routeTime: "4-6 часов вместе с крепостью; без подъема Старый город занимает 2-3 часа.",
    choice: "Для вашей группы лучший порядок - сначала крепость, потом город. Так историческая часть остается приятным продолжением, а не вторым испытанием на жаре.",
  } },
  { place: "Пераст", tag: "13 августа · спокойный день", image: "/images/perast.jpg", credit: "Tumi-1983 / CC0", lead: "Небольшой город раскрывается без машины и без спешки: набережная, лодка к острову и один выбранный формат отдыха у воды.", picks: [
    ["Набережная и St. Nicholas", "обязательно", "Приехать около 08:00, пока город и парковки еще не перегружены."],
    ["Gospa od Škrpjela", "желательно", "Короткая лодка из Пераста; цену, расписание и возвращение проверить на месте."],
    ["Kraken или купание", "дополнительно, выбрать одно", "Kraken только по подтвержденной брони; иначе оставить время для спокойного купания."],
  ], source: "https://whc.unesco.org/en/list/125", sourceLabel: "UNESCO: регион Котора", guide: {
    location: "На северном берегу внутренней части Бока-Которской бухты, примерно между Рисаном и Котором.",
    famousFor: "Город морских капитанов и судовладельцев, барочные дворцы у воды и два маленьких острова напротив набережной.",
    story: [
      "Пераст рос в очень узкой полосе между скалой и морем, поэтому его улицы и дворцы вытянулись вдоль берега. В венецианскую эпоху город разбогател на мореходстве, а семьи капитанов строили здесь дворцы, церкви и склады.",
      "Gospa od Škrpjela стоит на искусственно созданном острове. Местная традиция связывает его появление с найденной на рифе иконой; память об этом сохраняет праздник Fašinada, когда жители привозят к острову камни на лодках.",
    ],
    facts: ["Пераст вместе с Котором входит в охраняемый UNESCO культурный ландшафт.", "Его историческая застройка приспособлена к очень узкому берегу.", "Острова Gospa od Škrpjela и Sveti Đorđe лучше всего читаются именно с воды."],
    details: [["Фасады к морю", "Главные стороны дворцов обращены к бухте: для города капитанов море было дорогой, площадью и источником статуса."], ["Два разных острова", "Gospa od Škrpjela создан людьми вокруг рифа, а Sveti Đorđe имеет естественное происхождение и занят монастырем."], ["Вертикаль St. Nicholas", "Колокольня работает как ориентир в городе, которому почти некуда расти в ширину."],],
    route: [["St. Nicholas", "Начните с площади и колокольни, главного ориентира города."], ["Дворцы Smekja и Bujović", "Идите вдоль воды и смотрите на фасады морских семей."], ["Perast Museum", "Добавьте контекст о мореходстве, если музей открыт."], ["Gospa od Škrpjela", "Закончите короткой лодкой, заранее согласовав возвращение."]],
    routeTime: "3-4 часа с музеем и островом; сама набережная короче одного километра.",
    choice: "После острова выберите только одно: Kraken по подтвержденной брони или спокойное купание. Оба варианта в один день уже размывают ритм Пераста.",
    sources: [["Visit Kotor: острова и город", "https://kotor.travel/"]],
  } },
  { place: "Ловчен", tag: "14 августа · море с высоты", image: "/images/lovcen.jpg", credit: "Netzach / CC BY-SA 4.0", lead: "В этот день важен контраст: одиннадцать минут от моря к горе, короткая прогулка на Kuk и только одно активное развлечение.", picks: [
    ["Kotor Cable Car Dub-Kuk", "обязательно", "Подъем занимает около 11 минут; статус работы зависит от погоды и требует проверки утром."],
    ["Короткая маркированная прогулка", "желательно", "Выбрать маршрут на месте по погоде и состоянию группы."],
    ["Alpine Coaster", "обязательно при работе", "Трасса находится у станции Kuk; заложить время на возможную очередь."],
  ], source: "https://www.montenegro.travel/nacionalnyj-park-lovchen", sourceLabel: "Официальный туризм Черногории", guide: {
    location: "Над Котором и Цетинье. Канатная дорога ведет от Dub к плато Kuk на склонах массива Ловчен.",
    famousFor: "Резкий переход от Адриатики к горам и символическая роль Ловчена в истории Черногории.",
    story: [
      "Ловчен для Черногории больше, чем красивый фон бухты: гора стала образом независимости и национальной памяти. Национальный парк существует с 1952 года.",
      "На Jezerski vrh находится мавзолей Петра II Петровича Негоша, правителя, поэта и мыслителя. Современный мемориал работы Ивана Мештровича открыли в 1974 году; к нему ведет 461 ступень.",
    ],
    facts: ["Высшая точка массива, Štirovnik, достигает 1749 м.", "Jezerski vrh с мавзолеем имеет высоту около 1657 м.", "Мавзолей и верхняя станция Kuk - разные точки, между ними нет короткой прогулочной связи."],
    details: [["Карстовый рельеф", "Светлый известняк, впадины и редкая растительность объясняют суровый вид горы даже рядом с зеленой бухтой."], ["Контраст высоты", "С Kuk сравните почти замкнутую Боку с открытой Адриатикой: география сразу объясняет значение Котора как защищенной гавани."], ["Силуэт мавзолея", "Если увидите Jezerski vrh издалека, помните: это отдельная автомобильная цель через парк, а не продолжение прогулки от канатной дороги."],],
    route: [["Dub", "Поднимитесь на канатной дороге после утренней проверки ветра и статуса."], ["Kuk", "Посмотрите бухту и выберите одну короткую маркированную прогулку."], ["Alpine Coaster", "Добавьте только при работе и приемлемой очереди."], ["Тиват", "Вернитесь к морю и оставьте спокойный вечер на набережной."]],
    routeTime: "Около половины дня на Dub-Kuk и еще 2-3 часа на Тиват.",
    choice: "Мавзолей Негоша достоин отдельной поездки через Цетинье. В текущий день с канатной дорогой он не помещается без лишнего автомобильного крюка.",
  } },
  { place: "Златар", tag: "15 августа · транзитная ночь", image: "/images/zlatar-lake.jpg", credit: "Fatmir Bajrovic / CC BY-SA 4.0", lead: "Здесь не нужен еще один насыщенный день. После длинного переезда оставьте одну короткую остановку рядом с жильем и сохраните силы для Тары.", picks: [
    ["Zlatarsko jezero / Kokin Brod", "желательно при раннем приезде", "Короткий видовой выезд к воде, только при свете и после проверки подъезда."],
    ["Golo Brdo", "дополнительно", "Короткая прогулка или видовая точка, если старт рядом с точным адресом жилья."],
    ["Uvac", "для отдельного дня", "Сильная самостоятельная цель, но в текущий транзитный план не помещается без перегруза."],
  ], source: "https://www.old.serbia.travel/en/see-serbia/mountains-in-serbia/zlatar", sourceLabel: "Туристическая организация Сербии", guide: {
    location: "Юго-запад Сербии, вокруг Nova Varoš, между долинами рек Lim, Uvac и Bistrica.",
    famousFor: "Светлые горные плато, четыре искусственных озера и близость каньона Uvac с белоголовыми сипами.",
    story: [
      "Название Zlatar связывают с сербским словом «золото». Здесь это хорошо чувствуется визуально: открытые луга, светлые плато и вода среди еловых и березовых склонов.",
      "Современный ландшафт во многом создан человеком. Zlatarsko, Sjeničko, Radoinjsko и Potpećko - искусственные озера, но именно они сделали изгибы Uvac и окрестные виды узнаваемыми.",
    ],
    facts: ["В районе Златара четыре крупных искусственных озера.", "Каньон Uvac известен колонией белоголового сипа.", "Uvac - отдельная экскурсия, а не короткая остановка у дороги."],
    details: [["Искусственная береговая линия", "Заливы и полуострова Zlatarsko jezero появились после перекрытия Uvac, поэтому пейзаж одновременно природный и инженерный."], ["Полет сипа", "Белоголовые сипы часто используют восходящие потоки и могут долго кружить почти без взмахов крыльев."], ["Открытые плато", "Златар воспринимается мягче Проклетие: здесь важны дальние горизонтали лугов, воды и лесных полос."],],
    route: [["Brdo / Golo Brdo", "Сначала уточните у хозяев ближайший безопасный выход на прогулку."], ["Zlatarsko jezero", "Если приехали засветло, сделайте одну короткую видовую остановку."], ["Ранний ужин", "Сохраните силы перед Тарой и финальной дорогой."]],
    routeTime: "1-2 часа после заселения. Полный Uvac требует отдельного дня.",
    choice: "В этой поездке Златар остается красивой паузой между двумя длинными днями. Не превращайте транзитную ночь в гонку к меандрам Uvac.",
  } },
  { place: "Тара", tag: "16 августа · финальный день", image: "/images/tara.jpg", credit: "Gzanag / CC BY-SA 4.0", lead: "Финальный день строится вокруг одного большого вида на Дрину, короткой остановки у воды и возвращения в Белград.", picks: [
    ["Banjska Stena", "обязательно", "Главная смотровая поездки; подъезд, парковку и последний пеший участок проверить заранее."],
    ["Баина-Башта", "желательно", "Удобная пауза на питание между Тарой и домиком на Дрине."],
    ["Drina River Small House", "обязательно", "Короткая фотостановка с берега перед дорогой в Белград."],
  ], source: "https://www.nptara.rs/?lang=en", sourceLabel: "Национальный парк Тара", guide: {
    location: "Западная Сербия, над каньоном Дрины между Баина-Баштой и Вишеградом.",
    famousFor: "Густые леса, множество смотровых и почти отвесный вид с Banjska Stena на Дрину и озеро Perućac.",
    story: [
      "Тара находится под государственной охраной с 1981 года. Парк занимает почти 25 тысяч гектаров и включает большую часть массивов Tara и Zvijezda, ограниченных Дриной.",
      "Домик на скале у Баина-Башты вырос из места для отдыха, которое местные ребята устроили в 1968 году. Река неоднократно сносила постройку, а жители снова ее восстанавливали, поэтому маленький дом стал символом упрямого соседства человека и Дрины.",
    ],
    facts: ["Banjska Stena находится примерно в 6 км от Mitrovac.", "Со смотровой видны озеро Perućac, каньон Дрины и склоны Тары.", "Домик лучше рассматривать с берега: отдельный выход на скалу не нужен."],
    details: [["Изгиб Дрины", "С Banjska Stena видно, как река стала длинным озером Perućac и отделила склоны Сербии от Боснии и Герцеговины."], ["Сербская ель", "На Таре растет редкая оморика с узкой кроной. Ее естественный ареал связан с долиной средней Дрины."], ["Домик на скале", "Его смысл не в архитектуре, а в истории повторных разрушений и восстановлений после разливов реки."],],
    route: [["Banjska Stena", "Начните рано и заложите время на пеший участок."], ["Баина-Башта", "Спуститесь на обед и короткую паузу."], ["Kućica na Drini", "Посмотрите домик с берега и не растягивайте остановку."], ["Белград", "Выезжайте с запасом, не добавляя новых точек."]],
    routeTime: "Длинный финальный день: смотровая, спуск к Дрине и дорога в Белград.",
    choice: "Главный выбор здесь уже сделан: Banjska Stena важнее дополнительных озер и троп. Если день отстает от графика, сократите Баина-Башту, но не спешите на горной дороге.",
    sources: [["Туристическая организация Сербии: история домика", "https://www.old.serbia.travel/sr/blog/27"]],
  } },
];

const stays = [
  ["06-08", "Pine Cabins", "Златибор", "2 ночи"],
  ["08-11", "Hotel Rosi", "Гусине", "3 ночи"],
  ["11-15", "SOUTH NEST", "район Котора", "4 ночи"],
  ["15-16", "Vila Plava", "Златар", "1 ночь"],
];

type MapPriority = "обязательно" | "желательно" | "дополнительно";

type MapFeature = {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    priority: MapPriority;
    date?: string;
    dates?: string[];
  };
  geometry: { type: "Point"; coordinates: [number, number] };
};

type MapData = { type: "FeatureCollection"; features: MapFeature[] };

const mapFilters: { label: string; value: "all" | MapPriority }[] = [
  { label: "Все", value: "all" },
  { label: "Обязательно", value: "обязательно" },
  { label: "Желательно", value: "желательно" },
  { label: "Дополнительно", value: "дополнительно" },
];

const priorityClass: Record<MapPriority, string> = {
  обязательно: "must",
  желательно: "want",
  дополнительно: "extra",
};

const locationGuides: Record<string, { tip: string; source: string; sourceLabel: string }> = {
  "belgrade-center": { tip: "Лучшее завершение маршрута - прогулка по Калемегдану к виду на слияние Савы и Дуная. Машину удобнее оставить в гараже и идти пешком.", source: "https://www.tob.rs/", sourceLabel: "Visit Belgrade" },
  "gold-gondola-zlatibor": { tip: "Приезжайте к началу работы и утром проверьте статус: ветер и технические работы могут изменить режим. На Tornik оставьте время без спешки.", source: "https://goldgondola.rs/rs/status", sourceLabel: "Статус Gold Gondola" },
  "brdo-zlatar-area": { tip: "После длинного переезда выбирайте только короткую прогулку рядом с жильем и возвращайтесь до темноты. Точный старт тропы уточните у хозяев.", source: "https://www.serbia.travel/en/zlatar/", sourceLabel: "Tourism Serbia: Zlatar" },
  "banjska-stena": { tip: "Выезжайте рано, возьмите воду и обувь с хорошим сцеплением. Последний участок проходит пешком, а состояние подъезда стоит уточнить в парке.", source: "https://www.nptara.rs/", sourceLabel: "Национальный парк Тара" },
  "drina-river-house": { tip: "Планируйте короткую остановку на берегу после Баина-Башты. Домик лучше смотреть и фотографировать с берега, не закладывая отдельный водный трансфер.", source: "https://www.taradrina.com/", sourceLabel: "Tara Drina" },
  "ali-pasha-springs": { tip: "Спокойная первая остановка дня восстановления. Подходит для короткой прогулки и обеда, но не заменяет запас воды на дальнейший маршрут.", source: "https://gusinje.travel/tourist-offer/", sourceLabel: "Туристическая организация Гусине" },
  "grlja-waterfall": { tip: "Подход короткий, но у каньона держитесь подальше от края: камни бывают скользкими. Не пытайтесь спускаться к воде вне тропы.", source: "https://gusinje.travel/tourist-offer/", sourceLabel: "Туристическая организация Гусине" },
  "oko-skakavice": { tip: "Совместите с Grlja, но оставьте отдельное время на лесной подход. После дождя пригодится закрытая обувь, а не пляжные сандалии.", source: "https://gusinje.travel/tourist-offer/", sourceLabel: "Туристическая организация Гусине" },
  "ropojana-valley-short": { tip: "Это восстановительная прогулка, а не второй поход. Разворачивайтесь до ухудшения грунтовки и не продолжайте к государственной границе.", source: "https://gusinje.travel/tourist-offer/", sourceLabel: "Туристическая организация Гусине" },
  "gusinje-center": { tip: "Используйте центр как практическую паузу: ранний ужин, продукты, банкомат и подготовка воды. После горного дня не добавляйте дальний выезд.", source: "https://gusinje.travel/", sourceLabel: "Visit Gusinje" },
  "plav-lake": { tip: "Оставляйте озеро дополнительным вариантом на закат только при хорошем самочувствии группы. Для спокойной паузы достаточно набережной.", source: "https://www.plavto.me/", sourceLabel: "Туристическая организация Плав" },
  "kotor-old-town": { tip: "Гуляйте после утреннего спуска с крепости: поздний завтрак и тенистые улицы лучше еще одного подъема в жару.", source: "https://kotor.travel/", sourceLabel: "Visit Kotor" },
  "kotor-fortress": { tip: "Начинайте как можно раньше, берите воду и защиту от солнца. Перед выходом проверьте официальный вход и состояние маршрута, не используйте обходы.", source: "https://kotor.travel/", sourceLabel: "Visit Kotor" },
  "perast": { tip: "Приезжайте около 08:00 и оставляйте автомобиль у въезда: исторический центр лучше проходить пешком до появления дневных групп.", source: "https://kotor.travel/", sourceLabel: "Visit Kotor" },
  "gospa-od-skrpjela": { tip: "Сразу согласуйте с лодочником цену, время ожидания и обратный рейс. На острове не нужен длинный визит, если дальше запланирован музей.", source: "https://kotor.travel/", sourceLabel: "Visit Kotor" },
  "st-nicholas-perast": { tip: "Зайдите в начале прогулки по набережной, если храм открыт. Для посещения интерьера нужна закрытая одежда; режим работы проверьте на месте.", source: "https://kotor.travel/", sourceLabel: "Visit Kotor" },
  "smekja-palace": { tip: "Рассматривайте дворец как архитектурную остановку на набережной. Доступ внутрь не предполагается без отдельного подтверждения.", source: "https://kotor.travel/", sourceLabel: "Visit Kotor" },
  "perast-museum": { tip: "Хороший выбор на самый жаркий час. Перед приездом проверьте часы и общий билет на официальном сайте музеев Котора.", source: "https://muzejikotor.me/en/home/perast-museum/", sourceLabel: "Музей Пераста" },
  "perast-swim": { tip: "Берите обувь для воды и выбирайте только очевидный безопасный вход. Не оставляйте вещи и автомобиль там, где проход мешает местным жителям.", source: "https://kotor.travel/", sourceLabel: "Visit Kotor" },
  "kraken-underwater-wine": { tip: "Ехать только после подтвержденной брони. Заранее назначьте водителя без алкоголя и запросите точку посадки, длительность и условия отмены.", source: "https://www.underwaterwine.me/index.php/en/floating-wine-bar-winery-cellar-kotor-kraken", sourceLabel: "Kraken Underwater Wine" },
  "kotor-cable-car-dub": { tip: "Утром проверьте статус, погоду и билеты. Приезжайте с запасом времени на парковку: работа канатной дороги зависит от ветра и грозы.", source: "https://kotorcablecar.me/", sourceLabel: "Kotor Cable Car" },
  "kotor-cable-car-kuk": { tip: "Наверху прохладнее и ветренее, поэтому возьмите легкий слой одежды. Alpine Coaster планируйте только после подтверждения его работы.", source: "https://kotorcablecar.me/", sourceLabel: "Kotor Cable Car" },
  "tivat": { tip: "Лучший формат - неспешная вечерняя прогулка по набережной и Porto Montenegro. Не кружите в поиске улицы: сразу выбирайте отмеченную парковку.", source: "https://tivat.travel/en/", sourceLabel: "Visit Tivat" },
};

const mainRoute = [
  "belgrade-center",
  "gold-gondola-zlatibor",
  "gusinje-center",
  "ali-pasha-springs",
  "kotor-old-town",
  "perast",
  "kotor-cable-car-kuk",
  "brdo-zlatar-area",
  "banjska-stena",
  "drina-river-house",
  "belgrade-center",
];

function formatMapDates(feature: MapFeature) {
  const rawDates = feature.properties.dates ?? (feature.properties.date ? feature.properties.date.split(";") : []);
  return rawDates.map((date) => {
    const parsed = new Date(`${date}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(parsed);
  }).join(" · ");
}

function TripMap() {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const pointsLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [data, setData] = useState<MapData | null>(null);
  const [filter, setFilter] = useState<"all" | MapPriority>("all");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let disposed = false;

    async function initializeMap() {
      try {
        const [leaflet, response] = await Promise.all([
          import("leaflet"),
          fetch("/data/map_points.geojson"),
        ]);
        if (!response.ok) throw new Error("Не удалось загрузить точки");
        const points = await response.json() as MapData;
        if (disposed || !mapNode.current) return;

        const map = leaflet.map(mapNode.current, {
          scrollWheelZoom: false,
          zoomControl: false,
        });
        leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);
        leaflet.control.zoom({ position: "topright" }).addTo(map);

        const featuresById = new Map(points.features.map((feature) => [feature.properties.id, feature]));
        const routeCoordinates = mainRoute
          .map((id) => featuresById.get(id))
          .filter((feature): feature is MapFeature => Boolean(feature))
          .map((feature) => [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] as [number, number]);
        leaflet.polyline(routeCoordinates, {
          color: "#e86143",
          weight: 3,
          opacity: 0.72,
          dashArray: "3 11",
          lineCap: "round",
        }).addTo(map);

        leafletRef.current = leaflet;
        mapRef.current = map;
        setData(points);
        setStatus("ready");
      } catch {
        if (!disposed) setStatus("error");
      }
    }

    initializeMap();
    return () => {
      disposed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const leaflet = leafletRef.current;
    const map = mapRef.current;
    if (!leaflet || !map || !data) return;

    pointsLayerRef.current?.remove();
    const visible = data.features.filter((feature) => filter === "all" || feature.properties.priority === filter);
    const layer = leaflet.layerGroup();

    visible.forEach((feature) => {
      const [longitude, latitude] = feature.geometry.coordinates;
      const marker = leaflet.marker([latitude, longitude], {
        icon: leaflet.divIcon({
          className: "trip-marker-shell",
          html: `<span class="trip-marker trip-marker-${priorityClass[feature.properties.priority]}"></span>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      });

      const popup = document.createElement("div");
      popup.className = "map-popup";
      const meta = document.createElement("span");
      meta.textContent = `${feature.properties.priority} · ${formatMapDates(feature)}`;
      const title = document.createElement("strong");
      title.textContent = feature.properties.name;
      const guide = locationGuides[feature.properties.id];
      const tip = document.createElement("p");
      tip.textContent = guide?.tip ?? "Перед выездом проверьте подъезд, парковку и локальные ограничения.";
      const links = document.createElement("div");
      links.className = "map-popup-links";
      const usefulLinks = [
        [guide?.source, guide?.sourceLabel ?? "Источник"],
        [`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, "Маршрут"],
        [`https://www.google.com/maps/search/?api=1&query=parking+near+${latitude},${longitude}`, "Парковка рядом"],
        [`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`, "OpenStreetMap"],
      ];
      usefulLinks.forEach(([href, label]) => {
        if (!href) return;
        const link = document.createElement("a");
        link.href = href;
        link.target = "_blank";
        link.rel = "noreferrer";
        link.textContent = `${label} ↗`;
        links.append(link);
      });
      popup.append(meta, title, tip, links);
      marker.bindPopup(popup, { closeButton: false, offset: [0, -8] });
      marker.addTo(layer);
    });

    layer.addTo(map);
    pointsLayerRef.current = layer;
    const bounds = leaflet.latLngBounds(visible.map((feature) => [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [38, 38], maxZoom: 11 });
  }, [data, filter]);

  const visibleCount = data?.features.filter((feature) => filter === "all" || feature.properties.priority === filter).length ?? 0;

  return (
    <div className="atlas-map-shell">
      <div className="map-toolbar" aria-label="Фильтр точек">
        {mapFilters.map((item) => (
          <button key={item.value} className={filter === item.value ? "active" : ""} onClick={() => setFilter(item.value)}>{item.label}</button>
        ))}
      </div>
      <div ref={mapNode} className="trip-map" aria-label="Интерактивная карта маршрута по Сербии и Черногории" />
      {status === "loading" && <div className="map-state">Загружаем карту...</div>}
      {status === "error" && <div className="map-state map-error">Карта не загрузилась. Проверьте соединение.</div>}
      {status === "ready" && <div className="map-counter"><strong>{visibleCount}</strong><span>точек на карте</span></div>}
    </div>
  );
}

export default function Home() {
  const [activeDay, setActiveDay] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const [activeGuide, setActiveGuide] = useState<number | null>(null);
  const guideDialog = useRef<HTMLDialogElement | null>(null);
  const guideClose = useRef<HTMLButtonElement | null>(null);
  const guideTrigger = useRef<HTMLButtonElement | null>(null);
  const selected = days[activeDay];
  const openGuide = activeGuide === null ? null : highlights[activeGuide];

  useEffect(() => {
    const saved = window.localStorage.getItem("balkan-roadbook-checks");
    if (saved) setDone(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const dialog = guideDialog.current;
    if (!dialog || activeGuide === null) return;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => guideClose.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [activeGuide]);

  const showGuide = (index: number, trigger: HTMLButtonElement) => {
    guideTrigger.current = trigger;
    setActiveGuide(index);
  };

  const hideGuide = () => {
    setActiveGuide(null);
    window.requestAnimationFrame(() => guideTrigger.current?.focus());
  };

  const toggleCheck = (index: number) => {
    const next = done.includes(index) ? done.filter((item) => item !== index) : [...done, index];
    setDone(next);
    window.localStorage.setItem("balkan-roadbook-checks", JSON.stringify(next));
  };

  const progress = useMemo(() => Math.round((done.length / checklist.length) * 100), [done]);

  return (
    <main>
      <header className="nav-shell">
        <a className="wordmark" href="#top" aria-label="В начало">BALKAN<br />ROADBOOK</a>
        <nav aria-label="Разделы сайта">
          <a href="#route">11 дней</a>
          <a href="#map">Карта</a>
          <a href="#places">Что посмотреть</a>
          <a href="#ready">Перед выездом</a>
        </nav>
        <span className="nav-date">06-16 / 08 / 26</span>
      </header>

      <section className="hero" id="top">
        <div className="hero-photo" role="img" aria-label="Пераст и Бока-Которская бухта">
          <span className="photo-credit">Perast / CC0, Tumi-1983</span>
        </div>
        <div className="hero-copy">
          <p className="kicker">Сербия → Черногория → Сербия</p>
          <h1>Между<br /><i>вершинами</i><br />и морем.</h1>
          <p className="hero-lede">11 дней, 5 взрослых и один автомобиль. Маршрут, в котором сложный горный день не спорит с отдыхом, а море появляется ровно тогда, когда оно нужно.</p>
          <a className="round-link" href="#route"><span>Смотреть<br />маршрут</span><b>↓</b></a>
        </div>
        <div className="hero-stamp" aria-hidden="true"><strong>26</strong><span>AUG<br />ROAD<br />TRIP</span></div>
      </section>

      <section className="ticker" aria-label="Ключевые точки">
        <div>Белград <span>◆</span> Златибор <span>◆</span> Проклетие <span>◆</span> Котор <span>◆</span> Пераст <span>◆</span> Златар <span>◆</span> Тара</div>
      </section>

      <section className="route-section" id="route">
        <div className="section-intro">
          <p className="kicker">01 / Маршрут по дням</p>
          <h2>Одиннадцать дней.<br />Три разных ритма.</h2>
          <p>Выберите дату. Важное уже отделено от желательного, а все нестабильные детали помечены для повторной проверки.</p>
        </div>

        <div className="route-board">
          <div className="day-rail" role="tablist" aria-label="Дни поездки">
            {days.map((day, index) => (
              <button key={day.date} className={index === activeDay ? "active" : ""} onClick={() => setActiveDay(index)} role="tab" aria-selected={index === activeDay}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{day.date}</strong><small>{day.city}</small>
              </button>
            ))}
          </div>
          <article className={`day-card kind-${selected.kind}`} aria-live="polite">
            <div className="day-card-head">
              <div><p className="kicker">{selected.city} / {selected.tempo}</p><h3>{selected.title}</h3></div>
              <span className="day-index">{String(activeDay + 1).padStart(2, "0")}</span>
            </div>
            <p className="day-lede">{selected.intro}</p>
            <ol className="stop-stack">
              {selected.stops.map((stop, index) => <li key={stop}><span>{String(index + 1).padStart(2, "0")}</span>{stop}</li>)}
            </ol>
            <p className="risk"><b>Учесть</b>{selected.risk}</p>
          </article>
        </div>
      </section>

      <section className="stays-section" aria-labelledby="stays-title">
        <div><p className="kicker">Ночевки фиксированы</p><h2 id="stays-title">Четыре базы,<br />одна линия.</h2></div>
        <div className="stay-line">
          {stays.map(([date, name, place, nights], index) => <article key={name}><span>{index + 1}</span><small>{date} августа</small><h3>{name}</h3><p>{place} · {nights}</p></article>)}
        </div>
      </section>

      <section className="atlas-section" id="map">
        <div className="atlas-copy">
          <p className="kicker">02 / Карта маршрута</p>
          <h2>Весь путь.<br /><i>Одним взглядом.</i></h2>
          <p>Все 23 отмеченные точки: горы, море, города и короткие остановки. В каждой карточке есть практический совет, проверенный источник, маршрут и поиск парковки.</p>
          <div className="map-legend" aria-label="Легенда карты">
            <span><i className="legend-must" />обязательно</span>
            <span><i className="legend-want" />желательно</span>
            <span><i className="legend-extra" />дополнительно</span>
          </div>
          <small>Метка показывает объект, но не гарантированное место парковки или точку доступа. Эти детали требуют проверки.</small>
        </div>
        <TripMap />
      </section>

      <section className="places-section" id="places">
        <div className="section-intro light">
          <p className="kicker">03 / Не пропустить</p>
          <h2>Семь мест.<br />Семь разных характеров.</h2>
          <p>От сосен Златибора и скал Проклетие до камня Боки и финального вида на Дрину. В каждой точке оставлено только то, что реально помещается в маршрут.</p>
        </div>
        <div className="highlight-grid">
          {highlights.map((group, index) => (
            <article className="highlight-card" key={group.place}>
              <div className="highlight-image" style={{ backgroundImage: `linear-gradient(180deg, transparent 45%, rgba(10,22,19,.78)), url(${group.image})` }}>
                <span>{group.tag}</span><h3>{group.place}</h3>
                <small className="image-credit">{group.credit}</small>
              </div>
              <div className="highlight-body">
                <p>{group.lead}</p>
                <div className="pick-list">
                  {group.picks.map(([name, priority, description]) => <div key={name}><small>{priority}</small><h4>{name}</h4><p>{description}</p></div>)}
                </div>
                <div className="highlight-actions">
                  <button type="button" onClick={(event) => showGuide(index, event.currentTarget)}>Открыть путеводитель <span aria-hidden="true">→</span></button>
                  <a href={group.source} target="_blank" rel="noreferrer">Источник: {group.sourceLabel} ↗</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <dialog
        ref={guideDialog}
        className="place-dialog"
        aria-labelledby="place-dialog-title"
        onCancel={(event) => { event.preventDefault(); hideGuide(); }}
        onClick={(event) => { if (event.target === event.currentTarget) hideGuide(); }}
      >
        {openGuide && (
          <div className="place-dialog-sheet">
            <header className="place-dialog-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(10,22,19,.06), rgba(10,22,19,.84)), url(${openGuide.image})` }}>
              <span className="place-dialog-chapter">Полевые заметки · {String(activeGuide! + 1).padStart(2, "0")}</span>
              <div><small>{openGuide.tag}</small><h2 id="place-dialog-title">{openGuide.place}</h2><p>{openGuide.guide.famousFor}</p></div>
              <span className="place-dialog-credit">Фото: {openGuide.credit}</span>
            </header>
            <div className="place-dialog-content">
              <button ref={guideClose} className="place-dialog-close" type="button" onClick={hideGuide} aria-label="Закрыть путеводитель">Закрыть <span aria-hidden="true">×</span></button>
              <section className="place-dialog-location">
                <span>Где это</span><p>{openGuide.guide.location}</p>
              </section>
              <section className="place-dialog-story">
                <p className="kicker">Короткая история</p>
                {openGuide.guide.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </section>
              <aside className="place-dialog-facts">
                <p className="kicker">Три факта для друзей</p>
                <ul>{openGuide.guide.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              </aside>
              <section className="place-dialog-details">
                <p className="kicker">На что обратить внимание</p>
                <div>{openGuide.guide.details.map(([title, note]) => <article key={title}><h3>{title}</h3><p>{note}</p></article>)}</div>
              </section>
              <section className="place-dialog-route">
                <div className="place-dialog-route-head"><div><p className="kicker">Маршрут внимания</p><h3>На что смотреть по порядку</h3></div><span>{openGuide.guide.routeTime}</span></div>
                <ol>{openGuide.guide.route.map(([stop, note], index) => <li key={stop}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{stop}</strong><p>{note}</p></div></li>)}</ol>
              </section>
              <section className="place-dialog-choice"><span>Что оставить на выбор</span><p>{openGuide.guide.choice}</p></section>
              <div className="place-dialog-sources">
                <span>Источники</span>
                <a href={openGuide.source} target="_blank" rel="noreferrer">{openGuide.sourceLabel} ↗</a>
                {openGuide.guide.sources?.map(([label, url]) => <a key={url} href={url} target="_blank" rel="noreferrer">{label} ↗</a>)}
              </div>
            </div>
          </div>
        )}
      </dialog>

      <section className="ready-section" id="ready">
        <div className="ready-copy">
          <p className="kicker">04 / Перед выездом</p>
          <h2>Спокойствие начинается с восьми галочек.</h2>
          <p>Отметки сохраняются только в этом браузере. Они не меняют исходный маршрут.</p>
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}><strong>{done.length}</strong><span>из {checklist.length}</span></div>
        </div>
        <div className="check-list">
          {checklist.map((item, index) => <label key={item} className={done.includes(index) ? "checked" : ""}><input type="checkbox" checked={done.includes(index)} onChange={() => toggleCheck(index)} /><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong><i aria-hidden="true">✓</i></label>)}
        </div>
      </section>

      <footer>
        <p>Погода, дороги, часы работы, цены, парковки и границы требуют повторной проверки перед поездкой.</p>
        <a href="#top">Наверх ↑</a>
      </footer>
    </main>
  );
}
