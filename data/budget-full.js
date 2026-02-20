/**
 * Valtion talousarvio 2023–2026: kokonaisvuosidata, hallinnonalat (drillable), haettava data.
 * Ensisijaiset lähteet: talousarvio-2023-t.pdf, talousarvio-2024.pdf, talousarvio-2025-t.pdf, talousarvio-2026-t.pdf
 *   (tarkempi taso kuin HE-dokumenteissa). Pääluokkakoodit (id 21–36) = talousarvion päätöskoodisto PDF:eistä.
 * Taustalla HE 109/2024 vp (2025), HE 99/2025 vp (2026). Summat milj. €.
 */

const BUDGET_YEARS = [2023, 2024, 2025, 2026];

// Kokonaismäärärahat vuosittain (talousarvio-PDF:ien taulukot)
const totalByYear = {
  y2023: 81553,
  y2024: 87867,
  y2025: 88754,
  y2026: 90306,
};

// Hallinnonalat: id = talousarvion pääluokkakoodi (päätöskoodisto PDF:eissä), name, category, vuosiarvot
// 21 Eduskunta, 22 Presidentti, 23 VNK, 24 Ulko, 25 Oikeus, 26 Sisä, 27 Puolustus, 28 VM, 29 Opetus, 30 MMM, 31 Liikenne, 32 TEM, 33 STM, 35 Ym, 36 Valtionvelan korot
const ministryRows = [
  { id: "21", name: "Eduskunta", short: "Eduskunta", category: "discretionary", y2023: 137, y2024: 146, y2025: 148, y2026: 148 },
  { id: "22", name: "Tasavallan presidentti", short: "Presidentti", category: "discretionary", y2023: 40, y2024: 48, y2025: 47, y2026: 29 },
  { id: "23", name: "Valtioneuvoston kanslia", short: "VNK", category: "discretionary", y2023: 585, y2024: 259, y2025: 246, y2026: 239 },
  { id: "24", name: "Ulkoministeriön hallinnonala", short: "Ulko", category: "discretionary", y2023: 1344, y2024: 1284, y2025: 1200, y2026: 1155 },
  { id: "25", name: "Oikeusministeriön hallinnonala", short: "Oikeus", category: "mandated", y2023: 1121, y2024: 1214, y2025: 1202, y2026: 1243 },
  { id: "26", name: "Sisäministeriön hallinnonala", short: "Sisä", category: "discretionary", y2023: 2560, y2024: 2579, y2025: 2207, y2026: 2090 },
  { id: "27", name: "Puolustusministeriön hallinnonala", short: "Puolustus", category: "discretionary", y2023: 6401, y2024: 5973, y2025: 6527, y2026: 6297 },
  { id: "28", name: "Valtiovarainministeriön hallinnonala", short: "VM", category: "mandated", y2023: 34226, y2024: 38091, y2025: 40210, y2026: 41840 },
  { id: "29", name: "Opetus- ja kulttuuriministeriön hallinnonala", short: "Opetus", category: "investment", y2023: 7780, y2024: 8041, y2025: 8452, y2026: 8934 },
  { id: "30", name: "Maa- ja metsätalousministeriön hallinnonala", short: "MMM", category: "mixed", y2023: 2720, y2024: 2655, y2025: 2621, y2026: 2553 },
  { id: "31", name: "Liikenne- ja viestintäministeriön hallinnonala", short: "Liikenne", category: "investment", y2023: 3554, y2024: 3616, y2025: 3598, y2026: 3849 },
  { id: "32", name: "Työ- ja elinkeinoministeriön hallinnonala", short: "TEM", category: "mixed", y2023: 3854, y2024: 4232, y2025: 3631, y2026: 3349 },
  { id: "33", name: "Sosiaali- ja terveysministeriön hallinnonala", short: "STM", category: "mandated", y2023: 15905, y2024: 16311, y2025: 15221, y2026: 14840 },
  { id: "35", name: "Ympäristöministeriön hallinnonala", short: "Ym", category: "investment", y2023: 373, y2024: 243, y2025: 252, y2026: 494 },
  { id: "36", name: "Valtionvelan korot", short: "Korkomenot", category: "mandated", y2023: 2323, y2024: 3177, y2025: 3191, y2026: 3246 },
];

