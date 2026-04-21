"use client";
import { cn } from "@/lib/utils";
import * as React from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export type NumericInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> &
  FieldWrapperPassThroughProps & {
    className?: string;
    registration?: Partial<UseFormRegisterReturn>;
    /** Allow decimal point, default true */
    allowDecimal?: boolean;
    isRequired?: boolean;
  };

/** Keys that are always allowed (navigation, editing, etc.) */
const ALLOWED_KEYS = new Set([
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Tab",
  "Home",
  "End",
  "Enter",
]);

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      className,
      label,
      error,
      registration,
      allowDecimal = true,
      onKeyDown,
      isRequired,
      ...props
    },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow control combos (Ctrl+A, Ctrl+C, etc.)
      if (e.ctrlKey || e.metaKey) {
        onKeyDown?.(e);
        return;
      }

      // Allow navigation & editing keys
      if (ALLOWED_KEYS.has(e.key)) {
        onKeyDown?.(e);
        return;
      }

      // Allow digits
      if (/^[0-9]$/.test(e.key)) {
        const input = e.target as HTMLInputElement;
        const val = input.value;
        const selectionStart = input.selectionStart ?? 0;
        const selectionEnd = input.selectionEnd ?? 0;

        if (allowDecimal && val.includes(".")) {
          const dotIndex = val.indexOf(".");
          // Only restrict if we are typing after the dot and adding a digit (not replacing)
          if (selectionStart > dotIndex) {
            const decimalPart = val.slice(dotIndex + 1);
            if (decimalPart.length >= 10 && selectionStart === selectionEnd) {
              e.preventDefault();
              return;
            }
          }
        }

        onKeyDown?.(e);
        return;
      }

      // Allow single decimal point
      if (allowDecimal && e.key === ".") {
        const val = (e.target as HTMLInputElement).value;
        if (!val.includes(".")) {
          onKeyDown?.(e);
          return;
        }
      }

      // Allow minus at position 0
      if (e.key === "-") {
        const input = e.target as HTMLInputElement;
        if (input.selectionStart === 0 && !input.value.includes("-")) {
          onKeyDown?.(e);
          return;
        }
      }

      // Block everything else
      e.preventDefault();
    };

    return (
      <FieldWrapper label={label} error={error}>
        <div className="relative w-full">
          <input
            ref={ref}
            inputMode="decimal"
            className={cn(
              "peer flex h-9 w-full border border-border rounded-sm bg-transparent px-2 py-1 text-sm text-card-foreground transition-colors",
              "placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-[3px] focus:border-primary outline-none focus-visible:ring-primary/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              error && "border-error/80 ring-3 ring-error/40",
              className,
            )}
            type="text"
            step={allowDecimal ? "0.01" : "1"}
            placeholder=" "
            onKeyDown={handleKeyDown}
            {...registration}
            {...props}
          />
          <label className="z-2 text-foreground pointer-events-none rounded-full absolute l ltr:left-2 rtl:right-2 inset-y-0 h-fit flex items-center select-none transition-all text-sm peer-focus:text-xs peer-placeholder-shown:text-sm px-1 peer-focus:px-1 peer-placeholder-shown:px-0 peer-focus:bg-card peer-placeholder-shown:bg-card duration-200 t m-0 peer-focus:m-0 peer-placeholder-shown:m-auto -translate-y-1/2 peer-focus:-translate-y-1/2 peer-placeholder-shown:translate-y-0">
            {label}
            {isRequired && <span className="mx-0.5 text-destructive">*</span>}
          </label>
        </div>
      </FieldWrapper>
    );
  },
);
NumericInput.displayName = "NumericInput";

export { NumericInput };
