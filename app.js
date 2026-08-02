const days = [
  {
    date: "06 авг",
    place: "Златибор",
    pace: "переезд",
    title: "Белград - Златибор",
    intro: "Старт поездки и заезд в Pine Cabins Zlatibor. Детальный расчет дороги и остановок еще не подготовлен.",
    stops: [
      ["Белград", "Город отправления требует финального подтверждения."],
      ["Pine Cabins Zlatibor", "Заезд с 14:00 до 22:00; точный адрес и парковку проверить."],
      ["Спокойный вечер", "Только короткая прогулка и ужин после дороги."]
    ],
    warning: "Маршрут переезда, дорожные работы и время остановок требуют проверки."
  },
  {
    date: "07 авг",
    place: "Златибор",
    pace: "средний",
    title: "Gold Gondola Zlatibor",
    intro: "Главный день в Златиборе с канатной дорогой и запасом времени на отдых.",
    stops: [
      ["Gold Gondola Zlatibor", "Обязательно. Место посадки, билеты и режим работы проверить."],
      ["Прогулка и обед", "Не перегружать день дополнительными удаленными точками."],
      ["Подготовка к дороге", "Проверить маршрут до Гусине и документы на границу."]
    ],
    warning: "Работа канатной дороги зависит от погоды; парковка и часы требуют проверки."
  },
  {
    date: "08 авг",
    place: "Гусине",
    pace: "переезд",
    title: "Златибор - Гусине",
    intro: "Переезд через границу и заселение в Hotel Rosi. Вечером никаких обязательных активностей.",
    stops: [
      ["Pine Cabins Zlatibor", "Выезд до 10:00."],
      ["Граница Сербия - Черногория", "Пункт перехода и возможные задержки требуют проверки."],
      ["Hotel Rosi", "Заезд после 12:00; парковку и точный адрес уточнить."],
      ["Гусине", "Короткая прогулка и ужин только по времени прибытия."]
    ],
    warning: "Горные дороги, граница и продолжительность переезда требуют отдельного расчета."
  },
  {
    date: "09 авг",
    place: "Проклетие",
    pace: "интенсивно",
    title: "Popadija, Talijanka и Volusnica",
    intro: "Единственный полноценный горный день: круговой маршрут 10,89 км с набором около 960 м.",
    stops: [
      ["Ранний выезд в Dolja", "Проверить дорогу и официальное место для автомобиля."],
      ["Cafa - Popadija - Talijanka - Volusnica", "6-7 часов с остановками; офлайн-трек обязателен."],
      ["Возвращение в Гусине", "Отдых и ранний ужин. Другие точки не добавлять."]
    ],
    warning: "При плохом прогнозе поменять этот день местами с 10 августа. Риски: гроза, жара, крутые участки, близость границы и отсутствие связи."
  },
  {
    date: "10 авг",
    place: "Гусине",
    pace: "восстановление",
    title: "Источники и долина Ropojana",
    intro: "Спокойный природный день после похода: короткие переезды, вода и начальная часть ледниковой долины.",
    stops: [
      ["Ali-pašini izvori", "30-45 минут у карстового источника."],
      ["Vodopad Grlja", "30-45 минут; каньон осматривать только сверху."],
      ["Oko Skakavice", "2-2,5 часа пешком туда и обратно по начальной части Ropojana."],
      ["Гусине", "Поздний обед и отдых."],
      ["Plavsko jezero", "Дополнительно, только при нормальном самочувствии группы."]
    ],
    warning: "Не ехать дальше по плохой грунтовке и не продолжать прогулку к государственной границе."
  },
  {
    date: "11 авг",
    place: "Бока",
    pace: "переезд",
    title: "Гусине - район Котора",
    intro: "Длинный переезд и спокойный вечер после заселения в Apartments SOUTH NEST.",
    stops: [
      ["Hotel Rosi", "Выезд до 11:00."],
      ["Apartments SOUTH NEST", "Заезд после 15:00; точный адрес пока требует проверки."],
      ["Ужин рядом", "1-2 часа без отдельной поездки в Котор или Пераст."]
    ],
    warning: "После получения адреса жилья пересчитать все локальные переезды 12-15 августа."
  },
  {
    date: "12 авг",
    place: "Котор",
    pace: "ранний старт",
    title: "Крепость и Старый город",
    intro: "Самый жаркий городской подъем вынесен на раннее утро, а после обеда оставлено свободное время.",
    stops: [
      ["Kotor Fortress", "2,5-3,5 часа. Начать подъем как можно раньше."],
      ["Stari Grad Kotor", "2-3 часа с поздним завтраком или ранним обедом."],
      ["Отдых у воды", "После 13:00 без обязательной программы."]
    ],
    warning: "Открытый каменный подъем, мало тени, круизные группы и ограниченная парковка."
  },
  {
    date: "13 авг",
    place: "Пераст",
    pace: "спокойно",
    title: "Пераст, остров и Kraken",
    intro: "Набережная без спешки, короткая лодка до Gospa od Škrpjela и необычная остановка на воде при подтвержденной брони.",
    stops: [
      ["Пераст", "Приехать около 08:00; использовать официальную парковку у въезда."],
      ["Crkva Svetog Nikole и Smekja Palace", "Главная площадь и внешняя архитектура."],
      ["Perast Museum", "Желательно; вход зависит от актуальных часов."],
      ["Gospa od Škrpjela", "45-75 минут вместе с ожиданием лодки."],
      ["Underwater Wine Cellar Kraken", "Около 2 часов, только при подтвержденной брони."]
    ],
    warning: "Для Kraken заранее получить полную цену, парковку и условия лодочного трансфера. Водитель не употребляет алкоголь."
  },
  {
    date: "14 авг",
    place: "Ловчен",
    pace: "средний",
    title: "Канатная дорога, Kuk и Тиват",
    intro: "Панорама Боки с высоты, короткая прогулка, Alpine Coaster и спокойный вечер у моря.",
    stops: [
      ["Станция Dub", "Приехать к открытию; статус работы и парковку проверить."],
      ["Станция Kuk", "45-90 минут на маркированную прогулку и смотровые."],
      ["Alpine Coaster", "30-60 минут вместе с возможной очередью."],
      ["Тиват / Porto Montenegro", "2-3 часа на прогулку, отдых и ранний ужин."]
    ],
    warning: "Канатная дорога зависит от ветра и грозы. Наверх взять закрытую обувь и легкий верхний слой."
  },
  {
    date: "15 авг",
    place: "Златар",
    pace: "транзит",
    title: "Котор - Златар",
    intro: "Преимущественно транзитный день с пересечением границы и заездом в Vila Plava Zlatar.",
    stops: [
      ["Apartments SOUTH NEST", "Выезд до 11:00."],
      ["Граница Черногория - Сербия", "Пункт перехода и задержки проверить перед дорогой."],
      ["Vila Plava Zlatar, Brdo", "Заезд после 14:00; точный адрес и парковку уточнить."]
    ],
    warning: "Не добавлять точки у Котора. Дорога, топливо и остановки на отдых требуют расчета."
  },
  {
    date: "16 авг",
    place: "Тара",
    pace: "длинный день",
    title: "Banjska Stena, Дрина и Белград",
    intro: "Финальный природный день с фиксированной последовательностью точек и возвращением в Белград.",
    stops: [
      ["Banjska Stena", "Смотровая на Дрину; дорогу, парковку и пеший доступ проверить."],
      ["Баина-Башта", "Спуск в сторону Дрины с паузой на питание."],
      ["Drina River Small House", "Короткая фотостановка у домика на реке."],
      ["Белград", "Финальная точка поездки."]
    ],
    warning: "Общую продолжительность дня нужно подтвердить в навигаторе с учетом прогулки, остановок и дорожной обстановки."
  }
];