// Alitaso: pääluokat / toimialat – value = 2025 (milj. €), valuePrev = 2024 (delta 2024→2025)
const subItemsExample = {
  "28": [
    { name: "Eläkkeet ja korvaukset", value: 6076, valuePrev: 5760 },
    { name: "Hyvinvointialueiden rahoitus", value: 26236, valuePrev: 24820 },
    { name: "Kuntien tukeminen", value: 3919, valuePrev: 3710 },
    { name: "EU ja kansainväliset järjestöt", value: 2386, valuePrev: 2260 },
    { name: "Muut (hallinto, verotus, Ahvenanmaa jne.)", value: 1593, valuePrev: 1541 },
  ],
  "33": [
    { name: "Eläkkeet (valtion osuus)", value: 5547, valuePrev: 5780 },
    { name: "Työttömyysturva", value: 1884, valuePrev: 1960 },
    { name: "Sairausvakuutus", value: 1872, valuePrev: 1950 },
    { name: "Perhe- ja asumisetuudet", value: 4002, valuePrev: 3980 },
    { name: "Muut (STM)", value: 1916, valuePrev: 2641 },
  ],
};

// Kokonaisvuosimuutokset: vuosi -> { total, delta, deltaPct } edelliseen
function getYearlyChanges() {
  const vals = BUDGET_YEARS.map((y) => totalByYear[`y${y}`]);
  return BUDGET_YEARS.map((year, i) => {
    const total = vals[i];
    const prev = i > 0 ? vals[i - 1] : null;
    const delta = prev !== null ? total - prev : null;
    const deltaPct = prev && prev !== 0 ? (delta / prev) * 100 : null;
    return { year, total, delta, deltaPct };
  });
}

// Haettava lista: kaikki nimet ja lyhyet nimet (search index)
function getSearchableItems() {
  const items = [];
  ministryRows.forEach((m) => {
    items.push({ type: "ministry", id: m.id, name: m.name, short: m.short, category: m.category });
    if (subItemsExample[m.id]) {
      subItemsExample[m.id].forEach((s) => {
        items.push({ type: "sub", parentId: m.id, name: s.name, parentName: m.name });
      });
    }
  });
  return items;
}

// D3 / UI: kokonaiskuvaajan data
const totalChartData = getYearlyChanges();

// D3: hallinnonalat kaikille vuosille + delta viimeisestä
const ministryChartData = ministryRows.map((m) => {
  const v2025 = m.y2025;
  const v2026 = m.y2026;
  return {
    ...m,
    delta: v2026 - v2025,
    deltaPct: v2025 ? ((v2026 - v2025) / v2025) * 100 : 0,
    searchText: (m.name + " " + m.short).toLowerCase(),
  };
});

// Kategorioittain vuosittain (stacked bar 2023–2026)
const categoryLabelsLong = {
  mandated: "1. Lakisääteiset ja demografian ajamat",
  discretionary: "2. Poliittisesti harkinnanvaraiset",
  investment: "3. Sijoitusluonteiset (tuotto riippuu kasvusta)",
  mixed: "Sekalaista (osittain lakisääteinen, osittain harkinnanvarainen/sijoitus)",
};
function getCategoryTotalsByYear() {
  const cats = { mandated: {}, discretionary: {}, investment: {}, mixed: {} };
  BUDGET_YEARS.forEach((y) => {
    const key = "y" + y;
    ["mandated", "discretionary", "investment", "mixed"].forEach((cat) => {
      cats[cat][key] = ministryRows.filter((m) => m.category === cat).reduce((s, m) => s + (m[key] || 0), 0);
    });
  });
  return BUDGET_YEARS.map((year) => ({
    year,
    mandated: cats.mandated["y" + year] || 0,
    discretionary: cats.discretionary["y" + year] || 0,
    investment: cats.investment["y" + year] || 0,
    mixed: cats.mixed["y" + year] || 0,
  }));
}
const categoryByYearData = getCategoryTotalsByYear();

if (typeof window !== "undefined") {
  window.BUDGET_YEARS = BUDGET_YEARS;
  window.totalByYear = totalByYear;
  window.totalChartData = totalChartData;
  window.ministryRows = ministryRows;
  window.ministryChartData = ministryChartData;
  window.subItemsExample = subItemsExample;
  window.getSearchableItems = getSearchableItems;
  window.categoryByYearData = categoryByYearData;
  window.categoryLabelsLong = categoryLabelsLong;
}
