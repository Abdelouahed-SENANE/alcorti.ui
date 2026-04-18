"use client";

import { RemoteSelector } from "@/components/ui/remote-selector";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useVehicleOptions } from "../api/vehicle.options";
import { VehicleOption } from "../vehicle.type";

export interface VehicleSelectorProps {
  label?: string;
  error?: string;
  onSelect?: (vehicle: VehicleOption) => void;
  defaultValue?: string;
  className?: string;
  isRequired?: boolean;
}

export function VehicleSelector({
  error,
  onSelect,
  className,
  isRequired,
}: VehicleSelectorProps) {
  const { t } = useTranslation();
  const renderItem = React.useCallback(
    (vehicle: VehicleOption) => (
      <div className="flex justify-start flex-col gap-0.5 truncate w-full  ltr:flex-row rtl:flex-row-reverse">
        {vehicle.label}
      </div>
    ),
    [],
  );

  const itemToLabel = React.useCallback((v: VehicleOption) => v.label, []);
  const itemToValue = React.useCallback((v: VehicleOption) => v.value, []);
  const handleSelect = React.useCallback(
    (vehicle: VehicleOption) => {
      console.log(vehicle);
      onSelect?.(vehicle);
    },
    [onSelect],
  );
  return (
    <RemoteSelector
      isRequired={isRequired}
      label={t("vehicles.autocomplete.label")}
      error={error}
      onSelect={handleSelect}
      useOptionsQuery={useVehicleOptions}
      renderItem={renderItem}
      itemToLabel={itemToLabel}
      itemToValue={itemToValue}
      className={className}
      debounceMs={500}
    />
  );
}
