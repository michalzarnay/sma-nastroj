// Porovnanie areálov — krátériálna funkcia nad váhami z "VESMA_vahy pre vibe coding.xlsx"

export type Hrozba = 'sucho' | 'horucavy' | 'voda';

export const HROZBY: Array<{ value: Hrozba; label: string }> = [
  { value: 'sucho', label: 'Sucho' },
  { value: 'horucavy', label: 'Horúčavy' },
  { value: 'voda', label: 'Voda (záplavy)' },
];

export type OblastPorovnania = Hrozba | 'energia';

export interface ParameterPodrobnost {
  nazov: string;
  hodnota: number; // vypočítaná hodnota parametra (m², m³ alebo počet)
  vaha: number;
  prispevok: number; // hodnota * vaha
}

/** Výsledok krátériálnej funkcie pre jeden areál — štyri sumárne hodnoty. */
export interface AreaComparisonScore {
  arealId: string;
  nazov: string;
  sucho: number;
  horucavy: number;
  voda: number;
  energia: number;
  podrobnostiVoda: {
    sucho: ParameterPodrobnost[];
    horucavy: ParameterPodrobnost[];
    voda: ParameterPodrobnost[];
  };
  podrobnostiEnergia: ParameterPodrobnost[];
}

export interface AreaComparisonRow extends AreaComparisonScore {
  poradieSucho: number;
  poradieHorucavy: number;
  poradieVoda: number;
  poradieEnergia: number;
}
