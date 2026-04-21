
// Inside your autocomplete.tsx file
"use client";

import * as React from "react";

// ═══════════════════════════════════════════════════════════════════
// AUTOCOMPLETE CACHE — With automatic 30-minute expiration
// ═══════════════════════════════════════════════════════════════════

type CacheEntry<T = unknown> = {
  value: string;
  label: string;
  item: T;
  expiresAt: number; // timestamp in ms
};

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // run cleanup every 5 minutes

class AutocompleteCache {
  private cache = new Map<string, Map<string, CacheEntry>>();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;
  private subscribers = new Set<() => void>();

  constructor() {
    // Auto-start cleanup on client side only
    if (typeof window !== "undefined") {
      this.startCleanup();
    }
  }

  /**
   * Start the periodic cleanup timer.
   * Removes expired entries every CLEANUP_INTERVAL_MS.
   */
  private startCleanup() {
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      this.removeExpired();
    }, CLEANUP_INTERVAL_MS);
  }

  /**
   * Remove all expired entries from the cache.
   */
  private removeExpired() {
    const now = Date.now();
    let removed = 0;

    this.cache.forEach((namespace, namespaceKey) => {
      namespace.forEach((entry, entryKey) => {
        if (entry.expiresAt < now) {
          namespace.delete(entryKey);
          removed++;
        }
      });

      // Clean up empty namespaces
      if (namespace.size === 0) {
        this.cache.delete(namespaceKey);
      }
    });

    if (removed > 0) {
      this.notify();
    }
  }

  /**
   * Save an item to the cache with a TTL.
   */
  set<T>(
    namespace: string,
    value: string,
    label: string,
    item: T,
    ttlMs: number = DEFAULT_TTL_MS,
  ) {
    if (!this.cache.has(namespace)) {
      this.cache.set(namespace, new Map());
    }

    this.cache.get(namespace)!.set(value, {
      value,
      label,
      item,
      expiresAt: Date.now() + ttlMs,
    });

    this.notify();
  }

  /**
   * Get a cached entry. Returns undefined if missing or expired.
   * Lazy cleanup: expired entries are removed when accessed.
   */
  get<T = unknown>(namespace: string, value: string): CacheEntry<T> | undefined {
    const entry = this.cache.get(namespace)?.get(value);
    if (!entry) return undefined;

    // Lazy expiration check
    if (entry.expiresAt < Date.now()) {
      this.cache.get(namespace)?.delete(value);
      return undefined;
    }

    return entry as CacheEntry<T>;
  }

  /**
   * Get just the label for a cached value.
   */
  getLabel(namespace: string, value: string): string | undefined {
    return this.get(namespace, value)?.label;
  }

  /**
   * Get the full item object for a cached value.
   */
  getItem<T = unknown>(namespace: string, value: string): T | undefined {
    return this.get<T>(namespace, value)?.item;
  }

  /**
   * Save multiple items at once.
   */
  setMany<T>(
    namespace: string,
    items: { value: string; label: string; item: T }[],
    ttlMs: number = DEFAULT_TTL_MS,
  ) {
    items.forEach(({ value, label, item }) => {
      this.set(namespace, value, label, item, ttlMs);
    });
  }

  /**
   * Clear a specific namespace.
   */
  clear(namespace: string) {
    this.cache.delete(namespace);
    this.notify();
  }

  /**
   * Clear all cached data.
   */
  clearAll() {
    this.cache.clear();
    this.notify();
  }

  /**
   * Subscribe to cache changes (used by useSyncExternalStore).
   */
  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers of a change.
   */
  private notify() {
    this.subscribers.forEach((cb) => cb());
  }

  /**
   * Stop cleanup timer — useful for cleanup in tests.
   */
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
    this.subscribers.clear();
  }
}

// Singleton instance
export const autocompleteCache = new AutocompleteCache();

// ═══════════════════════════════════════════════════════════════════
// HOOK: useAutocompleteCache
// Reactively reads/writes to the cache
// ═══════════════════════════════════════════════════════════════════

export interface UseAutocompleteCacheOptions<T> {
  /** Unique namespace (e.g., "locations", "categories") */
  cacheKey: string;
  /** Currently selected value/ID */
  value?: string;
  /** Options from the current query (auto-cached) */
  options?: T[];
  /** Extract ID from an item */
  itemToValue: (item: T) => string;
  /** Extract display label from an item */
  itemToLabel: (item: T) => string;
  /** Custom TTL in milliseconds (default: 30 min) */
  ttlMs?: number;
}

export function useAutocompleteCache<T>({
  cacheKey,
  value,
  options = [],
  itemToValue,
  itemToLabel,
  ttlMs = DEFAULT_TTL_MS,
}: UseAutocompleteCacheOptions<T>) {
  // Subscribe to cache changes — component re-renders when cache updates
  const subscribe = React.useCallback(
    (cb: () => void) => autocompleteCache.subscribe(cb),
    [],
  );

  const getSnapshot = React.useCallback(() => {
    if (!value) return undefined;
    return autocompleteCache.getItem<T>(cacheKey, value);
  }, [cacheKey, value]);

  const cachedItem = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => undefined, // SSR: no cache
  );

  // Auto-seed cache when options arrive
  React.useEffect(() => {
    if (options.length === 0) return;

    options.forEach((option) => {
      const itemValue = itemToValue(option);
      const itemLabel = itemToLabel(option);
      autocompleteCache.set(cacheKey, itemValue, itemLabel, option, ttlMs);
    });
  }, [options, cacheKey, itemToValue, itemToLabel, ttlMs]);

  // Resolve the current selection: prefer options, fall back to cache
  const selectedItem = React.useMemo(() => {
    if (!value) return undefined;

    // 1. Check current options first (freshest data)
    const inOptions = options.find((opt) => itemToValue(opt) === value);
    if (inOptions) return inOptions;

    // 2. Fall back to cache
    return cachedItem;
  }, [value, options, itemToValue, cachedItem]);

  const selectedLabel = React.useMemo(() => {
    if (!selectedItem) return "";
    return itemToLabel(selectedItem);
  }, [selectedItem, itemToLabel]);

  // Manual cache setter — use in onSelect
  const cacheItem = React.useCallback(
    (item: T) => {
      autocompleteCache.set(
        cacheKey,
        itemToValue(item),
        itemToLabel(item),
        item,
        ttlMs,
      );
    },
    [cacheKey, itemToValue, itemToLabel, ttlMs],
  );

  return {
    selectedItem,
    selectedLabel,
    cacheItem,
  };
}