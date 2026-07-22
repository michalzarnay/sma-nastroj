import { describe, it, expect } from 'vitest';
import { glossary } from '../glossary';

describe('glossary', () => {
  it('pole pre solárny ohrev vody je pomenované "solárne kolektory", nie "solárne panely" (nezamieňať s fotovoltikou)', () => {
    expect(glossary.solarnePanelyDef.term).toBe('Solárne kolektory');
  });
});
