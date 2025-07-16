import { combineReducers } from "redux";
import UpdateFcmReducer from "../slice/UpdateFcmSlice";
import LoginUserReducer from "../slice/login/LoginUserSlice";
import VerifyOtpReducer from "../slice/login/VerifyOtpSlice";
import GetChannelsListReducer from "../slice/channel/ChannelListSlice";
import FetchProfileDetailsReducer from "../slice/profile/ProfiledeatilsSlice";
//notification
import FetchNotificationsReducer from "../slice/notification/FetchNotificationSlice";
import MarkAllNotificationReducer from "../slice/notification/MarkAllReadNotificationSlice";
import MarkReadNotification from "../slice/notification/MarkReadNotification";
import DeleteNotificationReducer from "../slice/notification/DeleteNotificationSlice";
import DeleteAllNotificationReducer from "../slice/notification/DeleteAllNotificationSlice";

import GroupDetailsReducer from "../slice/group/GroupDetailsSlice";
import SearchGroupReducer from "../slice/group/SearchGroupSlice";
import CreatePostReducer from "../slice/post/CreatePostSlice";
import CreateEventPostReducer from "../slice/post/CreateEventPostSlice";

//Profile
import SaveDetailsReducer from "../slice/profile/SavePersonalDetailsSlice";
import MyGroupsReducer from "../slice/group/MyGroupsSlice";
import MyFeedsReducer from "../slice/profile/UserFeedsSlice";
import GetFollowerListReducer from "../slice/profile/GetFollowerListSlice";
import FollowingListReducer from "../slice/profile/FetchFollowingListSlice";
import UpdateProfilePictureReducer from "../slice/profile/UpdateProfilePictureSlice";
import FollowUserReducer from "../slice/profile/FollowUserSlice";
import BlockUserReducer from "../slice/profile/BlockUserSlice";
//New profile api
import SaveBasicInfoReducer from "../slice/profile/SaveBasicInfo";
import SaveContactInfoReducer from "../slice/profile/SavePersonalDetailsSlice";

import AddPreferenceSliceReducer from "../slice/profile/AddPreferenceSlice";
import ProfileFavouriteSliceReducer from "../slice/profile/ProfileFavouriteSlice";

//Drawer
import GroupSubDataReducer from "../slice/channel/ChannelListSlice";

//Group
import CreateGroupReducer from "../slice/group/CreateGroupSlice";
import GroupFeedsListReducer from "../slice/group/GroupFeedsListSlice";
import CreateGroupCategoryReducer from "../slice/channel/CreateGroupCategorySlice";
import CreateCategoryChannelReducer from "../slice/channel/createCategoryChannelSlice";
import JoinGroupReducer from "../slice/group/JoinGroupSlice";
import GroupMembersReducer from "../slice/group/GroupMembersSlice";
import ChannelDetailsReducer from "../slice/channel/GetChannelDetailsSlice";
import ChannelMembersReducer from "../slice/channel/ChannelMembersSlice";
import JoinRequestListReducer from "../slice/group/JoinRequestListSlice";
import JoinRequestUpdateReducer from "../slice/group/joinRequestUpdateSlice";
//new group api
import FollowingGroupsReducer from "../slice/group/FollowingGroupSlice";
//Search
import SearchDataReducer from "../slice/search/SearchDataSlice";
//Chat message
import fetchMessageReducer from "../slice/chat/fetchMessageListSlice";
import fetchMessageRedisReducer from "../slice/chat/fetchMessageRedisSlice";
import MessageUserListReducer from "../slice/chat/MessageUserListSlice";

//Chat user details
import ChatUserDetailsReducer from "../slice/chat/ChatUserDetailsSlice";

//Post Details
import PostDetailReducer from "../slice/post/PostDetailSlice";
import EventPostDetailReducer from "../slice/post/EventPostDetailSlice";
import PostLikeReducer from "../slice/post/postLikeSlice";
import DeleteCommentReducer from "../slice/post/DeleteCommentSlice";
import DeletePostReducer from "../slice/post/DeletePostSlice";

//Report
import SubmitReportReducer from "../slice/report/SubmitReportSlice";

