import { create } from "zustand";

interface CheckVersionStateProps {
  id: number;
  app_name: string;
  version: string;
  os: string;
  force_update: number;
  app_store_url: string;
  linkedin: number;
  isSkipped: boolean;
  updateAvailable: boolean;
  setId: (data: number) => void;
  setAppName: (data: string) => void;
  setVersion: (data: string) => void;
  setOS: (data: string) => void;
  setForceUpdate: (data: number) => void;
  setAppStoreUrl: (data: string) => void;
  setLinkedin: (data: number) => void;
  setIsSkipped: (data: boolean) => void;
  setUpdateAvailable: (data: boolean) => void;
}

export const useCheckVersionStore = create<CheckVersionStateProps>((set) => ({
  id: 0,
  app_name: "",
  version: "",
  os: "",
  force_update: 0,
  app_store_url: "",
  linkedin: 0,
  isSkipped: false,
  updateAvailable: false,
  setId: (data) => set({ id: data }),
  setAppName: (data) => set({ app_name: data }),
  setVersion: (data) => set({ version: data }),
  setOS: (data) => set({ os: data }),
  setForceUpdate: (data) => set({ force_update: data }),
  setAppStoreUrl: (data) => set({ app_store_url: data }),
  setLinkedin: (data) => set({ linkedin: data }),
  setIsSkipped: (data) => set({ isSkipped: data }),
  setUpdateAvailable: (data) => set({ updateAvailable: data }),
}));
