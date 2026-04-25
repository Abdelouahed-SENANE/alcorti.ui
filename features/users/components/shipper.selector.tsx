"use client";
import { useAutocompleteCache } from "@/components/ui/autocomplete/autocomplete.cache";
import { RemoteSelector } from "@/components/ui/remote-selector";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { ShipperOption } from "../user.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useShipperOptions } from "../api/shipper.options";

export interface ShipperSelectorProps {
  label?: string;
  error?: string;
  onSelect?: (shipper: ShipperOption) => void;
  defaultValue?: string;
  className?: string;
  isRequired?: boolean;
  placeholder?: string;
}


export function ShipperSelector({
  error,
  onSelect,
  className,
  isRequired,
  defaultValue,
  placeholder,
  label,
}: ShipperSelectorProps) {
  const { t } = useTranslation();

  const itemToLabel = React.useCallback(
    (v: ShipperOption) => `${v.first_name} ${v.last_name}`,
    [],
  );

  const itemToValue = React.useCallback((v: ShipperOption) => v.id, []);

  const { selectedItem, cacheItem } = useAutocompleteCache<ShipperOption>({
    cacheKey: "shippers",
    value: defaultValue,
    itemToValue,
    itemToLabel,
    ttlMs: 30 * 60 * 1000,
  });

  const renderItem = React.useCallback(
    (shipper: ShipperOption) => (
      <div className="flex items-center gap-2">
        <div className="flex flex-col min-w-0">
          <span className="font-medium text-sm truncate">
            {shipper.first_name} {shipper.last_name}
          </span>
        </div>
      </div>
    ),
    [],
  );

  const handleSelect = React.useCallback(
    (shipper: ShipperOption) => {
      if (shipper?.id) {
        cacheItem(shipper);
      }
      onSelect?.(shipper);
    },
    [onSelect, cacheItem],
  );

  return (
    <RemoteSelector<ShipperOption>
      isRequired={isRequired}
      label={label}
      placeholder={placeholder || t("users.select_shipper", "Select a shipper")}
      error={error}
      onSelect={handleSelect}
      useOptionsQuery={useShipperOptions}
      renderItem={renderItem}
      itemToLabel={itemToLabel}
      itemToValue={itemToValue}
      className={className}
      debounceMs={600}
      initialSelectedItem={selectedItem}
    />
  );
}
