import { Pozemok } from '../../../types/areal';
import { TextInput } from '../../ui/TextInput';
import { NumberInput } from '../../ui/NumberInput';
import { PercentageGroup } from '../../ui/PercentageGroup';
import { ConditionalSection } from '../../ui/ConditionalSection';

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
            label="Celková výmera"
            value={pozemok.celkovaVymera}
            onChange={(v) => onChange({ celkovaVymera: v })}
            unit="m²"
            tooltipText="Celková výmera parcely podľa katastra."
          />
          <NumberInput
            label="Plocha pozemku bez budov"
            value={pozemok.plochaBezBudov}
            onChange={(v) => onChange({ plochaBezBudov: v })}
            unit="m²"
            tooltipText="Plocha pozemku po odčítaní zastavanej plochy budov. Ak je celý pozemok zastavaný, zadajte 0."
          />
        </div>
        <TextInput
          label="Členitosť terénu"
          value={pozemok.clenitosTerenu}
          onChange={(v) => onChange({ clenitosTerenu: v })}
          placeholder="napr. rovinatý, mierny svah, kopcovitý"
          tooltipText="Opíšte tvar a sklon terénu. Napr. kužeľovitý kopec s miernymi svahmi, alebo hrboľatý vodorovný s priemerom jám do 0,5 m."
        />
      </div>

      {/* Odvod vody */}
      <PercentageGroup
        title="Odvod vody z pozemku"
        tooltipText="Kam odteká dažďová voda z vášho pozemku? Rozdeľte 100% plochy medzi jednotlivé spôsoby odvodu."
        fields={[
          { key: 'odvodVodyKanalizacia', label: 'Do kanalizácie', tooltipText: 'Časť pozemku, z ktorej voda odteká do dažďovej alebo jednotnej kanalizácie.' },
          { key: 'odvodVodyVodnyTok', label: 'Do vodného toku', tooltipText: 'Časť pozemku, z ktorej voda odteká priamo do potoka, rieky alebo vodnej plochy.' },
          { key: 'odvodVodyVsakovanie', label: 'Cielené vsakovanie', tooltipText: 'Časť pozemku, kde sa voda cielene vsakuje – napr. do vsakovacieho rigolu, dažďovej záhrady alebo retenčnej nádrže.' },
          { key: 'odvodVodyNerieseny', label: 'Neriešený', tooltipText: 'Časť pozemku, kde odvod vody nie je riešený – voda voľne steká po povrchu.' },
        ]}
        values={{
          odvodVodyKanalizacia: pozemok.odvodVodyKanalizacia,
          odvodVodyVodnyTok: pozemok.odvodVodyVodnyTok,
          odvodVodyVsakovanie: pozemok.odvodVodyVsakovanie,
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
              { key: 'priepustnaPlochaHolaPoda', label: 'Holá pôda', tooltipText: 'Pôda bez vegetácie – napr. čerstvo prekopané záhony, stavebné pozemky.' },
              { key: 'priepustnaPlochaByliny', label: 'Byliny (trávnik, lúka)', tooltipText: 'Trávnik, lúky, záhony s nízkymi rastlinami.' },
              { key: 'priepustnaPlochaKry', label: 'Kry', tooltipText: 'Kríky a nízke dreviny.' },
              { key: 'priepustnaPlochaStromy', label: 'Stromy', tooltipText: 'Plocha pod korunami stromov.' },
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
            unit="%"
            max={100}
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
              { key: 'polopriepustnaPlnevegetacneTvarnice', label: 'Plnevegetačné zatrávňovacie tvárnice', tooltipText: 'Betónové tvárnice s veľkými otvormi vyplnenými zeminou a trávou.' },
              { key: 'polopriepustnaPolovegetacneTvarnice', label: 'Polovegetačné tvárnice (betónové)', tooltipText: 'Betónové tvárnice s menšími otvormi čiastočne vyplnenými trávou.' },
              { key: 'polopriepustnaVodopriepustnaDlazba', label: 'Vodopriepustná dlažba', tooltipKey: 'priepustnaDlazbaDef' },
              { key: 'polopriepustnaZivicaKremicityStrk', label: 'Živica a kremičitý štrk', tooltipText: 'Povrch zo zmesi živice a kremičitého štrku – priepustný a pevný.' },
              { key: 'polopriepustnaMlatovyPovrch', label: 'Mlatový povrch', tooltipText: 'Prírodný povrch z udupanej zmesi hliny, štrku a piesku.' },
              { key: 'polopriepustnaStered', label: 'Materiál STERED ID 250/05', tooltipText: 'Špeciálny priepustný povrchový materiál.' },
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
            unit="%"
            max={100}
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
            unit="%"
            max={100}
            tooltipKey="vyspadovanyPozemokDef"
          />
        </ConditionalSection>
      </div>

      {/* Stromy */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Stromy</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Podiel mladých stromov"
            value={pozemok.stromyPodielMladych}
            onChange={(v) => onChange({ stromyPodielMladych: v })}
            unit="%"
            max={100}
            tooltipText="Koľko percent všetkých stromov na pozemku sú mladé (menej ako 10-15 rokov). Mladé stromy = rastúci potenciál."
          />
          <NumberInput
            label="Podiel nezdravých stromov"
            value={pozemok.stromyPodielNezdravych}
            onChange={(v) => onChange({ stromyPodielNezdravych: v })}
            unit="%"
            max={100}
            tooltipText="Koľko percent stromov je poškodených, chorých alebo odumierajúcich."
          />
        </div>
      </div>

      {/* Existujuca infrastruktura */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
          Už zrealizovaná infraštruktúra
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Dažďová záhrada – plocha"
            value={pozemok.dazdovaZahradaPlocha}
            onChange={(v) => onChange({ dazdovaZahradaPlocha: v })}
            unit="m²"
            tooltipKey="dazdovaZahradaDef"
          />
          <NumberInput
            label="Dažďová záhrada – hĺbka"
            value={pozemok.dazdovaZahradaHlbka}
            onChange={(v) => onChange({ dazdovaZahradaHlbka: v })}
            unit="cm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Jazierko – plocha"
            value={pozemok.jazierkoPlocha}
            onChange={(v) => onChange({ jazierkoPlocha: v })}
            unit="m²"
            tooltipText="Plocha existujúceho jazierka alebo vodnej plochy na pozemku."
          />
          <NumberInput
            label="Jazierko – hĺbka"
            value={pozemok.jazierkoHlbka}
            onChange={(v) => onChange({ jazierkoHlbka: v })}
            unit="cm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Nadzemné nádoby – objem"
            value={pozemok.nadzemneNadobyObjem}
            onChange={(v) => onChange({ nadzemneNadobyObjem: v })}
            unit="m³"
            tooltipText="Celkový objem nadzemných nádob na zachytávanie dažďovej vody (sudy, IBC kontajnery a pod.)."
          />
          <NumberInput
            label="Podzemné nádoby – objem"
            value={pozemok.podzemneNadobyObjem}
            onChange={(v) => onChange({ podzemneNadobyObjem: v })}
            unit="m³"
            tooltipText="Celkový objem podzemných retenčných nádrží."
          />
        </div>

        <TextInput
          label="Spôsob využitia vody z nádob"
          value={pozemok.sposobVyuzitiaVody}
          onChange={(v) => onChange({ sposobVyuzitiaVody: v })}
          placeholder="napr. polievanie, sekundárny okruh v objekte"
          tooltipText="Opíšte, na čo používate zachytenú dažďovú vodu."
        />

        <NumberInput
          label="Zelená strecha (napr. na prístrešku) – plocha"
          value={pozemok.zelenaStrechaPlocha}
          onChange={(v) => onChange({ zelenaStrechaPlocha: v })}
          unit="m²"
          tooltipKey="zelenaStrechaDef"
        />
      </div>
    </div>
  );
}
