import { useCallback, useState } from "react";

interface UseStepperProps {
  initialStep?: number;
  totalSteps: number;
}

export const useStepper = ({
  initialStep = 1,
  totalSteps,
}: UseStepperProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const next = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [totalSteps]);

  const back = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goTo = useCallback(
    (step: number) => {
      setCurrentStep(Math.min(Math.max(step, 1), totalSteps));
    },
    [totalSteps],
  );
  const reset = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);
  return {
    currentStep,
    next,
    back,
    goTo,
    reset,
    isFirst: currentStep === 1,
    isLast: currentStep === totalSteps,
    progress: (currentStep / totalSteps) * 100,
  };
};

export type StepperHook = ReturnType<typeof useStepper>;
