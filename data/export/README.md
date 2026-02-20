# CSV-viennit / talousarviodata

Kaikki tiedostot käyttävät **puolipistettä (`;`)** sarjaerottimena (suomenkielinen desimaalipilkku).

| Tiedosto | Sisältö |
|----------|--------|
| **totals_by_year.csv** | Kokonaismäärärahat vuosittain (2023–2026), delta ja delta % edelliseen |
| **hallinnonalat.csv** | Hallinnonalat: id, name, short, category, y2023–y2026 (milj. €) |
| **kustannuspaikat.csv** | Kustannuspaikka-taso: hallinnonala_id, kustannuspaikka, value_2025, value_2024 |
| **kategoria_vuosittain.csv** | Kategoriat vuosittain: mandated, discretionary, investment, mixed (milj. €) |
| **menotyypit.csv** | Menotyypit: kulutusmenot, siirtomenot, sijoitusmenot, muut (y2025, y2026) |
| **macro.csv** | Makro: BKT, velkasuhteet, alijäämä, valtionvelka (y2024–y2026) |
| **velkasimulaatio.csv** | Velkasuhde % BKT skenaarioittain (g -1 % … 2 %) vuosille 2025–2035 |

Lähde: sovelluksen data (`budget-full.js`, `budget.js`, `debt-simulation.js`), budjetti.vm.fi.
