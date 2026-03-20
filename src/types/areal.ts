// Data model matching Excel questionnaire structure

export interface Areal {
  id: string;
  nazov: string;
  adresa: string;
  obec: string;
  region: string;
  mnozstvoZrazok?: number; // mm/m2
  potencialSlnecnehoSvitu?: number; // kWh/rok
  pozemky: Pozemok[];
  budovy: Budova[];
  ineStavby: InaStavba[];
  bgOpatrenia: BGOpatrenie[];
}

export interface Pozemok {
  id: string;
  aktualneVyuzitie: string;
  parcela: string;
  listVlastnictva: string;
  celkovaVymera: number; // m2
  plochaBezBudov: number; // m2
  clenitosTerenu: string;

  // Odvod vody (% plochy, sucet = 100%)
  odvodVodyKanalizacia: number;
  odvodVodyVodnyTok: number;
  odvodVodyVsakovanie: number;
  odvodVodyNerieseny: number;

  // Priepustna plocha
  priepustnaPlochaCelkom: number; // m2
  priepustnaPlochaHolaPoda: number; // %
  priepustnaPlochaByliny: number; // %
  priepustnaPlochaKry: number; // %
  priepustnaPlochaStromy: number; // %
  priepustnaPlochaZatienena: number; // %

  // Polopriepustna plocha
  polopriepustnaPlochaCelkom: number; // m2
  polopriepustnaPriepustnyAsfalt: number; // %
  polopriepustnaPriepustnyBeton: number; // %
  polopriepustnaPlnevegetacneTvarnice: number; // %
  polopriepustnaPolovegetacneTvarnice: number; // %
  polopriepustnaVodopriepustnaDlazba: number; // %
  polopriepustnaZivicaKremicityStrk: number; // %
  polopriepustnaMlatovyPovrch: number; // %
  polopriepustnaStered: number; // %
  polopriepustnaInyPovrch: number; // %
  polopriepustnaVyspadovana: number; // %

  // Spevnena plocha
  spevnenaPlochaCelkom: number; // m2
  spevnenaPlochaVyspadovana: number; // %

  // Stromy
  stromyPodielMladych: number; // %
  stromyPodielNezdravych: number; // %

  // Existujuca infrastruktura
  dazdovaZahradaPlocha: number; // m2
  dazdovaZahradaHlbka: number; // cm
  jazierkoPlocha: number; // m2
  jazierkoHlbka: number; // cm
  nadzemneNadobyObjem: number; // m3
  podzemneNadobyObjem: number; // m3
  sposobVyuzitiaVody: string;
  zelenaStrechaPlocha: number; // m2
}

export interface Budova {
  id: string;
  nazov: string;
  parcela: string;
  listVlastnictva: string;
  plochaPodorysu: number; // m2
  uzitkovaPlochaNUS: number; // m2
  kategoriaBudovy?: 'S' | 'M' | 'L'; // auto-calculated

  // Vyuzitie objektu
  vyuzitieDniVRoku: number;
  vyuzitieMesiacovVRoku: number;
  vyuzitieHodinDenne: number;
  vyuzitieEnergiaPercent: number; // %

  // Strecha
  strechaTyp: 1 | 2 | 3; // 1=plocha, 2=sikma, 3=strma
  strechaMaterial: string;
  strechaPopisZateplenia: string;
  strechaNosnaKonstrukcia: string;
  strechaZateplenie: 0 | 1 | 2; // 0=nie, 1=ano, 2=ciastocne
  strechaRokObnovy: number;
  strechaProblemy: 0 | 1; // 0=nie, 1=ano
  potencialZelenejStrechy?: number; // m2, auto
  strechaOrientovanaPlochaNaJuh: number; // m2
  fasadaOrientovanaNaJuh: number; // m2
  // NUS helper from xMatik
  strechaTvarKrovu?: string;

  // Voda a splaskovod
  splaskovod: 1 | 2; // 1=spolu, 2=oddelene
  zvodyDazdovejVody: 1 | 2; // 1=vonkajsie, 2=vnutorne
  budovaOdvodVodyKanalizacia: number; // %
  budovaOdvodVodyVodnyTok: number; // %
  budovaOdvodVodyNaPozemok: number; // %
  budovaOdvodVodyNerieseny: number; // %
  oddeleneRozvodyVody: 0 | 1;

  // Uspory energie
  zateplenieFasady: 0 | 1 | 2;
  termoizolacneOkna: number; // %
  osvetlenieLED: number; // %

  // Vykurovanie - Plyn
  kurenePlynom: 0 | 1;
  kureniePlynRokInstalacie: number;
  kureniePlynVykon: number; // kW
  kureniePlynSpotreba: number; // kWh

  // Vykurovanie - Elektrina
  kurenieElektrinou: 0 | 1;
  kurenieElektrinaRokInstalacie: number;
  kurenieElektrinaVykon: number; // kW
  kurenieElektrinaSpotreba: number; // kWh

  // Vykurovanie - Tepelne cerpadlo
  tepelneCerpadlo: 0 | 1;
  tepelneCerpadloRokInstalacie: number;
  tepelneCerpadloVykon: number; // kW
  tepelneCerpadloSpotreba: number; // kWh

