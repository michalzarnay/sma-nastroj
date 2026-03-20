import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WIZARD_STEPS } from '../../types/wizard';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (step: number) => void;
  visitedSteps: number[];
}

export function StepNavigation({
  currentStep, totalSteps, onNext, onPrev, onGoTo, visitedSteps,
}: StepNavigationProps) {
  return (
    <div className="mt-6 space-y-4">
      {/* Step indicators */}
      <div className="flex justify-center gap-1">
        {WIZARD_STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isVisited = visitedSteps.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => isVisited ? onGoTo(step.id) : undefined}
              disabled={!isVisited}
              className={`w-8 h-8 rounded-full text-xs font-medium transition-all
                ${isActive
                  ? 'bg-[#2D7D46] text-white'
                  : isVisited
                    ? 'bg-[#2D7D46]/10 text-[#2D7D46] hover:bg-[#2D7D46]/20 cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-default'
                }`}
              title={step.nazov}
            >
              {step.id}
            </button>
          );
        })}
      </div>

      {/* Nav buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentStep === 1}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Späť
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-1 px-6 py-2 text-sm font-medium text-white bg-[#2D7D46] rounded-lg hover:bg-[#2D7D46]/90 transition-colors"
        >
          {currentStep === totalSteps ? 'Zobraziť výsledky' : 'Ďalej'}
          {currentStep < totalSteps && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
