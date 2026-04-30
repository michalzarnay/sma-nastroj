import { Pozemok } from '../../../types/areal';
import { TextInput } from '../../ui/TextInput';
import { NumberInput } from '../../ui/NumberInput';
import { SelectCard } from '../../ui/SelectCard';
import { PercentageGroup } from '../../ui/PercentageGroup';
import { ConditionalSection } from '../../ui/ConditionalSection';
import { YES_NO } from '../../../data/constants';

interface PozemokFormProps {
  pozemok: Pozemok;
  onChange: (data: Partial<Pozemok>) => void;
}

export function PozemokForm({ pozemok, onChange }: PozemokFormProps) {
  return (
    <div className="space-y-6">
      {/* Identifikacia */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Identifikácia</h3>
        <TextInput
          label="Aktuálne využitie"
          value={pozemok.aktualneVyuzitie}
          onChange={(v) => onChange({ aktualneVyuzitie: v })}
          placeholder="napr. záhrada, park, parkovisko, dvor"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Parcela"
            value={pozemok.parcela}
            onChange={(v) => onChange({ parcela: v })}
            placeholder="napr. 2307"
            tooltipKey="parcelaDef"
          />
          <TextInput
            label="Číslo listu vlastníctva"
            value={pozemok.listVlastnictva}
            onChange={(v) => onChange({ listVlastnictva: v })}
            placeholder="napr. 2794"
            tooltipKey="listVlastnictvaDef"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Celková výmera parcely"
            value={pozemok.celkovaVymera}
            onChange={(v) => onChange({ celkovaVymera: v })}
            unit="m²"
            tooltipText="Celková výmera parcely podľa katastra (vrátane plochy pod budovami, ak sú na parcele)."
          />
          <NumberInput
            label="Plocha bez budov (nezastavaná)"
            value={pozemok.plochaBezBudov}
            onChange={(v) => onChange({ plochaBezBudov: v })}
            unit="m²"
            tooltipText="Plocha parcely bez zastavanej časti – teda plocha pozemku, na ktorej nestojí žiadna budova. Táto plocha sa hodnotí v tomto formulári."
          />
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-700">
          Pozor: pozemok (parcela) <strong>nezahŕňa</strong> zastavanú plochu budov. Údaje o budovách zadajte v kroku Budovy.
        </div>
        <TextInput
          label="Členitosť terénu"
          value={pozemok.clenitosTerenu}
          onChange={(v) => onChange({ clenitosTerenu: v })}
          placeholder="napr. rovinatý, mierny svah, kopcovitý"
          tooltipText="Opíšte tvar a sklon terénu."
        />
      </div>

      {/* Odvod vody — 7 kategórií */}
      <PercentageGroup
        title="Odvod vody z pozemku"
        tooltipText="Kam odteká voda (zrejme najmä dažďová) z vášho pozemku? Rozdeľte 100% plochy medzi jednotlivé spôsoby odvodu."
        fields={[
          { key: 'odvodVodyJednotnaKanalizacia', label: 'Jednotná stokova sieť', tooltipText: 'Kanalizácia spoločná pre splaškovú aj dažďovú vodu.' },
          { key: 'odvodVodySplaskovaKanalizacia', label: 'Delená splašková kanalizácia', tooltipText: 'Samostatná kanalizácia pre splašky (bez dažďovej vody).' },
          { key: 'odvodVodyZrazkovaKanalizacia', label: 'Delená zrážková kanalizácia', tooltipText: 'Samostatná kanalizácia len pre dažďovú vodu.' },
          { key: 'odvodVodyVodnyTok', label: 'Do vodného toku', tooltipText: 'Priamo do potoka, rieky alebo vodnej plochy.' },
          { key: 'odvodVodyVsakovanie', label: 'Cielené vsakovanie', tooltipText: 'Cielene vsakovaním – napr. do priehlbne, dažďovej záhrady.' },
          { key: 'odvodVodyRetencnaNadrzou', label: 'Do retenčnej nádrže', tooltipText: 'Voda sa zachytáva v retenčnej nádrži.' },
          { key: 'odvodVodyNerieseny', label: 'Neriešený', tooltipText: 'Odvod vody nie je riešený – voda voľne steká po povrchu.' },
        ]}
        values={{
          odvodVodyJednotnaKanalizacia: pozemok.odvodVodyJednotnaKanalizacia,
          odvodVodySplaskovaKanalizacia: pozemok.odvodVodySplaskovaKanalizacia,
          odvodVodyZrazkovaKanalizacia: pozemok.odvodVodyZrazkovaKanalizacia,
          odvodVodyVodnyTok: pozemok.odvodVodyVodnyTok,
          odvodVodyVsakovanie: pozemok.odvodVodyVsakovanie,
          odvodVodyRetencnaNadrzou: pozemok.odvodVodyRetencnaNadrzou,
          odvodVodyNerieseny: pozemok.odvodVodyNerieseny,
        }}
        onChange={(key, value) => onChange({ [key]: value })}
      />

      {/* Priepustna plocha */}
      <div className="space-y-4">
        <NumberInput
          label="Priepustná plocha celkom"
          value={pozemok.priepustnaPlochaCelkom}
          onChange={(v) => onChange({ priepustnaPlochaCelkom: v })}
          unit="m²"
          tooltipKey="priepustnaPlochaDef"
        />
        <ConditionalSection title="Rozdelenie priepustnej plochy" show={pozemok.priepustnaPlochaCelkom > 0}>
          <PercentageGroup
            title="Podiel typov vegetácie na priepustnej ploche"
            tooltipText="Rozdeľte priepustnú plochu podľa typu vegetácie. Súčet musí byť 100%."
            fields={[
              { key: 'priepustnaPlochaHolaPoda', label: 'Holá pôda' },
              { key: 'priepustnaPlochaByliny', label: 'Byliny (trávnik, lúka)' },
              { key: 'priepustnaPlochaKry', label: 'Kry' },
              { key: 'priepustnaPlochaStromy', label: 'Stromy' },
            ]}
            values={{
              priepustnaPlochaHolaPoda: pozemok.priepustnaPlochaHolaPoda,
              priepustnaPlochaByliny: pozemok.priepustnaPlochaByliny,
              priepustnaPlochaKry: pozemok.priepustnaPlochaKry,
              priepustnaPlochaStromy: pozemok.priepustnaPlochaStromy,
            }}
            onChange={(key, value) => onChange({ [key]: value })}
          />
          <NumberInput
            label="Časť zatienená stromami"
            value={pozemok.priepustnaPlochaZatienena}
            onChange={(v) => onChange({ priepustnaPlochaZatienena: v })}
            unit="%" max={100}
            tooltipText="Koľko percent priepustnej plochy je zatienených korunami stromov."
          />
        </ConditionalSection>
      </div>

      {/* Polopriepustna plocha */}
      <div className="space-y-4">
        <NumberInput
          label="Polopriepustná plocha celkom"
          value={pozemok.polopriepustnaPlochaCelkom}
          onChange={(v) => onChange({ polopriepustnaPlochaCelkom: v })}
          unit="m²"
          tooltipKey="polopriepustnaPlochaDef"
        />
        <ConditionalSection title="Rozdelenie polopriepustnej plochy" show={pozemok.polopriepustnaPlochaCelkom > 0}>
          <PercentageGroup
            title="Typy polopriepustného povrchu"
            tooltipText="Rozdeľte polopriepustnú plochu podľa typu materiálu. Súčet musí byť 100%."
            fields={[
              { key: 'polopriepustnaPriepustnyAsfalt', label: 'Priepustný asfalt' },
              { key: 'polopriepustnaPriepustnyBeton', label: 'Priepustný betón' },
              { key: 'polopriepustnaPlnevegetacneTvarnice', label: 'Plnevegetačné zatrávňovacie tvárnice' },
              { key: 'polopriepustnaPolovegetacneTvarnice', label: 'Polovegetačné tvárnice (betónové)' },
              { key: 'polopriepustnaVodopriepustnaDlazba', label: 'Vodopriepustná dlažba', tooltipKey: 'priepustnaDlazbaDef' },
              { key: 'polopriepustnaZivicaKremicityStrk', label: 'Živica a kremičitý štrk' },
              { key: 'polopriepustnaMlatovyPovrch', label: 'Mlatový povrch' },
              { key: 'polopriepustnaStered', label: 'Materiál STERED ID 250/05' },
              { key: 'polopriepustnaInyPovrch', label: 'Iný povrch' },
            ]}
            values={{
              polopriepustnaPriepustnyAsfalt: pozemok.polopriepustnaPriepustnyAsfalt,
              polopriepustnaPriepustnyBeton: pozemok.polopriepustnaPriepustnyBeton,
              polopriepustnaPlnevegetacneTvarnice: pozemok.polopriepustnaPlnevegetacneTvarnice,
              polopriepustnaPolovegetacneTvarnice: pozemok.polopriepustnaPolovegetacneTvarnice,
              polopriepustnaVodopriepustnaDlazba: pozemok.polopriepustnaVodopriepustnaDlazba,
              polopriepustnaZivicaKremicityStrk: pozemok.polopriepustnaZivicaKremicityStrk,
              polopriepustnaMlatovyPovrch: pozemok.polopriepustnaMlatovyPovrch,
              polopriepustnaStered: pozemok.polopriepustnaStered,
              polopriepustnaInyPovrch: pozemok.polopriepustnaInyPovrch,
            }}
            onChange={(key, value) => onChange({ [key]: value })}
          />
          <NumberInput
            label="Časť polopriepustnej plochy vyspádovaná"
            value={pozemok.polopriepustnaVyspadovana}
            onChange={(v) => onChange({ polopriepustnaVyspadovana: v })}
            unit="%" max={100}
            tooltipKey="vyspadovanyPozemokDef"
          />
        </ConditionalSection>
      </div>

      {/* Spevnena plocha */}
      <div className="space-y-4">
        <NumberInput
          label="Spevnená plocha celkom"
          value={pozemok.spevnenaPlochaCelkom}
          onChange={(v) => onChange({ spevnenaPlochaCelkom: v })}
          unit="m²"
          tooltipKey="spevnenaPlochaDef"
        />
        <ConditionalSection title="Detail spevnenej plochy" show={pozemok.spevnenaPlochaCelkom > 0}>
          <NumberInput
            label="Časť spevnenej plochy vyspádovaná"
            value={pozemok.spevnenaPlochaVyspadovana}
            onChange={(v) => onChange({ spevnenaPlochaVyspadovana: v })}
            unit="%" max={100}
            tooltipKey="vyspadovanyPozemokDef"
          />
        </ConditionalSection>
      </div>

      {/* Stromy */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Stromy</h3>
        <p className="text-xs text-gray-500">
          Do plochy stromov započítajte aj stromy z parciel susediacich s riešenou parcelou, ak ich koruny presahujú
          cez hranicu na túto parcelu a majú adaptačný význam pre ňu. Zvlášť v prípade, že ide o susedné parcely
          mimo posudzovaného areálu.
        </p>
        {pozemok.priepustnaPlochaStromy > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="Podiel mladých stromov"
              value={pozemok.stromyPodielMladych}
              onChange={(v) => onChange({ stromyPodielMladych: v })}
              unit="%" max={100}
              tooltipText="Koľko percent všetkých stromov sú mladé (menej ako 10–15 rokov)."
            />
            <NumberInput
              label="Podiel nezdravých stromov"
              value={pozemok.stromyPodielNezdravych}
              onChange={(v) => onChange({ stromyPodielNezdravych: v })}
              unit="%" max={100}
              tooltipText="Koľko percent stromov je poškodených, chorých alebo odumierajúcich."
            />
          </div>
        )}
        {pozemok.priepustnaPlochaStromy === 0 && (
          <p className="text-xs text-gray-400 italic">
            Polia pre stromy sú dostupné, keď je podiel stromov na priepustnej ploche väčší ako 0 %.
          </p>
        )}
      </div>

      {/* Existujuca infrastruktura */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
          Už zrealizovaná infraštruktúra na pozemkoch
        </h3>

        {/* Dažďová záhrada */}
        <div className="space-y-3 border border-gray-100 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700">Dažďová záhrada</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <NumberInput label="Plocha" value={pozemok.dazdovaZahradaPlocha}
              onChange={(v) => onChange({ dazdovaZahradaPlocha: v })} unit="m²" tooltipKey="dazdovaZahradaDef" />
            <NumberInput label="Hĺbka" value={pozemok.dazdovaZahradaHlbka}
              onChange={(v) => onChange({ dazdovaZahradaHlbka: v })} unit="cm" />
            <NumberInput label="Odvodnená plocha strechy" value={pozemok.dazdovaZahradaPlochaStrechy}
              onChange={(v) => onChange({ dazdovaZahradaPlochaStrechy: v })} unit="m²"
              tooltipText="Plocha strechy, z ktorej voda odteká do dažďovej záhrady." />
            <NumberInput label="Odvodnená plocha terénu" value={pozemok.dazdovaZahradaPlochaTerenu}
              onChange={(v) => onChange({ dazdovaZahradaPlochaTerenu: v })} unit="m²"
              tooltipText="Plocha terénu, z ktorej voda odteká do dažďovej záhrady." />
          </div>
        </div>

        {/* Jazierko */}
        <div className="space-y-3 border border-gray-100 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700">Jazierko</h4>
          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Plocha" value={pozemok.jazierkoPlocha}
              onChange={(v) => onChange({ jazierkoPlocha: v })} unit="m²" />
            <NumberInput label="Max. hĺbka" value={pozemok.jazierkoHlbka}
              onChange={(v) => onChange({ jazierkoHlbka: v })} unit="cm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectCard label="Bezpečnostný prepad riešený" options={YES_NO}
              value={pozemok.jazierkoPrepadRieseny}
              onChange={(v) => onChange({ jazierkoPrepadRieseny: v as 0 | 1 })} />
            <ConditionalSection title="" show={pozemok.jazierkoPrepadRieseny === 1} defaultOpen>
              <TextInput label="Kam smeruje prepad" value={pozemok.jazierkoSmerPrepadu}
                onChange={(v) => onChange({ jazierkoSmerPrepadu: v })}
                placeholder="napr. do kanalizácie, na terén" />
            </ConditionalSection>
          </div>
        </div>

        {/* Nádrže */}
        <div className="space-y-3 border border-gray-100 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700">Nádrže na dažďovú vodu</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberInput label="Nadzemné nádrže – objem" value={pozemok.nadzemneNadobyObjem}
              onChange={(v) => onChange({ nadzemneNadobyObjem: v })} unit="m³"
              tooltipText="Sudy, IBC kontajnery a pod." />
            <NumberInput label="Podzemné nádrže – objem" value={pozemok.podzemneNadobyObjem}
              onChange={(v) => onChange({ podzemneNadobyObjem: v })} unit="m³" />
          </div>
          <TextInput label="Spôsob využitia vody z nádob" value={pozemok.sposobVyuzitiaVody}
            onChange={(v) => onChange({ sposobVyuzitiaVody: v })}
            placeholder="napr. polievanie, sekundárny okruh" />
          <SelectCard label="Kapacita nádrží postačuje na zachytenie zrážok zo strechy?"
            options={YES_NO} value={pozemok.kapacitaNadrzSebahodnotenie}
            onChange={(v) => onChange({ kapacitaNadrzSebahodnotenie: v as 0 | 1 })} />
        </div>

        {/* Zelená strecha na pozemkoch */}
        <div className="space-y-3 border border-gray-100 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700">Zelená strecha na pozemkoch (napr. prístrešok)</h4>
          <NumberInput label="Celková plocha" value={pozemok.zelenaStrechaPlocha}
            onChange={(v) => onChange({ zelenaStrechaPlocha: v })} unit="m²" tooltipKey="zelenaStrechaDef" />
          <ConditionalSection title="Rozdelenie podľa typu" show={pozemok.zelenaStrechaPlocha > 0}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <NumberInput label="Extenzívna plochá (sklon ≤35°, substrát ≤200mm)" value={pozemok.zelenaStrechaExtenzivnaPloca}
                onChange={(v) => onChange({ zelenaStrechaExtenzivnaPloca: v })} unit="m²" />
              <NumberInput label="Extenzívna šikmá (sklon >35°)" value={pozemok.zelenaStrechaExtenzivnaSikma}
                onChange={(v) => onChange({ zelenaStrechaExtenzivnaSikma: v })} unit="m²" />
              <NumberInput label="Intenzívna (substrát >200mm)" value={pozemok.zelenaStrechaIntenzivna}
                onChange={(v) => onChange({ zelenaStrechaIntenzivna: v })} unit="m²" />
              <NumberInput label="Modrá / modrozelená" value={pozemok.zelenaStrechaModrozelena}
                onChange={(v) => onChange({ zelenaStrechaModrozelena: v })} unit="m²" />
              <NumberInput label="So štrkovým zásypom" value={pozemok.zelenaStrechaStrkova}
                onChange={(v) => onChange({ zelenaStrechaStrkova: v })} unit="m²" />
              <NumberInput label="Zelená stena / popínavé rastliny" value={pozemok.zelenaStenaNaPozemku}
                onChange={(v) => onChange({ zelenaStenaNaPozemku: v })} unit="m²" />
            </div>
          </ConditionalSection>
        </div>

        {/* Vsakovacie priehlbne */}
        <div className="space-y-3 border border-gray-100 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700">Vsakovacie priehlbne</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <NumberInput label="S bezpečnostným prepadom" value={pozemok.vsakovaciaPrehlbenaBezpecnostnyPrepad}
              onChange={(v) => onChange({ vsakovaciaPrehlbenaBezpecnostnyPrepad: v })} unit="m²" />
            <NumberInput label="S regulovaným odtokom" value={pozemok.vsakovaciaPrehlbenaRegulovanyOdtok}
              onChange={(v) => onChange({ vsakovaciaPrehlbenaRegulovanyOdtok: v })} unit="m²" />
          </div>
        </div>

        {/* Prekoreniteľný priestor */}
        <NumberInput
          label="Podzemný prekoreniteľný priestor pre stromy"
          value={pozemok.prekorenetelnyPriestorPreStromy}
          onChange={(v) => onChange({ prekorenetelnyPriestorPreStromy: v })}
          unit="m²"
          tooltipText="Špeciálne upravený podzemný priestor, ktorý umožňuje koreňom stromov rásť pod spevnenými plochami."
        />
      </div>
    </div>
  );
}
