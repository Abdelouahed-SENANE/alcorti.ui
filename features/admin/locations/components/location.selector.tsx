"use client";

import { RemoteSelector } from "@/components/ui/remote-selector";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useLocationOptions } from "../api/location.options";
import { LocationOption } from "../location.type";
import i18n from "@/config/i18n";
import { resolve } from "path";
import { resolveLocaleValue } from "@/lib/utils";

export interface LocationSelectorProps {
  label?: string;
  error?: string;
  onSelect?: (location: LocationOption) => void;
  defaultValue?: string;
  className?: string;
  isRequired?: boolean;
}

export function LocationSelector({
  error,
  onSelect,
  className,
  isRequired,
}: LocationSelectorProps) {
  const { t } = useTranslation();
  const lang = i18n.language;
  const renderItem = React.useCallback(
    (location: LocationOption) => (
      <div className="flex justify-start flex-col gap-0.5 truncate w-full  ltr:flex-row rtl:flex-row-reverse">
        {resolveLocaleValue(location, lang)}
      </div>
    ),
    [lang],
  );

  const itemToLabel = React.useCallback((v: LocationOption) => resolveLocaleValue(v, lang), []);
  const itemToValue = React.useCallback((v: LocationOption) => v.value, []);
  const handleSelect = React.useCallback(
    (location: LocationOption) => {
      onSelect?.(location);
    },
    [onSelect],
  );
  return (
    <RemoteSelector
      isRequired={isRequired}
      label={t("locations.autocomplete.label")}
      error={error}
      onSelect={handleSelect}
      useOptionsQuery={useLocationOptions}
      renderItem={renderItem}
      itemToLabel={itemToLabel}
      itemToValue={itemToValue}
      className={className}
      debounceMs={600}
    />
  );
}
