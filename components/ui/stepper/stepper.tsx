"use client";

import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";
import * as React from "react";

interface StepperContextValue {
  currentStep: number;
}

const StepperContext = React.createContext<StepperContextValue | null>(null);

function useStepperContext() {
  const context = React.useContext(StepperContext);
  if (!context) {
    throw new Error(
      "Stepper sub-components must be used within a Stepper component",
    );
  }
  return context;
}

export interface StepperProps {
  currentStep: number;
  children: React.ReactNode;
  className?: string;
}

export function Stepper({ currentStep, children, className }: StepperProps) {
  return (
    <StepperContext.Provider value={{ currentStep }}>
      <div className={cn("w-full space-y-6", className)}>{children}</div>
    </StepperContext.Provider>
  );
}

// --- Header ---

export function StepperHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex justify-center items-center gap-4 md:gap-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- Item ---

export interface StepperItemProps {
  step: number;
  title: string;
  isLast?: boolean;
  className?: string;
}

export function StepperItem({
  step,
  title,
  isLast,
  className,
}: StepperItemProps) {
  const { currentStep } = useStepperContext();
  const isActive = currentStep === step;
  const isCompleted = currentStep > step;

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-center px-1 relative z-10",
        className,
      )}
    >
      <div
        className={cn(
          "size-7 rounded-full flex items-center justify-center transition-all duration-300 border-2 shrink-0",
          isActive && "bg-primary border-primary text-primary-foreground",
          isCompleted && "bg-primary border-primary text-primary-foreground",
          !isActive &&
            !isCompleted &&
            "bg-background border-border text-foreground",
        )}
      >
        {isCompleted ? (
          <Check className="size-4" />
        ) : (
          <span className="text-xs font-bold">{step}</span>
        )}
      </div>
      <div className="flex gap-5  relative items-center">
        <span
          className={cn(
            "text-sm font-bold transition-colors whitespace-nowrap",
            isActive ? "text-primary" : "text-foreground",
          )}
        >
          {title}
        </span>
        {!isLast && (isActive || isCompleted) && (
          <ChevronRight className="size-4 text-primary rtl:rotate-180 ltr:rotate-0" />
        )}
      </div>
    </div>
  );
}

// --- Content ---

export function StepperContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(className)}>{children}</div>;
}

// --- Step ---

export function StepperStep({
  step,
  children,
}: {
  step: number;
  children: React.ReactNode;
}) {
  const { currentStep } = useStepperContext();
  if (currentStep !== step) return null;
  return <div>{children}</div>;
}

// Attach sub-components to Stepper for compound usage
Stepper.Header = StepperHeader;
Stepper.Item = StepperItem;
Stepper.Content = StepperContent;
Stepper.Step = StepperStep;
