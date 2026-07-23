import { describe, it, expect } from 'vitest';
import { getStrechaOrientovanaPlochaLabel, getStrechaOrientovanaPlochaTooltip } from '../roofOrientationText';

describe('getStrechaOrientovanaPlochaLabel', () => {
  it('pre plochú strechu vynechá orientáciu', () => {
    expect(getStrechaOrientovanaPlochaLabel(1)).toBe('Využiteľná plocha strechy');
  });

  it('pre šikmú strechu ponechá orientáciu J/JV/JZ', () => {
    expect(getStrechaOrientovanaPlochaLabel(2)).toBe('Využiteľná plocha strechy orient. na J/JV/JZ');
  });

  it('pre strmú strechu ponechá orientáciu J/JV/JZ', () => {
    expect(getStrechaOrientovanaPlochaLabel(3)).toBe('Využiteľná plocha strechy orient. na J/JV/JZ');
  });
});

describe('getStrechaOrientovanaPlochaTooltip', () => {
  it('pre plochú strechu vysvetlí, že sa uvádza celá plocha', () => {
    expect(getStrechaOrientovanaPlochaTooltip(1)).toContain('celú využiteľnú plochu strechy');
  });

  it('pre šikmú strechu vysvetlí orientáciu na juh', () => {
    expect(getStrechaOrientovanaPlochaTooltip(2)).toContain('orientovaná na juh');
  });
});
