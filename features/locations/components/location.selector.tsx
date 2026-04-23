"use client";
import { useAutocompleteCache } from "@/components/ui/autocomplete/autocomplete.cache";
import { RemoteSelector } from "@/components/ui/remote-selector";
import i18n from "@/config/i18n";
import { resolveLocaleValue } from "@/lib/utils";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useLocationOptions } from "../api/location.options";
import { LocationOption } from "../location.type";

export interface LocationSelectorProps {
  label?: string;
  error?: string;
  onSelect?: (location: LocationOption) => void;
  defaultValue?: string;
  className?: string;
  isRequired?: boolean;
  placeholder?: string;
}

export function LocationSelector({
  error,
  onSelect,
  className,
  isRequired,
  defaultValue,
  placeholder,
  label,
}: LocationSelectorProps) {
  const { t } = useTranslation();
  const lang = i18n.language;

  const itemToLabel = React.useCallback(
    (v: LocationOption) => resolveLocaleValue(v, lang),
    [lang],
  );

  const itemToValue = React.useCallback((v: LocationOption) => v.value, []);

  const { selectedItem, cacheItem } = useAutocompleteCache<LocationOption>({
    cacheKey: "locations",
    value: defaultValue,
    itemToValue,
    itemToLabel,
    ttlMs: 30 * 60 * 1000,
  });

  const renderItem = React.useCallback(
    (location: LocationOption) => (
      <div className="flex justify-start flex-col gap-0.5 truncate w-full ltr:flex-row rtl:flex-row-reverse">
        {resolveLocaleValue(location, lang)}
      </div>
    ),
    [lang],
  );

  const handleSelect = React.useCallback(
    (location: LocationOption) => {
      cacheItem(location); // ← saves to cache with 30-min TTL
      onSelect?.(location);
    },
    [onSelect, cacheItem],
  );

  return (
    <RemoteSelector<LocationOption>
      isRequired={isRequired}
      label={label}
      placeholder={placeholder}
      error={error}
      onSelect={handleSelect}
      useOptionsQuery={useLocationOptions}
      renderItem={renderItem}
      itemToLabel={itemToLabel}
      itemToValue={itemToValue}
      className={className}
      debounceMs={600}
      initialSelectedItem={selectedItem}
    />
  );
}
