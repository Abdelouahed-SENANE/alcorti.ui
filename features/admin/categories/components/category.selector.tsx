"use client";

import { RemoteSelector } from "@/components/ui/remote-selector";
import i18n from "@/config/i18n";
import { resolveLocaleValue } from "@/lib/utils";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useCategoryOptions } from "../api/category.options";
import { CategoryOption } from "../category.type";

export interface CategorySelectorProps {
  label?: string;
  error?: string;
  onSelect?: (category: CategoryOption) => void;
  defaultValue?: string;
  className?: string;
  isRequired?: boolean;
}

export function CategorySelector({
  error,
  onSelect,
  className,
  isRequired,
}: CategorySelectorProps) {
  const { t } = useTranslation();
  const lang = i18n.language;
  const renderItem = React.useCallback(
    (category: CategoryOption) => (
      <div className="flex justify-start flex-col gap-0.5 truncate w-full  ltr:flex-row rtl:flex-row-reverse">
        {resolveLocaleValue(category, lang)}
      </div>
    ),
    [lang],
  );

  const itemToLabel = React.useCallback(
    (v: CategoryOption) => resolveLocaleValue(v, lang),
    [lang],
  );
  const itemToValue = React.useCallback((v: CategoryOption) => v.id, []);
  const handleSelect = React.useCallback(
    (category: CategoryOption) => {
      onSelect?.(category);
    },
    [onSelect],
  );
  return (
    <RemoteSelector
      isRequired={isRequired}
      label={t("categories.autocomplete.label")}
      error={error}
      onSelect={handleSelect}
      useOptionsQuery={useCategoryOptions}
      renderItem={renderItem}
      itemToLabel={itemToLabel}
      itemToValue={itemToValue}
      className={className}
      debounceMs={600}
    />
  );
}
