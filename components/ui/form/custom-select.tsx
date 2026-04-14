"use client";
// src/components/CustomSelect.tsx
import React, { useRef, useState, useEffect } from "react";

type Option = { label: string; value: string | number };

type Props = {
  options: Option[];
  placeholder?: string;
  className?: string;
};

export const CustomSelect: React.FC<Props> = ({
  options,
  placeholder = "Select...",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside (basic UX)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={rootRef} className={`relative w-72 ${className ?? ""}`}>
      {/* Trigger (looks like an input) */}
      <div
        role="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <span className="text-gray-500">{placeholder}</span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-2 max-h-56 w-full overflow-auto rounded-lg border bg-white p-1 shadow-lg"
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected="false"
              className="cursor-default select-none rounded-md px-3 py-2 text-sm hover:bg-gray-100"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
