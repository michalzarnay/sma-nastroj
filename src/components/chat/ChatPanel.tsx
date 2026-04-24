import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, ChevronDown, Bot } from 'lucide-react';
import { Areal } from '../../types/areal';

interface Sprava {
  id: string;
  odosielatel: 'user' | 'bot';
  text: string;
  cas: string;
}

interface ChatPanelProps {
  // areal reserved for future AI integration
  areal?: Areal;
  currentStep: number;
}

// Kontextové nápovedy podľa kroku
const KONTEXTOVE_OTAZKY: Record<number, string[]> = {
  1: [
    'Kde nájdem množstvo zrážok pre moju obec?',
    'Čo je potenciál slnečného svitu a kde ho zistím?',
    'Ako definovať hranice areálu?',
  ],
  2: [
    'Ako rozlíšiť priepustné a polopriepustné plochy?',
    'Čo patrí do spevnenej plochy?',
    'Ako odhadnúť percentá odvodu dažďovej vody?',
    'Čo je dažďová záhrada?',
  ],
  3: [
    'Ako určiť typ strechy?',
    'Čo znamená orientácia strechy na juh?',
    'Kde nájdem spotrebu plynu/elektriny?',
    'Čo je rekuperácia?',
    'Ako odhadnúť % termoizolačných okien?',
  ],
  4: [
    'Čo patrí medzi iné stavby?',
    'Ako zadať oplotenie alebo parkovisko?',
  ],
  5: [
    'Čo sú ochranné pásma?',
    'Ako posúdiť potenciál znečistenia?',
    'Čo znamená hladina podzemnej vody?',
  ],
  6: [
    'Ako interpretovať celkové skóre?',
    'Čo znamenajú váhy pri porovnávaní areálov?',
    'Ako exportovať výsledky do XLSX?',
    'Ktoré opatrenia sú najdôležitejšie?',
  ],
};

