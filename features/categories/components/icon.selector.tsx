"use client";
import { Input } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { icons, X } from "lucide-react";
import {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

// Curated list of icons relevant to shipping, transportation, and logistics
const SHIPPING_ICON_NAMES = [
  // ──────────── Packaging & Boxes ────────────
  "Package",
  "Package2",
  "PackageCheck",
  "PackageMinus",
  "PackageOpen",
  "PackagePlus",
  "PackageSearch",
  "PackageX",
  "Box",
  "Boxes",
  "Container",
  "Archive",
  "ArchiveRestore",
  "ArchiveX",

  // ──────────── Vehicles & Transport ────────────
  "Truck",
  "Caravan",
  "Bus",
  "Car",
  "CarFront",
  "CarTaxiFront",
  "Bike",
  "Ship",
  "ShipWheel",
  "Anchor",
  "Sailboat",
  "Plane",
  "PlaneTakeoff",
  "PlaneLanding",
  "Train",
  "TrainFront",
  "TrainTrack",
  "TramFront",
  "Forklift",
  "Tractor",
  "Ambulance",

  // ──────────── Logistics & Warehouse ────────────
  "Warehouse",
  "Factory",
  "Building",
  "Building2",
  "Store",
  "ShoppingBag",
  "ShoppingCart",

  // ──────────── Routes & Navigation ────────────
  "Map",
  "MapPin",
  "MapPinned",
  "Route",
  "Navigation",
  "Navigation2",
  "Compass",
  "Locate",
  "LocateFixed",
  "Milestone",
  "Signpost",
  "Flag",

  // ──────────── Shipping Actions ────────────
  "Send",
  "SendHorizontal",
  "Import",
  "Download",
  "Upload",
  "ArrowDownToLine",
  "ArrowUpFromLine",
  "MoveRight",
  "MoveLeft",
  "RefreshCw",

  // ──────────── Status & Tracking ────────────
  "Clock",
  "Timer",
  "CalendarClock",
  "CalendarCheck",
  "CheckCircle",
  "CheckCircle2",
  "CircleCheck",
  "CircleX",
  "AlertTriangle",
  "AlertCircle",
  "ShieldCheck",
  "Shield",
  "ShieldAlert",
  "Lock",
  "Unlock",

  // ──────────── Weight & Measurement ────────────
  "Scale",
  "Scale3d",
  "Ruler",
  "Weight",

  // ──────────── Documents & Labels ────────────
  "FileText",
  "FileCheck",
  "ClipboardList",
  "ClipboardCheck",
  "Receipt",
  "ReceiptText",
  "Tag",
  "Tags",
  "Barcode",
  "QrCode",
  "ScanBarcode",
  "ScanLine",

  // ──────────── Payment & Business ────────────
  "DollarSign",
  "CreditCard",
  "Wallet",
  "Banknote",
  "Coins",
  "Briefcase",

  // ──────────── People ────────────
  "User",
  "Users",
  "UserCheck",
  "Contact",
  "Headset",

  // ──────────── Common Shipped Items ────────────
  "Tv",
  "Tv2",
  "Monitor",
  "Laptop",
  "Smartphone",
  "Tablet",
  "Refrigerator",
  "WashingMachine",
  "Microwave",
  "Sofa",
  "Armchair",
  "Bed",
  "Lamp",
  "Shirt",
  "Gift",
  "Wine",
  "Utensils",
  "Book",
  "Camera",
  "Printer",

  // ──────────── Industrial / Fragile ────────────
  "Wrench",
  "Hammer",
  "Cog",
  "Drill",
  "HardHat",
  "Flame",
  "Snowflake",
  "Droplet",
  "Zap",

  // ──────────── Communication ────────────
  "Phone",
  "Mail",
  "MessageSquare",
  "Bell",
] as const;

// Filter to only icons that actually exist in the installed Lucide version
const allIconNames = SHIPPING_ICON_NAMES.filter(
  (name) => name in icons,
) as (keyof typeof icons)[];

const indexedIcons = allIconNames.map((name) => ({
  name,
  lower: name.toLowerCase(),
}));

const defaultIcons = allIconNames.slice(0, 40);

// =======================================================================
// IconRow - uses onMouseDown with preventDefault to avoid blur race
// =======================================================================
const IconRow = memo(
  ({
    name,
    isHighlighted,
    onSelect,
    onHover,
  }: {
    name: keyof typeof icons;
    isHighlighted: boolean;
    onSelect: (name: string) => void;
    onHover: () => void;
  }) => {
    const Icon = icons[name];
    return (
      <div
        role="option"
        aria-selected={isHighlighted}
        onMouseDown={(e) => {
          e.preventDefault();
          onSelect(name);
        }}
        onMouseEnter={onHover}
        className={`flex cursor-pointer items-center gap-2 rounded-sm px-4 py-1 text-sm ${
          isHighlighted
            ? "bg-primary/20 text-primary"
            : "hover:bg-primary/10 hover:text-primary"
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="truncate">{name}</span>
      </div>
    );
  },
);
IconRow.displayName = "IconRow";

// =======================================================================
// Main component
// =======================================================================
export interface IconSelectorProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
}

export const IconSelector = ({
  value,
  onChange,
  label,
  error,
  onBlur,
  className,
  placeholder = "Search icons...",
}: IconSelectorProps) => {
  const [searchValue, setSearchValue] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setSearchValue(value || "");
    }
  }, [value, open]);

  useEffect(() => {
    return () => {
      setOpen(false);
    };
  }, []);

  const deferredSearch = useDeferredValue(searchValue);
  const isPending = searchValue !== deferredSearch;

  const filteredIcons = useMemo(() => {
    const search = deferredSearch.trim().toLowerCase();
    if (!search) return defaultIcons;

    const results: (keyof typeof icons)[] = [];
    const LIMIT = 30;
    for (let i = 0; i < indexedIcons.length && results.length < LIMIT; i++) {
      if (indexedIcons[i].lower.includes(search)) {
        results.push(indexedIcons[i].name);
      }
    }
    return results;
  }, [deferredSearch]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [deferredSearch]);

  const handleSelect = useCallback(
    (name: string) => {
      onChange(name);
      setSearchValue(name);
      setOpen(false);
      inputRef.current?.blur();
    },
    [onChange],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setOpen(true);

    if (newValue === "" && value) {
      onChange("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === "Backspace" &&
      value &&
      searchValue === value &&
      inputRef.current?.selectionStart === value.length
    ) {
      e.preventDefault();
      onChange("");
      setSearchValue("");
      setOpen(true);
      return;
    }

    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, filteredIcons.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredIcons[highlightedIndex]) {
          handleSelect(filteredIcons[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    onChange("");
    setSearchValue("");
    setOpen(true);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onBlur]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const highlighted = listRef.current.querySelector(
      `[data-index="${highlightedIndex}"]`,
    );
    highlighted?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

  const showClearButton = searchValue.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className ?? ""}`}>
      <div className="relative w-full">
        <Input
          ref={inputRef}
          type="text"
          label={label}
          error={error}
          value={searchValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="icon-listbox"
          aria-activedescendant={
            open ? `icon-option-${highlightedIndex}` : undefined
          }
        />
      </div>
      {open && (
        <div
          ref={listRef}
          id="icon-listbox"
          role="listbox"
          className="absolute left-0 right-0 z-50 mt-1 min-w-[300px] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="max-h-60 overflow-y-auto p-1">
            {isPending ? (
              <div className="flex items-center justify-center gap-2 py-6  text-primary">
                <Spinner size="xs" />
                <span className="text-xs">{t("global.loading")}</span>
              </div>
            ) : filteredIcons.length > 0 ? (
              filteredIcons.map((name, index) => (
                <div key={name} id={`icon-option-${index}`} data-index={index}>
                  <IconRow
                    name={name}
                    isHighlighted={index === highlightedIndex}
                    onSelect={handleSelect}
                    onHover={() => setHighlightedIndex(index)}
                  />
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No icons found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};