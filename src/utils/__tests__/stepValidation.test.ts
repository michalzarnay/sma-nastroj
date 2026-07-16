import { describe, it, expect } from 'vitest';
import { step1CanProceed } from '../stepValidation';

describe('step1CanProceed', () => {
  it('vráti false pre prázdny názov', () => {
    expect(step1CanProceed({ nazov: '' })).toBe(false);
  });

  it('vráti false pre názov tvorený len medzerami', () => {
    expect(step1CanProceed({ nazov: '   ' })).toBe(false);
  });

  it('vráti true keď je názov vyplnený', () => {
    expect(step1CanProceed({ nazov: 'Základná škola Lipová' })).toBe(true);
  });

  it('vráti true aj pre jednoznakový názov', () => {
    expect(step1CanProceed({ nazov: 'A' })).toBe(true);
  });

  it('vráti true pre názov s medzerami na okrajoch (trim)', () => {
    expect(step1CanProceed({ nazov: '  ZŠ Lipová  ' })).toBe(true);
  });
});
