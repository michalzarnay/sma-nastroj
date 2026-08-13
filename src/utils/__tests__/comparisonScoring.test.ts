import { describe, it, expect } from 'vitest';
import { createEmptyAreal } from '../../types/areal';
import { computeAreaComparisonScore, rankAreaComparisons } from '../comparisonScoring';

describe('computeAreaComparisonScore', () => {
  it('vráti nulové hodnoty pre prázdny areál', () => {
    const areal = createEmptyAreal();
    const score = computeAreaComparisonScore(areal);
    expect(score.sucho).toBe(0);
    expect(score.horucavy).toBe(0);
    expect(score.voda).toBe(0);
    expect(score.energia).toBe(0);
  });

  it('spočíta vodný parameter podľa m² a váhy (odvod do kanalizácie)', () => {
    const areal = createEmptyAreal();
    areal.pozemky[0].plochaBezBudov = 1000;
    areal.pozemky[0].odvodVodyJednotnaKanalizacia = 50; // 500 m²

    const score = computeAreaComparisonScore(areal);
    // Váha sucho=7, horúčavy=5, voda=10 pre tento parameter (jediný nenulový v areáli)
    expect(score.sucho).toBe(Math.round(500 * 7));
    expect(score.horucavy).toBe(Math.round(500 * 5));
    expect(score.voda).toBe(Math.round(500 * 10));
  });

  it('sčíta odvod z jednotnej, splaškovej aj zrážkovej kanalizácie', () => {
    const areal = createEmptyAreal();
    areal.pozemky[0].plochaBezBudov = 1000;
    areal.pozemky[0].odvodVodyJednotnaKanalizacia = 20;
    areal.pozemky[0].odvodVodySplaskovaKanalizacia = 10;
    areal.pozemky[0].odvodVodyZrazkovaKanalizacia = 10;
    // spolu 40 % z 1000 m² = 400 m²

    const score = computeAreaComparisonScore(areal);
    expect(score.voda).toBe(Math.round(400 * 10));
  });

  it('existujúce opatrenie (dažďová záhrada) znižuje potenciál (záporná váha)', () => {
    const areal = createEmptyAreal();
    areal.pozemky[0].dazdovaZahradaPlocha = 50;

    const score = computeAreaComparisonScore(areal);
    expect(score.sucho).toBe(50 * -6);
    expect(score.horucavy).toBe(50 * -4);
    expect(score.voda).toBe(50 * -10);
  });

  it('počíta energetický parameter "vykurovanie plynom" ako počet budov bez tepelného čerpadla', () => {
    const areal = createEmptyAreal();
    areal.budovy[0].kurenePlynom = 1;
    areal.budovy[0].tepelneCerpadlo = 0;

    const score = computeAreaComparisonScore(areal);
    // Váha 6, hodnota parametra = 1 (jedna budova)
    expect(score.energia).toBe(6);
  });

  it('vystavbaPred1980 prispieva do energetického skóre s váhou 4', () => {
    const areal = createEmptyAreal();
    areal.budovy[0].vystavbaPred1980 = 1;

    const score = computeAreaComparisonScore(areal);
    expect(score.energia).toBe(4);
  });
});

describe('rankAreaComparisons', () => {
  it('priradí poradie #1 areálu s najvyššou hodnotou v každej oblasti', () => {
    const arealA = createEmptyAreal();
    arealA.nazov = 'A';
    arealA.pozemky[0].dazdovaZahradaPlocha = 0; // nižší potenciál sucha (nič neexistuje, ale aj nič netreba)

    const arealB = createEmptyAreal();
    arealB.nazov = 'B';
    arealB.pozemky[0].plochaBezBudov = 1000;
    arealB.pozemky[0].odvodVodyJednotnaKanalizacia = 100; // vysoký potenciál vo všetkých hrozbách

    const riadky = rankAreaComparisons([
      computeAreaComparisonScore(arealA),
      computeAreaComparisonScore(arealB),
    ]);

    const riadokB = riadky.find((r) => r.nazov === 'B')!;
    const riadokA = riadky.find((r) => r.nazov === 'A')!;

    expect(riadokB.poradieSucho).toBe(1);
    expect(riadokB.poradieVoda).toBe(1);
    expect(riadokA.poradieSucho).toBe(2);
    expect(riadokA.poradieVoda).toBe(2);
  });
});
