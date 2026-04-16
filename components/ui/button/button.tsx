"use client";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";
import i18n from "@/config/i18n";

const buttonVariants = cva(
  "inline-flex items-center shrink-0 px-2 py-1.5 text-sm font-semibold  flex items-center justify-center whitespace-nowrap rounded-md space-x-1  text-xs h-8  transition-all disabled:opacity-50 disabled:pointer-events-none [&_svg]:pointer-events-none cursor-pointer [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px] aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger",
  {
    variants: {
      variant: {
        default: " text-primary-foreground hover:bg-primary bg-primary",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-card  hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-border dark:hover:bg-border/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        plain: "bg-transparent text-foreground",
      },
      size: {
        default: "px-4 py-1.5 has-[>svg]:px-3",
        sm: " rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  isLoading,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const isRTL = i18n.language === "ar";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      aria-disabled={isLoading}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading && (
            <Spinner
              size="xs"
              className={isRTL ? "ml-1" : "mr-1"}
              variant="light"
            />
          )}
          {children}
        </>
      )}
    </Comp>
  );
}

export { Button, buttonVariants };
