import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import React from "react";

export const alertStyles = {
  info: {
    icon: React.createElement(Info, {
      className: "text-info size-5",
      "aria-hidden": true,
    }),
    text: "text-foreground-card",
    bg: "bg-card",
    border: "border-border",
  },
  success: {
    icon: React.createElement(CircleCheck, {
      className: "text-success size-5",
      "aria-hidden": true,
    }),
    text: "text-foreground",
    bg: "bg-card",
    border: "border-border",
  },
  error: {
    icon: React.createElement(CircleAlert, {
      className: "text-destructive size-5",
      "aria-hidden": true,
    }),
    text: "text-destructive",
    bg: "bg-card",
    border: "border-border",
  },
  warning: {
    icon: React.createElement(CircleAlert, {
      className: "text-warning size-5",
      "aria-hidden": true,
    }),
    text: "text-warning",
    bg: "bg-warning/5",
    border: "border-warning/50",
  },
} as const;
