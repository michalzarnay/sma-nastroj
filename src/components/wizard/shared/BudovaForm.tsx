import { Budova } from '../../../types/areal';
import { ROOF_TYPES, INSULATION_LEVELS, YES_NO, SEWAGE_TYPES, GUTTER_TYPES, COAL_WOOD_TYPES, PD_LEVELS, PD_FORMS, FUEL_CONVERSIONS } from '../../../data/constants';
import { TextInput } from '../../ui/TextInput';
import { NumberInput } from '../../ui/NumberInput';
import { SelectCard } from '../../ui/SelectCard';
import { PercentageGroup } from '../../ui/PercentageGroup';
import { ConditionalSection } from '../../ui/ConditionalSection';
import { Tooltip } from '../../ui/Tooltip';

interface BudovaFormProps {
  budova: Budova;
  onChange: (data: Partial<Budova>) => void;
}

export function BudovaForm({ budova, onChange }: BudovaFormProps) {
  return (
    <div className="space-y-6">
      {/* Zakladne info */}
      <Section title="Základné informácie">
        <TextInput
          label="Názov budovy"
          value={budova.nazov}
          onChange={(v) => onChange({ nazov: v })}
          placeholder="napr. Hlavná budova, Kotolňa"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Parcela pod budovou"
            value={budova.parcela}
            onChange={(v) => onChange({ parcela: v })}
            placeholder="napr. C 2307"
            tooltipKey="parcelaDef"
          />
          <TextInput
            label="Číslo listu vlastníctva"
            value={budova.listVlastnictva}
            onChange={(v) => onChange({ listVlastnictva: v })}
            tooltipKey="listVlastnictvaDef"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Plocha pôdorysu budovy (zastavaná plocha)"
            value={budova.plochaPodorysu}
            onChange={(v) => onChange({ plochaPodorysu: v })}
            unit="m²"
            tooltipKey="plochaPodorysuDef"
          />
          <NumberInput
            label="Úžitková plocha"
            value={budova.uzitkovaPlochaNUS}
            onChange={(v) => onChange({ uzitkovaPlochaNUS: v })}
            unit="m²"
            tooltipKey="uzitkovaPlochaDef"
          />
        </div>
        {budova.kategoriaBudovy && (
          <div className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
            Kategória budovy: <span className="font-medium">{budova.kategoriaBudovy}</span>
            {budova.kategoriaBudovy === 'S' && ' (do 500 m²)'}
            {budova.kategoriaBudovy === 'M' && ' (500 – 1 500 m²)'}
            {budova.kategoriaBudovy === 'L' && ' (nad 1 500 m²)'}
          </div>
        )}

        <h4 className="text-xs font-semibold text-gray-600 mt-4">Využitie objektu</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <NumberInput
            label="Dni v roku"
            value={budova.vyuzitieDniVRoku}
            onChange={(v) => onChange({ vyuzitieDniVRoku: v })}
            max={365}
            tooltipText="Počet dní v roku, kedy sa budova využíva (0-365)."
          />
          <NumberInput
            label="Mesiace za rok"
            value={budova.vyuzitieMesiacovVRoku}
            onChange={(v) => onChange({ vyuzitieMesiacovVRoku: v })}
            max={12}
          />
          <NumberInput
            label="Hodín denne"
            value={budova.vyuzitieHodinDenne}
            onChange={(v) => onChange({ vyuzitieHodinDenne: v })}
            max={24}
          />
          <NumberInput
            label="Spotreba energie"
            value={budova.vyuzitieEnergiaPercent}
            onChange={(v) => onChange({ vyuzitieEnergiaPercent: v })}
            unit="%"
            max={100}
            tooltipText="Aký podiel dní v roku sa v budove spotrebováva väčšina energie."
          />
        </div>
      </Section>

      {/* Strecha */}
      <Section title="Strecha">
        <SelectCard
          label="Typ strechy"
          options={ROOF_TYPES}
          value={budova.strechaTyp}
          onChange={(v) => onChange({ strechaTyp: v as 1 | 2 | 3 })}
        />
        <TextInput
          label="Materiál povrchu strechy"
          value={budova.strechaMaterial}
          onChange={(v) => onChange({ strechaMaterial: v })}
          placeholder="napr. plech, škridla, hydroizolačná fólia"
        />
        <TextInput
          label="Popis strechy a spôsobu zateplenia"
          value={budova.strechaPopisZateplenia}
          onChange={(v) => onChange({ strechaPopisZateplenia: v })}
          multiline
          placeholder="napr. ž-b panel, heraklit, škvárobetón, lepenka, minerálna vlna"
        />
        <TextInput
          label="Nosná konštrukcia strechy"
          value={budova.strechaNosnaKonstrukcia}
          onChange={(v) => onChange({ strechaNosnaKonstrukcia: v })}
          placeholder="napr. žb panel, krov drevo, betónové panely"
        />
        <SelectCard
          label="Zrealizovaná obnova strechy so zateplením (posledných max. 10 rokov)"
          options={INSULATION_LEVELS}
          value={budova.strechaZateplenie}
          onChange={(v) => onChange({ strechaZateplenie: v as 0 | 1 | 2 })}
        />
        <ConditionalSection title="Detail plochej strechy" show={budova.strechaTyp === 1}>
          <NumberInput
            label="Rok poslednej obnovy povlakovej krytiny"
            value={budova.strechaRokObnovy}
            onChange={(v) => onChange({ strechaRokObnovy: v })}
            placeholder="napr. 2019"
            tooltipText="Kedy bola naposledy obnovená hydroizolácia plochej strechy."
          />
        </ConditionalSection>
        <SelectCard
          label="Problémy s aktuálnym stavom strechy"
          options={[
            { value: 0, label: 'Nie', description: 'Strecha je v poriadku' },
            { value: 1, label: 'Áno', description: 'Zatekanie, plesne, iné problémy' },
          ]}
          value={budova.strechaProblemy}
          onChange={(v) => onChange({ strechaProblemy: v as 0 | 1 })}
        />
        {budova.potencialZelenejStrechy != null && budova.potencialZelenejStrechy > 0 && (
          <div className="text-xs text-green-700 bg-green-50 rounded px-3 py-2">
            Potenciál zelenej strechy: <span className="font-medium">{Math.round(budova.potencialZelenejStrechy)} m²</span>
          </div>
        )}

        <h4 className="text-xs font-semibold text-gray-600 mt-4">Orientácia na juh</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Využiteľná plocha strechy orient. na J/JV/JZ"
            value={budova.strechaOrientovanaPlochaNaJuh}
            onChange={(v) => onChange({ strechaOrientovanaPlochaNaJuh: v })}
            unit="m²"
            tooltipText="Plocha strechy orientovaná na juh, juhovýchod alebo juhozápad, vhodná napr. na montáž solárnych panelov."
          />
          <NumberInput
            label="Fasáda orientovaná na juh"
            value={budova.fasadaOrientovanaNaJuh}
            onChange={(v) => onChange({ fasadaOrientovanaNaJuh: v })}
            unit="m²"
            tooltipText="Plocha fasády (vrátane otvorov) orientovanej na juh – dôležité pre pasívne solárne zisky."
          />
        </div>
      </Section>

      {/* Ohrozenie záplavami */}
      <Section title="Ohrozenie budovy záplavami">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            Povodňové riziko lokality
            <Tooltip text="Ohodnoťte mieru povodňového rizika podľa polohy budovy: 1 = žiadne riziko (vysoko nad vodným tokom, nezáplavová zóna), 5 = vysoké riziko (blízko vodného toku, v záplavovej zóne Q100). Overte napr. na Povodňovom portáli SVP (povodnovy-portal.sk)." />
          </label>
          <select
            value={budova.povodnovoRiziko}
            onChange={(e) => onChange({ povodnovoRiziko: Number(e.target.value) })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D7D46] focus:ring-2 focus:ring-[#2D7D46]/20 focus:outline-none"
          >
            <option value={0}>— nevyplnené —</option>
            <option value={1}>1 – Žiadne riziko</option>
            <option value={2}>2 – Nízke riziko</option>
            <option value={3}>3 – Stredné riziko</option>
            <option value={4}>4 – Vysoké riziko</option>
            <option value={5}>5 – Veľmi vysoké riziko</option>
          </select>
        </div>
        <p className="text-xs text-gray-500">
          Označte rizikové faktory, ktoré sa týkajú tejto budovy
          (každý „Áno" zvyšuje zraniteľnosť voči záplavám):
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([
            ['budovaZaplavenaPoslednychRokov', 'Budova bola zaplavená v posledných 10 rokoch'],
            ['castPodTerenomBezOdcerpania', 'Budova má časť pod úrovňou terénu bez možnosti odčerpania'],
            ['technologickeZariadenieSuteren', 'V suteréne sú technologické zariadenia (kotolňa, rozvádzače…)'],
            ['kanalizacneVpusteNadSuterenom', 'Kanalizačné vpuste sú pod úrovňou podlahy suterénu'],
            ['potrubiaNeSpljajuNormy', 'Potrubia nemajú spätné klapky podľa noriem'],
            ['chybajuMriazkyNaVtokoch', 'Na vtokoch dažďovej kanalizácie chýbajú ochranné mriežky'],
            ['dazdovaKanalizaciaBezZariadenia', 'Dažďová kanalizácia nemá spätné (protipovodňové) zariadenie'],
            ['pripojkaBezSpatnejKlapky', 'Kanalizačná prípojka nemá spätnú klapku'],
            ['elektrickeZariadeniaSuterenNizko', 'Elektrické zariadenia v suteréne sú umiestnené nízko (pod potenciálnou hladinou záplavy)'],
            ['uzaverPlynuSuteren', 'V suteréne chýba uzáver plynu'],
          ] as [keyof typeof budova, string][]).map(([key, label]) => (
            <SelectCard
              key={key}
              label={label}
              options={YES_NO}
              value={budova[key] as 0 | 1}
              onChange={(v) => onChange({ [key]: v as 0 | 1 })}
            />
          ))}
        </div>
      </Section>

      {/* Voda */}
      <Section title="Voda a splašky">
        <SelectCard
          label="Odvod splaškov a dažďovej vody"
          options={SEWAGE_TYPES}
          value={budova.splaskovod}
          onChange={(v) => onChange({ splaskovod: v as 1 | 2 })}
        />
        <SelectCard
          label="Zvody dažďovej vody"
          options={GUTTER_TYPES}
          value={budova.zvodyDazdovejVody}
          onChange={(v) => onChange({ zvodyDazdovejVody: v as 1 | 2 })}
          tooltipText="Vonkajšie = zvody vedené po vonkajšej fasáde (vrátane prípadov, keď sa po zateplení ocitli vo vnútri obvodového plášťa – stále sa považujú za vonkajšie, ak sú dostupné zvonku). Vnútorné = zvody prechádzajú konštrukciou budovy."
        />
        <PercentageGroup
          title="Odvod vody z budovy"
          tooltipText="Kam odteká dažďová voda zo strechy a okolia budovy? Rozdeľte 100%."
          fields={[
            { key: 'budovaOdvodVodyKanalizacia', label: 'Do kanalizácie' },
            { key: 'budovaOdvodVodyVodnyTok', label: 'Do vodného toku' },
            { key: 'budovaOdvodVodyNaPozemok', label: 'Cielene na pozemok' },
            { key: 'budovaOdvodVodyNerieseny', label: 'Neriešený' },
          ]}
          values={{
            budovaOdvodVodyKanalizacia: budova.budovaOdvodVodyKanalizacia,
            budovaOdvodVodyVodnyTok: budova.budovaOdvodVodyVodnyTok,
            budovaOdvodVodyNaPozemok: budova.budovaOdvodVodyNaPozemok,
            budovaOdvodVodyNerieseny: budova.budovaOdvodVodyNerieseny,
          }}
          onChange={(key, value) => onChange({ [key]: value })}
        />
        <SelectCard
          label="Vnútorné oddelené rozvody pitnej a úžitkovej vody"
          options={YES_NO}
          value={budova.oddeleneRozvodyVody}
          onChange={(v) => onChange({ oddeleneRozvodyVody: v as 0 | 1 })}
        />
        <SelectCard
          label="Využitie dažďovej vody v objekte"
          options={YES_NO}
          value={budova.vyuzitieDazdovejVodyVObjekte}
          onChange={(v) => onChange({ vyuzitieDazdovejVodyVObjekte: v as 0 | 1 })}
          tooltipText="Či sa dažďová voda zbiera a používa vnútri budovy (napr. na splachovanie WC, zavlažovanie)."
        />
      </Section>

      {/* Uspory energie */}
      <Section title="Úspory energie">
        <TextInput
          label="Materiál obvodových stien"
          value={budova.obvodoveStenyMaterial}
          onChange={(v) => onChange({ obvodoveStenyMaterial: v })}
          placeholder="napr. tehlová murovaná, panelová, ž-b skelet"
        />
        <SelectCard
          label="Zateplenie fasády"
          options={INSULATION_LEVELS}
          value={budova.zateplenieFasady}
          onChange={(v) => onChange({ zateplenieFasady: v as 0 | 1 | 2 })}
          tooltipKey="zateplenieFasadyDef"
        />
        <ConditionalSection title="Detail zateplenia fasády" show={budova.zateplenieFasady > 0} defaultOpen>
          <TextInput
            label="Materiál zateplenia fasády"
            value={budova.zateplenieFasadyMaterial}
            onChange={(v) => onChange({ zateplenieFasadyMaterial: v })}
            placeholder="napr. EPS, minerálna vlna, PIR"
          />
        </ConditionalSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Celková plocha presklenia"
            value={budova.celkovaPlochaPresklenia}
            onChange={(v) => onChange({ celkovaPlochaPresklenia: v })}
            unit="m²"
            tooltipText="Celková plocha okien a sklenených dverí v budove."
          />
          <NumberInput
            label="Termoizolačné okná/dvere (% zo všetkých otvorov)"
            value={budova.termoizolacneOkna}
            onChange={(v) => onChange({ termoizolacneOkna: v })}
            unit="%"
            max={100}
            step={10}
            tooltipKey="termoizolacneOknaDef"
          />
        </div>
        <NumberInput
          label="Vek termoizolačných okien (rok výmeny)"
          value={budova.vekTermoizolacnychOkien}
          onChange={(v) => onChange({ vekTermoizolacnychOkien: v })}
          placeholder="napr. 2015"
          tooltipText="Rok, kedy boli termoizolačné okná namontované (vážený priemer pri viacerých etapách)."
        />
        <NumberInput
          label="LED osvetlenie (% zo všetkých svietidiel)"
          value={budova.osvetlenieLED}
          onChange={(v) => onChange({ osvetlenieLED: v })}
          unit="%"
          max={100}
          step={10}
          tooltipText="Zaokrúhlite na desiatky %. Napr. ak máte 15 svietidiel a 5 je LED, zadajte 30%."
        />
        <NumberInput
          label="Objem vyvetrávaného vzduchu"
          value={budova.objemVyvetranehoPrezduchu}
          onChange={(v) => onChange({ objemVyvetranehoPrezduchu: v })}
          unit="m³/deň"
          tooltipText="Celkový objem vzduchu, ktorý sa vymení vetraním za deň (projektovaná hodnota alebo meranie)."
        />
      </Section>

      {/* Vykurovanie */}
      <Section title="Vykurovanie">
        {/* Plyn */}
        <HeatingSource
          title="Kúrenie plynom"
          present={budova.kurenePlynom}
          onPresent={(v) => onChange({ kurenePlynom: v })}
          rok={budova.kureniePlynRokInstalacie}
          onRok={(v) => onChange({ kureniePlynRokInstalacie: v })}
          vykon={budova.kureniePlynVykon}
          onVykon={(v) => onChange({ kureniePlynVykon: v })}
          spotreba={budova.kureniePlynSpotreba}
          onSpotreba={(v) => onChange({ kureniePlynSpotreba: v })}
          spotrebaUnit="kWh"
        />

        {/* Elektrina */}
        <HeatingSource
          title="Kúrenie elektrinou"
          present={budova.kurenieElektrinou}
          onPresent={(v) => onChange({ kurenieElektrinou: v })}
          rok={budova.kurenieElektrinaRokInstalacie}
          onRok={(v) => onChange({ kurenieElektrinaRokInstalacie: v })}
          vykon={budova.kurenieElektrinaVykon}
          onVykon={(v) => onChange({ kurenieElektrinaVykon: v })}
          spotreba={budova.kurenieElektrinaSpotreba}
          onSpotreba={(v) => onChange({ kurenieElektrinaSpotreba: v })}
          spotrebaUnit="kWh"
          spotrebaTooltip="Uveďte iba ak sa elektrinou vykuruje. Ak sa nedá odlíšiť spotreba na vykurovanie, uveďte celkovú spotrebu."
        />

        {/* Tepelne cerpadlo */}
        <HeatingSource
          title="Tepelné čerpadlo"
          present={budova.tepelneCerpadlo}
          onPresent={(v) => onChange({ tepelneCerpadlo: v })}
          rok={budova.tepelneCerpadloRokInstalacie}
          onRok={(v) => onChange({ tepelneCerpadloRokInstalacie: v })}
          vykon={budova.tepelneCerpadloVykon}
          onVykon={(v) => onChange({ tepelneCerpadloVykon: v })}
          spotreba={budova.tepelneCerpadloSpotreba}
          onSpotreba={(v) => onChange({ tepelneCerpadloSpotreba: v })}
          spotrebaUnit="kWh"
          spotrebaLabel="Spotreba elektriny na prevádzku TČ"
          tooltipKey="tepelneCerpadloDef"
        />

        {/* Pelety */}
        <HeatingSource
          title="Kúrenie peletami"
          present={budova.kureniePeletami}
          onPresent={(v) => onChange({ kureniePeletami: v })}
          rok={budova.kureniePeletyRokInstalacie}
          onRok={(v) => onChange({ kureniePeletyRokInstalacie: v })}
          vykon={budova.kureniePeletyVykon}
          onVykon={(v) => onChange({ kureniePeletyVykon: v })}
          spotreba={budova.kureniePeletySpotreba_kg}
          onSpotreba={(v) => onChange({ kureniePeletySpotreba_kg: v })}
          spotrebaUnit="kg"
          spotrebaLabel="Spotreba peliet za rok 2022"
          tooltipKey="peletyDef"
        >
          {budova.kureniePeletami === 1 && budova.kureniePeletySpotreba_kg > 0 && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
              Prepočítaná spotreba: <span className="font-medium">
                {Math.round(budova.kureniePeletySpotreba_kg * FUEL_CONVERSIONS.pelety).toLocaleString('sk')} kWh
              </span> (× {FUEL_CONVERSIONS.pelety} kWh/kg)
            </div>
          )}
        </HeatingSource>

        {/* Stiepka */}
        <HeatingSource
          title="Kúrenie štiepkou"
          present={budova.kurenieStiepkou}
          onPresent={(v) => onChange({ kurenieStiepkou: v })}
          rok={budova.kurenieStiepkaRokInstalacie}
          onRok={(v) => onChange({ kurenieStiepkaRokInstalacie: v })}
          vykon={budova.kurenieStiepkaVykon}
          onVykon={(v) => onChange({ kurenieStiepkaVykon: v })}
          spotreba={budova.kurenieStiepkaSpotreba_kg}
          onSpotreba={(v) => onChange({ kurenieStiepkaSpotreba_kg: v })}
          spotrebaUnit="kg"
          spotrebaLabel="Spotreba štiepky za rok 2022"
          tooltipKey="stiepkaDef"
        >
          {budova.kurenieStiepkou === 1 && budova.kurenieStiepkaSpotreba_kg > 0 && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
              Prepočítaná spotreba: <span className="font-medium">
                {Math.round(budova.kurenieStiepkaSpotreba_kg * FUEL_CONVERSIONS.stiepka).toLocaleString('sk')} kWh
              </span> (× {FUEL_CONVERSIONS.stiepka} kWh/kg)
            </div>
          )}
        </HeatingSource>

        {/* Uhlie/Drevo */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <SelectCard
            label="Kúrenie uhlím alebo drevom"
            options={COAL_WOOD_TYPES}
            value={budova.kurenieUhlimDrevom}
            onChange={(v) => onChange({ kurenieUhlimDrevom: v as 0 | 1 | 2 })}
          />
          <ConditionalSection title="Detail uhlia/dreva" show={budova.kurenieUhlimDrevom > 0} defaultOpen>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <NumberInput
                label="Rok inštalácie"
                value={budova.kurenieUhlimDrevomRokInstalacie}
                onChange={(v) => onChange({ kurenieUhlimDrevomRokInstalacie: v })}
              />
              <NumberInput
                label="Výkon zdroja tepla"
                value={budova.kurenieUhlimDrevomVykon}
                onChange={(v) => onChange({ kurenieUhlimDrevomVykon: v })}
                unit="kW"
              />
              <NumberInput
                label="Spotreba za rok 2022"
                value={budova.kurenieUhlimDrevomSpotreba_kg}
                onChange={(v) => onChange({ kurenieUhlimDrevomSpotreba_kg: v })}
                unit="kg"
              />
            </div>
            {budova.kurenieUhlimDrevomSpotreba_kg > 0 && (
              <div className="text-xs text-gray-500 bg-gray-50 rounded px-3 py-2">
                Prepočítaná spotreba: <span className="font-medium">
                  {Math.round(
                    budova.kurenieUhlimDrevomSpotreba_kg *
                    (budova.kurenieUhlimDrevom === 1 ? FUEL_CONVERSIONS.uhlie : FUEL_CONVERSIONS.drevo)
                  ).toLocaleString('sk')} kWh
                </span> (× {budova.kurenieUhlimDrevom === 1 ? FUEL_CONVERSIONS.uhlie : FUEL_CONVERSIONS.drevo} kWh/kg)
              </div>
            )}
          </ConditionalSection>
        </div>

        {/* CZT */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <SelectCard
            label="CZT (Centrálne zásobovanie teplom)"
            options={YES_NO}
            value={budova.kurenieCZT}
            onChange={(v) => onChange({ kurenieCZT: v as 0 | 1 })}
            tooltipKey="CZTDef"
          />
          <ConditionalSection title="Detail CZT" show={budova.kurenieCZT === 1} defaultOpen>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberInput
                label="Ročná spotreba"
                value={budova.kurenieCZTSpotreba}
                onChange={(v) => onChange({ kurenieCZTSpotreba: v })}
                unit="kWh"
              />
              <NumberInput
                label="Priemerná cena za 1 kWh"
                value={budova.kurenieCZTCenaKWh}
                onChange={(v) => onChange({ kurenieCZTCenaKWh: v })}
                unit="EUR"
                step={0.01}
                tooltipText="Priemerná cena tepla za predchádzajúci rok (z faktúry od dodávateľa CZT). Na Slovensku sa pohybuje okolo 0,10–0,14 EUR/kWh v závislosti od mesta a dodávateľa. Údaje ÚRSO: urso.gov.sk."
              />
            </div>
          </ConditionalSection>
        </div>

        {/* Total */}
        {(budova.celkovaSpotreba ?? 0) > 0 && (
          <div className="text-sm font-medium text-gray-800 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            Celková spotreba všetkých zdrojov kúrenia: <span className="text-amber-700">
              {Math.round(budova.celkovaSpotreba!).toLocaleString('sk')} kWh/rok
            </span>
          </div>
        )}

        {/* Vykurovacie telesa */}
        <h4 className="text-xs font-semibold text-gray-600 pt-2">Vykurovacie telesá a regulácia</h4>
        <TextInput
          label="Druh vykurovacích telies"
          value={budova.vykurovacieTelesaDruh}
          onChange={(v) => onChange({ vykurovacieTelesaDruh: v })}
          placeholder="napr. panelové radiátory, podlahové kúrenie"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <SelectCard
            label="Termohlavice"
            options={YES_NO}
            value={budova.termohlavice}
            onChange={(v) => onChange({ termohlavice: v as 0 | 1 })}
            tooltipKey="termohlaviceDef"
          />
          <SelectCard
            label="Automatická regulácia"
            options={YES_NO}
            value={budova.automatickaRegulacia}
            onChange={(v) => onChange({ automatickaRegulacia: v as 0 | 1 })}
          />
          <SelectCard
            label="Rozdelenie ÚK do zón"
            options={YES_NO}
            value={budova.rozdelenieDozOn}
            onChange={(v) => onChange({ rozdelenieDozOn: v as 0 | 1 })}
            tooltipText="Či je ústredné kúrenie rozdelené na nezávislé zóny, ktoré sa dajú regulovať samostatne."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SelectCard
            label="Kúrenie riadené harmonogramom"
            options={YES_NO}
            value={budova.kurenieHarmonogram}
            onChange={(v) => onChange({ kurenieHarmonogram: v as 0 | 1 })}
            tooltipText="Či sa kúrenie riadi podľa nejakého harmonogramu (deň/noc, prázdniny, sviatky, dovolenka)."
          />
          <SelectCard
            label="Prítomnosť rekuperácie"
            options={YES_NO}
            value={budova.rekuperacia}
            onChange={(v) => onChange({ rekuperacia: v as 0 | 1 })}
            tooltipKey="rekuperaciaDef"
          />
        </div>
        <ConditionalSection title="Detail rekuperácie" show={budova.rekuperacia === 1} defaultOpen>
          <NumberInput
            label="Centrálna jednotka – účinnosť"
            value={budova.rekuperaciaCentralnaUcinnost}
            onChange={(v) => onChange({ rekuperaciaCentralnaUcinnost: v })}
            unit="%"
            max={100}
            tooltipText="Tepelná účinnosť centrálnej rekuperačnej jednotky (ak existuje). 0 = žiadna centrálna."
          />
          <p className="text-xs text-gray-500">Lokálne rekuperačné jednotky (počet kusov podľa účinnosti):</p>
          <div className="grid grid-cols-3 gap-3">
            <NumberInput
              label="do 75%"
              value={budova.rekuperaciaLokalnaDo75}
              onChange={(v) => onChange({ rekuperaciaLokalnaDo75: v })}
            />
            <NumberInput
              label="76 – 89%"
              value={budova.rekuperaciaLokalnaOd76do89}
              onChange={(v) => onChange({ rekuperaciaLokalnaOd76do89: v })}
            />
            <NumberInput
              label="90% a viac"
              value={budova.rekuperaciaLokalnaOd90}
              onChange={(v) => onChange({ rekuperaciaLokalnaOd90: v })}
            />
          </div>
        </ConditionalSection>
      </Section>

      {/* Elektricka energia */}
      <Section title="Elektrická energia">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Spotreba elektriny za rok 2022"
            value={budova.spotrebaElektriny}
            onChange={(v) => onChange({ spotrebaElektriny: v })}
            unit="kWh"
          />
          <NumberInput
            label="Výroba elektriny za rok 2022"
            value={budova.vyrobaElektriny}
            onChange={(v) => onChange({ vyrobaElektriny: v })}
            unit="kWh"
            tooltipText="Ak máte fotovoltiku alebo iný zdroj vlastnej elektriny."
          />
        </div>
        <SelectCard
          label="Existencia fotovoltických panelov"
          options={YES_NO}
          value={budova.fotovoltika}
          onChange={(v) => onChange({ fotovoltika: v as 0 | 1 })}
          tooltipKey="fotovoltikaDef"
        />
        <ConditionalSection title="Detail fotovoltiky" show={budova.fotovoltika === 1}>
          <NumberInput
            label="Plocha fotovoltických panelov"
            value={budova.fotovoltikaPlocha}
            onChange={(v) => onChange({ fotovoltikaPlocha: v })}
            unit="m²"
          />
        </ConditionalSection>
        <NumberInput
          label="Batériové úložisko elektriny"
          value={budova.bateriovyUlozisko}
          onChange={(v) => onChange({ bateriovyUlozisko: v })}
          unit="kWh"
          tooltipText="Kapacita batériového úložiska na ukladanie prebytočnej elektrickej energie (ak existuje)."
        />
        <SelectCard
          label="Počítačová sieť (LAN / Wi-Fi) prítomná v objekte"
          options={YES_NO}
          value={budova.pocitacovaSiet}
          onChange={(v) => onChange({ pocitacovaSiet: v as 0 | 1 })}
          tooltipKey="PCsietDef"
        />
      </Section>

      {/* Dokumentacia */}
      <Section title="Projektová dokumentácia">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectCard
            label="Energetický certifikát"
            options={YES_NO}
            value={budova.energetickyCertifikat}
            onChange={(v) => onChange({ energetickyCertifikat: v as 0 | 1 })}
            tooltipKey="energetickyCertifikatDef"
          />
          <ConditionalSection title="" show={budova.energetickyCertifikat === 1}>
            <TextInput
              label="Číslo energetického certifikátu"
              value={budova.energetickyCertifikatCislo}
              onChange={(v) => onChange({ energetickyCertifikatCislo: v })}
            />
          </ConditionalSection>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectCard
            label="Energetický audit"
            options={YES_NO}
            value={budova.energetickyAudit}
            onChange={(v) => onChange({ energetickyAudit: v as 0 | 1 })}
            tooltipKey="energetickyAuditDef"
          />
          <ConditionalSection title="" show={budova.energetickyAudit === 1}>
            <NumberInput
              label="Rok spracovania auditu"
              value={budova.energetickyAuditRok}
              onChange={(v) => onChange({ energetickyAuditRok: v })}
            />
          </ConditionalSection>
        </div>

        {/* PD 1 */}
        <PDSection
          num={1}
          nazov={budova.pd1Nazov} onNazov={(v) => onChange({ pd1Nazov: v })}
          uroven={budova.pd1Uroven} onUroven={(v) => onChange({ pd1Uroven: v })}
          rok={budova.pd1Rok} onRok={(v) => onChange({ pd1Rok: v })}
          forma={budova.pd1Forma} onForma={(v) => onChange({ pd1Forma: v })}
        />
        <ConditionalSection title="Projektová dokumentácia 2" show={budova.pd1Nazov.length > 0}>
          <PDSection
            num={2}
            nazov={budova.pd2Nazov} onNazov={(v) => onChange({ pd2Nazov: v })}
            uroven={budova.pd2Uroven} onUroven={(v) => onChange({ pd2Uroven: v })}
            rok={budova.pd2Rok} onRok={(v) => onChange({ pd2Rok: v })}
            forma={budova.pd2Forma} onForma={(v) => onChange({ pd2Forma: v })}
          />
        </ConditionalSection>
        <ConditionalSection title="Projektová dokumentácia 3" show={budova.pd2Nazov.length > 0}>
          <PDSection
            num={3}
            nazov={budova.pd3Nazov} onNazov={(v) => onChange({ pd3Nazov: v })}
            uroven={budova.pd3Uroven} onUroven={(v) => onChange({ pd3Uroven: v })}
            rok={budova.pd3Rok} onRok={(v) => onChange({ pd3Rok: v })}
            forma={budova.pd3Forma} onForma={(v) => onChange({ pd3Forma: v })}
          />
        </ConditionalSection>
      </Section>

      {/* Celkový stav budovy */}
      <Section title="Celkový stav budovy">
        <TextInput
          label="Popis celkového stavu budovy"
          value={budova.celkovyStavBudovy}
          onChange={(v) => onChange({ celkovyStavBudovy: v })}
          placeholder="Voľný popis – konštrukčný stav, viditeľné poruchy, opotrebenie..."
          multiline
        />
      </Section>

      {/* Existujuca infrastruktura */}
      <Section title="Už zrealizovaná infraštruktúra">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Zelená strecha – plocha celkom"
            value={budova.zelenaStrechaPlocha}
            onChange={(v) => onChange({ zelenaStrechaPlocha: v })}
            unit="m²"
            tooltipKey="zelenaStrechaDef"
          />
          <NumberInput
            label="Solárne panely – plocha"
            value={budova.solarnePanelyPlocha}
            onChange={(v) => onChange({ solarnePanelyPlocha: v })}
            unit="m²"
            tooltipKey="solarnePanelyDef"
          />
        </div>
        <ConditionalSection title="Typy zelenej strechy (detail)" show={budova.zelenaStrechaPlocha > 0} defaultOpen>
          <p className="text-xs text-gray-500">Rozdeľte celkovú plochu zelenej strechy podľa typu (m²):</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <NumberInput
              label="Extenzívna plochá"
              value={budova.zelenaStrechaBudovExtenzivnaPloca}
              onChange={(v) => onChange({ zelenaStrechaBudovExtenzivnaPloca: v })}
              unit="m²"
            />
            <NumberInput
              label="Extenzívna šikmá"
              value={budova.zelenaStrechaBudovExtenzivnaSikma}
              onChange={(v) => onChange({ zelenaStrechaBudovExtenzivnaSikma: v })}
              unit="m²"
            />
            <NumberInput
              label="Intenzívna"
              value={budova.zelenaStrechaBudovIntenzivna}
              onChange={(v) => onChange({ zelenaStrechaBudovIntenzivna: v })}
              unit="m²"
            />
            <NumberInput
              label="Modrozelená"
              value={budova.zelenaStrechaBudovModrozelena}
              onChange={(v) => onChange({ zelenaStrechaBudovModrozelena: v })}
              unit="m²"
            />
            <NumberInput
              label="Štrková"
              value={budova.zelenaStrechaBudovStrkova}
              onChange={(v) => onChange({ zelenaStrechaBudovStrkova: v })}
              unit="m²"
            />
          </div>
        </ConditionalSection>
        <NumberInput
          label="Zelená stena budovy"
          value={budova.zelenaStenaBudov}
          onChange={(v) => onChange({ zelenaStenaBudov: v })}
          unit="m²"
          tooltipText="Plocha vegetačnej zelenej steny na fasáde budovy."
        />
      </Section>
    </div>
  );
}

// Helper components

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border border-gray-100 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">{title}</h3>
      {children}
    </div>
  );
}

