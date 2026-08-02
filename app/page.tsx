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

const highlights = [
  { place: "Златибор", tag: "06-08 августа · 2 ночи", image: "/images/zlatibor.jpg", credit: "Grati / CC0", lead: "Главное - Gold Gondola. Если канатная дорога закрыта или захочется заменить ее, соберите спокойную дугу из двух точек, а не пытайтесь взять все три.", picks: [
    ["Stopića pećina", "обязательно как запасной план", "Пещера с травертиновыми ваннами; около 19 км от туристического центра."],
    ["Staro selo Sirogojno", "желательно", "Музей под открытым небом о жизни златиборского края."],
    ["Vodopad Gostilje", "дополнительно", "Благоустроенная природная остановка; удобно объединять с Sirogojno."],
  ], source: "https://www.zlatibor.org.rs/sr/sta-raditi/izleti/stopica-pecina-sirogojno-gostilje/", sourceLabel: "Туристическая организация Златибора" },
  { place: "Проклетие", tag: "08-11 августа · 3 ночи", image: "/images/prokletije.jpg", credit: "Marko Randjic / CC BY-SA 4.0", lead: "Самая дикая часть поездки. Один день отдан сложному маршруту, второй - воде, коротким прогулкам и восстановлению вокруг Гусине.", picks: [
    ["Popadija - Talijanka - Volusnica", "обязательно", "Полный горный день: 10,89 км, около 960 м набора и 6-7 часов с остановками."],
    ["Ropojana и Oko Skakavice", "обязательно в день восстановления", "Короткая прогулка по началу долины без продолжения к государственной границе."],
    ["Ali-pašini izvori и Grlja", "желательно", "Две короткие природные остановки, которые не перегружают восстановительный день."],
  ], source: "https://nparkovi.me/", sourceLabel: "Национальные парки Черногории" },
  { place: "Котор", tag: "12 августа · ранний старт", image: "/images/kotor-bay.jpg", credit: "Alexander Klink / CC BY 4.0", lead: "Крепость лучше встречать до жары, а Старый город - уже после спуска. Вторая половина дня намеренно остается свободной.", picks: [
    ["Kotor Fortress", "обязательно", "Подъем на 2,5-3,5 часа; маршрут, вход и состояние тропы проверить перед поездкой."],
    ["Stari Grad Kotor", "обязательно", "Каменные улицы, площади и поздний завтрак после крепости без спешки."],
    ["Отдых у воды", "желательно", "После 13:00 не добавлять еще одну большую достопримечательность."],
  ], source: "https://kotor.travel/", sourceLabel: "Туристическая организация Котора" },
  { place: "Пераст", tag: "13 августа · спокойный день", image: "/images/perast.jpg", credit: "Tumi-1983 / CC0", lead: "Небольшой город раскрывается без машины и без спешки: набережная, лодка к острову и один выбранный формат отдыха у воды.", picks: [
    ["Набережная и St. Nicholas", "обязательно", "Приехать около 08:00, пока город и парковки еще не перегружены."],
    ["Gospa od Škrpjela", "желательно", "Короткая лодка из Пераста; цену, расписание и возвращение проверить на месте."],
    ["Kraken или купание", "дополнительно, выбрать одно", "Kraken только по подтвержденной брони; иначе оставить время для спокойного купания."],
  ], source: "https://kotor.travel/", sourceLabel: "Туристическая организация Котора" },
  { place: "Ловчен", tag: "14 августа · море с высоты", image: "/images/lovcen.jpg", credit: "Netzach / CC BY-SA 4.0", lead: "В этот день важен контраст: одиннадцать минут от моря к горе, короткая прогулка на Kuk и только одно активное развлечение.", picks: [
    ["Kotor Cable Car Dub-Kuk", "обязательно", "Подъем занимает около 11 минут; статус работы зависит от погоды и требует проверки утром."],
    ["Короткая маркированная прогулка", "желательно", "Выбрать маршрут на месте по погоде и состоянию группы."],
    ["Alpine Coaster", "обязательно при работе", "Трасса находится у станции Kuk; заложить время на возможную очередь."],
  ], source: "https://www.kotorcablecar.me/", sourceLabel: "Kotor Cable Car" },
  { place: "Златар", tag: "15 августа · транзитная ночь", image: "/images/zlatar-lake.jpg", credit: "Fatmir Bajrovic / CC BY-SA 4.0", lead: "Здесь не нужен еще один насыщенный день. После длинного переезда оставьте одну короткую остановку рядом с жильем и сохраните силы для Тары.", picks: [
    ["Zlatarsko jezero / Kokin Brod", "желательно при раннем приезде", "Короткий видовой выезд к воде, только при свете и после проверки подъезда."],
    ["Golo Brdo", "дополнительно", "Короткая прогулка или видовая точка, если старт рядом с точным адресом жилья."],
    ["Uvac", "для отдельного дня", "Сильная самостоятельная цель, но в текущий транзитный план не помещается без перегруза."],
  ], source: "https://www.serbia.travel/en/zlatar/", sourceLabel: "Туристическая организация Сербии" },
  { place: "Тара", tag: "16 августа · финальный день", image: "/images/tara.jpg", credit: "Gzanag / CC BY-SA 4.0", lead: "Финальный день строится вокруг одного большого вида на Дрину, короткой остановки у воды и возвращения в Белград.", picks: [
    ["Banjska Stena", "обязательно", "Главная смотровая поездки; подъезд, парковку и последний пеший участок проверить заранее."],
    ["Баина-Башта", "желательно", "Удобная пауза на питание между Тарой и домиком на Дрине."],
    ["Drina River Small House", "обязательно", "Короткая фотостановка с берега перед дорогой в Белград."],
  ], source: "https://www.nptara.rs/", sourceLabel: "Национальный парк Тара" },
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
  const selected = days[activeDay];

  useEffect(() => {
    const saved = window.localStorage.getItem("balkan-roadbook-checks");
    if (saved) setDone(JSON.parse(saved));
  }, []);

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
          {highlights.map((group) => (
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
                <a href={group.source} target="_blank" rel="noreferrer">Источник: {group.sourceLabel} ↗</a>
              </div>
            </article>
          ))}
        </div>
      </section>

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