const checks = [
  "Подтвердить старт из Белграда и точные адреса всех мест ночевки.",
  "Проверить документы автомобиля, страховку и разрешение на пересечение границы.",
  "Скачать офлайн-карты, трек похода и координаты жилья.",
  "Проверить погоду в Проклетие и состояние дороги к Dolja.",
  "Уточнить вход, часы и маршрут Kotor Fortress.",
  "Проверить парковки, лодки и условия посещения Пераста.",
  "Подтвердить бронь Kraken или исключить его из расписания.",
  "Проверить статус Kotor Cable Car и Alpine Coaster 13-14 августа."
];

const tabs = document.querySelector("#day-tabs");
const detail = document.querySelector("#day-detail");

function renderDay(index) {
  const day = days[index];
  document.querySelectorAll(".day-tab").forEach((tab, tabIndex) => {
    tab.classList.toggle("is-active", tabIndex === index);
    tab.setAttribute("aria-selected", String(tabIndex === index));
  });
  detail.innerHTML = `
    <div class="day-meta">
      <span class="pill">${day.date}</span>
      <span class="pill">${day.place}</span>
      <span class="pill ${day.pace === "интенсивно" ? "pill-intense" : ""}">${day.pace}</span>
    </div>
    <h3>${day.title}</h3>
    <p class="day-intro">${day.intro}</p>
    <ol class="stop-list">
      ${day.stops.map(([name, note]) => `<li><strong>${name}</strong><span>${note}</span></li>`).join("")}
    </ol>
    <p class="day-warning"><strong>Учесть:</strong> ${day.warning}</p>
  `;
}

