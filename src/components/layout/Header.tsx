import { Leaf } from 'lucide-react';
import { ReactNode } from 'react';
import { WIZARD_STEPS } from '../../types/wizard';

interface HeaderProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
  visitedSteps: number[];
  onGoTo: (step: number) => void;
  extraActions?: ReactNode;
}

export function Header({ currentStep, totalSteps, visitedSteps, onGoTo, extraActions }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 space-y-2">
        {/* Top row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2D7D46] rounded-lg flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-800 leading-tight">SMA Nástroj</h1>
              <p className="text-[10px] text-gray-500 hidden sm:block">Hodnotenie adaptačných opatrení</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {extraActions}
          </div>
        </div>

        {/* Step bar */}
        <div className="flex items-center gap-1">
          {WIZARD_STEPS.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isVisited = visitedSteps.includes(step.id);
            const isClickable = isVisited && !isActive;
            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <button
                  onClick={() => isClickable && onGoTo(step.id)}
                  disabled={!isClickable}
                  title={step.nazov}
                  className={`flex items-center gap-1 w-full rounded-lg px-1.5 py-1 text-left transition-colors min-w-0
                    ${isActive
                      ? 'bg-[#2D7D46] text-white cursor-default'
                      : isVisited
                        ? 'bg-[#2D7D46]/10 text-[#2D7D46] hover:bg-[#2D7D46]/20 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 cursor-default'
                    }`}
                >
                  <span className="text-xs font-bold flex-shrink-0 w-4 text-center">{step.id}</span>
                  <span className="text-[10px] font-medium truncate hidden sm:block">{step.nazov}</span>
                </button>
                {idx < WIZARD_STEPS.length - 1 && (
                  <div className="w-1 flex-shrink-0 h-px bg-gray-200 mx-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-[#2D7D46] h-1 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max((currentStep / totalSteps) * 100, 5)}%` }}
          />
        </div>
      </div>
    </header>
  );
}
