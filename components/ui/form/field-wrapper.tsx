"use client";
import * as React from "react";
import { type FieldError } from "react-hook-form";

import { cn } from "@/lib/utils";
import { InputError } from "./input-error";

type FieldWrapperProps = {
  label?: string;
  className?: string;
  children: React.ReactNode;
  error?: FieldError | string;
};

export type FieldWrapperPassThroughProps = Omit<
  FieldWrapperProps,
  "className" | "children"
>;

export const FieldWrapper = (props: FieldWrapperProps) => {
  const { error, children, className } = props;
  return (
    <div className="flex flex-col">
      <div className={cn(className)}>{children}</div>
      <InputError
        errorMessage={typeof error == "string" ? error : error?.message}
      />
    </div>
  );
};
