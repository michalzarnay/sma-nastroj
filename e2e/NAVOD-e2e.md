# E2E testy VESMA (Playwright)

Funkčné testy, ktoré preklikajú dotazník ako reálny používateľ a strážia, že
sa nerozbije navigácia, vykreslenie krokov ani export. Sú postavené tak, aby
chránili pred slepými UI opravami auto-fix agenta (pozri `CLAUDE.md`).

## Inštalácia (jednorazovo)

```bash
npm i -D @playwright/test
npx playwright install chromium
```

Pridaj do `package.json` (sekcia `scripts`):

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

> Poznámka: úprava `package.json` je na tebe (ľudská brána). Vyššie sú navrhnuté
> riadky, nie automatická zmena.

## Spustenie

```bash
npm run test:e2e        # bežne v termináli
npm run test:e2e:ui     # interaktívny režim na ladenie selektorov
```

Playwright si sám spustí `npm run dev` (port 5173) a po teste ho zhasne.

## Čo testy pokrývajú

| Súbor | Pokrýva |
|---|---|
| `smoke.spec.ts` | nábeh appky, preklik všetkými 6 krokmi, rýchla navigácia |
| `vysledky-export.spec.ts` | vykreslenie Výsledkov, stiahnutie XLSX a CSV |
| `stav-bez-dat.spec.ts` | prázdny areál na Výsledkoch sa vykreslí bez pádu |

`helpers/stubs.ts` zmocňuje externé siete (Nominatim, Open-Meteo, Photon,
`/api/pvgis`, `/api/svp-flood`), aby boli testy deterministické.

## Známe obmedzenia / čo doladiť pri prvom behu

- **Žiadne `data-testid`.** Selektory idú cez rolu + slovenský text (`Ďalej`,
  `Exportovať XLSX`…). Ak sa text v UI zmení, treba upraviť selektor. Odporúčam
  doplniť zopár stabilných `data-testid` na najkrehkejšie miesta (prepínač
  entít `EntityTabBar`, `ScoreGauge`, hlavné navigačné tlačidlá) — je to malá,
  bezpečná zmena, ktorá testy spevní.
- Selektory vo vnútri formulárov krokov (Pozemky/Budovy) sú zatiaľ minimálne;
  rozšírenie na vypĺňanie konkrétnych polí je ďalší krok (viď nižšie).

## Ďalšie rozšírenie (návrh poradia)

1. Vyplnenie areálu: názov + pridanie parcely/budovy, kontrola, že sa skóre
   prepočíta (cez `ScoreGauge`).
2. Perzistencia: reload zachová rozpracovaný areál; „Nový areál" ho vyčistí.
3. Podmienené sekcie (`ConditionalSection`): zobrazenie/skrytie podľa odpovedí.
4. Kontrakt exportu: porovnanie štruktúry XLSX/CSV oproti očakávaným
   stĺpcom (G-label) — ako strážny test, ktorý kontrakt NEMENÍ.
