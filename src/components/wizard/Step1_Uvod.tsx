import { Building2, MapPin, Camera, ClipboardList } from 'lucide-react';
import { Areal, MediaItem } from '../../types/areal';
import { TextInput } from '../ui/TextInput';
import { NumberInput } from '../ui/NumberInput';
import { MediaUpload } from '../media/MediaUpload';

interface Step1Props {
  areal: Areal;
  updateAreal: (data: Partial<Areal>) => void;
  addMedia: (item: MediaItem) => void;
  updateMedia: (id: string, data: Partial<MediaItem>) => void;
  removeMedia: (id: string) => void;
}

export function Step1_Uvod({ areal, updateAreal, addMedia, updateMedia, removeMedia }: Step1Props) {
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
          />
          <NumberInput
            label="Aktuálna obsadenosť"
            value={areal.aktualnaObsadenost}
            onChange={(v) => updateAreal({ aktualnaObsadenost: v })}
            unit="%"
            max={100}
          />
          <NumberInput
            label="Počet zamestnancov"
            value={areal.pocetZamestnancov}
            onChange={(v) => updateAreal({ pocetZamestnancov: v })}
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
        />
      </div>

      {/* Závery */}
      <div className="space-y-4 pt-2 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-800">Závery hodnotenia</h3>
        <p className="text-xs text-gray-500">Tieto polia sa vypĺňajú na záver procesu mapovania (krok 6 a späť).</p>
        <TextInput
          label="Záver BG (modro-zelená infraštruktúra)"
          value={areal.zaverBG}
          onChange={(v) => updateAreal({ zaverBG: v })}
          placeholder="Záverečné zhrnutie pre oblasť MZI…"
          multiline
        />
        <TextInput
          label="Záver OZE (obnoviteľné zdroje energie)"
          value={areal.zaverOZE}
          onChange={(v) => updateAreal({ zaverOZE: v })}
          placeholder="Záverečné zhrnutie pre oblasť OZE…"
          multiline
        />
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
            Dáta sa automaticky ukladajú v prehliadači. Pre zdieľanie alebo zálohu použite
            funkciu <strong>Relácie → Uložiť</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
