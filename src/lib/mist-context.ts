import { createContext, useContext } from "react";
import type { MistContextValue } from "./mist-store";

// Keep a single context instance even if this module is re-evaluated during a
// live update, so provider and consumers never end up on different copies.
const globalScope = globalThis as unknown as {
  __mistContext?: ReturnType<typeof createContext<MistContextValue | null>>;
};

export const MistContext =
  globalScope.__mistContext ??
  (globalScope.__mistContext = createContext<MistContextValue | null>(null));

export function useMist() {
  const context = useContext(MistContext);
  if (!context) throw new Error("useMist must be used inside MistProvider");
  return context;
}