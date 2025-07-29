import { create } from "zustand";

interface StatusStateProps {

  userKycStatus: number | null;
  kycScreen: number;
  basicDetails: {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    gender: string;
    isMobile: boolean;
  };

  selfieImage: {
    uri: any;
    type: string;
    name: string;
  };
  docOneFront: {
    uri: any;
    type: string;
    name: string;
  };

  docOneBack: {
    uri: any;
    type: string;
    name: string;
  };
  docPanFront: {
    uri: any;
    type: string;
    name: string;
  };


  onSetUserKycStatus: (data: any) => void;
  onSetKycScreen: (data: any) => void;

  onSetDocOneFront: (data: any) => void;
  onSetDocOneBack: (data: any) => void;
  onSetDocPanFront: (data: any) => void;
  onSetSelfieImage: (data: any) => void;
  onSetBasicDetail: (data: Partial<StatusStateProps["basicDetails"]>) => void;
}

export const useKycGlobalStore = create<StatusStateProps>((set) => ({

  userKycStatus: null, // 0: otp, 1: 
  kycScreen: 1,
  basicDetails: {
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    gender: "",
    isMobile: false,
  },
  selfieImage: {
    uri: "",
    type: "",
    name: "",
  },
  docOneFront: {
    uri: "",
    type: "",
    name: "",
  },
  docOneBack: {
    uri: "",
    type: "",
    name: "",
  },
  docPanFront: {
    uri: "",
    type: "",
    name: "",
  },

  onSetUserKycStatus: (data) => set({ userKycStatus: data }),
  onSetKycScreen: (data) => set({ kycScreen: data }),
  onSetBasicDetail: (data) =>
    set((state) => ({
      basicDetails: {
        ...state.basicDetails,
        ...data,
      },
    })),

  onSetSelfieImage: (data) =>
    set({ selfieImage: { uri: data.uri, type: data.type, name: data.name } }),
  onSetDocOneFront: (data) =>
    set({ selfieImage: { uri: data.uri, type: data.type, name: data.name } }),
  onSetDocOneBack: (data) =>
    set({ selfieImage: { uri: data.uri, type: data.type, name: data.name } }),
  onSetDocPanFront: (data) =>
    set({ selfieImage: { uri: data.uri, type: data.type, name: data.name } }),
}));
