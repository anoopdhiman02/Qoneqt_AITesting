import { create } from "zustand";

interface StatusStateProps {
  serverErrorStatus: boolean;
  internetError: boolean;
  onSetServerErrorStatus: (data: boolean) => void;
  onSetInternetErrorStatus: (data: boolean) => void;
}

export const useGlobalStatusStore = create<StatusStateProps>((set) => ({
  serverErrorStatus: false,
  internetError: false,
  onSetServerErrorStatus: (data) => set({ serverErrorStatus: data }),
  onSetInternetErrorStatus: (data) => set({ internetError: data }),
}));
