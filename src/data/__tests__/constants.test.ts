import { describe, it, expect } from 'vitest';
import { ROOF_TYPES } from '../constants';

describe('ROOF_TYPES', () => {
  it('hranice sklonu strechy sú 15° a 35° (issue #129)', () => {
    expect(ROOF_TYPES[0]).toMatchObject({ value: 1, label: 'plochá alebo málo šikmá strecha (do 15°)' });
    expect(ROOF_TYPES[1]).toMatchObject({ value: 2, label: 'šikmá strecha (16° – 35°)' });
    expect(ROOF_TYPES[2]).toMatchObject({ value: 3, label: 'strmá strecha (nad 35°)' });
  });
});
