import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export const useQueryTable = <
  T extends { id?: string | number },
  F extends Record<string, string | number | undefined> = {},
>() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSearchParams = useCallback(
    (params: URLSearchParams) => {
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  // ===========================
  // PAGINATION
  // ===========================
  const page = Number(searchParams.get("page") || 1);
  const query = searchParams.get("query") ?? "";
  const limit = Number(searchParams.get("limit") || 10);

  // ===========================
  // SORT
  // ===========================

  const sort = (searchParams.get("sort") as keyof T) ?? "created_at";
  const order: "asc" | "desc" =
    searchParams.get("order") === "desc" ? "desc" : "asc";

  // ===========================
  // GENERIC FILTERS
  // ===========================
  const filters = useMemo<F>(() => {
    const result = {} as F;

    searchParams.forEach((value, key) => {
      if (!["page", "query", "limit", "sort", "order"].includes(key)) {
        (result as any)[key] = value;
      }
    });

    return result;
  }, [searchParams]);

  const setFilter = useCallback(
    <K extends keyof F>(key: K, value: F[K]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === undefined || value === "" || value === null) {
        params.delete(String(key));
      } else {
        params.set(String(key), String(value));
      }

      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );
  // ===========================
  // SELECTION
  // ===========================
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    () => new Set(),
  );

  const toggleRow = useCallback((id: string | number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((allIds: (string | number)[]) => {
    setSelectedRows((prev) =>
      prev.size === allIds.length ? new Set() : new Set(allIds),
    );
  }, []);

  // ===========================
  // QUERY / SEARCH
  // ===========================
  const setQuery = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) params.set("query", value);
      else params.delete("query");

      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  // ===========================
  // SORTING
  // ===========================
  const setSorting = useCallback(
    (field: keyof T, dir: "asc" | "desc") => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("sort", String(field));
      params.set("order", dir);
      params.set("page", "1");
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  const setPage = useCallback(
    (value: number) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", String(value));
      setSearchParams(params);
    },
    [searchParams, setSearchParams],
  );

  return {
    page,
    query,
    limit,
    sort,
    order,

    filters, // <---- NEW
    setFilter, // <---- NEW

    selectedRows,
    toggleRow,
    toggleAll,

    setQuery,
    setSorting,
    setPage,
  };
};
