import { Budova, Pozemok, Areal } from '../types/areal';
import { FUEL_CONVERSIONS } from '../data/constants';

// Building category by uzitkovaPlochaNUS
export function getBuildingCategory(uzitkova: number): 'S' | 'M' | 'L' {
  if (uzitkova <= 500) return 'S';
  if (uzitkova <= 1500) return 'M';
  return 'L';
}

// Green roof potential = podorys area if flat roof
export function getGreenRoofPotential(budova: Budova): number | null {
  return budova.strechaTyp === 1 ? budova.plochaPodorysu : null;
}

// Fuel consumption conversion to kWh
export function convertFuelToKWh(kg: number, fuelType: 'pelety' | 'stiepka' | 'uhlie' | 'drevo'): number {
  return kg * FUEL_CONVERSIONS[fuelType];
}

// Total heating consumption for a building
export function getTotalHeatingConsumption(budova: Budova): number {
  let total = budova.kureniePlynSpotreba + budova.kurenieElektrinaSpotreba + budova.tepelneCerpadloSpotreba;

  total += budova.kureniePeletySpotreba_kg * FUEL_CONVERSIONS.pelety;
  total += budova.kurenieStiepkaSpotreba_kg * FUEL_CONVERSIONS.stiepka;

  if (budova.kurenieUhlimDrevom === 1) {
    total += budova.kurenieUhlimDrevomSpotreba_kg * FUEL_CONVERSIONS.uhlie;
  } else if (budova.kurenieUhlimDrevom === 2) {
    total += budova.kurenieUhlimDrevomSpotreba_kg * FUEL_CONVERSIONS.drevo;
  }

  total += budova.kurenieCZTSpotreba;
  return total;
}

// Weighted average of water drainage across pozemky
export function getWeightedWaterDrainage(pozemky: Pozemok[]): {
  kanalizacia: number;
  vodnyTok: number;
  vsakovanie: number;
  nerieseny: number;
} {
  let totalPlocha = 0;
  let wKan = 0, wVod = 0, wVsak = 0, wNer = 0;

  for (const p of pozemky) {
    const plocha = p.plochaBezBudov || p.celkovaVymera;
    totalPlocha += plocha;
    wKan += (p.odvodVodyKanalizacia ?? 0) * plocha;
    wVod += p.odvodVodyVodnyTok * plocha;
    wVsak += p.odvodVodyVsakovanie * plocha;
    wNer += p.odvodVodyNerieseny * plocha;
  }

  if (totalPlocha === 0) return { kanalizacia: 0, vodnyTok: 0, vsakovanie: 0, nerieseny: 0 };

  return {
    kanalizacia: wKan / totalPlocha,
    vodnyTok: wVod / totalPlocha,
    vsakovanie: wVsak / totalPlocha,
    nerieseny: wNer / totalPlocha,
  };
}

// Total areal area stats
export function getArealStats(areal: Areal) {
  let totalPlocha = 0;
  let totalPriepustna = 0;
  let totalPolopriepustna = 0;
  let totalSpevnena = 0;
  let totalZastavana = 0;

  for (const p of areal.pozemky) {
    totalPlocha += p.celkovaVymera;
    totalPriepustna += p.priepustnaPlochaCelkom;
    totalPolopriepustna += p.polopriepustnaPlochaCelkom;
    totalSpevnena += p.spevnenaPlochaCelkom;
  }

  for (const b of areal.budovy) {
    totalZastavana += b.plochaPodorysu;
  }

  return { totalPlocha, totalPriepustna, totalPolopriepustna, totalSpevnena, totalZastavana };
}

// FV potential calculation
export function getFVPotential(juznaPlochm2: number): { kWp: number; kWhRok: number } {
  const kWp = juznaPlochm2 * 0.15;
  const kWhRok = kWp * 1050;
  return { kWp: Math.round(kWp * 10) / 10, kWhRok: Math.round(kWhRok) };
}
