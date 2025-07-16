import { create } from "zustand";

interface ShowPicker {
    showPicker: boolean;
    setShowPicker: (update: boolean | ((prev: boolean) => boolean)) => void;
}

export const userShowPicker = create<ShowPicker>((set) => ({
    showPicker: false, 
    setShowPicker: (update) =>
      set((state) => ({
        showPicker:
          typeof update === "function" ? update(state.showPicker) : update, 
      })),
}));

interface idPickerStore {
  Pickerid: string | null;
  setPcikerID: (update: string | ((prevId: string | null) => string | null)) => void;
}

// Create the Zustand store
export const useIdPickerStore = create<idPickerStore>((set) => ({
  Pickerid: null, // Initially, there is no id set
  setPcikerID: (update) =>
    set((state) => ({
      Pickerid: typeof update === "function" ? update(state.Pickerid) : update,
    })),
}));