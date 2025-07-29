import { createContext } from "react";

interface AppContextType {
  theme: "light" | "dark";
  userInfo: UserInfo | null;
  userId: string | null;
  isAuthenticated: boolean;
  homePostList: any[];
  groupId: string | null;
  groupDetails: GroupDetails | null;
  postId: string | null;
  postDetails: PostDetails;
  channelId: string | null;
  channelDetails: ChannelDetails;
  verifyUserData: Object;
  userKycStatus: number | null;
  isFullKycCompleted: boolean;
  verificationType: string | null;
  forceRedirected: number | null;
  isSkipUpdate: boolean;
  isPartialKyc: boolean;
  userGroupRole: number | null;
  verificationStage: number | null;
  refreshGroup: boolean;
  refreshProfile: boolean;
  refreshHome: boolean;
  refreshProfileFeed: boolean;
  refreshUserChats: boolean;
  refreshComments: boolean;
  otherUserId: number | null;
  msgReceiverId: number | null;

  // Function types
  onSetThemeFunc: (theme: "light" | "dark") => void;
  onSetUserInfoFunc: (userInfo: UserInfo | null) => void;
  onSetAuthenticateFunc: (isAuthenticated: boolean) => void;
  onSetUserIdFunc: (userId: string | null) => void;
  onSetHomePostListFunc: (list: any[]) => void;
  onSetGroupDetailFunc: (groupDetails: GroupDetails | null) => void;
  onSetGroupIdFunc: (groupId: string | null) => void;
  onSetPostDetailFunc: (postDetails: PostDetails) => void;
  onSetPostIdFunc: (postId: string | null) => void;
  onSetChannelDetailFunc: (channelDetails: ChannelDetails) => void;
  onSetChannelIdFunc: (channelId: string | null) => void;
  onSetVerifyUserDataFunc: (data: any) => void;
  onSetKycStatusFunc: (data: any) => void;
  onSetIsKycCompletedFunc: (data: any) => void;
  onSetVerificationTypeFunc: (data: any) => void;
  onSetForceRedirectedFunc: (data: any) => void;
  onSetIsSkipUpdateFunc: (data: any) => void;
  onSetPartialKycFunc: (data: any) => void;
  onSetUserGroupRoleFunc: (data: any) => void;
  onSetVerificationStageFunc: (data: any) => void;
  onSetRefreshGroupFunc: (data: any) => void;
  onSetRefreshProfileFunc: (data: any) => void;
  onSetRefreshHomeFunc: (data: any) => void;
  onSetRefreshProfileFeedFunc: (data: boolean) => void;
  onSetRefreshUserChatsFunc: (data: boolean) => void;
  onSetRefreshCommentsFunc: (data: boolean) => void;
  onSetOtherUserIdFunc: (data: any) => void;
  onSetMsgReceiverIdFunc: (data: any) => void;
}

interface UserInfo {
  // Define the properties of the UserInfo object
}

interface GroupDetails {
  // Define the properties of the GroupDetails object
}

interface PostDetails {
  // Define the properties of the PostDetails object
}

interface ChannelDetails {
  // Define the properties of the ChannelDetails object
}

const GlobalContext = createContext<AppContextType>({
  //State
  theme: "light",
  userInfo: null,
  userId: null,
  isAuthenticated: false,
  homePostList: [],
  groupId: null,
  groupDetails: null,
  postId: null,
  postDetails: {},
  channelId: null,
  channelDetails: {},
  verifyUserData: {},
  userKycStatus: null,
  isFullKycCompleted: false,
  verificationType: null,
  forceRedirected: 0,
  isSkipUpdate: false,
  isPartialKyc: false,
  verificationStage: null,
  userGroupRole: null,
  refreshGroup: false,
  refreshProfile: false,
  refreshHome: false,
  refreshProfileFeed: false,
  refreshComments: false,
  refreshUserChats: false,
  otherUserId: null,
  msgReceiverId: null,

  //Function
  onSetThemeFunc: () => {},
  onSetUserInfoFunc: () => {},
  onSetAuthenticateFunc: () => {},
  onSetUserIdFunc: () => {},
  onSetHomePostListFunc: (list: any[]) => console.log(list),
  onSetGroupDetailFunc: () => {},
  onSetGroupIdFunc: () => {},
  onSetPostDetailFunc: () => {},
  onSetPostIdFunc: () => {},
  onSetChannelDetailFunc: () => {},
  onSetChannelIdFunc: () => {},
  onSetVerifyUserDataFunc: () => {},
  onSetKycStatusFunc: () => {},
  onSetIsKycCompletedFunc: () => {},
  onSetVerificationTypeFunc: () => {},
  onSetForceRedirectedFunc: () => {},
  onSetIsSkipUpdateFunc: () => {},
  onSetPartialKycFunc: () => {},
  onSetVerificationStageFunc: () => {},
  onSetUserGroupRoleFunc: () => {},
  onSetRefreshGroupFunc: () => {},
  onSetRefreshProfileFunc: () => {},
  onSetRefreshHomeFunc: () => {},
  onSetRefreshProfileFeedFunc: () => {},
  onSetRefreshUserChatsFunc: () => {},
  onSetRefreshCommentsFunc: () => {},
  onSetOtherUserIdFunc: () => {},
  onSetMsgReceiverIdFunc: () => {},
});

export default GlobalContext;
