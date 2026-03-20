import { useState, useCallback } from 'react';
import { WIZARD_STEPS } from '../types/wizard';
import { useLocalStorage } from './useLocalStorage';

export function useWizard() {
  const [currentStep, setCurrentStep] = useLocalStorage('sma-wizard-step', 1);
  const [visitedSteps, setVisitedSteps] = useLocalStorage<number[]>('sma-wizard-visited', [1]);
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = WIZARD_STEPS.length;

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
      setVisitedSteps((prev) => {
        if (!prev.includes(step)) return [...prev, step];
        return prev;
      });
    }
  }, [totalSteps, setCurrentStep, setVisitedSteps]);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      goToStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentStep, totalSteps, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return {
    currentStep,
    totalSteps,
    progress,
    isComplete,
    visitedSteps,
    goToStep,
    nextStep,
    prevStep,
    steps: WIZARD_STEPS,
  };
}
