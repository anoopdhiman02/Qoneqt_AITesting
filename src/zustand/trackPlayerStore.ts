import { create } from "zustand";

export const useTrackPlayerStore = create((set) => ({
  isPlayerInitialized: false,
  setPlayerInitialized: (value: any) => set({ isPlayerInitialized: value }),
}));
