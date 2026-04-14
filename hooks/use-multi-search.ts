import * as React from "react";
import { useDebouce } from "@/hooks/use-debounce";

type Action = {
  type: string;
  value: string;
};

export function useMultiSearch(keys: string[], delay = 500) {
  const [state, dispatch] = React.useReducer(
    (s: Record<string, string>, a: Action) => ({
      ...s,
      [a.type]: a.value,
    }),
    Object.fromEntries(keys.map((k) => [k, ""]))
  );

  const debounced = Object.fromEntries(
    keys.map((k) => [k, useDebouce(state[k], delay)])
  );

  return { state, debounced, dispatch };
}
