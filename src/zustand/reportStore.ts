import { create } from "zustand";

interface ReportProps {
  reportUserDetails: {
    userId: number;
    name: string;
    profilePic: string;
    reportId: number;
    reportType: string;
    reportFor: string;
    reportDescription: string;
  };
  setReportUserDetails: (data: Partial<ReportProps['reportUserDetails']>) => void;
}

export const useReportStore = create<ReportProps>((set) => ({
  reportUserDetails: {
    userId: 0,
    name: '',
    profilePic: '',
    reportId: 0,
    reportType: '',
    reportFor: '',
    reportDescription: ''
  },

  setReportUserDetails: (data) =>
    set((state) => ({
      reportUserDetails: {
        ...state.reportUserDetails,
        ...data
      }
    })),
}));
