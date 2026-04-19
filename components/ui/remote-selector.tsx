"use client";

import {
  Autocomplete,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@/components/ui/autocomplete";
import { Spinner } from "@/components/ui/spinner";
import { useDebouce } from "@/hooks/use-debounce";
import { ApiResponse } from "@/types/api";
import * as React from "react";
import { useTranslation } from "react-i18next";

interface RemoteSelectorProps<T> {
  onSelect?: (item: T) => void;
  useOptionsQuery: (params: { search: string; queryConfig: any }) => {
    data?: ApiResponse<T[]>;
    isFetching: boolean;
    isError: boolean;
  };
  renderItem: (item: T) => React.ReactNode;
  itemToLabel: (item: T) => string;
  itemToValue: (item: T) => string | number;
  label?: string;
  isRequired?: boolean;
  error?: string;
  className?: string;
  debounceMs?: number;
}

export function RemoteSelector<T>({
  onSelect,
  useOptionsQuery,
  renderItem,
  itemToLabel,
  itemToValue,
  label,
  isRequired,
  error,
  className,
  debounceMs = 300,
}: RemoteSelectorProps<T>) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = React.useState("");
  const debounced = useDebouce(searchValue, debounceMs);

  const { data, isFetching, isError } = useOptionsQuery({
    search: debounced,
    queryConfig: {
      enabled: debounced.length > 0,
      staleTime: 5 * 60 * 1000,
      placeholderData: (prev: any) => prev,
    },
  });

  const results = data?.data ?? [];

  const resultsRef = React.useRef(results);

  React.useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  const handleValueChange = React.useCallback(
    (val: string | T) => {
      if (typeof val !== "string") {
        setSearchValue(itemToLabel(val));
        onSelect?.(val);
        return;
      }
      setSearchValue(val);
      // Cleared
      if (val === "") {
        onSelect?.({} as T);
        return;
      }

      const matched = resultsRef.current.find(
        (item) => itemToLabel(item) === val,
      );
      if (matched) {
        onSelect?.(matched);
      }
    },
    [onSelect, itemToLabel],
  );

  const itemToStringValue = React.useCallback(
    (item: unknown) => itemToLabel(item as T),
    [itemToLabel],
  );

  const shouldRenderPopup = debounced.length > 0 || isFetching;

  return (
    <div className={className}>
      <Autocomplete
        items={results}
        value={searchValue}
        onValueChange={handleValueChange}
        itemToStringValue={itemToStringValue}
        filter={null}
      >
        <AutocompleteInput
          label={label}
          error={error}
          className="h-9"
          showTrigger
          showClear
          isRequired={isRequired}
        />
        {shouldRenderPopup && (
          <AutocompleteContent className="min-w-[300px]">
            <Status
              isFetching={isFetching}
              isError={isError}
              searchValue={debounced}
              resultCount={results.length}
            />
            <AutocompleteList className="max-h-[300px]">
              <AutocompleteCollection>
                {(item: T) => (
                  <AutocompleteItem
                    key={itemToValue(item)}
                    value={item}
                    className="rounded-sm"
                  >
                    {renderItem(item)}
                  </AutocompleteItem>
                )}
              </AutocompleteCollection>
            </AutocompleteList>
          </AutocompleteContent>
        )}
      </Autocomplete>
    </div>
  );
}

const Status = React.memo(function Status({
  isFetching,
  isError,
  searchValue,
  resultCount,
}: {
  isFetching: boolean;
  isError: boolean;
  searchValue: string;
  resultCount: number;
}) {
  const { t } = useTranslation();

  let content: React.ReactNode = null;

  if (isFetching) {
    content = (
      <div className="flex items-center gap-2 text-foreground">
        <Spinner size="xs" />
        {t("global.searching", "Searching...")}
      </div>
    );
  } else if (isError) {
    content = (
      <span className="text-destructive font-medium">
        {t("global.error.fetch", "Failed to fetch results")}
      </span>
    );
  } else if (searchValue && resultCount === 0) {
    content = (
      <span className="text-foreground">
        {t("global.no_results", 'No results found for "{{term}}"', {
          term: searchValue,
        })}
      </span>
    );
  } else if (resultCount > 0) {
    content = (
      <span className="text-foreground/80 text-sm tracking-wider">
        {resultCount} {t("global.results", "results")}
      </span>
    );
  }

  if (!content) return null;

  return (
    <AutocompleteStatus className="border-b border-border/50 py-2">
      {content}
    </AutocompleteStatus>
  );
});
