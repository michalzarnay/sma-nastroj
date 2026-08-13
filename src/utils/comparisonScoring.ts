import { Areal } from '../types/areal';
import { AreaComparisonScore, AreaComparisonRow, Hrozba, ParameterPodrobnost } from '../types/comparison';
import { MZI_PARAMETERS, ENERGIA_PARAMETERS } from '../data/comparisonWeights';

function mziPodrobnosti(areal: Areal, hrozba: Hrozba): ParameterPodrobnost[] {
  return MZI_PARAMETERS.map((param) => {
    const hodnota = param.getValue(areal);
    const vaha = param.vahy[hrozba];
    return { nazov: param.nazov, hodnota, vaha, prispevok: hodnota * vaha };
  });
}

function energiaPodrobnosti(areal: Areal): ParameterPodrobnost[] {
  return ENERGIA_PARAMETERS.map((param) => {
    const hodnota = param.getValue(areal);
    return { nazov: param.nazov, hodnota, vaha: param.vaha, prispevok: hodnota * param.vaha };
  });
}

function sucet(podrobnosti: ParameterPodrobnost[]): number {
  return Math.round(podrobnosti.reduce((acc, p) => acc + p.prispevok, 0));
}

/** Kritériálna funkcia: pre daný areál spočíta štyri sumárne hodnoty (sucho/horúčavy/voda/energia). */
export function computeAreaComparisonScore(areal: Areal): AreaComparisonScore {
  const podrobnostiSucho = mziPodrobnosti(areal, 'sucho');
  const podrobnostiHorucavy = mziPodrobnosti(areal, 'horucavy');
  const podrobnostiVoda = mziPodrobnosti(areal, 'voda');
  const podrobnostiEnergia = energiaPodrobnosti(areal);

  return {
    arealId: areal.id,
    nazov: areal.nazov || 'Areál bez názvu',
    sucho: sucet(podrobnostiSucho),
    horucavy: sucet(podrobnostiHorucavy),
    voda: sucet(podrobnostiVoda),
    energia: sucet(podrobnostiEnergia),
    podrobnostiVoda: { sucho: podrobnostiSucho, horucavy: podrobnostiHorucavy, voda: podrobnostiVoda },
    podrobnostiEnergia,
  };
}

/** Priradí poradie (1 = najvyšší potenciál) pre každú zo štyroch oblastí naprieč zoznamom areálov. */
export function rankAreaComparisons(scores: AreaComparisonScore[]): AreaComparisonRow[] {
  const poradie = (key: 'sucho' | 'horucavy' | 'voda' | 'energia') => {
    const zoradene = [...scores].sort((a, b) => b[key] - a[key]);
    const map = new Map<string, number>();
    zoradene.forEach((s, idx) => map.set(s.arealId, idx + 1));
    return map;
  };

  const poradieSucho = poradie('sucho');
  const poradieHorucavy = poradie('horucavy');
  const poradieVoda = poradie('voda');
  const poradieEnergia = poradie('energia');

  return scores.map((s) => ({
    ...s,
    poradieSucho: poradieSucho.get(s.arealId)!,
    poradieHorucavy: poradieHorucavy.get(s.arealId)!,
    poradieVoda: poradieVoda.get(s.arealId)!,
    poradieEnergia: poradieEnergia.get(s.arealId)!,
  }));
}
