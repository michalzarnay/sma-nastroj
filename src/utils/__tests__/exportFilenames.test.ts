import { describe, it, expect } from 'vitest';
import { csvFilename, xlsxFilename } from '../exportFilenames';

describe('csvFilename', () => {
  it('obsahuje názov areálu a príponu .csv', () => {
    expect(csvFilename('ZŠ Lipová')).toBe('ZŠ Lipová-hodnotenie.csv');
  });

  it('použije fallback "areal" pre prázdny názov', () => {
    expect(csvFilename('')).toBe('areal-hodnotenie.csv');
  });
});

describe('xlsxFilename', () => {
  it('obsahuje názov, dátum a príponu .xlsx', () => {
    expect(xlsxFilename('ZŠ Lipová', '2026-07-16')).toBe('ZŠ Lipová-hodnotenie-2026-07-16.xlsx');
  });

  it('použije fallback "areal" pre prázdny názov', () => {
    expect(xlsxFilename('', '2026-07-16')).toBe('areal-hodnotenie-2026-07-16.xlsx');
  });

  it('má príponu .xlsx', () => {
    expect(xlsxFilename('Test', '2026-01-01')).toMatch(/\.xlsx$/);
  });
});
