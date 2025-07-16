import { create } from "zustand";

interface ChannelState {
  // Group Data
  groupId: number | string;
  groupDetails: {};
  userGroupRole: number;
  refreshGroup: boolean;

  categoryId: number | string;
  categoryDetails: {};
  userCategoryRole: number;
  refreshCategory: boolean;

  channelDetails: {};
  channelId: number | string;
  userChannelRole: number;
  refreshChannel: boolean;

  // Other users
  otherUserId: number | string;
  msgReceiverId: number | string;

  // Functions to update state

  setGroupId: (data: string) => void;
  setGroupDetails: (data: number | string) => void;
  setUserGroupRole: (data: number) => void;
  setRefreshGroup: (data: boolean) => void;

  setCategoryId: (data: number | string) => void;
  setCategoryDetails: (data: number | string) => void;
  setUserCategoryRole: (data: number) => void;
  setRefreshCategory: (data: boolean) => void;

  setChannelId: (data: number | string) => void;
  setChannelDetails: (data: number | string) => void;
  setUserChannelRole: (data: number) => void;
  setRefreshCHannel: (data: boolean) => void;

  setOtherUserId: (data: number | string) => void;
  setMsgReceiverId: (data: number | string) => void;
}

// Update the store with the initial state
export const useChannelStore = create<ChannelState>((set) => ({
  groupId: null,
  groupDetails: {},
  userGroupRole: 0,
  refreshGroup: false,

  categoryId: null, // Add this
  categoryDetails: {}, // Add this
  userCategoryRole: 0, // Add this
  refreshCategory: false,

  channelId: null,
  channelDetails: {},
  userChannelRole: 0,
  refreshChannel: false,

  otherUserId: null,
  msgReceiverId: null,

  setGroupId: (data) => set({ groupId: data }),
  setGroupDetails: (data) => set({ groupDetails: data }),
  setUserGroupRole: (data) => set({ userGroupRole: data }),
  setRefreshGroup: (data) => set({ refreshGroup: data }),

  setCategoryId: (data) => set({ categoryId: data }),
  setCategoryDetails: (data) => set({ categoryDetails: data }),
  setUserCategoryRole: (data) => set({ userCategoryRole: data }),
  setRefreshCategory: (data) => set({ refreshGroup: data }),

  setChannelId: (data) => set({ channelId: data }),
  setChannelDetails: (data) => set({ channelDetails: data }),
  setUserChannelRole: (data) => set({ userChannelRole: data }),
  setRefreshCHannel: (data) => set({ refreshGroup: data }),

  setOtherUserId: (data) => set({ otherUserId: data }),
  setMsgReceiverId: (data) => set({ msgReceiverId: data }),
}));
