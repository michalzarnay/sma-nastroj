export interface ScoreResult {
  celkove: number; // 0-100
  mzi: MZIScore;
  oze: OZEScore;
  energia: EnergiaScore;
  mziPotencial: number; // absolútny potenciál v m²·váha jednotkách (vyššie = viac možností)
}

export interface MZIScore {
  celkove: number;
  podielPriepustnychPloch: number; // 0-25
  existujuceOpatrenia: number; // 0-25
  stavZelene: number; // 0-25
  potencialZlepsenia: number; // 0-25
}

export interface OZEScore {
  celkove: number;
  vhodnostStrechyPreSolar: number; // 0-30
  existujuceOZE: number; // 0-20
  potencialTepelnehoCerpadla: number; // 0-25
  potencialDalsichOZE: number; // 0-25
}

export interface EnergiaScore {
  celkove: number;
  zateplenie: number; // 0-30
  kvalitaOkien: number; // 0-20
  vykurovaciSystem: number; // 0-25
  vetranie: number; // 0-25
}

export type ScoreLevel = 'cervena' | 'oranzova' | 'zlta' | 'zelena' | 'tmavaZelena';

export interface ScoreLevelInfo {
  level: ScoreLevel;
  color: string;
  bgColor: string;
  label: string;
}

export function getScoreLevel(score: number): ScoreLevelInfo {
  if (score <= 30) return { level: 'cervena', color: '#DC2626', bgColor: '#FEE2E2', label: 'Veľký priestor na zlepšenie' };
  if (score <= 50) return { level: 'oranzova', color: '#EA580C', bgColor: '#FFF7ED', label: 'Priemerný stav' };
  if (score <= 70) return { level: 'zlta', color: '#CA8A04', bgColor: '#FEFCE8', label: 'Dobrý základ' };
  if (score <= 85) return { level: 'zelena', color: '#16A34A', bgColor: '#F0FDF4', label: 'Veľmi dobrý stav' };
  return { level: 'tmavaZelena', color: '#166534', bgColor: '#DCFCE7', label: 'Vynikajúci stav' };
}
