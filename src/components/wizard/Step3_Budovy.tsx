import { useState } from 'react';
import { Home } from 'lucide-react';
import { Budova } from '../../types/areal';
import { EntityTabBar } from '../ui/EntityTabBar';
import { BudovaForm } from './shared/BudovaForm';

interface Step3Props {
  budovy: Budova[];
  addBudova: () => void;
  updateBudova: (index: number, data: Partial<Budova>) => void;
  removeBudova: (index: number) => void;
}

export function Step3_Budovy({ budovy, addBudova, updateBudova, removeBudova }: Step3Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleRemove = (index: number) => {
    removeBudova(index);
    if (activeIndex >= budovy.length - 1 && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleAdd = () => {
    addBudova();
    setActiveIndex(budovy.length);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 bg-[#2196F3]/10 rounded-lg flex items-center justify-center">
          <Home className="w-5 h-5 text-[#2196F3]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Budovy</h2>
          <p className="text-xs text-gray-500">
            Zadajte údaje pre každú budovu v areáli – strecha, voda, vykurovanie, energia.
          </p>
        </div>
      </div>

      <EntityTabBar
        items={budovy.map((b, i) => ({
          id: b.id,
          label: b.nazov || `Budova ${i + 1}`,
        }))}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onAdd={handleAdd}
        onRemove={handleRemove}
        addLabel="Pridať budovu"
      />

      {budovy[activeIndex] && (
        <BudovaForm
          budova={budovy[activeIndex]}
          onChange={(data) => updateBudova(activeIndex, data)}
        />
      )}
    </div>
  );
}
