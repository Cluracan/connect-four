import { create } from "zustand";
import { MIN_DEPTH, MAX_DEPTH } from "../constants";

interface SettingsState {
  depth: number;
  updateDepth: (depth: number) => void;
  increaseDepth: () => void;
  decreaseDepth: () => void;
  zeroBasedIndex: boolean;
  toggleZeroBasedIndex: () => void;
}

const useSettings = create<SettingsState>()((set) => ({
  depth: 4,
  updateDepth: (depth) => set({ depth }),
  increaseDepth: () =>
    set((state) => ({
      depth: state.depth < MAX_DEPTH ? state.depth + 1 : state.depth,
    })),
  decreaseDepth: () =>
    set((state) => ({
      depth: state.depth > MIN_DEPTH ? state.depth - 1 : state.depth,
    })),
  zeroBasedIndex: true,
  toggleZeroBasedIndex: () =>
    set((state) => ({ zeroBasedIndex: !state.zeroBasedIndex })),
}));

export { useSettings };