// Databáza odpovedí
const ODPOVEDE: Record<string, string> = {
  // Step 1
  'kde nájdem množstvo zrážok': 'Množstvo zrážok pre vašu obec nájdete na stránke **SHMÚ (shmu.sk)** v sekcii Klimatológia → Zrážky. Pre rýchly odhad: väčšina Slovenska má 600–800 mm/rok, hornaté oblasti 800–1200 mm/rok.',

  'potenciál slnečného svitu': 'Potenciál slnečného svitu (kWh/m²/rok) nájdete v európskej databáze **PVGIS** (re.jrc.ec.europa.eu/pvgis). Pre väčšinu Slovenska je to 1 000–1 200 kWh/m²/rok. Zadáte súradnice a systém vám vráti hodnotu pre konkrétnu lokalitu.',

  'hranice areálu': 'Areál definujte ako **súvislé územie** (pozemky + budovy), ktoré patria k jednej organizácii alebo projektu. Ideálne využite katastrálnu mapu (katasterportal.sk) na identifikáciu parciel. Jeden areál = jedna položka v tomto nástroji.',

  // Step 2
  'priepustné a polopriepustné': 'Priepustné plochy **prepúšťajú vodu priamo do pôdy**: tráva, záhony, lesná pôda, štrk. Polopriepustné plochy prepúšťajú vodu **čiastočne**: priepustný asfalt, vegetačné tvarovky, mlat. Spevnené plochy (beton, klasický asfalt) vodu **neprepúšťajú vôbec**.',

  'spevnená plocha': 'Do spevnenej plochy patria: klasický asfalt, betónové plochy, dlažba bez spár, terasy. Sú to plochy, kde dažďová voda **nevsákne** – odtečie po povrchu do odtoku alebo kanalizácie.',

  'odvod dažďovej vody': 'Percentá odvodu odhadnite takto:\n• Kanalizácia: ak väčšina odtokov vedie do splaškovej/daž. kanalizácie\n• Vodný tok: ak areál susedí s potok/riekou a voda odtečie priamo\n• Vsakovanie: ak máte zelené plochy kde voda vsákne\n• Neriešený: ak neviete kam voda odtečie (problém!)\nSúčet musí dať 100 %.',

  'dažďová záhrada': 'Dažďová záhrada je **zahlbená záhon** (10–30 cm pod úrovňou okolia), do ktorej sa zvádza dažďová voda zo striech alebo spevnených plôch. Rastliny v nej sú odolné voči krátkodobému zaplaveniu aj suchu. Pomáha vsáknutiu vody do pôdy a znižuje záťaž kanalizácie.',

  // Step 3
  'typ strechy': 'Typy striech:\n• **Plochá** (sklon < 5°): ideálna pre zelenú strechu alebo fotovoltiku\n• **Šikmá** (sklon 5°–45°): vhodná pre FV panely\n• **Strmá** (sklon > 45°): menej vhodná pre FV, väčšie tienenie',

  'orientácia strechy na juh': 'Zadajte **plochu strešnej roviny** (v m²) otočenej na juh (± 45° od juhu). Táto plocha je kľúčová pre výpočet solárneho potenciálu. Ak má strecha viac rovín, sčítajte plochy tých, ktoré sú orientované na juh, juhozápad alebo juhovýchod.',

  'spotreba plynu elektriny': 'Spotrebu nájdete na **ročnom vyúčtovaní** od dodávateľa energie:\n• Plyn: v m³ alebo kWh (prepočet: 1 m³ ≈ 10,5 kWh)\n• Elektrina: v kWh\nAk nemáte vyúčtovanie, odhadnite podľa výkonu kotla × hodiny prevádzky za rok.',

  'rekuperácia': 'Rekuperácia (spätné získavanie tepla) je systém vetrania, ktorý **ohrieva čerstvý vzduch** tepelnou energiou odpadového vzduchu. Znižuje straty tepla pri vetraní o 60–85 %. Ak má budova takýto systém, zadajte "áno".',

  'termoizolačné okná': 'Zadajte **percentuálny podiel** okien s tepelnoizolačným zasklením (dvojsklo/trojsklo) z celkových okien budovy. Ak si nie ste istí, odhadnite: okná staršie ako 20 rokov sú väčšinou bez termoizolácie.',

  // Step 6
  'interpretovať celkové skóre': 'Skóre vyjadruje **pripravenosť areálu** na klimatické opatrenia:\n• 0–30: nízka (veľký potenciál zlepšenia)\n• 31–50: podpriemerná\n• 51–70: priemerná\n• 71–85: dobrá\n• 86–100: výborná\n\nNižšie skóre = väčší priestor pre zlepšenie a možné dotácie.',

  'váhy pri porovnávaní': 'Váhy umožňujú **zvýrazniť dôležitosť** konkrétnej oblasti pre daný typ areálu alebo zámer:\n• Ak chcete prioritizovať vodu: nastavte MZI váhu vyššie (napr. 2)\n• Ak riešite energiu: zvýšte váhu Energia\n• Výsledné vážené skóre sa zobrazí v XLSX v záložke "Váhy a skóre"',

  'exportovať výsledky do xlsx': 'Kliknite na tlačidlo **"Exportovať XLSX"** v sekcii Výsledky (krok 6). Súbor obsahuje 5 záložiek: Súhrn, Pozemky, Budovy, Odporúčania, Váhy a skóre. Záložku "Váhy a skóre" môžete upraviť priamo v Exceli pre porovnanie viacerých areálov.',

  'najdôležitejšie opatrenia': 'Opatrenia sú zoradené podľa **priority** (vysoká → stredná → nízka). Priorita je určená na základe:\n• Ako veľmi zlepší skóre\n• Dostupnosť dotácií\n• Realizovateľnosť\n\nOdporúčame začať s opatreniami s **vysokou prioritou** a dobrou dostupnosťou dotácií.',
};

function najdiOdpoved(otazka: string): string {
  const q = otazka.toLowerCase();

  for (const [kluc, odpoved] of Object.entries(ODPOVEDE)) {
    const kluce = kluc.split(' ');
    if (kluce.every((k) => q.includes(k))) {
      return odpoved;
    }
  }

  // Fallback podľa kľúčových slov
  if (q.includes('zrážok') || q.includes('srážok') || q.includes('prší')) {
    return ODPOVEDE['kde nájdem množstvo zrážok'];
  }
  if (q.includes('slnk') || q.includes('pvgis') || q.includes('solar')) {
    return ODPOVEDE['potenciál slnečného svitu'];
  }
  if (q.includes('priepust')) {
    return ODPOVEDE['priepustné a polopriepustné'];
  }
  if (q.includes('strech') && (q.includes('typ') || q.includes('druh'))) {
    return ODPOVEDE['typ strechy'];
  }
  if (q.includes('rekuperáci') || q.includes('rekuperac')) {
    return ODPOVEDE['rekuperácia'];
  }
  if (q.includes('skóre') && q.includes('interpret')) {
    return ODPOVEDE['interpretovať celkové skóre'];
  }
  if (q.includes('xlsx') || q.includes('export') || q.includes('excel')) {
    return ODPOVEDE['exportovať výsledky do xlsx'];
  }

  return 'Prepáčte, na túto otázku nemám presnú odpoveď. Skúste otázku preformulovať alebo sa pozrite do nápovedy pri konkrétnom poli (ikona ?).\n\nMôžete sa tiež opýtať na: zrážky, slnečný svit, typy plôch, odvod vody, typ strechy, spotrebu energie, rekuperáciu, alebo interpretáciu skóre.';
}

