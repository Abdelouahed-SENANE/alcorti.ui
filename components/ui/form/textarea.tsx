"use client";
import * as React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';

import { FieldWrapper, FieldWrapperPassThroughProps } from './field-wrapper';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldWrapperPassThroughProps & {
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
  };

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, registration, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error}>
        <textarea
          className={cn(
            'flex min-h-20 w-full text-card-foreground placeholder:text-foreground/50 rounded-sm border border-border bg-transparent px-3 py-2 text-sm  focus-visible:outline-none focus-visible:ring-[3px] focus:border-primary outline-none focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...registration}
          {...props}
        />
      </FieldWrapper>
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };