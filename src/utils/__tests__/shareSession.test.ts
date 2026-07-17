import { describe, it, expect } from 'vitest';
import { buildShareMailto, sessionJsonFilename } from '../shareSession';

describe('sessionJsonFilename', () => {
  it('obsahuje názov, skrátené id a príponu .json', () => {
    expect(sessionJsonFilename('ZŠ Lipová', 'abcdef12-3456-7890')).toBe('ZŠ Lipová-abcdef12.json');
  });

  it('použije fallback "areal" pre prázdny názov', () => {
    expect(sessionJsonFilename('', 'abcdef12-3456-7890')).toBe('areal-abcdef12.json');
  });
});

describe('buildShareMailto', () => {
  it('vytvorí mailto: odkaz bez adresáta', () => {
    expect(buildShareMailto('ZŠ Lipová', 'ZŠ Lipová-abcdef12.json')).toMatch(/^mailto:\?/);
  });

  it('predvyplní predmet s názvom relácie', () => {
    const url = buildShareMailto('ZŠ Lipová', 'subor.json');
    const subject = new URLSearchParams(url.slice('mailto:?'.length)).get('subject');
    expect(subject).toBe('VESMA relácia: ZŠ Lipová');
  });

  it('v tele spomenie názov súboru a postup importu', () => {
    const url = buildShareMailto('ZŠ Lipová', 'subor.json');
    const body = new URLSearchParams(url.slice('mailto:?'.length)).get('body') ?? '';
    expect(body).toContain('subor.json');
    expect(body).toContain('Importovať zo súboru');
  });

  it('použije fallback „bez názvu" pre prázdny názov relácie', () => {
    const url = buildShareMailto('', 'subor.json');
    const subject = new URLSearchParams(url.slice('mailto:?'.length)).get('subject');
    expect(subject).toBe('VESMA relácia: bez názvu');
  });
});