import TransactionHistoryReducer from "../slice/Transaction/GetTransactionHistorySlice";
import FetchCommentsReducer from "../slice/post/FetchCommentsSlice";
import AddCommentReducer from "../slice/post/AddCommentSlice";
import CheckWithDrawalReducer from "../slice/Transaction/CheckWithdrawalSlice";
//referral api
import FetchReferralReducer from "../slice/Transaction/FetchReferralSlice";
import changeKycContactReducer from "../slice/kyc/ChangeKycContactSlice";

import submitPanKycSliceReducer from "../slice/kyc/SubmitPanKycSlice";

import ChannelRoleUpdateSlice from "../slice/channel/ChannelRoleUpdateSlice";
import DeleteAccountReducer from "../slice/profile/setting/DeleteAccountSlice";

///new --------------------------------------------------------
import DiscoverPostReducer from "../slice/home/DiscoverPostSlice";
import HomePostReducer from "../slice/home/HomePostSlice";
import HomePostNextReducer from "../slice/home/HomePostNextSlice";
import TrendingPostReducer from "../slice/home/TrendingPostSlice";
import CategoryPostReducer from "../slice/home/CategoryPostSlice";
//preference list
import PreferenceListReducer from "../slice/profile/PreferenceListSlice";

//channel
import ChannelGroupInfoReducer from "../slice/channel/ChannelGroupInfoSlice";
import ChannelCategoryListReducer from "../slice/channel/ChannelCategoryListSlice";
import DeleteCategorySlice from "../slice/channel/DeleteCategorySlice";
import EditCategoryNameReducer from "../slice/channel/EditCategoryNameSlice";
import ChannelInfoReducer from "../slice/channel/ChannelInfoSlice";

//bank transaction
import GetBankDetailReducer from "../slice/Transaction/GetBankDetailSlice";
import InsertbankDetailReducer from "../slice/Transaction/InsertBankDetailSlice";
import LogoutUserSlice from "../slice/login/LogoutUserSlice";
import EventLeaderBoardSlice from "../slice/post/EventLeaderBoardSlice";
import ClaimGroupSlice from "../slice/group/ClaimGroupSlice";
import MuteGroupSlice from "../slice/group/MuteGroupSlice";
import DynamicContentSlice from "../slice/home/DynamicContentSlice";
import DynamicContentStatusSlice from "../slice/home/DynamicContentStatusSlice";
import DynamicActionSlice from "../slice/home/DynamicActionSlice";
import GroupinfoSlice from "../slice/group/GroupinfoSlice";
import DeleteGroupSlice from "../slice/group/DeleteGroupSlice";
import DeleteCommentSlice from "../slice/post/DeleteCommentSlice";
import NewFeedCountSlice from "../slice/home/NewFeedCountSlice";
import AllGroupSlice from "../slice/group/AllGroupSlice";
import GroupUnreadSlice from "../slice/group/GroupUnreadSlice";
import TrendingLiteGroupSlice from "../slice/group/TrendingLiteGroupSlice";
import ProfileMyDetailsSlice from "../slice/profile/ProfileMyDetailsSlice";
import ProfileMyFeedsSlice from "../slice/profile/ProfileMyFeedsSlice";
import SendPushNotificationSlice from "../slice/chat/SendPushNotificationSlice";
import channelAllMembersSlice from "../slice/channel/ChannelAllMembersSlice";
import kycDetailsSlice from "../slice/kyc/kycDetailsSlice";
import { uploadImageApiSlice } from "../slice/uploadImage-api-slice";

