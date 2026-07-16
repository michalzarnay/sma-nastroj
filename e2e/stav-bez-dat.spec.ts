import { test, expect } from '@playwright/test';
import { openClean, goToResults } from './helpers/stubs';

/**
 * STAV BEZ DÁT.
 *
 * Zdokumentovaný krehký bod VESMA: prázdny areál / čerstvá session občas
 * vyzerá ako "chyba zobrazenia", hoci ide o legitímny stav bez dát.
 * Tento test fixuje očakávanie: s úplne prázdnym areálom sa Výsledky
 * vykreslia BEZ pádu a zobrazia exportnú sekciu.
 *
 * Slúži aj ako ochrana pred slepými UI opravami auto-fix agenta:
 * ak "oprava" rozbije render prázdneho stavu, tento test spadne.
 */
test('Výsledky s prázdnym areálom sa vykreslia bez pádu', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  await openClean(page);
  await goToResults(page);

  // Stránka žije, exportná sekcia je prítomná, žiadna nezachytená výnimka.
  await expect(page.getByText('Export výsledkov')).toBeVisible();
  expect(consoleErrors, `Nezachytené chyby: ${consoleErrors.join('\n')}`).toHaveLength(0);
});