  // Vykurovanie - Pelety
  kureniePeletami: 0 | 1;
  kureniePeletyRokInstalacie: number;
  kureniePeletyVykon: number; // kW
  kureniePeletySpotreba_kg: number; // kg
  kureniePeletySpotreba_kWh?: number; // auto: kg * 4.8

  // Vykurovanie - Stiepka
  kurenieStiepkou: 0 | 1;
  kurenieStiepkaRokInstalacie: number;
  kurenieStiepkaVykon: number; // kW
  kurenieStiepkaSpotreba_kg: number; // kg
  kurenieStiepkaSpotreba_kWh?: number; // auto: kg * 4.0

  // Vykurovanie - Uhlie/Drevo
  kurenieUhlimDrevom: 0 | 1 | 2; // 0=nie, 1=uhlie, 2=drevo
  kurenieUhlimDrevomRokInstalacie: number;
  kurenieUhlimDrevomVykon: number; // kW
  kurenieUhlimDrevomSpotreba_kg: number; // kg
  kurenieUhlimDrevomSpotreba_kWh?: number; // auto: uhlie*8, drevo*4.3

  // Vykurovanie - CZT
  kurenieCZT: 0 | 1;
  kurenieCZTSpotreba: number; // kWh
  kurenieCZTCenaKWh: number;

  // Auto-calculated total
  celkovaSpotreba?: number; // kWh sum

  // Vykurovacie telesa
  vykurovacieTelesaDruh: string;
  termohlavice: 0 | 1;
  automatickaRegulacia: 0 | 1;
  rozdelenieDozOn: 0 | 1;
  kurenieHarmonogram: 0 | 1;
  rekuperacia: 0 | 1;

  // Elektricka energia
  spotrebaElektriny: number; // kWh
  vyrobaElektriny: number; // kWh
  fotovoltika: 0 | 1;
  fotovoltikaPlocha: number; // m2
  bateriovyUlozisko: number; // kWh
  pocitacovaSiet: 0 | 1;

  // Projektova dokumentacia
  energetickyCertifikat: 0 | 1;
  energetickyCertifikatCislo: string;
  energetickyAudit: 0 | 1;
  energetickyAuditRok: number;
  pd1Nazov: string;
  pd1Uroven: number; // 1-6
  pd1Rok: number;
  pd1Forma: 1 | 2; // 1=tlacena, 2=elektronicka
  pd2Nazov: string;
  pd2Uroven: number;
  pd2Rok: number;
  pd2Forma: 1 | 2;
  pd3Nazov: string;
  pd3Uroven: number;
  pd3Rok: number;
  pd3Forma: 1 | 2;

  // Existujuca infrastruktura
  zelenaStrechaPlocha: number; // m2
  solarnePanelyPlocha: number; // m2

  // Expert fields (hidden)
  normovanaSpotreba?: number;
  kategoriaEnergetickejNarocnosti?: string;
}

export interface InaStavba {
  id: string;
  nazov: string;
  parcela: string;
  listVlastnictva: string;
  typStavby: string;
  popisStavby: string;
  aktualneVyuzitie: string;
  celkovaVymeraParciel: number;
  zastavanaPlocha: number;
}

export interface BGOpatrenie {
  id: string;
  nazov: string;
  naParcele: string;
  inaBudovaMimoUSK: string;
  ochrannePasma: string;
  potencialZnecistenia: string;
  hladinaPodzemnejVody: string;
  vzdialenostVodnehoToku: number;
  vplyvOchranaPredPovodniami: string;
  vplyvZranitelneSkupiny: string;
  prekazky: string;
}

// Factory functions
export function createEmptyPozemok(): Pozemok {
  return {
    id: crypto.randomUUID(),
    aktualneVyuzitie: '',
    parcela: '',
    listVlastnictva: '',
    celkovaVymera: 0,
    plochaBezBudov: 0,
    clenitosTerenu: '',
    odvodVodyKanalizacia: 0,
    odvodVodyVodnyTok: 0,
    odvodVodyVsakovanie: 0,
    odvodVodyNerieseny: 0,
    priepustnaPlochaCelkom: 0,
    priepustnaPlochaHolaPoda: 0,
    priepustnaPlochaByliny: 0,
    priepustnaPlochaKry: 0,
    priepustnaPlochaStromy: 0,
    priepustnaPlochaZatienena: 0,
    polopriepustnaPlochaCelkom: 0,
    polopriepustnaPriepustnyAsfalt: 0,
    polopriepustnaPriepustnyBeton: 0,
    polopriepustnaPlnevegetacneTvarnice: 0,
    polopriepustnaPolovegetacneTvarnice: 0,
    polopriepustnaVodopriepustnaDlazba: 0,
    polopriepustnaZivicaKremicityStrk: 0,
    polopriepustnaMlatovyPovrch: 0,
    polopriepustnaStered: 0,
    polopriepustnaInyPovrch: 0,
    polopriepustnaVyspadovana: 0,
    spevnenaPlochaCelkom: 0,
    spevnenaPlochaVyspadovana: 0,
    stromyPodielMladych: 0,
    stromyPodielNezdravych: 0,
    dazdovaZahradaPlocha: 0,
    dazdovaZahradaHlbka: 0,
    jazierkoPlocha: 0,
    jazierkoHlbka: 0,
    nadzemneNadobyObjem: 0,
    podzemneNadobyObjem: 0,
    sposobVyuzitiaVody: '',
    zelenaStrechaPlocha: 0,
  };
}

