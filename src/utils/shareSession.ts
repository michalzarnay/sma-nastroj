/** Názov JSON súboru pri exporte/zdieľaní relácie (rovnaký formát ako doteraz). */
export function sessionJsonFilename(nazov: string, id: string): string {
  return `${nazov || 'areal'}-${id.slice(0, 8)}.json`;
}

/**
 * Zostaví `mailto:` odkaz s predvyplneným predmetom a telom pre zdieľanie relácie.
 * Prílohu (JSON súbor) musí používateľ pridať ručne — `mailto:` prílohy nepodporuje.
 */
export function buildShareMailto(nazov: string, filename: string): string {
  const nazovAleboFallback = nazov || 'bez názvu';
  const predmet = `VESMA relácia: ${nazovAleboFallback}`;
  const telo = [
    'Dobrý deň,',
    '',
    `posielam vyplnenú reláciu VESMA „${nazovAleboFallback}".`,
    '',
    `Súbor „${filename}" sa vám práve stiahol — priložte ho, prosím, ručne do tohto e-mailu.`,
    'Otvoríte ho vo VESMA cez Relácie → Importovať zo súboru…',
  ].join('\n');
  return `mailto:?subject=${encodeURIComponent(predmet)}&body=${encodeURIComponent(telo)}`;
}
