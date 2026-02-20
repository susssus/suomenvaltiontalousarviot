# Suomen valtion talousarvio 2023–2026 – analyysi ja visualisoinnit

Tämä projekti käy läpi Suomen talousarviot vuosille 2023–2026, kategorisoi menot taloustieteilijän näkökulmasta, simuloi velkasuhteen kehitystä eri kasvuskenaarioilla ja visualisoi budjetit D3:llä (YoY-muutos).

## Rakenne

- **`data/budget.js`** – Määrärahat hallinnonaloittain (2025–2026), kategorisointi (lakisääteinen / harkinnanvarainen / sijoitusluonteinen / sekalaista).
- **`data/budget-full.js`** – Kokonaisvuosidata 2023–2026, hallinnonalat (drillable), pääluokkakoodit PDF:ien mukaisesti.
- **`data/debt-simulation.js`** – Velkasuhteen simulointi kasvuskenaarioilla -1 %, -0,5 %, 0 %, 0,5 %, 1 %, 2 %.
- **`index.html`** – D3-grafiikat: kokonaisvuosimuutos, menot kategorioittain, YoY-delta hallinnonaloittain, velkasuhteen kehitys.
- **`ANALYYSI.md`** – Taloustieteilijän tulkinta, “seinä”-keskustelu ja skenaariot (humaaninen, kaupallinen, hybridi, liberaali, vasemmisto-vihreä).

## Käyttö

1. Avaa `index.html` selaimessa (tai käynnistä paikallinen palvelin, esim. `npx serve .`).
2. Luet analyysin: `ANALYYSI.md`.

## Lähteet

Ensisijaiset (tarkempi taso): valtion talousarvion PDF-taulukot  
`talousarvio-2023-t.pdf`, `talousarvio-2024.pdf`, `talousarvio-2025-t.pdf`, `talousarvio-2026-t.pdf`

Pääluokkakoodit (päätöskoodistot) noudattavat näissä PDF:eissä olevaa hallinnonalajaottelua (id 21–36). Taustalla hallitusesitykset HE 109/2024 vp (talousarvio 2025) ja HE 99/2025 vp (talousarvio 2026).
