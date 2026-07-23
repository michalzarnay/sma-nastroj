import { describe, it, expect } from 'vitest';
import { glossary } from '../glossary';

describe('glossary', () => {
  it('pole pre solárny ohrev vody je pomenované "solárne kolektory", nie "solárne panely" (nezamieňať s fotovoltikou)', () => {
    expect(glossary.solarnePanelyDef.term).toBe('Solárne kolektory');
  });

  it('typy povrchu na pozemku majú aktualizované názvy (issue #71)', () => {
    expect(glossary.priepustnaPlochaDef.term).toBe('Prírodný (vsakovací) povrch');
    expect(glossary.polopriepustnaPlochaDef.term).toBe('Spevnený (polopriepustný) povrch');
    expect(glossary.spevnenaPlochaDef.term).toBe('Nepriepustný povrch');
  });
});
