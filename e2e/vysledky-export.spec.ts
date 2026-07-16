import { test, expect } from '@playwright/test';
import { openClean, goToResults } from './helpers/stubs';

/**
 * VÝSLEDKY + EXPORT.
 *
 * Overuje, že krok Výsledky sa korektne vykreslí a že export XLSX reálne spustí
 * stiahnutie súboru (xlsx sa generuje na klientovi, takže funguje aj offline).
 * Export je v `CLAUDE.md` označený ako kontrakt – tento test ho NEMENÍ,
 * len stráži, že tlačidlo stále produkuje súbor (regresná poistka).
 */
test.describe('Výsledky a export', () => {
  test.beforeEach(async ({ page }) => {
    await openClean(page);
  });

  test('export XLSX spustí stiahnutie súboru', async ({ page }) => {
    await goToResults(page);

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Exportovať XLSX' }).click();
    const download = await downloadPromise;

    // Názov súboru by mal mať príponu .xlsx.
    expect(download.suggestedFilename()).toMatch(/\.xlsx$/i);
  });

  test('export CSV spustí stiahnutie súboru', async ({ page }) => {
    await goToResults(page);

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Exportovať CSV' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  });
});
