import { create } from "zustand";

interface AppState {
  // Global context data
  theme: string;
  userId: any;
  userInfo: any;
  isNewUser: boolean;
  isVerified: number;
  isLinkedinLogin: boolean;
  showLinkedInButton: boolean;
  isNewUpdateAvailable: boolean;
  fcmTokenStore: string;
  userFromType: string;
  userLoginType: string| null | undefined;
  getReferralCode:string;
  //kyc
  showKycModalStore: boolean;
  contectValue: any;


  // Verification Data
  userKycStatus: number;
  verifyUserData: any;
  isPartialKyc: boolean;
  isFullKycCompleted: boolean;
  verificationType: any;
  forceRedirected: number;
  isSkipUpdate: boolean;
  verificationStage: number;

  // Home Data
  homePostList: any[];

  // Group Data
  groupId: any;
  groupDetails: any;
  userGroupRole: number;
  refreshGroup: boolean;

  // Post Data
  postDetails: any;
  postId: any;

  // Channel Data
  channelDetails: any;
  channelId: any;

  // Profile
  refreshProfile: boolean;

  // Refresh states
  refreshHome: boolean;
  refreshProfileFeed: boolean;
  refreshUserChats: boolean;
  refreshComments: boolean;

  // Other users
  otherUserId: any;
  msgReceiverId: any;

  // Functions to update state
  setUserInfo: (data?: any) => void;
  setTheme: (data: string) => void;
  setUserId: (data: any) => void;
  setIsVerified: (data: any) => void;
  setIsNewUser: (data: boolean) => void;
  setIsLinkedinLogin: (data: boolean) => void;
  setShowLinkedInButton: (data: boolean) => void;
  setIsNewUpdateAvailable: (data: boolean) => void;
  setFcmTokenStore: (data: string) => void;
  onSetUserFromType: (data: any) => void;
  onSetUserLoginType: (data: any) => void;
  onSetGetReferralCode: (data:string) =>void;
  onSetShowKycModalStore: (data:boolean) => void;
  setHomePostList: (data: any[]) => void;
  setGroupId: (data: any) => void;
  setGroupDetails: (data: any) => void;
  setUserGroupRole: (data: number) => void;
  setRefreshGroup: (data: boolean) => void;
  setPostDetails: (data: any) => void;
  setPostId: (data: any) => void;
  setChannelDetails: (data: any) => void;
  setChannelId: (data: any) => void;
  setVerifyUserData: (data: any) => void;
  setUserKycStatus: (data: number) => void;
  setContactValue: (data: any) => void;
  setIsPartialKyc: (data: boolean) => void;
  setIsFullKycCompleted: (data: boolean) => void;
  setVerificationType: (data: any) => void;
  setForceRedirected: (data: number) => void;
  setIsSkipUpdate: (data: boolean) => void;
  setVerificationStage: (data: number) => void;
  setRefreshProfile: (data: boolean) => void;
  setRefreshHome: (data: boolean) => void;
  setRefreshProfileFeed: (data: boolean) => void;
  setRefreshUserChats: (data: boolean) => void;
  setRefreshComments: (data: boolean) => void;
  setOtherUserId: (data: any) => void;
  setMsgReceiverId: (data: any) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isNewUser: true,
  userInfo: {},
  theme: "light",
  userId: null,
  userKycStatus: 1,
  contactValue:'',
  isVerified: 0,
  isLinkedinLogin: false,
  showLinkedInButton: true,
  isNewUpdateAvailable: false,
  fcmTokenStore: "",
  userFromType: "",
  userLoginType:"",
  showKycModalStore:false,
  homePostList: [],
  groupId: null,
  groupDetails: {},
  userGroupRole: 0,
  refreshGroup: false,
  postDetails: {},
  postId: null,
  channelDetails: {},
  channelId: null,
  verifyUserData: {},
  isPartialKyc: false,
  isFullKycCompleted: false,
  verificationType: null,
  forceRedirected: 0,
  isSkipUpdate: false,
  verificationStage: 0,
  refreshProfile: false,
  refreshHome: false,
  refreshProfileFeed: false,
  refreshUserChats: false,
  refreshComments: false,
  otherUserId: null,
  msgReceiverId: null,
  getReferralCode:'',

  // Functions to update state
  setIsNewUser: (data) => set({ isNewUser: data }),
  setTheme: (data) => set({ theme: data }),

  setUserId: (data) => set({ userId: data }),
  setUserInfo: (data) => set({ userInfo: data }),
  setIsVerified: (data) => set({ isVerified: data }),

  setIsLinkedinLogin: (data) => set({ isLinkedinLogin: data }),
  setShowLinkedInButton: (data) => set({ showLinkedInButton: data }),
  setIsNewUpdateAvailable: (data) => set({ showLinkedInButton: data }),
  setFcmTokenStore: (data) => set({ fcmTokenStore: data }),
  onSetUserFromType: (data) => set({ userFromType: data }),
  onSetUserLoginType: (data) => set({ userLoginType: data }),
  onSetGetReferralCode: (data) => set({getReferralCode:data}),
  onSetShowKycModalStore: (data) => set({showKycModalStore:data}),

  setVerifyUserData: (data) => set({ verifyUserData: data }),
  setUserKycStatus: (data) => set({ userKycStatus: data }),
  setContactValue: (data) => set({ contectValue: data }),
  setIsPartialKyc: (data) => set({ isPartialKyc: data }),
  setIsFullKycCompleted: (data) => set({ isFullKycCompleted: data }),
  setVerificationType: (data) => set({ verificationType: data }),
  setVerificationStage: (data) => set({ verificationStage: data }),

  setChannelId: (data) => set({ channelId: data }),
  setHomePostList: (data) => set({ homePostList: data }),
  setGroupId: (data) => set({ groupId: data }),
  setGroupDetails: (data) => set({ groupDetails: data }),
  setUserGroupRole: (data) => set({ userGroupRole: data }),
  setRefreshGroup: (data) => set({ refreshGroup: data }),
  setPostDetails: (data) => set({ postDetails: data }),
  setPostId: (data) => set({ postId: data }),
  setChannelDetails: (data) => set({ channelDetails: data }),
  setForceRedirected: (data) => set({ forceRedirected: data }),
  setIsSkipUpdate: (data) => set({ isSkipUpdate: data }),

  setRefreshProfile: (data) => set({ refreshProfile: data }),
  setRefreshHome: (data) => set({ refreshHome: data }),
  setRefreshProfileFeed: (data) => set({ refreshProfileFeed: data }),
  setRefreshUserChats: (data) => set({ refreshUserChats: data }),
  setRefreshComments: (data) => set({ refreshComments: data }),
  setOtherUserId: (data) => set({ otherUserId: data }),
  setMsgReceiverId: (data) => set({ msgReceiverId: data }),
}));
