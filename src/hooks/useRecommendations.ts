import { useMemo } from 'react';
import { Areal } from '../types/areal';
import { Odporucanie, Priorita } from '../types/catalog';
import { katalogOpatreni } from '../data/catalog';

function findOpatrenie(id: string) {
  return katalogOpatreni.find((o) => o.id === id);
}

function addRec(recs: Odporucanie[], id: string, priorita: Priorita, dovod: string, potencial?: string) {
  const opatrenie = findOpatrenie(id);
  if (opatrenie && !recs.some((r) => r.opatrenie.id === id)) {
    recs.push({ opatrenie, priorita, dovod, potencial });
  }
}

export function useRecommendations(areal: Areal): Odporucanie[] {
  return useMemo(() => {
    const recs: Odporucanie[] = [];
    const currentYear = new Date().getFullYear();

    // Analyze pozemky
    let totalPlocha = 0;
    let totalSpevnena = 0;
    let totalPriepustna = 0;
    let hasRetencnaNadrz = false;
    let hasDazdovaZahrada = false;
    let avgNeriesenyOdvod = 0;
    let totalZelenaStrechaPozemky = 0;

    for (const p of areal.pozemky) {
      const plocha = p.plochaBezBudov || p.celkovaVymera;
      totalPlocha += plocha;
      totalSpevnena += p.spevnenaPlochaCelkom;
      totalPriepustna += p.priepustnaPlochaCelkom;
      if (p.nadzemneNadobyObjem > 0 || p.podzemneNadobyObjem > 0) hasRetencnaNadrz = true;
      if (p.dazdovaZahradaPlocha > 0) hasDazdovaZahrada = true;
      avgNeriesenyOdvod += p.odvodVodyNerieseny;
      totalZelenaStrechaPozemky += p.zelenaStrechaPlocha;
    }
    if (areal.pozemky.length > 0) avgNeriesenyOdvod /= areal.pozemky.length;

    // MZI recommendations
    const spevnenyPodiel = totalPlocha > 0 ? totalSpevnena / totalPlocha : 0;
    if (spevnenyPodiel > 0.3) {
      addRec(recs, 'priepustna-dlazba', 'vysoká', `${Math.round(spevnenyPodiel * 100)}% areálu tvorí spevnená plocha.`, `Potenciál nahradiť až ${Math.round(totalSpevnena * 0.5)} m² priepustnou dlažbou.`);
      addRec(recs, 'dazdova-zahrada', 'vysoká', 'Vysoký podiel spevnených plôch zvyšuje povrchový odtok.');
    }

    if (!hasDazdovaZahrada && totalPlocha > 200) {
      addRec(recs, 'dazdova-zahrada', 'stredná', 'Areál nemá dažďovú záhradu na zachytávanie zrážkovej vody.');
    }

    if (avgNeriesenyOdvod > 50) {
      addRec(recs, 'vsakovaci-rigol', 'vysoká', `Priemerne ${Math.round(avgNeriesenyOdvod)}% odvodu vody z pozemkov je neriešených.`);
      addRec(recs, 'odvedenie-mimo-kanalizaciu', 'vysoká', 'Veľká časť dažďovej vody nie je riadene odvádzaná.');
    }

    // Green roof potential on buildings
    let totalGreenRoofPotential = 0;
    let totalStrechaPlochaBudov = 0;
    let hasExistingFV = false;
    let hasExistingSolar = false;
    let hasTC = false;
    let hasBateria = false;
    let totalJuznaPlochaBudov = 0;
    let hasBezZateplenia = false;
    let hasStareOkna = false;
    let hasBezRekuperacie = false;
    let hasStareKurenie = false;
    let hasUhlieDrevo = false;
    let hasBezLED = false;
    let hasBezTermohlavic = false;

    for (const b of areal.budovy) {
      totalStrechaPlochaBudov += b.plochaPodorysu;
      totalJuznaPlochaBudov += b.strechaOrientovanaPlochaNaJuh;

      if (b.strechaTyp === 1 && b.zelenaStrechaPlocha === 0) {
        totalGreenRoofPotential += b.plochaPodorysu;
      }
      if (b.fotovoltika === 1) hasExistingFV = true;
      if (b.solarnePanelyPlocha > 0) hasExistingSolar = true;
      if (b.tepelneCerpadlo === 1) hasTC = true;
      if (b.bateriovyUlozisko > 0) hasBateria = true;
      if (b.zateplenieFasady === 0) hasBezZateplenia = true;
      if (b.termoizolacneOkna < 50) hasStareOkna = true;
      if (b.rekuperacia === 0) hasBezRekuperacie = true;
      if (b.kurenieUhlimDrevom > 0) hasUhlieDrevo = true;
      if (b.osvetlenieLED < 50) hasBezLED = true;
      if (b.termohlavice === 0 && (b.kurenePlynom === 1 || b.tepelneCerpadlo === 1)) hasBezTermohlavic = true;

      // Check for old heating
      if (b.kurenePlynom === 1 && b.kureniePlynRokInstalacie > 0) {
        const age = currentYear - b.kureniePlynRokInstalacie;
        if (age > 15) hasStareKurenie = true;
      }
      if (b.kurenieElektrinou === 1 && b.kurenieElektrinaRokInstalacie > 0) {
        const age = currentYear - b.kurenieElektrinaRokInstalacie;
        if (age > 15) hasStareKurenie = true;
      }
    }

    if (totalGreenRoofPotential > 50) {
      addRec(recs, 'zelena-strecha-ext', 'stredná', `${Math.round(totalGreenRoofPotential)} m² plochých striech bez zelene.`, `Potenciál zachytiť ${Math.round(totalGreenRoofPotential * 0.3)} m³ dažďovej vody ročne.`);
    }

    if (!hasRetencnaNadrz && totalStrechaPlochaBudov > 50) {
      const potencialLitrov = Math.round(totalStrechaPlochaBudov * 0.8 * 0.7); // 700mm rain, 80% collection
      addRec(recs, 'retencna-nadrz', 'vysoká', `Areál nemá nádrž na dažďovú vodu. Zo striech (${Math.round(totalStrechaPlochaBudov)} m²) stečie veľa vody.`, `Potenciál zachytiť až ${potencialLitrov} litrov vody ročne.`);
    }

    // Trees
    let lowTreePozemky = 0;
    for (const p of areal.pozemky) {
      if (p.priepustnaPlochaStromy < 20 && p.priepustnaPlochaCelkom > 100) lowTreePozemky++;
    }
    if (lowTreePozemky > 0) {
      addRec(recs, 'vysadba-stromov', 'stredná', 'Nízky podiel stromov na pozemkoch.');
    }

    // OZE recommendations
    if (!hasExistingFV && totalJuznaPlochaBudov > 20) {
      const kWp = Math.round(totalJuznaPlochaBudov * 0.15);
      const kWhRok = kWp * 1050;
      addRec(recs, 'fotovoltika', 'vysoká', `${Math.round(totalJuznaPlochaBudov)} m² strechy orientovanej na juh bez fotovoltiky.`, `Potenciál: ${kWp} kWp, cca ${kWhRok.toLocaleString('sk')} kWh/rok.`);
    }

    if (!hasExistingSolar && totalJuznaPlochaBudov > 10) {
      addRec(recs, 'solarne-kolektory', 'stredná', 'Areál nevyužíva solárne kolektory na ohrev vody.');
    }

    if (!hasTC && (hasStareKurenie || hasUhlieDrevo)) {
      addRec(recs, 'tepelne-cerpadlo-vzduch', 'vysoká', hasUhlieDrevo ? 'Areál používa uhlie/drevo na vykurovanie.' : 'Vykurovací systém je starší ako 15 rokov.');
    }

    if (hasExistingFV && !hasBateria) {
      addRec(recs, 'bateriove-ulozisko', 'stredná', 'Areál má fotovoltiku, ale nemá batériové úložisko.');
    }

    // Energia recommendations
    if (hasBezZateplenia) {
      addRec(recs, 'zateplenie-fasady', 'vysoká', 'Niektoré budovy nemajú zateplenú fasádu.');
    }

    // Roof insulation
    let hasBezZateplenejStrechy = false;
    for (const b of areal.budovy) {
      if (b.strechaZateplenie === 0) hasBezZateplenejStrechy = true;
    }
    if (hasBezZateplenejStrechy) {
      addRec(recs, 'zateplenie-strechy', 'vysoká', 'Niektoré budovy nemajú zateplenú strechu.');
    }

    if (hasStareOkna) {
      addRec(recs, 'vymena-okien', 'vysoká', 'Niektoré budovy majú menej ako 50% termoizolačných okien.');
    }

    if (hasBezRekuperacie) {
      addRec(recs, 'rekuperacia', 'stredná', 'Niektoré budovy nemajú rekuperáciu vzduchu.');
    }

    if (hasStareKurenie) {
      addRec(recs, 'vymena-vykurovania', 'vysoká', 'Vykurovací systém je starší ako 15 rokov.');
    }

    if (hasBezTermohlavic) {
      addRec(recs, 'smart-termostaty', 'stredná', 'Niektoré budovy nemajú termohlavice na radiátoroch.');
    }

    if (hasBezLED) {
      addRec(recs, 'led-osvetlenie', 'nízka', 'Niektoré budovy majú menej ako 50% LED osvetlenia.');
    }

    // Sort by priority
    const priorityOrder: Record<Priorita, number> = { 'vysoká': 0, 'stredná': 1, 'nízka': 2 };
    recs.sort((a, b) => priorityOrder[a.priorita] - priorityOrder[b.priorita]);

    return recs;
  }, [areal]);
}
