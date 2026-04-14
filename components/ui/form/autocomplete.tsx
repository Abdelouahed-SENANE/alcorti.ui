"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command/command";

import { ScrollArea } from "@/components/ui/scroll-area";
import i18n from "@/config/i18n";
import { cn, LabelResolver } from "@/lib/utils";
import { BaseOption, Lang } from "@/types/api";
import { Check, ChevronDown, X } from "lucide-react";
import { Spinner } from "../spinner";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export interface AutocompleteProps<T extends BaseOption>
  extends FieldWrapperPassThroughProps {
  value?: string;
  initialOption?: T;
  onChange: (value?: string, option?: T) => void;

  items: T[];
  term: string;
  setTerm: (val: string) => void;

  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;

  renderOption?: (o: T) => React.ReactNode;
  renderValue?: (o: T) => React.ReactNode;
  renderFooter?: () => React.ReactNode;
  disabled?: boolean;
}

const BATCH_SIZE = 20;

/**
 * Stabilize a callback that may be a new reference every render.
 * The returned function has a stable identity but always calls
 * the latest version of `fn`.
 */
function useStableCallback<T extends (...args: any[]) => any>(fn: T): T {
  const ref = React.useRef(fn);
  React.useLayoutEffect(() => {
    ref.current = fn;
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(((...args: any[]) => ref.current(...args)) as T, []);
}

function AutocompleteComponent<T extends BaseOption>({
  label,
  error,
  value,
  onChange,
  initialOption,
  items,
  term,
  setTerm,
  placeholder,
  searchPlaceholder,
  emptyMessage,
  isLoading,
  renderOption,
  renderValue,
  renderFooter,
  disabled,
}: AutocompleteProps<T>) {
  const [open, setOpen] = React.useState(false);
  const lang = i18n.language;

  // ─── Stabilize parent callbacks ───
  // If the parent doesn't memoize onChange / setTerm, every render
  // creates a new function reference which cascades into every
  // useCallback / useMemo that depends on them → infinite loop.
  const stableOnChange = useStableCallback(onChange);
  const stableSetTerm = useStableCallback(setTerm);
  const stableRenderOption = useStableCallback(
    renderOption ?? ((opt: T) => getLabel(opt)),
  );

  // ─── Option cache ───
  const optionCacheRef = React.useRef<Map<string, T>>(new Map());

  React.useEffect(() => {
    if (initialOption?.value != null) {
      optionCacheRef.current.set(initialOption.value, initialOption);
    }
  }, [initialOption]);

  // ─── Stable label resolver ───
  const getLabel = React.useCallback(
    (opt: T) => LabelResolver(opt, lang as Lang),
    [lang],
  );

  // ─── Resolve selected option ───
  // We read `items` via a ref so this memo only reacts to `value` changing.
  // The cache covers the case where the selected item isn't in the
  // current filtered list.
  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  const selectedOption = React.useMemo(() => {
    if (!value) return undefined;

    const fromList = items.find((i) => i.value === value);
    if (fromList) return fromList;

    return optionCacheRef.current.get(value);
  }, [value, items]);

  // ─── Select handler ───
  const handleSelect = React.useCallback(
    (opt: T) => {
      optionCacheRef.current.set(opt.value, opt);
      stableOnChange(opt.value, opt);
      setOpen(false);
    },
    [stableOnChange],
  );

  // ─── Clear handler ───
  const handleClear = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      stableOnChange(undefined, undefined);
    },
    [stableOnChange],
  );

  // ─── Reset search term when popover closes ───
  React.useEffect(() => {
    if (!open) {
      stableSetTerm("");
    }
  }, [open, stableSetTerm]);

  // ─── Display limit for virtual scrolling ───
  const [displayLimit, setDisplayLimit] = React.useState(BATCH_SIZE);
  const deferredTerm = React.useDeferredValue(term);

  React.useEffect(() => {
    setDisplayLimit(BATCH_SIZE);
  }, [deferredTerm]);

  // ─── IntersectionObserver for infinite scroll ───
  const observerRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useRef(() => {
    setDisplayLimit((prev) => prev + BATCH_SIZE);
  });

  React.useEffect(() => {
    if (!open || displayLimit >= items.length) return;

    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreRef.current();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [open, items.length, displayLimit]);

  // ─── Option list ───
  // We derive a simple fingerprint from items so that the memo only
  // recalculates when the actual data changes, not on every new
  // array reference. Joining the first/last value + length is cheap
  // and catches additions, removals, and reorders at the boundaries.
  const itemsFingerprint = `${items.length}|${items[0]?.value ?? ""}|${items[items.length - 1]?.value ?? ""}`;
  const selectedValue = selectedOption?.value;

  const optionList = React.useMemo(() => {
    return itemsRef.current.slice(0, displayLimit).map((opt) => (
      <CommandItem
        key={opt.value}
        value={opt.value}
        onSelect={() => handleSelect(opt)}
        className="cursor-pointer ltr:flex-row rtl:flex-row-reverse"
      >
        <span className="ltr:mr-1 rtl:ml-1">
          <Check
            className={cn(
              "h-4 w-4",
              selectedValue === opt.value ? "opacity-100" : "opacity-0",
            )}
          />
        </span>
        {renderOption ? stableRenderOption(opt) : getLabel(opt)}
      </CommandItem>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsFingerprint, displayLimit, handleSelect, getLabel, selectedValue]);

  // ─── Focus management ───
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  return (
    <FieldWrapper label={label} error={error}>
      <Popover modal={false} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls="autocomplete-list"
            aria-activedescendant={selectedOption?.value}
            data-state={open ? "open" : "closed"}
            disabled={disabled}
            className={cn(
              "peer relative flex items-center justify-between h-9 w-full rounded-sm border border-border bg-transparent px-2 py-1 text-sm",
              disabled
                ? "cursor-not-allowed opacity-50 bg-input/50"
                : "cursor-pointer transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:border-primary focus-visible:ring-primary/50",
              "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/50",
              error && "border-error/80 ring-3 ring-error/40",
            )}
          >
            {selectedOption ? (
              <span className="text-card-foreground truncate">
                {renderValue
                  ? renderValue(selectedOption)
                  : getLabel(selectedOption)}
              </span>
            ) : (
              <span className="text-card-foreground/50 truncate">
                {placeholder}
              </span>
            )}

            <span className="ltr:ml-auto rtl:mr-auto flex items-center gap-0.5">
              {selectedOption && !disabled && (
                <span
                  role="button"
                  tabIndex={-1}
                  className="rounded-sm p-0.5 hover:bg-input transition-colors"
                  onClick={handleClear}
                >
                  <X className="size-3.5 opacity-50" />
                </span>
              )}
              <ChevronDown className="size-4 opacity-50" />
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="p-0 w-(--radix-popover-trigger-width) overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
        >
          {open && (
            <Command shouldFilter={false} className="bg-card">
              <CommandInput
                ref={searchInputRef}
                placeholder={
                  searchPlaceholder ?? "Type to search more results..."
                }
                value={term}
                autoFocus
                onValueChange={stableSetTerm}
              />

              <CommandList>
                <ScrollArea className="max-h-60 overflow-y-auto">
                  <CommandGroup>
                    {isLoading ? (
                      <div className="p-4 flex justify-center">
                        <Spinner size="sm" />
                      </div>
                    ) : (
                      <>
                        {optionList}
                        {displayLimit < items.length && (
                          <div
                            ref={observerRef}
                            className="h-10 flex items-center justify-center"
                          >
                            <Spinner size="sm" />
                          </div>
                        )}
                      </>
                    )}
                  </CommandGroup>
                  {items.length === 0 && !isLoading && (
                    <CommandEmpty className="py-6 text-center text-sm text-card-foreground/60">
                      {emptyMessage ?? "No results found."}
                    </CommandEmpty>
                  )}
                </ScrollArea>

                {renderFooter?.()}
              </CommandList>
            </Command>
          )}
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}

export const Autocomplete = React.memo(
  AutocompleteComponent,
) as typeof AutocompleteComponent;
