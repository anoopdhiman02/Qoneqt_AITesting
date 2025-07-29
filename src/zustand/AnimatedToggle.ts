import { create } from "zustand";

interface useAnimatedToggle {
  isFlex: boolean;
  setIsFlex: (
    update: boolean | ((prev: boolean) => boolean)
  ) => void;
}
export const userShowAnimatedToggle = create<useAnimatedToggle>((set) => ({
  isFlex: true,
  setIsFlex: (update) =>
    set((state) => ({
      isFlex:
        typeof update === "function" ? update(state.isFlex) : update,
    })),
}));