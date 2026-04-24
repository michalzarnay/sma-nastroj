import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (step: number) => void;
  visitedSteps: number[];
}

export function StepNavigation({ currentStep, totalSteps, onNext, onPrev, onGoTo }: StepNavigationProps) {
  return (
    <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Späť
      </button>

      {currentStep > 1 && (
        <button
          type="button"
          onClick={() => onGoTo(1)}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Na začiatok
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        className="flex items-center gap-1 px-6 py-2 text-sm font-medium text-white bg-[#2D7D46] rounded-lg hover:bg-[#2D7D46]/90 transition-colors"
      >
        {currentStep === totalSteps ? 'Zobraziť výsledky' : 'Ďalej'}
        {currentStep < totalSteps && <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
}
