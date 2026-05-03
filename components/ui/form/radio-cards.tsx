"use client";
// components/ui/radio-card-group.tsx
import { cn } from "@/lib/utils";
import * as React from "react";
import { FieldError } from "react-hook-form";
import { FieldWrapper } from "./field-wrapper";

export type RadioCardOption = {
  value: string;
  title: string;
  icon?: React.ReactNode;
};

type RadioCardsProps = {
  options: RadioCardOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  error?: FieldError | string;
  disabled?: boolean;
};

export function RadioCards({
  options,
  value,
  defaultValue,
  onChange,
  className,
  error,
  disabled,
}: RadioCardsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);

  const selected = value ?? internalValue;

  const handleSelect = (val: string) => {
    if (!value) setInternalValue(val);
    onChange?.(val);
  };

  return (
    <FieldWrapper error={error}>
      <div className={cn("flex gap-2 items-center", className)}>
        {options.map((option) => {
          const isSelected = selected === option.value;

          return (
            <button
              disabled={disabled}
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "relative flex disabled:opacity-60 disabled:cursor-not-allowed  w-full cursor-pointer select-none gap-3 rounded-md border p-2 text-left transition-all",
                "bg-background/20 border-input/50",
                "hover:bg-background/30",
                isSelected &&
                  "border-primary bg-primary/5",
              )}
            >
              <div>
                <p
                  className={cn(
                    "text-sm flex items-center gap-2 font-semibold tracking-wide text-card-foreground",
                    isSelected && "text-primary  transition-all duration-300",
                  )}
                >
                  <span className="size-5">{option.icon}</span>
                  {option.title}
                </p>
              </div>

              <span
                className={cn(
                  "absolute ltr:right-2 rtl:left-2 top-2 flex h-4 w-4 items-center justify-center rounded-full border border-input",
                  isSelected && "border-primary bg-primary",
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    isSelected ? "bg-white" : "bg-transparent",
                  )}
                />
              </span>
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