function formatText(text: string): React.ReactNode {
  // Jednoduchý markdown: **tučné**, nové riadky
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part.split('\n').map((line, j) => (
          <span key={`${i}-${j}`}>
            {j > 0 && <br />}
            {line}
          </span>
        ));
      })}
    </>
  );
}

export function ChatPanel({ currentStep }: ChatPanelProps) {
  const [otvoreny, setOtvoreny] = useState(false);
  const [spravy, setSpravy] = useState<Sprava[]>([
    {
      id: '0',
      odosielatel: 'bot',
      text: 'Dobrý deň! Som váš asistent pre mapovanie areálu. Môžem vám pomôcť objasniť, ako vyplniť jednotlivé polia, alebo odpovedať na otázky o parametroch a opatreniach.',
      cas: new Date().toLocaleTimeString('sk', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [vstup, setVstup] = useState('');
  const koniecRef = useRef<HTMLDivElement>(null);
  const vstupRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (otvoreny) {
      koniecRef.current?.scrollIntoView({ behavior: 'smooth' });
      vstupRef.current?.focus();
    }
  }, [otvoreny, spravy]);

  const odosliSprav = (text: string) => {
    if (!text.trim()) return;

    const cas = new Date().toLocaleTimeString('sk', { hour: '2-digit', minute: '2-digit' });

    const novaSprava: Sprava = {
      id: crypto.randomUUID(),
      odosielatel: 'user',
      text: text.trim(),
      cas,
    };

    const odpoved: Sprava = {
      id: crypto.randomUUID(),
      odosielatel: 'bot',
      text: najdiOdpoved(text),
      cas,
    };

    setSpravy((prev) => [...prev, novaSprava, odpoved]);
    setVstup('');
  };

  const kontextoveOtazky = KONTEXTOVE_OTAZKY[currentStep] ?? [];

  // Počet správ od posledného otvorenia (pre badge)
  const neprecitane = otvoreny ? 0 : Math.max(0, spravy.filter((s) => s.odosielatel === 'bot').length - 1);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOtvoreny(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-white font-medium text-sm transition-all ${
          otvoreny ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } bg-[#2D7D46] hover:bg-[#256939]`}
      >
        <MessageCircle className="w-5 h-5" />
        <span>Asistent</span>
        {neprecitane > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {neprecitane}
          </span>
        )}
      </button>

      {/* Panel */}
      {otvoreny && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 h-[500px] sm:h-[520px] flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Hlavička */}
          <div className="flex items-center gap-3 px-4 py-3 bg-[#2D7D46] text-white flex-shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Asistent mapera</p>
              <p className="text-xs text-white/70">
                Krok {currentStep}: {['', 'Identifikácia', 'Pozemky', 'Budovy', 'Iné stavby', 'B&G opatrenia', 'Výsledky'][currentStep]}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOtvoreny(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Správy */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {spravy.map((sprava) => (
              <div
                key={sprava.id}
                className={`flex ${sprava.odosielatel === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    sprava.odosielatel === 'user'
                      ? 'bg-[#2D7D46] text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {formatText(sprava.text)}
                  <p className={`text-[10px] mt-1 ${sprava.odosielatel === 'user' ? 'text-white/60 text-right' : 'text-gray-400'}`}>
                    {sprava.cas}
                  </p>
                </div>
              </div>
            ))}
            <div ref={koniecRef} />
          </div>

          {/* Kontextové otázky */}
          {kontextoveOtazky.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-100 flex-shrink-0">
              <p className="text-[10px] text-gray-400 mb-1.5 flex items-center gap-1">
                <ChevronDown className="w-3 h-3" /> Časté otázky pre tento krok
              </p>
              <div className="flex flex-wrap gap-1.5">
                {kontextoveOtazky.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => odosliSprav(q)}
                    className="text-[11px] px-2 py-1 bg-gray-100 hover:bg-[#2D7D46]/10 text-gray-700 hover:text-[#2D7D46] rounded-full transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vstup */}
          <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-200 flex-shrink-0 bg-gray-50">
            <input
              ref={vstupRef}
              type="text"
              value={vstup}
              onChange={(e) => setVstup(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && odosliSprav(vstup)}
              placeholder="Napíšte otázku…"
              className="flex-1 text-sm bg-white border border-gray-200 rounded-full px-3 py-1.5 focus:outline-none focus:border-[#2D7D46]"
            />
            <button
              type="button"
              onClick={() => odosliSprav(vstup)}
              disabled={!vstup.trim()}
              className="p-2 bg-[#2D7D46] text-white rounded-full hover:bg-[#256939] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Overlay pre mobil */}
      {otvoreny && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={() => setOtvoreny(false)}
        />
      )}
    </>
  );
}

