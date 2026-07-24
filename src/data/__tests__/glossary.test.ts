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

  it('vyspádovanie má názov "Spevnená plocha vo svahu s sklonom" a nezmenené vysvetlenie (issue #109)', () => {
    expect(glossary.vyspadovanyPozemokDef.term).toBe('Spevnená plocha vo svahu s sklonom');
    expect(glossary.vyspadovanyPozemokDef.definition).toBe(
      'Pozemok, ktorý nie je rovný – má svah alebo sklon. Voda po ňom steká smerom nadol.'
    );
  });
});
