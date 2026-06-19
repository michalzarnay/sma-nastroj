import { useState } from 'react';
import { Trees } from 'lucide-react';
import { Pozemok } from '../../types/areal';
import { EntityTabBar } from '../ui/EntityTabBar';
import { PozemokForm } from './shared/PozemokForm';

interface Step2Props {
  pozemky: Pozemok[];
  addPozemok: () => void;
  updatePozemok: (index: number, data: Partial<Pozemok>) => void;
  removePozemok: (index: number) => void;
}

export function Step2_Pozemky({ pozemky, addPozemok, updatePozemok, removePozemok }: Step2Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRemove = (index: number) => {
    removePozemok(index);
    if (activeIndex >= pozemky.length - 1 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleAdd = () => {
    addPozemok();
    setActiveIndex(pozemky.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-[#2D7D46]/10 rounded-lg flex items-center justify-center">
          <Trees className="w-5 h-5 text-[#2D7D46]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Pozemok</h2>
          <p className="text-xs text-gray-500">
            Posudzujeme iba nezastavanú časť pozemku. Zadajte údaje pre každú parcelu zvlášť.
          </p>
        </div>
      </div>

      {/* Nápoveda k rozhodnutiu, kam zaradiť parcelu (pozri issue #37). */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 space-y-1">
        <p><strong>Čo patrí sem (Pozemky):</strong> nezastavané parcely — trávnaté plochy, parkoviská, chodníky, dvory, záhrady.</p>
        <p><strong>Čo patrí do Budov:</strong> parcely, na ktorých stojí budova — zadajte ich v kroku Budovy (pole Parcela).</p>
        <p><strong>Parcela len so stavbou</strong> patrí len medzi Budovy — nezadávajte ju medzi Pozemky.</p>
        <p><strong>Parcela s budovou aj nezastavaným pozemkom:</strong> zaraďte ju podľa toho, čo na nej prevažuje (dominantné využitie) — buď medzi Budovy, alebo medzi Pozemky.</p>
        <p><strong>Príklad:</strong> Škola má parcelu 100/1 (budova) a 100/2 (školský dvor). Do Pozemkov zadajte len 100/2.
          Ak je dvorová parcela rozdelená plotom na dve časti s rôznym povrchom, pridajte každú ako samostatnú kartu.</p>
      </div>

      <EntityTabBar
        items={pozemky.map((p, i) => ({
          id: p.id,
          label: p.aktualneVyuzitie || p.parcela || `Parcela ${i + 1}`,
        }))}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onAdd={handleAdd}
        onRemove={handleRemove}
        addLabel="Pridať parcelu"
      />

      {pozemky[activeIndex] && (
        <PozemokForm
          pozemok={pozemky[activeIndex]}
          onChange={(data) => updatePozemok(activeIndex, data)}
        />
      )}
    </div>
  );
}
