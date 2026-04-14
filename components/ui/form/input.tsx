"use client";
import { cn } from "@/lib/utils";
import * as React from "react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps & {
    className?: string;
    registration?: Partial<UseFormRegisterReturn>;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, registration, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error}>
        <div className="relative w-full">
          <input
            ref={ref}
            className={cn(
              "peer flex h-9 w-full  border border-border  rounded-sm  bg-transparent px-2 py-1 text-sm text-card-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-card-foreground/50 focus-visible:outline-none focus-visible:ring-[3px] focus:border-primary outline-none focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-error/80 ring-3 ring-error/40",
              className
            )}
            type={type}
            placeholder=" "
            {...registration}
            {...props}
          />
          <label className="z-2 text-foreground pointer-events-none rounded-full absolute left-3 inset-y-0 h-fit flex items-center select-none transition-all text-sm peer-focus:text-xs peer-placeholder-shown:text-sm px-1 peer-focus:px-1 peer-placeholder-shown:px-0  peer-focus:bg-card peer-placeholder-shown:bg-card duration-200 t m-0 peer-focus:m-0 peer-placeholder-shown:m-auto -translate-y-1/2 peer-focus:-translate-y-1/2 peer-placeholder-shown:translate-y-0">
            {label}
          </label>
        </div>
      </FieldWrapper>
    );
  }
);
Input.displayName = "Input";

export { Input };
