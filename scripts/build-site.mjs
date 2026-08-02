import { copyFile, mkdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";

const distDir = new URL("../dist/", import.meta.url);
const dataDir = new URL("../dist/data/", import.meta.url);
await mkdir(dataDir, { recursive: true });

for (const asset of ["index.html", "styles.css", "app.js"]) {
  await copyFile(new URL(`../${asset}`, import.meta.url), new URL(`../dist/${asset}`, import.meta.url));
}

for (const source of ["map_points.geojson", "places.csv"]) {
  await copyFile(new URL(`../${source}`, import.meta.url), new URL(`../dist/data/${source}`, import.meta.url));
}

const geojson = JSON.parse(await readFile(new URL("../map_points.geojson", import.meta.url), "utf8"));
const csv = await readFile(new URL("../places.csv", import.meta.url), "utf8");
const csvIds = csv.trim().split("\n").slice(1).map((row) => row.slice(0, row.indexOf(",")));
const geojsonIds = geojson.features.map((feature) => feature.properties.id);
const csvRows = csvIds.length;
const missingInGeojson = csvIds.filter((id) => !geojsonIds.includes(id));
const missingInCsv = geojsonIds.filter((id) => !csvIds.includes(id));

if (
  geojson.type !== "FeatureCollection" ||
  geojson.features.length !== csvRows ||
  missingInGeojson.length ||
  missingInCsv.length ||
  new Set(csvIds).size !== csvIds.length ||
  new Set(geojsonIds).size !== geojsonIds.length
) {
  throw new Error(
    `Несовпадение данных: GeoJSON ${geojson.features.length}, CSV ${csvRows}; ` +
    `нет в GeoJSON: ${missingInGeojson.join(", ") || "-"}; нет в CSV: ${missingInCsv.join(", ") || "-"}`
  );
}

console.log(`Данные сайта подготовлены: ${geojson.features.length} точек.`);