days.forEach((day, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "day-tab";
  button.role = "tab";
  button.innerHTML = `<span class="day-number">${String(index + 1).padStart(2, "0")}</span><strong>${day.date}</strong><small>${day.place}</small>`;
  button.addEventListener("click", () => renderDay(index));
  tabs.append(button);
});
renderDay(0);

const storageKey = "serbia-montenegro-2026-checks";
const savedChecks = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
const checkGrid = document.querySelector("#check-grid");

function updateProgress() {
  const completed = checkGrid.querySelectorAll("input:checked").length;
  document.querySelector("#check-progress-label").textContent = `${completed} из ${checks.length}`;
  document.querySelector("#check-progress-bar").style.width = `${(completed / checks.length) * 100}%`;
  localStorage.setItem(storageKey, JSON.stringify([...checkGrid.querySelectorAll("input:checked")].map((input) => Number(input.value))));
}

checks.forEach((check, index) => {
  const label = document.createElement("label");
  label.className = "check-item";
  label.innerHTML = `<input type="checkbox" value="${index}" ${savedChecks.has(index) ? "checked" : ""}><span class="check-box" aria-hidden="true"></span><span>${check}</span>`;
  label.querySelector("input").addEventListener("change", updateProgress);
  checkGrid.append(label);
});
document.querySelector("#reset-checks").addEventListener("click", () => {
  checkGrid.querySelectorAll("input").forEach((input) => { input.checked = false; });
  updateProgress();
});
updateProgress();

const markerColors = {
  "обязательно": "pin-must",
  "желательно": "pin-want",
  "дополнительно": "pin-extra"
};
let map;
let pointLayer;
let geoData;

function iconFor(priority) {
  return L.divIcon({ className: `map-pin ${markerColors[priority] || "pin-extra"}`, iconSize: [18, 18] });
}

function showPoints(priority = "all") {
  if (!map || !geoData) return;
  if (pointLayer) pointLayer.remove();
  const filtered = {
    ...geoData,
    features: geoData.features.filter((feature) => priority === "all" || feature.properties.priority === priority)
  };
  pointLayer = L.geoJSON(filtered, {
    pointToLayer: (feature, latlng) => L.marker(latlng, { icon: iconFor(feature.properties.priority) }),
    onEachFeature: (feature, layer) => {
      const { name, priority, date, dates } = feature.properties;
      const dayList = Array.isArray(dates) ? dates : [date];
      const dateLabel = dayList
        .filter(Boolean)
        .map((day) => new Date(`${day}T12:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "long" }))
        .join(" и ");
      layer.bindPopup(`<span class="popup-priority">${priority}</span><br><strong>${name}</strong><br><small>${dateLabel}</small>`);
    }
  }).addTo(map);
  document.querySelector("#map-status").textContent = `${filtered.features.length} точек`;
  if (filtered.features.length) map.fitBounds(pointLayer.getBounds(), { padding: [35, 35], maxZoom: 12 });
}

async function initMap() {
  const status = document.querySelector("#map-status");
  if (typeof L === "undefined") {
    status.textContent = "Карта недоступна без подключения к сети";
    return;
  }
  map = L.map("map", { scrollWheelZoom: false }).setView([42.7, 19.2], 8);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);
  try {
    const response = await fetch("data/map_points.geojson");
    if (!response.ok) throw new Error("Не удалось загрузить GeoJSON");
    geoData = await response.json();
    document.querySelectorAll("[data-point-count]").forEach((element) => {
      element.textContent = String(geoData.features.length);
    });
    showPoints();
  } catch (error) {
    status.textContent = "Точки карты временно недоступны";
  }
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    showPoints(button.dataset.priority);
  });
});

window.addEventListener("load", initMap);
