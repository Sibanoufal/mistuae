import { createContext, useContext } from "react";
import type { MistContextValue } from "./mist-store";

export const MistContext = createContext<MistContextValue | null>(null);

export function useMist() {
  const context = useContext(MistContext);
  if (!context) throw new Error("useMist must be used inside MistProvider");
  return context;
}