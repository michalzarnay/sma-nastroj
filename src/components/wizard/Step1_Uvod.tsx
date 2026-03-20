import { Building2, MapPin } from 'lucide-react';
import { Areal } from '../../types/areal';
import { TextInput } from '../ui/TextInput';
import { NumberInput } from '../ui/NumberInput';

interface Step1Props {
  areal: Areal;
  updateAreal: (data: Partial<Areal>) => void;
}

export function Step1_Uvod({ areal, updateAreal }: Step1Props) {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Obec"
            value={areal.obec}
            onChange={(v) => updateAreal({ obec: v })}
            placeholder="napr. Likavka"
          />
          <TextInput
            label="Región"
            value={areal.region}
            onChange={(v) => updateAreal({ region: v })}
            placeholder="napr. Liptov"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberInput
            label="Množstvo zrážok v oblasti"
            value={areal.mnozstvoZrazok || 0}
            onChange={(v) => updateAreal({ mnozstvoZrazok: v })}
            unit="mm/m²"
            tooltipText="Priemerný ročný úhrn zrážok v oblasti. Nájdete na stránkach SHMÚ alebo odhadnite: Slovensko priemer 600-800 mm/rok."
          />
          <NumberInput
            label="Potenciál slnečného svitu"
            value={areal.potencialSlnecnehoSvitu || 0}
            onChange={(v) => updateAreal({ potencialSlnecnehoSvitu: v })}
            unit="kWh/rok"
            tooltipText="Ročný potenciál slnečného svitu v oblasti. Pre Slovensko je to typicky 1000-1200 kWh/m²/rok. Nájdete na PVGIS európska databáza."
          />
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
        <MapPin className="w-5 h-5 text-[#2196F3] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">V ďalších krokoch budete postupne zadávať:</p>
          <ul className="mt-1 list-disc list-inside text-xs space-y-0.5">
            <li>Pozemky – plochy, odvod vody, zeleň</li>
            <li>Budovy – strecha, voda, energia, vykurovanie</li>
            <li>Iné stavby – oplotenie, chodníky, parkoviská</li>
            <li>Zamýšľané B&G opatrenia</li>
          </ul>
          <p className="mt-2 text-xs">
            Môžete pridať viacero pozemkov a budov. Dáta sa automaticky ukladajú, takže
            môžete kedykoľvek prerušiť a pokračovať neskôr.
          </p>
        </div>
      </div>
    </div>
  );
}
