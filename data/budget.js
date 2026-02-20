/**
 * Suomen valtion talousarvio 2025 ja 2026 – määrärahat hallinnonaloittain (milj. €).
 * Ensisijainen lähde: talousarvio-2025-t.pdf, talousarvio-2026-t.pdf (päätöskoodisto = pääluokkakoodit id 21–36).
 * Taustalla HE 109/2024 vp (2025), HE 99/2025 vp (2026). Kategorisointi oma tulkinta.
 */

const BUDGET_YEARS = [2025, 2026];

// Määrärahat (milj. €) – talousarvio-PDF:ien taulukot 2025 ja 2026; id = pääluokkakoodi
const appropriationsByMinistry = [
  { id: "21", name: "Eduskunta", y2025: 148, y2026: 148, category: "discretionary" },
  { id: "22", name: "Tasavallan presidentti", y2025: 47, y2026: 29, category: "discretionary" },
  { id: "23", name: "Valtioneuvoston kanslia", y2025: 246, y2026: 239, category: "discretionary" },
  { id: "24", name: "Ulkoministeriön hallinnonala", y2025: 1200, y2026: 1155, category: "discretionary" },
  { id: "25", name: "Oikeusministeriön hallinnonala", y2025: 1202, y2026: 1243, category: "mandated" },
  { id: "26", name: "Sisäministeriön hallinnonala", y2025: 2207, y2026: 2090, category: "discretionary" },
  { id: "27", name: "Puolustusministeriön hallinnonala", y2025: 6527, y2026: 6297, category: "discretionary" },
  { id: "28", name: "Valtiovarainministeriön hallinnonala", y2025: 40210, y2026: 41840, category: "mandated" },
  { id: "29", name: "Opetus- ja kulttuuriministeriön hallinnonala", y2025: 8452, y2026: 8934, category: "investment" },
  { id: "30", name: "Maa- ja metsätalousministeriön hallinnonala", y2025: 2621, y2026: 2553, category: "mixed" },
  { id: "31", name: "Liikenne- ja viestintäministeriön hallinnonala", y2025: 3598, y2026: 3849, category: "investment" },
  { id: "32", name: "Työ- ja elinkeinoministeriön hallinnonala", y2025: 3631, y2026: 3349, category: "mixed" },
  { id: "33", name: "Sosiaali- ja terveysministeriön hallinnonala", y2025: 15221, y2026: 14840, category: "mandated" },
  { id: "35", name: "Ympäristöministeriön hallinnonala", y2025: 252, y2026: 494, category: "investment" },
  { id: "36", name: "Valtionvelan korot", y2025: 3191, y2026: 3246, category: "mandated" },
];

// Yhteenveto menotyypeistä (2025 / 2026)
const expenditureByType = {
  kulutusmenot: { y2025: 21274, y2026: 21074, label: "Kulutusmenot" },
  siirtomenot: { y2025: 63197, y2026: 65008, label: "Siirtomenot" },
  sijoitusmenot: { y2025: 1001, y2026: 902, label: "Sijoitusmenot" },
  muut: { y2025: 3282, y2026: 3321, label: "Muut menot" },
};

// Kategoriat taloustieteilijän jaottelussa
const CATEGORY_LABELS = {
  mandated: "1. Lakisääteiset ja demografian ajamat",
  discretionary: "2. Poliittisesti harkinnanvaraiset",
  investment: "3. Sijoitusluonteiset (tuotto riippuu kasvusta)",
  mixed: "Sekalaista (osittain lakisääteinen, osittain harkinnanvarainen/sijoitus)",
};

// Agregoidut kategoriat (mandated = 28 eläkkeet+rahoitus, 25 oikeus, 33 stm, 36 korko; investment = 29, 31, 35; rest discretionary/mixed)
function getCategoryAggregate(cat) {
  const items = appropriationsByMinistry.filter((m) => m.category === cat);
  return {
    label: CATEGORY_LABELS[cat] || cat,
    y2025: items.reduce((s, m) => s + m.y2025, 0),
    y2026: items.reduce((s, m) => s + m.y2026, 0),
  };
}

const categoryTotals = {
  mandated: getCategoryAggregate("mandated"),
  discretionary: getCategoryAggregate("discretionary"),
  investment: getCategoryAggregate("investment"),
  mixed: getCategoryAggregate("mixed"),
};

// BKT ja velka (VM:n luvut)
const macro = {
  gdp: { y2024: 276.0, y2025: 284.5, y2026: 295.0 }, // mrd €
  debtRatio: { y2024: 82.1, y2025: 86.9, y2026: 88.5 }, // julkisyhteisöt % BKT
  stateDebtRatio: { y2024: 61.4, y2025: 65.7, y2026: 67.1 }, // valtionvelka % BKT
  stateDeficitRatio: { y2025: 4.2, y2026: 4.0 }, // valtion alijäämä % BKT
  stateDebtNominal: { y2025: 181, y2026: 194 }, // mrd € (talousarvion mukainen)
};

const totalAppropriations = {
  y2025: appropriationsByMinistry.reduce((s, m) => s + m.y2025, 0),
  y2026: appropriationsByMinistry.reduce((s, m) => s + m.y2026, 0),
};

// YoY muutos (2025→2026) milj. € ja %
function yoyChange(val2025, val2026) {
  const delta = val2026 - val2025;
  const pct = val2025 ? (delta / val2025) * 100 : 0;
  return { delta, pct };
}

// D3:een sovitettu data
const chartData = {
  byMinistry: appropriationsByMinistry.map((m) => ({
    ...m,
    delta: m.y2026 - m.y2025,
    pct: m.y2025 ? ((m.y2026 - m.y2025) / m.y2025) * 100 : 0,
  })),
  byCategory: ["mandated", "discretionary", "investment", "mixed"].map((cat) => {
    const t = categoryTotals[cat];
    const { delta, pct } = yoyChange(t.y2025, t.y2026);
    return {
      category: cat,
      label: t.label,
      y2025: t.y2025,
      y2026: t.y2026,
      delta,
      pct,
    };
  }),
  totals: {
    y2025: totalAppropriations.y2025,
    y2026: totalAppropriations.y2026,
    ...yoyChange(totalAppropriations.y2025, totalAppropriations.y2026),
  },
  macro,
};

if (typeof module !== "undefined" && module.exports) module.exports = { chartData, macro, appropriationsByMinistry, categoryTotals, CATEGORY_LABELS };
