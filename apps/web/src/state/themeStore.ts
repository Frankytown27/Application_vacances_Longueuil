import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
}

export const useTheme = create<ThemeState>((set) => ({
  mode: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  setMode: (mode) => set({ mode }),
  toggle: () =>
    set((state) => ({
      mode: state.mode === "dark" ? "light" : "dark",
    })),
}));