interface HeatingSourceProps {
  title: string;
  present: 0 | 1;
  onPresent: (v: 0 | 1) => void;
  rok: number;
  onRok: (v: number) => void;
  vykon: number;
  onVykon: (v: number) => void;
  spotreba: number;
  onSpotreba: (v: number) => void;
  spotrebaUnit: string;
  spotrebaLabel?: string;
  spotrebaTooltip?: string;
  tooltipKey?: string;
  children?: React.ReactNode;
}

function HeatingSource({
  title, present, onPresent, rok, onRok, vykon, onVykon,
  spotreba, onSpotreba, spotrebaUnit, spotrebaLabel, spotrebaTooltip, tooltipKey, children,
}: HeatingSourceProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <SelectCard
          label={title}
          options={YES_NO}
          value={present}
          onChange={(v) => onPresent(v as 0 | 1)}
          tooltipKey={tooltipKey}
        />
      </div>
      <ConditionalSection title={`Detail ${title.toLowerCase()}`} show={present === 1} defaultOpen>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <NumberInput
            label="Rok inštalácie zdroja"
            value={rok}
            onChange={onRok}
          />
          <NumberInput
            label="Výkon zdroja tepla"
            value={vykon}
            onChange={onVykon}
            unit="kW"
          />
          <NumberInput
            label={spotrebaLabel || `Spotreba za rok 2022`}
            value={spotreba}
            onChange={onSpotreba}
            unit={spotrebaUnit}
            tooltipText={spotrebaTooltip}
          />
        </div>
        {children}
      </ConditionalSection>
    </div>
  );
}

