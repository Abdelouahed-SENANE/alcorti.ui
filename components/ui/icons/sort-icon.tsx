"use client";
import React from "react";

export type SortDirection = "default" | "asc" | "desc";

interface SortIconProps {
  size?: number;
  strokeWidth?: number;
  defaultColor?: string;
  activeColor?: string;
  className?: string;
  direction?: SortDirection;
}

const SortIcon: React.FC<SortIconProps> = ({
  size = 18,
  strokeWidth = 2,
  defaultColor = "color-mix(in srgb, var(--card-foreground), transparent 60%)",
  activeColor = "var(--primary)",
  className = "",
  direction = "default",
}) => {
  const upColor = direction === "asc" ? activeColor : defaultColor;
  const downColor = direction === "desc" ? activeColor : defaultColor;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: "inline-block" }}
      aria-label={`Sort ${direction}`}
    >
      {/* Down arrow (left) — active when desc */}
      <path
        d="m3 16 4 4 4-4"
        stroke={downColor}
        style={{ transition: "stroke 0.2s ease" }}
      />
      <path
        d="M7 20V4"
        stroke={downColor}
        style={{ transition: "stroke 0.2s ease" }}
      />

      {/* Up arrow (right) — active when asc */}
      <path
        d="m21 8-4-4-4 4"
        stroke={upColor}
        style={{ transition: "stroke 0.2s ease" }}
      />
      <path
        d="M17 4v16"
        stroke={upColor}
        style={{ transition: "stroke 0.2s ease" }}
      />
    </svg>
  );
};

export default SortIcon;
