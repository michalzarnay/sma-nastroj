export interface GlossaryEntry {
  term: string;
  definition: string;
  example?: string;
  whereToFind?: string;
}

export const glossary: Record<string, GlossaryEntry> = {
  priepustnaPlochaDef: {
    term: 'Priepustná plocha',
    definition: 'Povrch, cez ktorý môže voda voľne vsiaknuť do zeme.',
    example: 'Trávnik, záhon, holá pôda, nezhutnená zemina.',
    whereToFind: 'Odhadnite podľa toho, koľko vášho pozemku tvorí trávnik, záhrady alebo prirodzená pôda.',
  },
  polopriepustnaPlochaDef: {
    term: 'Polopriepustná plocha',
    definition: 'Povrch, ktorý čiastočne prepúšťa vodu – časť vsiakne, časť odtečie.',
    example: 'Zatrávňovacia dlažba, štrkový chodník, priepustný asfalt, vodopriepustná dlažba.',
    whereToFind: 'Pozrite sa na chodníky, parkoviská alebo terasy – ak medzi dlaždicami rastie tráva alebo je viditeľný štrk, ide o polopriepustnú plochu.',
  },
  spevnenaPlochaDef: {
    term: 'Spevnená plocha',
    definition: 'Nepriepustný povrch, ktorý vodu neprepúšťa – voda po ňom steká.',
    example: 'Asfalt, betón, klasická dlažba, budovy.',
  },
  vyspadovanyPozemokDef: {
    term: 'Vyspádovaný pozemok',
    definition: 'Pozemok, ktorý nie je rovný – má svah alebo sklon. Voda po ňom steká smerom nadol.',
    example: 'Ak položíte loptu na zem a sama sa rozkotúľa, pozemok je vyspádovaný.',
  },
  modroZelenaInfrastrukturaDef: {
    term: 'Modro-zelená infraštruktúra (MZI)',
    definition: 'Súbor opatrení, ktoré pracujú s vodou a zeleňou na zmiernenie dôsledkov zmeny klímy.',
    example: 'Dažďové záhrady, zelené strechy, retenčné nádrže, vsakovacie rigoly.',
  },
  fotovoltikaDef: {
    term: 'Fotovoltika',
    definition: 'Solárne panely na výrobu elektrickej energie zo slnečného svetla. Panely premieňajú svetlo priamo na elektrinu.',
    example: 'Panely na streche, ktoré vyrábajú elektrinu pre domácnosť alebo budovu.',
  },
  solarnePanelyDef: {
    term: 'Solárne (termálne) panely',
    definition: 'Panely, ktoré zachytávajú teplo slnečného žiarenia a používajú ho na ohrev vody. Na rozdiel od fotovoltiky nevyrábajú elektrinu, ale teplo.',
    example: 'Tmavé panely na streche napojené na bojler – slnko ohrieva vodu na kúpanie alebo vykurovanie.',
  },
  tepelneCerpadloDef: {
    term: 'Tepelné čerpadlo',
    definition: 'Zariadenie, ktoré odoberá teplo z okolitého prostredia (vzduch, zem, voda) a používa ho na vykurovanie budovy alebo ohrev vody.',
    example: 'Funguje ako chladnička naopak – odoberá teplo zvonku a presúva ho dovnútra.',
  },
  energetickyCertifikatDef: {
    term: 'Energetický certifikát',
    definition: 'Úradný dokument hodnotiaci energetickú náročnosť budovy na škále od A (najúspornejšia) po G (najnáročnejšia).',
    whereToFind: 'Ak ho máte, nájdete ho medzi dokumentáciou k budove. Býva povinný pri predaji alebo prenájme nehnuteľnosti.',
  },
  energetickyAuditDef: {
    term: 'Energetický audit',
    definition: 'Odborné posúdenie energetickej spotreby budovy s návrhmi na zníženie spotreby.',
    whereToFind: 'Ak bol spracovaný, nájdete ho u správcu budovy alebo v archíve projektovej dokumentácie.',
  },
  retenciaVodyDef: {
    term: 'Retencia vody',
    definition: 'Schopnosť areálu zadržať dažďovú vodu a spomaliť jej odtok do kanalizácie alebo vodného toku.',
    example: 'Dažďová záhrada, retenčná nádrž, jazierko – všetko, čo zachytí vodu a nedovolí jej rýchlo odtiecť.',
  },
  rekuperaciaDef: {
    term: 'Rekuperácia',
    definition: 'Systém vetrania, ktorý z odvádzaného teplého vzduchu odoberá teplo a odovzdáva ho čerstvému prichádzajúcemu vzduchu. Šetrí energiu na vykurovanie.',
    example: 'Vzduch odchádzajúci z kúpeľne alebo kuchyne odovzdá svoje teplo čerstvému vzduchu z vonku, takže ho netreba znova ohrievať.',
  },
  dazdovaZahradaDef: {
    term: 'Dažďová záhrada',
    definition: 'Záhradný záhon v miernej priehlbine, kam steká dažďová voda. Rastliny a pôda vodu postupne vsiaknu a prefiltrujú.',
    example: 'Plytký kvetinový záhon pri okapovom zvode, kam steká voda zo strechy.',
  },
  zelenaStrechaDef: {
    term: 'Zelená strecha',
    definition: 'Strecha pokrytá vrstvou zeminy a rastlín. Zadržiava dažďovú vodu, izoluje budovu a zlepšuje klímu v okolí.',
    example: 'Plochá strecha porastená rozchodníkmi alebo trávou.',
  },
  vsakovaciRigolDef: {
    term: 'Vsakovací rigol',
    definition: 'Plytký výkop vyplnený štrkom, do ktorého sa zvádza dažďová voda. Voda postupne vsiakne do zeme.',
    example: 'Štrková priekopa pozdĺž chodníka alebo parkoviska.',
  },
  retencnaNadrzDef: {
    term: 'Retenčná/akumulačná nádrž',
    definition: 'Podzemná alebo nadzemná nádrž na zachytávanie dažďovej vody. Vodu možno použiť na polievanie, splachovanie WC alebo technické účely.',
    example: 'Podzemná plastová nádrž pod záhradou, napojená na okapové zvody.',
  },
  priepustnaDlazbaDef: {
    term: 'Priepustná/vodopriepustná dlažba',
    definition: 'Špeciálna dlažba s medzerami alebo poréznym materiálom, cez ktorý môže voda vsiaknuť do podložia.',
    example: 'Dlažba s trávou v medzerách na parkovisku alebo chodníku.',
  },
  zateplenieFasadyDef: {
    term: 'Zateplenie fasády (ETICS)',
    definition: 'Vonkajšie zateplenie stien budovy izolačným materiálom (polystyrén, minerálna vlna). Znižuje tepelné straty a náklady na vykurovanie.',
    example: 'Polystyrénové dosky nalepené na vonkajšie steny a pokryté omietkou.',
  },
  termoizolacneOknaDef: {
    term: 'Termoizolačné okná/dvere',
    definition: 'Moderné okná s dvojsklom alebo trojsklom, ktoré výrazne znižujú tepelné straty oproti starým jednoduchým oknám.',
    whereToFind: 'Pozrite sa na okná – ak majú medzi sklami hliníkový rámik a sú ťažšie, pravdepodobne ide o termoizolačné okná. Dátum výroby nájdete na štítku medzi sklami.',
  },
  CZTDef: {
    term: 'CZT (Centrálne zásobovanie teplom)',
    definition: 'Systém, kde teplo vyrába centrálna teplárna a rozvádzaným potrubím ho dodáva do jednotlivých budov.',
    example: 'Typické pre sídliská – teplo prichádza z teplárne cez rozvody do radiátorov.',
  },
  peletyDef: {
    term: 'Pelety',
    definition: 'Malé valčeky z lisovaných drevených pilín. Ekologické palivo s vysokou výhrevnosťou.',
    example: 'Automatický kotol sám dávkuje pelety zo zásobníka.',
  },
  stiepkaDef: {
    term: 'Štiepka',
    definition: 'Drobné kúsky dreva vzniknuté štiepením konárov a kmeňov. Používa sa ako palivo v špeciálnych kotloch.',
    example: 'Kotol na štiepku s automatickým podávaním paliva.',
  },
  termohlaviceDef: {
    term: 'Termohlavice',
    definition: 'Regulačné hlavice na radiátoroch, ktoré automaticky regulujú prietok teplej vody podľa nastavenej teploty.',
    example: 'Otočný regulátor na radiátore s číslami 1-5, ktorý automaticky privrie ventil keď je v miestnosti dosť teplo.',
  },
  plochaPodorysuDef: {
    term: 'Plocha pôdorysu budovy (zastavaná plocha)',
    definition: 'Plocha, ktorú budova zaberá na zemi – jej „odtlačok" pri pohľade zhora.',
    whereToFind: 'Nájdete v katastri nehnuteľností, v projektovej dokumentácii alebo zmerajte vonkajšie rozmery budovy.',
  },
  uzitkovaPlochaDef: {
    term: 'Úžitková plocha',
    definition: 'Celková plocha všetkých miestností budovy, ktoré sa dajú využívať – súčet plôch všetkých podlaží.',
    whereToFind: 'Nájdete v projektovej dokumentácii, energetickom certifikáte alebo v liste vlastníctva.',
  },
  PCsietDef: {
    term: 'Počítačová sieť (LAN/Wi-Fi)',
    definition: 'Prítomnosť dátovej siete v budove. Dôležité pre budúce inteligentné riadenie spotreby energie (smart grid).',
  },
  normovanaSpotreba: {
    term: 'Normovaná spotreba budovy',
    definition: 'Štandardizovaná hodnota spotreby energie budovy prepočítaná na štandardné klimatické podmienky. Umožňuje porovnávať budovy medzi sebou.',
  },
  listVlastnictvaDef: {
    term: 'List vlastníctva',
    definition: 'Úradný dokument z katastra nehnuteľností, ktorý obsahuje údaje o vlastníkoch a nehnuteľnostiach.',
    whereToFind: 'Nájdete na katasterportál.sk alebo na príslušnom katastrálnom úrade.',
  },
  parcelaDef: {
    term: 'Parcela',
    definition: 'Konkrétny kus pozemku evidovaný v katastri nehnuteľností pod vlastným číslom.',
    whereToFind: 'Číslo parcely nájdete na liste vlastníctva alebo na katasterportál.sk.',
  },
  projektovaDokumentaciaDef: {
    term: 'Projektová dokumentácia',
    definition: 'Súbor výkresov, technických správ a výpočtov, podľa ktorých sa budova stavia alebo rekonštruuje.',
  },
  BGOpatreniaDef: {
    term: 'B&G opatrenia',
    definition: 'Blue & Green (modro-zelené) opatrenia – investície do vodného hospodárstva a zelene na pozemku/areáli.',
    example: 'Vsakovacie rigoly, dažďové záhrady, zelené strechy, retenčné nádrže, výsadba stromov.',
  },
};
