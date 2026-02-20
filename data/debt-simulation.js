/**
 * Velkasuhteen simulointi eri BKT-kasvuskenaarioilla.
 * Dynaamikka: Δd ≈ (r - g)*d + pd, missä d = velka/BKT, pd = primäärialijäämä/BKT, r = korko, g = reaalinen kasvu.
 * Käytetään yksinkertaistettuna: nimellinen korko i, nimellinen BKT-kasvu n => Δd ≈ (i - n)*d + pd.
 */

const macro = {
  gdp2025: 284.5,   // mrd €
  gdp2026: 295.0,
  debt2025: 181,     // valtionvelka mrd €
  debtRatio2025: 65.7,  // % BKT (VM arvio)
  deficitRatio2025: 4.2, // valtion alijäämä % BKT
  deficitRatio2026: 4.0,
  nominalInterestRate: 3.0, // pitkä korko ~3 %
};

// Primäärialijäämä = alijäämä - korkomenot (korkomenot ~3.2 mrd, BKT 2025 ~284.5 => korkomenot/BKT ~1.1 %)
const interestPaymentRatio2025 = (3.191 / 284.5) * 100;
const primaryDeficitRatio2025 = macro.deficitRatio2025 - interestPaymentRatio2025;
const primaryDeficitRatio2026 = macro.deficitRatio2026 - (3.246 / 295.0) * 100;

/**
 * Simuloi velkasuhde (valtionvelka % BKT) vuosille 2025..2035 eri kasvuskenaarioilla.
 * Dynaamikka: d(t+1) = (1+r)/(1+n)*d(t) + pd ≈ d(t)*(1+(r-n)/100) + pd.
 * g = reaalinen BKT-kasvu (%); inflaatio 2 % => nimellinen kasvu n ≈ g + 2.
 */
function simulateDebtRatio(options = {}) {
  const {
    growthRates = [-1, -0.5, 0, 0.5, 1, 2],
    inflation = 2,
    nominalInterestRate = 3,
    primaryDeficitPath = "constant",
    horizon = 10,
  } = options;

  const scenarios = {};
  growthRates.forEach((g) => {
    const n = g + inflation; // nimellinen BKT-kasvu %
    const r = nominalInterestRate;
    const pd = primaryDeficitPath === "improving" ? 2.5 : primaryDeficitRatio2025;
    const path = [macro.debtRatio2025];
    let d = macro.debtRatio2025;
    let pdYear = pd;
    for (let t = 1; t <= horizon; t++) {
      if (primaryDeficitPath === "improving") pdYear = Math.max(0, pd - t * 0.25);
      d = d * (1 + (r - n) / 100) + pdYear;
      path.push(Math.round(d * 10) / 10);
    }
    scenarios[`${g}%`] = { g, n, path, label: `BKT-kasvu ${g} %` };
  });
  return scenarios;
}

const GROWTH_SCENARIOS = [-1, -0.5, 0, 0.5, 1, 2];
const simulatedPaths = simulateDebtRatio({
  growthRates: GROWTH_SCENARIOS,
  horizon: 10,
  primaryDeficitPath: "constant",
});

// Vuodet 2025..2035
const simulationYears = Array.from({ length: 11 }, (_, i) => 2025 + i);

// D3-käyttöön: { year, g-1: ratio, g-0.5: ratio, ... }
const debtPathChartData = simulationYears.map((year, i) => {
  const row = { year };
  GROWTH_SCENARIOS.forEach((g) => {
    row[`g${g}`] = simulatedPaths[`${g}%`].path[i];
  });
  return row;
});

// Selain: globaalit muuttujat D3-visualisointia varten
if (typeof window !== "undefined") {
  window.simulatedPaths = simulatedPaths;
  window.simulationYears = simulationYears;
  window.GROWTH_SCENARIOS = GROWTH_SCENARIOS;
  window.simulateDebtRatio = simulateDebtRatio;
  window.macro = macro;
  window.primaryDeficitRatio2025 = primaryDeficitRatio2025;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    simulateDebtRatio,
    simulatedPaths,
    debtPathChartData,
    simulationYears,
    macro,
    primaryDeficitRatio2025,
  };
}
