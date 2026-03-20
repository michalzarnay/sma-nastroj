import { Leaf } from 'lucide-react';

interface HeaderProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export function Header({ progress, currentStep, totalSteps }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D7D46] rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 leading-tight">SMA Nástroj</h1>
              <p className="text-[10px] text-gray-500">Hodnotenie adaptačných opatrení</p>
            </div>
          </div>
          <span className="text-xs text-gray-500">
            Krok {currentStep} z {totalSteps}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-[#2D7D46] h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
      </div>
    </header>
  );
}
