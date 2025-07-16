import { create } from "zustand";

interface HomePostData {
  Selectedtab: number | null;
  setSelectedTab: (update: number | ((prevId: number | null) => number | null)) => void;
}

export const useHomePostStore = create<HomePostData>((set) => ({
  Selectedtab: 0,
  setSelectedTab: (update) =>
    set((state) => ({
      Selectedtab: typeof update === 'function' ? update(state.Selectedtab) : update,
    })),
}));