export function createEmptyBudova(): Budova {
  return {
    id: crypto.randomUUID(),
    nazov: '',
    parcela: '',
    listVlastnictva: '',
    plochaPodorysu: 0,
    uzitkovaPlochaNUS: 0,
    vyuzitieDniVRoku: 0,
    vyuzitieMesiacovVRoku: 0,
    vyuzitieHodinDenne: 0,
    vyuzitieEnergiaPercent: 0,
    strechaTyp: 1,
    strechaMaterial: '',
    strechaPopisZateplenia: '',
    strechaNosnaKonstrukcia: '',
    strechaZateplenie: 0,
    strechaRokObnovy: 0,
    strechaProblemy: 0,
    strechaOrientovanaPlochaNaJuh: 0,
    fasadaOrientovanaNaJuh: 0,
    splaskovod: 1,
    zvodyDazdovejVody: 1,
    budovaOdvodVodyKanalizacia: 0,
    budovaOdvodVodyVodnyTok: 0,
    budovaOdvodVodyNaPozemok: 0,
    budovaOdvodVodyNerieseny: 0,
    oddeleneRozvodyVody: 0,
    zateplenieFasady: 0,
    termoizolacneOkna: 0,
    osvetlenieLED: 0,
    kurenePlynom: 0,
    kureniePlynRokInstalacie: 0,
    kureniePlynVykon: 0,
    kureniePlynSpotreba: 0,
    kurenieElektrinou: 0,
    kurenieElektrinaRokInstalacie: 0,
    kurenieElektrinaVykon: 0,
    kurenieElektrinaSpotreba: 0,
    tepelneCerpadlo: 0,
    tepelneCerpadloRokInstalacie: 0,
    tepelneCerpadloVykon: 0,
    tepelneCerpadloSpotreba: 0,
    kureniePeletami: 0,
    kureniePeletyRokInstalacie: 0,
    kureniePeletyVykon: 0,
    kureniePeletySpotreba_kg: 0,
    kurenieStiepkou: 0,
    kurenieStiepkaRokInstalacie: 0,
    kurenieStiepkaVykon: 0,
    kurenieStiepkaSpotreba_kg: 0,
    kurenieUhlimDrevom: 0,
    kurenieUhlimDrevomRokInstalacie: 0,
    kurenieUhlimDrevomVykon: 0,
    kurenieUhlimDrevomSpotreba_kg: 0,
    kurenieCZT: 0,
    kurenieCZTSpotreba: 0,
    kurenieCZTCenaKWh: 0,
    vykurovacieTelesaDruh: '',
    termohlavice: 0,
    automatickaRegulacia: 0,
    rozdelenieDozOn: 0,
    kurenieHarmonogram: 0,
    rekuperacia: 0,
    spotrebaElektriny: 0,
    vyrobaElektriny: 0,
    fotovoltika: 0,
    fotovoltikaPlocha: 0,
    bateriovyUlozisko: 0,
    pocitacovaSiet: 0,
    energetickyCertifikat: 0,
    energetickyCertifikatCislo: '',
    energetickyAudit: 0,
    energetickyAuditRok: 0,
    pd1Nazov: '',
    pd1Uroven: 0,
    pd1Rok: 0,
    pd1Forma: 1,
    pd2Nazov: '',
    pd2Uroven: 0,
    pd2Rok: 0,
    pd2Forma: 1,
    pd3Nazov: '',
    pd3Uroven: 0,
    pd3Rok: 0,
    pd3Forma: 1,
    zelenaStrechaPlocha: 0,
    solarnePanelyPlocha: 0,
  };
}

export function createEmptyInaStavba(): InaStavba {
  return {
    id: crypto.randomUUID(),
    nazov: '',
    parcela: '',
    listVlastnictva: '',
    typStavby: '',
    popisStavby: '',
    aktualneVyuzitie: '',
    celkovaVymeraParciel: 0,
    zastavanaPlocha: 0,
  };
}

export function createEmptyBGOpatrenie(): BGOpatrenie {
  return {
    id: crypto.randomUUID(),
    nazov: '',
    naParcele: '',
    inaBudovaMimoUSK: '',
    ochrannePasma: '',
    potencialZnecistenia: '',
    hladinaPodzemnejVody: '',
    vzdialenostVodnehoToku: 0,
    vplyvOchranaPredPovodniami: '',
    vplyvZranitelneSkupiny: '',
    prekazky: '',
  };
}

export function createEmptyAreal(): Areal {
  return {
    id: crypto.randomUUID(),
    nazov: '',
    adresa: '',
    obec: '',
    region: '',
    pozemky: [createEmptyPozemok()],
    budovy: [createEmptyBudova()],
    ineStavby: [],
    bgOpatrenia: [],
  };
}
