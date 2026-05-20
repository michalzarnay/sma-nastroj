import { useState } from 'react';
import { Building2, MapPin, Camera, ClipboardList, Globe, Loader2 } from 'lucide-react';
import { Areal, MediaItem } from '../../types/areal';
import { TextInput } from '../ui/TextInput';
import { NumberInput } from '../ui/NumberInput';
import { ComboboxInput } from '../ui/ComboboxInput';
import { MediaUpload } from '../media/MediaUpload';
import { KRAJE, OKRESY_BY_KRAJ, OBCE_SR } from '../../data/slovakLocations';

interface Step1Props {
  areal: Areal;
  updateAreal: (data: Partial<Areal>) => void;
  addMedia: (item: MediaItem) => void;
  updateMedia: (id: string, data: Partial<MediaItem>) => void;
  removeMedia: (id: string) => void;
  mediaReady: boolean;
}

function matchKraj(raw: string): string {
  if (!raw) return '';
  const norm = raw.trim();
  // Nominatim SK state names match our KRAJE directly, e.g. "Žilinský kraj"
  const exact = KRAJE.find(k => k.toLowerCase() === norm.toLowerCase());
  if (exact) return exact;
  // Fallback: partial match
  return KRAJE.find(k => norm.toLowerCase().includes(k.split(' ')[0].toLowerCase())) ?? '';
}

function matchOkres(raw: string, kraj: string): string {
  if (!raw) return '';
  // Nominatim returns "Okres Ružomberok" — strip prefix
  const stripped = raw.replace(/^[Oo]kres\s+/, '').trim();
  const pool = kraj ? (OKRESY_BY_KRAJ[kraj] ?? []) : Object.values(OKRESY_BY_KRAJ).flat();
  return pool.find(o => o.toLowerCase() === stripped.toLowerCase())
    ?? pool.find(o => stripped.toLowerCase().includes(o.toLowerCase()))
    ?? '';
}

async function fetchKlimatickeUdaje(
  adresa: string,
  obec: string,
  onStatus: (msg: string) => void,
): Promise<{ zrazky: number; solar: number; kraj: string; okres: string } | null> {
  const query = [adresa, obec, 'Slovensko'].filter(Boolean).join(', ');

  // 1. Geocoding
  onStatus('Hľadám polohu adresy…');
  const geoRes = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&addressdetails=1`,
    { headers: { 'Accept-Language': 'sk', 'User-Agent': 'sma-nastroj/1.0 (zarnay@inovia.sk)' } }
  );
  if (!geoRes.ok) throw new Error(`Geocoding zlyhal (${geoRes.status})`);
  const geoData = await geoRes.json();
  if (!geoData.length) return null;
  const lat = parseFloat(geoData[0].lat);
  const lon = parseFloat(geoData[0].lon);

  // Extract kraj + okres from address details
  const addr = geoData[0].address ?? {};
  const krajMatched = matchKraj(addr.state ?? '');
  const okresMatched = matchOkres(addr.county ?? addr.state_district ?? '', krajMatched);

  // 2. Zrážky – Open-Meteo (priemer posledných 5 rokov)
  onStatus('Načítavam zrážkové dáta…');
  const rok = new Date().getFullYear();
  const precipRes = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
    `&start_date=${rok - 6}-01-01&end_date=${rok - 1}-12-31` +
    `&daily=precipitation_sum&timezone=Europe%2FBerlin`
  );
  if (!precipRes.ok) throw new Error(`Open-Meteo zlyhal (${precipRes.status})`);
  const precipData = await precipRes.json();
  if (precipData.error) throw new Error(`Open-Meteo: ${precipData.reason ?? 'neznáma chyba'}`);
  const sums: number[] = precipData.daily?.precipitation_sum ?? [];
  const zrazky = sums.length > 0
    ? Math.round(sums.reduce((a, b) => a + (b ?? 0), 0) / 5)
    : 0;

  // 3. Slnečný svit – PVGIS (kWh/m²/rok)
  onStatus('Načítavam dáta slnečného svitu…');
  const pvRes = await fetch(
    `https://re.jrc.ec.europa.eu/api/v5_2/MRcalc?lat=${lat}&lon=${lon}` +
    `&outputformat=json&raddatabase=PVGIS-SARAH2&horirrad=1`
  );
  if (!pvRes.ok) throw new Error(`PVGIS zlyhal (${pvRes.status})`);
  const pvData = await pvRes.json();
  if (pvData.status === 'error') throw new Error(`PVGIS: ${pvData.message ?? 'neznáma chyba'}`);
  const monthly: { H_h: number }[] = pvData.outputs?.monthly?.fixed ?? [];
  const solar = Math.round(monthly.reduce((a, m) => a + (m.H_h ?? 0), 0));

  return { zrazky, solar, kraj: krajMatched, okres: okresMatched };
}

