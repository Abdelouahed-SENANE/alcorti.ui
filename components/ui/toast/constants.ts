import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import React from "react";

export const alertStyles = {
  info: {
    icon: React.createElement(Info, {
      className: "text-blue-500 size-5",
      "aria-hidden": true,
    }),
    text: "text-blue-500",
    bg: "bg-blue-500",
  },
  success: {
    icon: React.createElement(CircleCheck, {
      className: "text-green-500 size-5",
      "aria-hidden": true,
    }),
    text: "text-green-500",
    bg: "bg-green-500",
  },
  error: {
    icon: React.createElement(CircleX, {
      className: "text-red-500 size-5",
      "aria-hidden": true,
    }),
    text: "text-red-500",
    bg: "bg-red-500",
  },
  warning: {
    icon: React.createElement(CircleAlert, {
      className: "text-yellow-500 size-5",
      "aria-hidden": true,
    }),
    text: "text-yellow-500",
    bg: "bg-yellow-500",
  },
} as const;