const appReducer = combineReducers({
  UpdateFcmData: UpdateFcmReducer,
  loginUserApi: LoginUserReducer,
  verifyOtpApi: VerifyOtpReducer,
  logoutUserApi: LogoutUserSlice,
  eventLeaderBoardApi: EventLeaderBoardSlice,

  GetChannelsList: GetChannelsListReducer,
  fetchProfileDetails: FetchProfileDetailsReducer,
  fetchNotificationsData: FetchNotificationsReducer,
  groupDetailsData: GroupDetailsReducer,
  searchGroupListData: SearchGroupReducer,
  createPostData: CreatePostReducer,
  createEventPostData: CreateEventPostReducer,
  unreadgroupSlice: GroupUnreadSlice,
  //Drawer
  GroupSubData: GroupSubDataReducer,
  //Search all data
  searchAllData: SearchDataReducer,
  createGroupData: CreateGroupReducer,

  //Profile
  savePersonalDetailsData: SaveDetailsReducer,
  myGroupsListData: MyGroupsReducer,
  myFeedsListData: MyFeedsReducer,
  getFollowerListData: GetFollowerListReducer,
  followingList: FollowingListReducer,
  updateProfilePictureData: UpdateProfilePictureReducer,
  followUserData: FollowUserReducer,
  blockUserData: BlockUserReducer,
  myProfileData: ProfileMyDetailsSlice,
  myFeedData: ProfileMyFeedsSlice,

  // add preference
  addPreferenceData: AddPreferenceSliceReducer,
  profileFavouriteData: ProfileFavouriteSliceReducer,
  //new
  saveBasicInfoResponse: SaveBasicInfoReducer,
  saveContactInfoResponse: SaveContactInfoReducer,
  //Chat
  fetchMessageList: fetchMessageReducer,
  fetchMessageRedisList: fetchMessageRedisReducer,
  messageUserList: MessageUserListReducer,
  chatUserDetails: ChatUserDetailsReducer,

  //Post
  postDetailData: PostDetailReducer,
  eventPostDetailData: EventPostDetailReducer,
  postLikeData: PostLikeReducer,
  groupFeedsListData: GroupFeedsListReducer,
  deleteCommentData: DeleteCommentReducer,
  deletePostData: DeletePostReducer,
  delete_comment: DeleteCommentSlice,

  //Report
  submitReportData: SubmitReportReducer,

  //Group
  trendingLiteGroup: TrendingLiteGroupSlice,
  allGroupSlice: AllGroupSlice,
  deleteGroupSlice: DeleteGroupSlice,
  createCategoryChannel: CreateCategoryChannelReducer,
  joinGroupData: JoinGroupReducer,
  groupMembersData: GroupMembersReducer,
  channelDetails: ChannelDetailsReducer,
  channelMembersData: ChannelMembersReducer,
  channelRoleUpdateData: ChannelRoleUpdateSlice,
  claimGroup: ClaimGroupSlice,
  mutegroup: MuteGroupSlice,
  groupInfoSlice: GroupinfoSlice,
  joinRequestListData: JoinRequestListReducer,
  joinRequestUpdateData: JoinRequestUpdateReducer,
  //new group
  followingGroupsResponse: FollowingGroupsReducer,
  //Transaction
  transactionHistortData: TransactionHistoryReducer,
  fetchCommentsData: FetchCommentsReducer,
  addCommentData: AddCommentReducer,

  //referral
  fetchReferralData: FetchReferralReducer,

  changeKycContactData: changeKycContactReducer,
  submitPanData: submitPanKycSliceReducer,
  dynamicActionSlice: DynamicActionSlice,
  deleteAccountData: DeleteAccountReducer,
  //Notification
  markAllNotificationData: MarkAllNotificationReducer,
  markReadNotification: MarkReadNotification,
  deleteNotification: DeleteNotificationReducer,
  deleteAllNotification: DeleteAllNotificationReducer,
  //new ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  DiscoverPostResponse: DiscoverPostReducer,
  HomePostResponse: HomePostReducer,
  HomePostNextResponse: HomePostNextReducer,
  TrendingPostResponse: TrendingPostReducer,
  CategoryPostResponse: CategoryPostReducer,
  newFeedSlice: NewFeedCountSlice,

  dynamicContent: DynamicContentSlice,
  dynamicContentStatusSlice: DynamicContentStatusSlice,
  //preference list
  preferenceListResponse: PreferenceListReducer,

  //channel
  channelGroupInfoResponse: ChannelGroupInfoReducer,
  channelCategoryListResponse: ChannelCategoryListReducer,
  deleteCategoryResponse: DeleteCategorySlice,
  editCategoryNameResponse: EditCategoryNameReducer,
  createGroupCategory: CreateGroupCategoryReducer,
  //Channel Module
  channelInfoResponse: ChannelInfoReducer,
  channelAllMembers: channelAllMembersSlice,

  //bank
  getBankDetailData: GetBankDetailReducer,
  insertBankDetailData: InsertbankDetailReducer,
  checkWithDrawalData: CheckWithDrawalReducer,

  // user data
  pushNotificationResponse: SendPushNotificationSlice,
  kycDetailsResponse: kycDetailsSlice,
  [uploadImageApiSlice.reducerPath]: uploadImageApiSlice.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    state = undefined; // clears entire redux state
  }
  return appReducer(state, action);
};

export default rootReducer;
