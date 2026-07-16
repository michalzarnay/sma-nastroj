import { describe, it, expect } from 'vitest';
import { matchKraj, matchOkres } from '../locationMatchers';

describe('matchKraj', () => {
  it('nájde kraj podľa presnej zhody (case-insensitive)', () => {
    expect(matchKraj('Žilinský kraj')).toBe('Žilinský kraj');
    expect(matchKraj('žilinský kraj')).toBe('Žilinský kraj');
    expect(matchKraj('ŽILINSKÝ KRAJ')).toBe('Žilinský kraj');
  });

  it('nájde kraj podľa čiastočnej zhody (Nominatim skratka)', () => {
    expect(matchKraj('Žilinský')).toBe('Žilinský kraj');
    expect(matchKraj('Bratislavský')).toBe('Bratislavský kraj');
  });

  it('vráti prázdny reťazec pre prázdny vstup', () => {
    expect(matchKraj('')).toBe('');
  });

  it('vráti prázdny reťazec pre neznámy kraj', () => {
    expect(matchKraj('Moravský kraj')).toBe('');
  });
});

describe('matchOkres', () => {
  it('nájde okres podľa presnej zhody', () => {
    expect(matchOkres('Ružomberok', 'Žilinský kraj')).toBe('Ružomberok');
  });

  it('odsekne prefix "Okres" z Nominatim odpovede', () => {
    expect(matchOkres('Okres Ružomberok', 'Žilinský kraj')).toBe('Ružomberok');
    expect(matchOkres('okres Ružomberok', 'Žilinský kraj')).toBe('Ružomberok');
  });

  it('hľadá vo všetkých krajoch ak kraj nie je zadaný', () => {
    expect(matchOkres('Okres Malacky', '')).toBe('Malacky');
  });

  it('vráti prázdny reťazec pre prázdny vstup', () => {
    expect(matchOkres('', 'Žilinský kraj')).toBe('');
  });

  it('vráti prázdny reťazec pre neznámy okres', () => {
    expect(matchOkres('Okres Neexistujúci', 'Žilinský kraj')).toBe('');
  });
});
