import { test, expect } from '@playwright/test';
import { openClean, clickNext } from './helpers/stubs';

/**
 * NÁDRŽE – OBJEM V m³ S DESATINNÝM ČÍSLOM (issue #56).
 *
 * Používatelia majú napr. tri 200 l sudy = 0,6 m³. Pole objemu nádrží
 * predtým dovoľovalo len celé m³ (step=1), takže 0,4 m³ sa nedalo zapísať.
 * Jednotka zostáva m³; povoľujeme desatinné číslo a default ukazujeme
 * v desatinnom tvare (0,0).
 */
test('Objem nádrží na Pozemku prijme desatinné m³', async ({ page }) => {
  await openClean(page);
  await clickNext(page); // Krok 1 -> Krok 2 (Pozemok)

  const fields = ['Nadzemné nádrže – objem', 'Podzemné nádrže – objem'];

  for (const label of fields) {
    const input = page
      .locator('div.flex.flex-col.gap-1', { hasText: label })
      .locator('input[type="number"]');

    // Default sa ponúka v desatinnom tvare (0,0), jednotka ostáva m³.
    await expect(input).toHaveAttribute('placeholder', '0,0');

    // Desatinná hodnota 0,4 m³ je platná (predtým ju step=1 odmietol).
    await input.fill('0.4');
    await expect(input).toHaveValue('0.4');
    const valid = await input.evaluate((el) => (el as HTMLInputElement).checkValidity());
    expect(valid, `${label}: 0,4 m³ musí byť platná hodnota`).toBe(true);
  }
});
