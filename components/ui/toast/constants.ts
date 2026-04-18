import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import React from "react";

export const alertStyles = {
  info: {
    icon: React.createElement(Info, {
      className: "text-white size-5",
      "aria-hidden": true,
    }),
    text: "text-white",
    bg: "bg-info",
  },
  success: {
    icon: React.createElement(CircleCheck, {
      className: "text-white size-5",
      "aria-hidden": true,
    }),
    text: "text-white",
    bg: "bg-success",
  },
  error: {
    icon: React.createElement(CircleAlert, {
      className: "text-white size-5",
      "aria-hidden": true,
    }),
    text: "text-white",
    bg: "bg-destructive",
  },
  warning: {
    icon: React.createElement(CircleAlert, {
      className: "text-white size-5",
      "aria-hidden": true,
    }),
    text: "text-white",
    bg: "bg-warning",
  },
} as const;