const selectClasses =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D7D46] focus:ring-2 focus:ring-[#2D7D46]/20 focus:outline-none';

export function Step1_Uvod({ areal, updateAreal, addMedia, updateMedia, removeMedia, mediaReady }: Step1Props) {
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchStatus, setFetchStatus] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [fetchOk, setFetchOk] = useState(false);

  const okresy = areal.kraj ? (OKRESY_BY_KRAJ[areal.kraj] ?? []) : [];

  const handleFetchKlima = async () => {
    setFetchLoading(true);
    setFetchError('');
    setFetchOk(false);
    setFetchStatus('');
    try {
      const res = await fetchKlimatickeUdaje(areal.adresa, areal.obec, setFetchStatus);
      if (!res) { setFetchError('Adresu sa nepodarilo nájsť. Skúste zadať obec presnejšie.'); return; }
      const update: Partial<Areal> = { mnozstvoZrazok: res.zrazky, potencialSlnecnehoSvitu: res.solar };
      if (res.kraj) { update.kraj = res.kraj; update.okres = res.okres || ''; }
      updateAreal(update);
      setFetchOk(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Neznáma chyba';
      setFetchError(msg);
    } finally {
      setFetchLoading(false);
      setFetchStatus('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="text-center space-y-2 pb-4 border-b border-gray-100">
        <div className="w-16 h-16 bg-[#2D7D46]/10 rounded-full flex items-center justify-center mx-auto">
          <Building2 className="w-8 h-8 text-[#2D7D46]" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Identifikácia areálu</h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Zadajte základné údaje o areáli, ktorý chcete vyhodnotiť.
          Areál je súvislé územie s pozemkami a budovami, ktoré patria k sebe.
        </p>
      </div>

      {/* Workflow info */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-amber-800 mb-2">Odporúčaný postup mapovania</p>
        <ol className="text-xs text-amber-700 space-y-1 list-decimal list-inside">
          <li>Vyplňte polia dostupné z internetu (zrážky, slnečný svit, katastrálna mapa)</li>
          <li>Uložte si rozrobený formulár pomocou tlačidla <strong>Relácie</strong> v hlavičke</li>
          <li>Choďte do terénu – robte si poznámky, fotky, videá (nahrajte ich tu dole)</li>
          <li>Po návrate otvorte uloženú reláciu a doplňte zvyšné polia</li>
        </ol>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <TextInput
          label="Názov areálu"
          value={areal.nazov}
          onChange={(v) => updateAreal({ nazov: v })}
          placeholder="napr. Základná škola Lipová"
          tooltipText="Zvoľte ľubovoľný názov, ktorý vám pomôže areál identifikovať."
        />

        <TextInput
          label="Adresa"
          value={areal.adresa}
          onChange={(v) => updateAreal({ adresa: v })}
          placeholder="napr. Hlavná 15"
        />

        {/* Kraj + Okres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Kraj</label>
            <select
              value={areal.kraj}
              onChange={(e) => updateAreal({ kraj: e.target.value, okres: '' })}
              className={selectClasses}
            >
              <option value="">– vyberte kraj –</option>
              {KRAJE.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Okres</label>
            <select
              value={areal.okres}
              onChange={(e) => updateAreal({ okres: e.target.value })}
              disabled={okresy.length === 0}
              className={selectClasses}
            >
              <option value="">
                {areal.kraj ? '– vyberte okres –' : '– najprv vyberte kraj –'}
              </option>
              {okresy.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Obec combobox */}
        <ComboboxInput
          label="Obec"
          value={areal.obec}
          onChange={(v) => updateAreal({ obec: v })}
          options={OBCE_SR}
          placeholder="napr. Likavka"
        />

        {/* Klimatické údaje s auto-fetch */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Klimatické údaje oblasti</span>
            <button
              type="button"
              onClick={handleFetchKlima}
              disabled={fetchLoading || (!areal.adresa && !areal.obec)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2D7D46] border border-[#2D7D46] rounded-lg hover:bg-[#2D7D46]/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Načíta priemerné zrážky z Open-Meteo a potenciál slnečného svitu z PVGIS podľa zadanej adresy"
            >
              {fetchLoading
                ? <><Loader2 className="w-3 h-3 animate-spin" /> Načítava…</>
                : <><Globe className="w-3 h-3" /> Načítať z webu</>}
            </button>
          </div>
          {fetchStatus && !fetchError && <p className="text-xs text-gray-500 italic">{fetchStatus}</p>}
          {fetchError && <p className="text-xs text-red-600">{fetchError}</p>}
          {fetchOk && <p className="text-xs text-green-700">✓ Údaje načítané – skontrolujte a upravte podľa potreby.</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="Množstvo zrážok v oblasti"
              value={areal.mnozstvoZrazok || 0}
              onChange={(v) => updateAreal({ mnozstvoZrazok: v })}
              unit="mm/rok"
              tooltipText="Priemerný ročný úhrn zrážok v oblasti. Načítané z Open-Meteo (priemer 5 rokov). Slovensko priemer: 600–800 mm/rok."
            />
            <NumberInput
              label="Potenciál slnečného svitu"
              value={areal.potencialSlnecnehoSvitu || 0}
              onChange={(v) => updateAreal({ potencialSlnecnehoSvitu: v })}
              unit="kWh/m²/rok"
              tooltipText="Ročný úhrn globálneho slnečného žiarenia na vodorovnú plochu. Načítané z PVGIS (JRC). Pre Slovensko typicky 1 000–1 300 kWh/m²/rok."
            />
          </div>
        </div>
      </div>

      {/* Záznam z obhliadky */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-[#2D7D46]" />
          <h3 className="text-sm font-semibold text-gray-800">Záznam z obhliadky</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Organizácia (zriaďovateľská pôsobnosť)"
            value={areal.organizaciaVZriadovatelskejPobnonosti}
            onChange={(v) => updateAreal({ organizaciaVZriadovatelskejPobnonosti: v })}
            placeholder="napr. Žilinský samosprávny kraj"
          />
          <TextInput
            label="Obhliadku vykonal"
            value={areal.obhliadkuVykonal}
            onChange={(v) => updateAreal({ obhliadkuVykonal: v })}
            placeholder="Meno a priezvisko"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Dátum obhliadky"
            value={areal.datumObhliadky}
            onChange={(v) => updateAreal({ datumObhliadky: v })}
            placeholder="napr. 23.4.2026"
          />
          <TextInput
            label="Prítomné osoby"
            value={areal.pritomnePOSOBY}
            onChange={(v) => updateAreal({ pritomnePOSOBY: v })}
            placeholder="Mená účastníkov"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextInput
            label="Kapacita zariadenia"
            value={areal.kapacitaZariadenia}
            onChange={(v) => updateAreal({ kapacitaZariadenia: v })}
            placeholder="napr. 450 žiakov"
            tooltipText="Maximálna kapacita zariadenia – koľko ľudí sa doň zmestí naraz najviac (žiaci, pacienti, návštevníci…)."
          />
          <NumberInput
            label="Aktuálna obsadenosť klientov/žiakov"
            value={areal.aktualnaObsadenost}
            onChange={(v) => updateAreal({ aktualnaObsadenost: v })}
            unit="%"
            max={100}
            tooltipText="Obsadenosť klientmi, pacientmi alebo žiakmi v čase mapovania, vyjadrená ako % z kapacity zariadenia. Ak sa obsadenosť v čase mapovania mení, uveďte priemer za príslušné obdobie. Nezahŕňa zamestnancov."
          />
          <NumberInput
            label="Počet zamestnancov"
            value={areal.pocetZamestnancov}
            onChange={(v) => updateAreal({ pocetZamestnancov: v })}
            tooltipText="Priemerný počet zamestnancov prítomných v areáli počas prevádzky. Slúži na výpočet KPI spotreby energií a vody – klienti/žiaci a zamestnanci majú spravidla rôznu spotrebu (napr. v sociálnych zariadeniach je spotreba klientov výrazne vyššia ako zamestnancov)."
          />
        </div>
      </div>

      {/* Foto a video materiál */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[#2D7D46]" />
          <h3 className="text-sm font-semibold text-gray-800">Foto a video materiál</h3>
          <span className="text-xs text-gray-400">(terénny prieskum)</span>
        </div>
        <p className="text-xs text-gray-500">
          Nahrajte fotky a videá z areálu. Budú priložené k výstupu a pomôžu pri vyplnení formulára.
        </p>
        <MediaUpload
          media={areal.media}
          onAdd={addMedia}
          onUpdate={updateMedia}
          onRemove={removeMedia}
          mediaReady={mediaReady}
        />
      </div>

      {/* Info box */}
      <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
        <MapPin className="w-5 h-5 text-[#2196F3] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">V ďalších krokoch budete postupne zadávať:</p>
          <ul className="mt-1 list-disc list-inside text-xs space-y-0.5">
            <li>Pozemok – nezastavané parcely, odvod vody, zeleň</li>
            <li>Budovy – strecha, voda, energia, vykurovanie</li>
            <li>Iné stavby – oplotenie, chodníky, parkoviská</li>
            <li>Zamýšľané B&amp;G opatrenia</li>
            <li>Výsledky a závery hodnotenia (krok 6)</li>
          </ul>
          <p className="mt-2 text-xs">
            Dáta sa automaticky ukladajú v prehliadači. Pre zdieľanie alebo zálohu použite
            funkciu <strong>Relácie → Uložiť</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
