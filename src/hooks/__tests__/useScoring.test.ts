import { describe, it, expect } from 'vitest';
import { calculateMZI } from '../useScoring';
import { createEmptyAreal, createEmptyPozemok } from '../../types/areal';

describe('calculateMZI – stav zelene s poľom priepustnaPlochaHolaPoda', () => {
  it('započíta holú pôdu do skóre rovnako ako byliny (issue #128 – pole skryté z formulára)', () => {
    const arealSByliny = createEmptyAreal();
    const pByliny = createEmptyPozemok();
    pByliny.priepustnaPlochaCelkom = 100;
    pByliny.priepustnaPlochaByliny = 40;
    arealSByliny.pozemky = [pByliny];

    const arealSHolouPodou = createEmptyAreal();
    const pHolaPoda = createEmptyPozemok();
    pHolaPoda.priepustnaPlochaCelkom = 100;
    pHolaPoda.priepustnaPlochaHolaPoda = 40;
    arealSHolouPodou.pozemky = [pHolaPoda];

    const skoreByliny = calculateMZI(arealSByliny);
    const skoreHolaPoda = calculateMZI(arealSHolouPodou);

    expect(skoreHolaPoda.stavZelene).toBe(skoreByliny.stavZelene);
  });

  it('existujúce nenulové hodnoty priepustnaPlochaHolaPoda naďalej prispievajú ku skóre (nie sú ignorované)', () => {
    const arealBezHolejPody = createEmptyAreal();
    const pBez = createEmptyPozemok();
    pBez.priepustnaPlochaCelkom = 100;
    arealBezHolejPody.pozemky = [pBez];

    const arealSHolouPodou = createEmptyAreal();
    const pS = createEmptyPozemok();
    pS.priepustnaPlochaCelkom = 100;
    pS.priepustnaPlochaHolaPoda = 40;
    arealSHolouPodou.pozemky = [pS];

    const skoreBez = calculateMZI(arealBezHolejPody);
    const skoreS = calculateMZI(arealSHolouPodou);

    expect(skoreS.stavZelene).toBeGreaterThan(skoreBez.stavZelene);
  });
});
