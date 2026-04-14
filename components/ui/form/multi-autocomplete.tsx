"use client";

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import i18n from "@/config/i18n";
import { cn } from "@/lib/utils";
import { BaseOption, Lang } from "@/types/api";
import { t } from "i18next";
import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";
import { Spinner } from "../spinner";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./field-wrapper";

export interface MultiSelectAutocompleteProps<T extends BaseOption>
  extends FieldWrapperPassThroughProps {
  value?: string[];
  onChange: (value: string[], options?: T[]) => void;

  items: T[];
  term: string;
  setTerm: (val: string) => void;

  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isLoading?: boolean;

  maxBadges?: number; // default 3
  renderOption?: (o: T) => React.ReactNode;
}

export function MultiAutocomplete<T extends BaseOption>({
  label,
  error,
  value = [],
  onChange,
  items,
  term,
  setTerm,
  placeholder = "Select...",
  emptyMessage,
  isLoading,
  maxBadges = 3,
  renderOption,
}: MultiSelectAutocompleteProps<T>) {
  const [open, setOpen] = React.useState(false);
  const lang = i18n.language as Lang;

  const getLabel = React.useCallback(
    (opt: T) =>
      typeof opt.label === "string"
        ? opt.label
        : (opt.label[lang] ?? opt.label.fr),
    [lang],
  );

  const selectedOptions = React.useMemo(() => {
    if (!value.length) return [];
    const set = new Set(value);
    return items.filter((i) => set.has(i.value));
  }, [value, items]);

  const toggle = React.useCallback(
    (opt: T) => {
      const exists = value.includes(opt.value);
      const next = exists
        ? value.filter((v) => v !== opt.value)
        : [...value, opt.value];

      const nextOptions = items.filter((i) => next.includes(i.value));
      onChange(next, nextOptions);
    },
    [value, items, onChange],
  );

  const removeOne = React.useCallback(
    (id: string) => {
      const next = value.filter((v) => v !== id);
      const nextOptions = items.filter((i) => next.includes(i.value));
      onChange(next, nextOptions);
    },
    [value, items, onChange],
  );
  const clearAll = React.useCallback(() => {
    onChange([], []);
  }, [onChange]);
  React.useEffect(() => {
    if (!open) setTerm("");
  }, [open, setTerm]);

  return (
    <FieldWrapper label={label} error={error}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            data-state={open ? "open" : "closed"}
            className={cn(
              "peer cursor-pointer relative flex min-h-9 w-full items-center justify-between rounded-sm border border-border bg-transparent px-2 py-1 text-sm",
              "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:border-primary focus-visible:ring-primary/50",
              "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/50",
              error && "border-error/80 ring-3 ring-error/40",
            )}
          >
            {value.length ? (
              <div className="flex flex-wrap gap-1 items-center">
                {selectedOptions.slice(0, maxBadges).map((opt) => (
                  <span
                    key={opt.value}
                    className="inline-flex items-center gap-2 rounded bg-primary/10 p-1 text-xs text-primary"
                  >
                    {renderOption ? renderOption(opt) : getLabel(opt)}
                    <span
                      role="button"
                      tabIndex={0}
                      className="opacity-70 hover:opacity-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeOne(opt.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          removeOne(opt.value);
                        }
                      }}
                    >
                      <X className="size-3.5" />
                    </span>
                  </span>
                ))}

                {value.length > maxBadges && (
                  <span className="text-sm text-primary">
                    +{value.length - maxBadges}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-card-foreground/50">{placeholder}</span>
            )}

            <ChevronDown className="ml-2 size-4 opacity-50" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-(--radix-popover-trigger-width)">
          <Command
            shouldFilter={false}
            className="bg-card text-card-foreground"
          >
            <div className="relative">
              <CommandInput
                className="w-full border-0  bg-transparent"
                placeholder={t("global.search")}
                value={term}
                onValueChange={setTerm}
              />
              {!!value.length && (
                <button
                  type="button"
                  className="text-xs font-bold absolute top-1/2  ltr:right-2 rtl:left-2 -translate-y-1/2 cursor-pointer text-card-foreground/50 hover:text-card-foreground"
                  onClick={(e) => {
                    e.preventDefault();
                    clearAll();
                  }}
                >
                  {t("global.clear_all")}
                </button>
              )}
            </div>

            <CommandList>
              <ScrollArea className="max-h-60">
                <CommandGroup>
                  {isLoading ? (
                    <div className="p-2">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    items.map((opt) => {
                      const selected = value.includes(opt.value);
                      return (
                        <CommandItem
                          key={opt.value}
                          value={opt.value}
                          onSelect={() => toggle(opt)}
                        >
                          {renderOption ? renderOption(opt) : getLabel(opt)}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selected ? "opacity-100" : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      );
                    })
                  )}
                </CommandGroup>

                {!items.length && !isLoading && (
                  <div className="h-10 flex items-center justify-center">
                    <span className="text-muted-foreground">
                      {emptyMessage}
                    </span>
                  </div>
                )}
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}
