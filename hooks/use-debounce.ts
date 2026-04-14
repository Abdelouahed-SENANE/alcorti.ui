import React from "react";

export const useDebouce = <T>(value: T, delay = 500) => {
  const [deboucedVal, setDeboucedVal] = React.useState(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setDeboucedVal(value);
    }, delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return deboucedVal;
  
};

export function useDebouncedFn<T extends any[], R>(
  func: (...args: T) => R,
  delay = 500
): (...args: T) => void {
  return React.useCallback(
    (...args: T) => {
      const timeoutId = setTimeout(() => {
        func(...args);
      }, delay);

      return () => clearTimeout(timeoutId);
    },
    [func, delay]
  );
}