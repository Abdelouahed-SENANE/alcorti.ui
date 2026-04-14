import React from "react";

export const useClickOutside = <T extends HTMLElement>(callback: () => void) => {
  const ref = React.useRef<T>(null);
  const handleClickOutside = React.useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    },
    [callback]
  );

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);
  return ref;
};