interface PDSectionProps {
  num: number;
  nazov: string; onNazov: (v: string) => void;
  uroven: number; onUroven: (v: number) => void;
  rok: number; onRok: (v: number) => void;
  forma: 1 | 2; onForma: (v: 1 | 2) => void;
}

function PDSection({ num, nazov, onNazov, uroven, onUroven, rok, onRok, forma, onForma }: PDSectionProps) {
  return (
    <div className="space-y-3">
      <TextInput
        label={`Projektová dokumentácia ${num} – názov`}
        value={nazov}
        onChange={onNazov}
        tooltipKey="projektovaDokumentaciaDef"
      />
      {nazov.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              Úroveň PD
              <Tooltip text="1=zámer, 2=štúdia uskutočniteľnosti, 3=PD pre územné rozhodnutie, 4=PD pre stavebné povolenie, 5=realizačná dokumentácia, 6=skutočné vyhotovenie" />
            </label>
            <select
              value={uroven}
              onChange={(e) => onUroven(Number(e.target.value))}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D7D46] focus:ring-2 focus:ring-[#2D7D46]/20 focus:outline-none"
            >
              {PD_LEVELS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <NumberInput
            label="Rok spracovania"
            value={rok}
            onChange={onRok}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Forma</label>
            <select
              value={forma}
              onChange={(e) => onForma(Number(e.target.value) as 1 | 2)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2D7D46] focus:ring-2 focus:ring-[#2D7D46]/20 focus:outline-none"
            >
              {PD_FORMS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
