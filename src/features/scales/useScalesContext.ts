import { useOutletContext } from "react-router";
import type { ScalesOutletContext } from "@/features/scales/scale.types";

export function useScalesContext() {
  return useOutletContext<ScalesOutletContext>();
}
