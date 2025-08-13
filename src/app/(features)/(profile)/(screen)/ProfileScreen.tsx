import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useReducer,
} from "react";
import {
  Alert,
  Linking,
  Modal,
  FlatList,
  TouchableOpacity,
  View,
  InteractionManager,
  ActivityIndicator,
  BackHandler,
  Keyboard,
} from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import BottomSheet from "@gorhom/bottom-sheet";
import useProfileViewModel from "../viewModel/ProfileViewModel";
import ProfileDetailsComponent from "../component/ProfileDetailsComponent";
import { ArrowLeftBigIcon, QRIcon, SettingsIcon } from "@/assets/DarkIcon";
import WalletComponent from "../component/WalletComponent";
import useMyPostsViewModel from "@/structure/viewModels/profile/MyPostsViewModel";
import { useAppStore } from "@/zustand/zustandStore";
import { showToast } from "@/components/atom/ToastMessageComponent";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import MyPostContainer from "@/components/element/MyPostContainer";
import PostLoaderComponent from "@/components/element/PostLoaderComponent";
import useCreatePostViewModel from "@/viewModels/CreatePostViewModel";
import SelectImageMediaSheet from "../../(group)/component/BottomSheet/SelectImageMediaSheet";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import TransactionViewModel from "../viewModel/TransactionViewModel";
import { onShare } from "@/utils/Helpers";
import { onFetchEventLeaderBoard } from "@/redux/reducer/post/EventLeaderBoard";
import { onDeletePost } from "@/redux/reducer/post/DeletePost";
import ProfileQRModal from "@/components/modal/ProfileQRModal";
import NotificationPermissionModal from "@/components/modal/NotificationPermissionModal";
import * as Notifications from "expo-notifications";
import { useCameraPermission } from "react-native-vision-camera";
import { useIdStore } from "@/customHooks/CommentUpdateStore";
import Clipboard from "@react-native-clipboard/clipboard";
import { onFetchMyUserFeeds } from "@/redux/reducer/Profile/FetchUserFeeds";
import { setIsLoading, setMyUserFeedData } from "@/redux/slice/profile/ProfileMyFeedsSlice";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import PostOptionComponent from "./profile/Component/PostOptionComponent";
import ShareProfileComponent from "./profile/Component/ShareProfileComponent";
import WithdrawComponent from "./profile/Component/WithdrawComponent";
import WithdrawAmountComponent from "./profile/Component/WithdrawAmountComponent";
import AddMoneyComponent from "./profile/Component/AddMoneyComponent";
import NoFeedComponent from "./profile/Component/NoFeedComponent";
import CreatePostComponent from "./profile/Component/CreatePostComponent";
import LeaderBoardComponent from "./profile/Component/LeaderBoardComponent";
import ProfileButtonViewComponent from "./profile/Component/ProfileButtonViewComponent";
import OpenVerifyComponent from "./profile/Component/OpenVerifyComponent";
import FeedTitleComponent from "./profile/Component/FeedTitleComponent";
import { shallowEqual, useSelector } from "react-redux";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { useIsFocused } from '@react-navigation/native';
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import { getLoggedMobile, storeUserKycStatus } from "@/localDB/LocalStroage";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import CreatePostView from "./profile/Component/CreatePostView";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommentsBottomSheet from "../../(viewPost)/component/CommentsBottomSheet";
import useKeyboardVisible from "@/app/hooks/useKeyboardVisible";
import { FlashList } from "@shopify/flash-list";
import { calculateHeight } from "@/utils/ImageHelper";

// Performance constants for optimal rendering
const POSTS_PER_BATCH = 2;
const WINDOW_SIZE = 7;
const MAX_POSTS_LIMIT = 100; // Prevent infinite loading

// Optimized debounce utility
const createDebouncedFunction = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  const debouncedFn = (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func.apply(null, args);
    }, delay);
  };
  
  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };
  
  return debouncedFn;
};

// Simplified UI State for better performance
interface UIState {
  modals: {
    isModalVisible: boolean;
    kycModalVisible: boolean;
    modalVisible: boolean;
    showQRModal: boolean;
  };
  ui: {
    loading: boolean;
    expandedItem: boolean;
    isExpanded: boolean;
  };
  data: {
    deletePost: string | undefined;
    amount: string;
    currentPlaying: string | null;
  };
}

type UIAction = 
  | { type: 'SET_MODAL'; key: keyof UIState['modals']; payload: boolean }
  | { type: 'SET_UI'; key: keyof UIState['ui']; payload: boolean }
  | { type: 'SET_DATA'; key: keyof UIState['data']; payload: any }
  | { type: 'BULK_UPDATE'; payload: Partial<UIState> }
  | { type: 'RESET_STATE' };

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'SET_MODAL':
      return {
        ...state,
        modals: { ...state.modals, [action.key]: action.payload }
      };
    case 'SET_UI':
      return {
        ...state,
        ui: { ...state.ui, [action.key]: action.payload }
      };
    case 'SET_DATA':
      return {
        ...state,
        data: { ...state.data, [action.key]: action.payload }
      };
    case 'BULK_UPDATE':
      return { ...state, ...action.payload };
    case 'RESET_STATE':
      return {
        modals: {
          isModalVisible: false,
          kycModalVisible: false,
          modalVisible: false,
          showQRModal: false,
        },
        ui: {
          loading: false,
          expandedItem: false,
          isExpanded: true,
        },
        data: {
          deletePost: undefined,
          amount: "",
          currentPlaying: null,
        }
      };
    default:
      return state;
  }
};

// Aggressively memoized components with custom comparisons
const MemoizedMyPostContainer = React.memo(MyPostContainer, (prevProps, nextProps) => {
  return (
    prevProps.data?.id === nextProps.data?.id &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.index === nextProps.index
  );
});
const MemoizedProfileDetailsComponent = React.memo(ProfileDetailsComponent);
const MemoizedWalletComponent = React.memo(WalletComponent);
const MemoizedLeaderBoardComponent = React.memo(LeaderBoardComponent);

// Lightweight post item component
const PostItem = React.memo(({ 
  item, 
  index, 
  currentPlaying, 
  onPressComment, 
  onPressPostDelete, 
  setCurrentPlaying, 
  userInfo
}: {
  item: any;
  index: number;
  currentPlaying: string | null;
  onPressComment: (postId: string, userId: string) => void;
  onPressPostDelete: () => void;
  setCurrentPlaying: (id: string | null) => void;
  userInfo?: any;
}) => {
  if (!item?.id) return null;
  
  return (
    <MemoizedMyPostContainer
      isHome={true}
      isProfile
      Type="Profile"
      data={{...item, post_by: {...item.post_by, profile_pic: userInfo?.profile_pic, full_name: userInfo?.full_name}}}
      index={index}
      onPressComment={onPressComment}
      onPressPostDelete={onPressPostDelete}
      isPlaying={currentPlaying === item.id}
      setCurrentPlaying={setCurrentPlaying}
    />
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item?.id === nextProps.item?.id &&
    prevProps.currentPlaying === nextProps.currentPlaying &&
    prevProps.index === nextProps.index &&
    prevProps.userInfo?.profile_pic === nextProps.userInfo?.profile_pic &&
    prevProps.userInfo?.full_name === nextProps.userInfo?.full_name
  );
});

const ProfileScreen = () => {
  // FIXED: Call useScreenTracking immediately at component start
  useScreenTracking("ProfileScreen");
  
  const { isNotification } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  // FIXED: All hooks called at the top level immediately
  const appStore = useAppStore();
  const { 
    userId, 
    userLoginType, 
    onSetUserFromType, 
    setIsVerified, 
    onSetShowKycModalStore 
  } = appStore;
  
  const { hasPermission, requestPermission } = useCameraPermission();
  const { setID } = useIdStore();
  const { setPostId, setPostedByUserId } = usePostDetailStore();
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  
  // FIXED: All custom hooks called immediately at top level
  const profileViewModel = useProfileViewModel();
  const myPostsViewModel = useMyPostsViewModel();
  const postCommentsHook = usePostCommentsHook();
  const userStoreDataModel = UserStoreDataModel();
  const createPostHook: any = useCreatePostViewModel();
  const transactionHook = TransactionViewModel();
  
  // Video store selectors
  const videoRef = useVideoPlayerStore(useCallback((state) => state.videoRef, []));
  const isVideoPlaying = useVideoPlayerStore(useCallback((state) => state.isPlay, []));

  // Redux selectors with error boundaries
  const postDetailResponse = useAppSelector(
    useCallback((state) => state.myFeedData || { updatedData: [], isLoaded: true }, [])
  );
  const profileDetailResponse = useAppSelector(
    useCallback((state) => state.myProfileData || { data: null }, [])
  );
  const eventLeaderBoard = useAppSelector(
    useCallback((state) => state.eventLeaderBoardApi || {}, [])
  );
  const getBankResponse = useSelector(
    useCallback((state: any) => state.getBankDetailData || {}, []),
    shallowEqual
  );
  const submitPostResponse = useSelector(
    useCallback((state: any) => state?.createPostData || {}, []),
    shallowEqual
  );

  // UI State Management
  const [uiState, dispatchUI] = useReducer(uiReducer, {
    modals: {
      isModalVisible: false,
      kycModalVisible: false,
      modalVisible: false,
      showQRModal: false,
    },
    ui: {
      loading: true,
      expandedItem: false,
      isExpanded: true,
    },
    data: {
      deletePost: undefined,
      amount: "",
      currentPlaying: null,
    }
  });
  
  // Component ready state
  const [isComponentReady, setIsComponentReady] = useState(false);
  const CommentSheetRef = useRef<BottomSheet>(null);
  // Refs for cleanup and performance
  const cleanupRef = useRef<Array<() => void>>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const settingRef = useRef(false);
  
  // Bottom sheet refs
  const ShareProfileRef = useRef<BottomSheet>(null);
  const AddMoneyRef = useRef<BottomSheet>(null);
  const DeletePostRef = useRef<BottomSheet>(null);
  const WithdrawAmount = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlashList<any>>(null);
  const [commentIndex, setCommentIndex] = useState(-1);
  const keyboardVisible = useKeyboardVisible();

  // Memoized profile details with safety
  const profileDetails = useMemo(() => {
    return profileDetailResponse?.data || {};
  }, [profileDetailResponse?.data]);

  // Optimized name calculations
  const { fname, lname } = useMemo(() => {
    const fullName = profileDetails?.full_name;
    if (!fullName || typeof fullName !== 'string') {
      return { fname: "", lname: "" };
    }
    const parts = fullName.trim().split(" ");
    return {
      fname: parts[0] || "",
      lname: parts[1] || "",
    };
  }, [profileDetails?.full_name]);

  // Cached mobile check
  const isLoginMobile = useMemo(() => {
    try {
      return getLoggedMobile();
    } catch {
      return 0;
    }
  }, []);

  // OPTIMIZED: Fast posts processing with limits
  const processedPosts = useMemo(() => {
    const rawData = postDetailResponse?.updatedData;
    if (!Array.isArray(rawData) || rawData.length === 0) {
      return [];
    }
    
    // Fast deduplication with early exit
    const seen = new Set();
    const result = [];
    
    for (let i = 0; i < Math.min(rawData.length, MAX_POSTS_LIMIT); i++) {
      const post = rawData[i];
      if (post?.id && !seen.has(post.id)) {
        seen.add(post.id);
        result.push(post);
      }
    }
    
    return result;
  }, [postDetailResponse?.updatedData]);

  // Optimized debounced scroll handler
  const debouncedEndReached: any = useCallback(() => {
    if (!postDetailResponse?.isLoaded && processedPosts.length > 3 && processedPosts.length < profileDetails?.post_count) {
        dispatch(setIsLoading(true));
       updatePostList();
    }
  }, [dispatch, userId, postDetailResponse?.isLoaded, processedPosts.length]);

  const updatePostList = async () => {
    var userFeedNewData: any =  await dispatch(
      onFetchMyUserFeeds({
        userId: userId,
        profileId: userId,
        lastCount: processedPosts.length,
      })
    );
    if(userFeedNewData.payload.success){
      var newData = await Promise.all(userFeedNewData?.payload?.data?.map(async (item) => {
                        if(item?.file_type == "image"){
                          return {
                            ...item,
                            display_height: (await Promise.all(calculateHeight(item)))
                          };
                        }
                        return {
                          ...item
                        };
                      })); 
      if(newData.length > 0){
        dispatch(setMyUserFeedData([...processedPosts, ...newData]));
      }
    }
  }

  useEffect(() => {
    getProfileFeedDetails();
  }, [])

  const getProfileFeedDetails = async () => {
  var userFeedData: any =  await dispatch(
      onFetchMyUserFeeds({
        userId: userId,
        profileId: userId,
        lastCount: 0,
      })
    );
    if(userFeedData.payload.success){
      var newData = await Promise.all(userFeedNewData?.payload?.data?.map(async (item) => {
        if(item?.file_type == "image"){
          return {
            ...item,
            display_height: (await Promise.all(calculateHeight(item)))
          };
        }
        return {
          ...item
        };
      })); 
          
      if(newData.length > 0){
        dispatch(setMyUserFeedData(newData));
    }
  }
  };

  // FIXED: Component ready effect with proper cleanup
  useEffect(() => {
    // Quick component ready state
    const readyTimer = setTimeout(() => {
      setIsComponentReady(true);
      dispatchUI({ type: 'SET_UI', key: 'loading', payload: false });
    },10);
    
    cleanupRef.current.push(() => clearTimeout(readyTimer));

    const backHandler = BackHandler.addEventListener(
                  "hardwareBackPress",
                  () => {
                   if(keyboardVisible){
                                     Keyboard.dismiss();
                                     return true;
                                   }
                                   if(commentIndex != -1){
                                     CommentSheetRef.current.close();
                                     return true;
                                   }

                    if (router.canGoBack()) {
                      router.back();
                    }
                    else{
                      router.replace("/DashboardScreen");
                    }
                    return true;
                  }
                );
    
    // Cleanup function
    return () => {
      backHandler.remove();
      // Cancel debounced functions
      debouncedEndReached.cancel?.();
      
      // Clear all timeouts
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Pause video safely
      if (videoRef && isVideoPlaying) {
        try {
          InteractionManager.runAfterInteractions(() => {
            videoRef.pauseAsync?.();
          });
        } catch (e) {
          console.warn('Video pause failed:', e);
        }
      }
      
      // Run all cleanup functions
      cleanupRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (e) {
          console.warn('Cleanup failed:', e);
        }
      });
    };
  }, []);

  // Background effects after component is ready
  useEffect(() => {
    if (!isComponentReady || !userId) return;
    
    if (userLoginType === "event") {
      InteractionManager.runAfterInteractions(() => {
        dispatch(onFetchEventLeaderBoard({ user_id: userId }));
      });
    }
  }, [isComponentReady, dispatch, userId, userLoginType]);

  useEffect(() => {
    if (!isComponentReady || !profileDetails?.kyc_details || !isFocused) return;
    
    InteractionManager.runAfterInteractions(() => {
      const userTableKyc = profileDetails.kyc_details.status;
      if (userTableKyc === 1) {
        if (getBankResponse?.data?.account_number) {
          transactionHook.updateBankDetail?.();
        } else {
          transactionHook.onFetchDetailHandler?.();
        }
      }
    });
  }, [
    isComponentReady,
    profileDetails?.kyc_details?.status,
    getBankResponse?.data?.account_number,
    isFocused
  ]);

  // Optimized callback functions
  const handleModalToggle = useCallback((key: keyof UIState['modals'], value?: boolean) => {
    dispatchUI({ 
      type: 'SET_MODAL', 
      key, 
      payload: value !== undefined ? value : !uiState.modals[key] 
    });
  }, [uiState.modals]);

  const handleUIToggle = useCallback((key: keyof UIState['ui'], value?: boolean) => {
    dispatchUI({ 
      type: 'SET_UI', 
      key, 
      payload: value !== undefined ? value : !uiState.ui[key] 
    });
  }, [uiState.ui]);

  const handleDataUpdate = useCallback((key: keyof UIState['data'], payload: any) => {
    dispatchUI({ type: 'SET_DATA', key, payload });
  }, []);

  // Simple callbacks
  const onPressAddMoney = useCallback(() => {
    showToast({
      type: "success",
      text1: "Feature Unavailable",
      text2: "Adding money is temporarily unavailable.",
    });
  }, []);

  const onPressSubmitMoney = useCallback(() => {
    AddMoneyRef.current?.close();
    showToast({
      type: "success",
      text1: "Feature Unavailable", 
      text2: "Adding money is temporarily unavailable.",
    });
  }, []);

  // Optimized KYC handler
  const onKycPress = useCallback(async () => {
    if (!profileDetails?.kyc_details) return;
    
    try {
      const kycData = profileDetails.kyc_details;
      const kycStatus = kycData?.status || 0;
      const stepStatus = Number(kycData?.finished_step || 0);
      const stepType = kycData?.identification_type;

      const handleKycCompletion = async (path: any, params = {}) => {
        onSetShowKycModalStore(false);
        await storeUserKycStatus(1);
        setIsVerified(1);
        router.push({ pathname: path, params });
      };

      onSetUserFromType(stepType === "google_auth" ? "google" : stepType);

      if (kycData?.id) {
        const path = isLoginMobile === 0 ? "/SelectSocialkyc" : "/KycOnboardHoc";
        switch (kycStatus) {
          case 0:
            if (stepStatus === 1 || stepStatus === 2) {
              router.push({
                pathname: "/KycOnboardHoc",
                params: { kycStepData: stepStatus },
              });
            }
            break;
          case 6:
            router.push("/KycOnboardHoc");
            break;
          case 2:
            await handleKycCompletion("/SuccessfullVerificationModal", { status: "pending" });
            break;
          case -1:
            router.push({
              pathname: path,
              params: { kycStepData: 0 },
            });
            break;
          case 3:
            router.push({
              pathname: "/SuccessfullVerificationModal",
              params: { status: "reject" },
            });
            break;
          case 5:
            await handleKycCompletion("/SuccessfullVerificationModal", { status: "panPending" });
            break;
          case 1:
            await handleKycCompletion("/DashboardScreen");
            break;
          case 4:
            await handleKycCompletion("/KycOnboardHoc", {
              kycStepData: kycData?.ask_profile ? 6 : 5,
              type: 0,
            });
            break;
          default:
            router.replace("/DashboardScreen");
        }
      } else {
        let kycStepData = 0;
        if (stepStatus === 1) kycStepData = 1;
        else if (stepStatus === 2) kycStepData = stepType === "event" ? 3 : 2;

        const path = isLoginMobile === 0 ? "/SelectSocialkyc" : "/KycOnboardHoc";
        router.push({ pathname: path, params: { kycStepData, type: 0 } });
      }
    } catch (error) {
      console.warn('KYC press error:', error);
    }
  }, [profileDetails?.kyc_details, isLoginMobile, onSetUserFromType, onSetShowKycModalStore, setIsVerified]);

  const onPressWallet = useCallback(async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        handleModalToggle('isModalVisible', true);
      } else {
        onCheckKychandler();
      }
    } catch (error) {
      console.warn('Wallet press error:', error);
    }
  }, [handleModalToggle]);

  const onCheckKychandler = useCallback(() => {
    try {
      transactionHook.onFetchDetailHandler?.();
      const userTableKyc = profileDetails?.kyc_details?.status;
      if (userTableKyc === 1) {
        WithdrawAmount.current?.expand();
        if (getBankResponse?.data?.account_number) {
          transactionHook.setIsOldAcc?.(1);
        }
      } else {
        handleModalToggle('kycModalVisible', true);
      }
    } catch (error) {
      console.warn('KYC check error:', error);
    }
  }, [profileDetails?.kyc_details?.status, getBankResponse?.data?.account_number, handleModalToggle]);

  const kycHandler = useCallback(() => {
    setTimeout(() => {
      onCheckKychandler();
    }, 100);
  }, [onCheckKychandler]);

  const askNotificationPermission = useCallback(() => {
    handleModalToggle('isModalVisible', false);
    setTimeout(async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: true, allowSound: true },
        });

        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "You have denied notification permissions. Enable it from settings.",
            [
              { text: "Yes", onPress: () => Linking.openSettings() },
              { text: "No", onPress: kycHandler },
            ]
          );
        } else {
          kycHandler();
        }
      } catch (error) {
        console.warn('Notification permission error:', error);
      }
    }, 100);
  }, [kycHandler, handleModalToggle]);

  const onPressCommentHandler = useCallback((postId: any, userId: any) => {
    dispatch(commentLoading(true));
    CommentSheetRef.current.expand();
    // router.push("/Comment");
    postCommentsHook.onFetchCommentHandler?.(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  }, [dispatch, postCommentsHook.onFetchCommentHandler, setPostId, setPostedByUserId]);

  const onPressDeletePost = useCallback(() => {
    if (!uiState.data.deletePost) return;
    dispatch(
      onDeletePost({
        user_id: userId,
        post_id: uiState.data.deletePost,
      })
    );
  }, [dispatch, userId, uiState.data.deletePost]);

  const goBackPress = useCallback(() => {
    if (isNotification) {
      userStoreDataModel.updateUserData?.();
    } else {
      router.back();
    }
  }, [isNotification, userStoreDataModel.updateUserData]);

  const onSettingsPress = useCallback(() => {
    if (settingRef.current) return;
    
    settingRef.current = true;
    router.push("/SettingScreen");

    timeoutRef.current = setTimeout(() => {
      settingRef.current = false;
    }, 400);
  }, []);

  const copyToClipboard = useCallback((id: string) => {
    if (!id) return;
    const profileUrl = `https://qoneqt.com/profile/${id}`;
    Clipboard.setString(profileUrl);
    showToast({ type: "success", text1: "Link copied to clipboard!" });
  }, []);

  // FlatList render functions
  const renderItem = useCallback(({ item, index }) => (
    <PostItem
      item={item}
      index={index}
      currentPlaying={uiState.data.currentPlaying}
      onPressComment={(postId: string, userId: string) => {
        setID("6");
        onPressCommentHandler(postId, userId);
      }}
      onPressPostDelete={() => {
        handleDataUpdate('deletePost', item?.id);
        DeletePostRef.current?.expand();
      }}
      setCurrentPlaying={(id: string | null) => {
        handleDataUpdate('currentPlaying', id);
      }}
      userInfo={profileDetails}
    />
  ), [uiState.data.currentPlaying, onPressCommentHandler, setID, handleDataUpdate]);

  const keyExtractor = useCallback((item: any, index: number) => 
    item?.id ? `post-${item.id}` : `empty-${index}`, []);

  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 350,
    offset: 350 * index,
    index,
  }), []);

  const renderFooter = useCallback(() => {
    if (!myPostsViewModel.myFeedLoading) return <View style={{ padding: 20, alignItems: 'center', marginBottom: 20, height: 100 }} />;
    
    return (
      <View style={{ padding: 20, alignItems: 'center', marginBottom: 20, height: 100 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }, [myPostsViewModel.myFeedLoading]);

  // Memoized modal component
  const OpenVerifyModal = useCallback(({ isVisible }: { isVisible: boolean }) => (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <OpenVerifyComponent
        setKycModalVisible={(visible: boolean) => handleModalToggle('kycModalVisible', visible)}
        verifyPress={() => {
          onKycPress();
          handleModalToggle('kycModalVisible', false);
        }}
      />
    </Modal>
  ), [onKycPress, handleModalToggle]);

  // Early return for loading state
  if (!isComponentReady) {
    return (
      <ViewWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </ViewWrapper>
    );
  }

  const onChangeSheetIndex = (index: number) => {
    setCommentIndex(index);
  }
    

  return (
    <ViewWrapper>
      <ProfileQRModal
        visible={uiState.modals.showQRModal}
        onClose={() => handleModalToggle('showQRModal', false)}
        qrValue={profileDetails?.id}
        profilePic={profileDetails?.profile_pic}
        name={profileDetails?.full_name}
        isVerified={profileDetails?.kyc_status}
        onEventCreate={({ postData, fromEventID }) => {
          console.log("dsalkfhsdfjk", JSON.stringify({ postData, fromEventID }))
          router.push({
            pathname: "/CreateEventPostScreen",
            params: { postData, fromEventID },
          });
        }}
      />

      {/* Header */}
      <View
        style={{
          width: "100%",
          height: 60,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          paddingHorizontal: 16,
          paddingTop: 10,
        }}
      >
        <TouchableOpacity onPress={goBackPress}>
          <ArrowLeftBigIcon />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity 
            onPress={() => {
              if (hasPermission) {
                handleModalToggle('showQRModal', true);
              } else {
                requestPermission();
              }
            }} 
            style={{ marginRight: 10 }}
          >
            <QRIcon />
          </TouchableOpacity>

          <TouchableOpacity onPress={onSettingsPress}>
            <SettingsIcon />
          </TouchableOpacity>
        </View>
      </View>

      <OpenVerifyModal isVisible={uiState.modals.kycModalVisible} />

      {/* Main Content - Optimized FlatList */}
      <FlashList
        ref={flatListRef}
        data={ (profileDetails?.post_count) > 0 ? processedPosts : []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={debouncedEndReached}
        onEndReachedThreshold={0.8}
        removeClippedSubviews={true}
        // @ts-ignore
        maxToRenderPerBatch={6}
        overScrollMode="never"
        getItemLayout={getItemLayout}
        updateCellsBatchingPeriod={100}
        windowSize={8}
        initialNumToRender={4}
        estimatedItemSize={420}
        ListHeaderComponent={
          <TouchableOpacity activeOpacity={1}>
            <MemoizedProfileDetailsComponent
              loading={uiState.ui.loading}
              userId={profileDetails?.id || ""}
              profilePic={profileDetails?.profile_pic || ""}
              postCount={profileDetails?.post_count || 0}
              follower={profileDetails?.follower_count || 0}
              following={profileDetails?.following_count || 0}
              firstName={fname}
              lastName={lname}
              socialName={profileDetails?.social_name || ""}
              userName={profileDetails?.username || ""}
              Headline={profileDetails?.about || ""}
              position="pending"
              onPressFollowers={profileViewModel.onPressFollower}
              onPressFollowings={profileViewModel.onPressFollowing}
              joinDate={profileDetails?.time}
              isVerified={profileDetails?.kyc_status}
              toggleModal={() => handleModalToggle('modalVisible')}
            />

            <ProfileButtonViewComponent
              profileDetails={profileDetails}
              toggleItem={() => handleUIToggle('expandedItem')}
              expandedItem={uiState.ui.expandedItem}
              fname={fname}
              lname={lname}
              ShareProfile={() => ShareProfileRef.current?.expand()}
            />

            {uiState.ui.expandedItem && (
              <MemoizedLeaderBoardComponent eventLeaderBoard={eventLeaderBoard} />
            )}

            <MemoizedWalletComponent
              onAddMoney={onPressAddMoney}
              onTransaction={() => router.push("/transaction")}
              onWithdraw={onPressWallet}
              walletBal={profileDetails?.total_inr || 0}
            />

            <FeedTitleComponent profileDetails={profileDetails} />
          </TouchableOpacity>
        }
        ListFooterComponent={renderFooter}
        ListEmptyComponent={<NoFeedComponent />}
        showsVerticalScrollIndicator={false}
      />
      <CreatePostView onPress={() => {router.push("/CreatePostScreen")}} insets={insets} />

      <SelectImageMediaSheet
        imageMediaRef={createPostHook.imageMediaRef}
        imageFileData={createPostHook.imageFileData}
        imageData={createPostHook.imageFileData?.uri || createPostHook.imageFileData?.url || ''}
        onPressCamera={createPostHook.onTakeSelfieHandler}
        onPressGallary={createPostHook.onPressGallaryTwo}
      />

      {/* Bottom Sheets */}
      <BottomSheetWrap snapPoints={["20%", "50%"]} bottomSheetRef={AddMoneyRef}>
        <AddMoneyComponent
          onPressSubmitMoney={onPressSubmitMoney}
          cancelHandler={() => AddMoneyRef.current?.close()}
        />
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={transactionHook.isWithDrawAmount ? ["50%", "60%"] : ["50%", "90%"]}
        bottomSheetRef={WithdrawAmount}
      >
        {transactionHook.isWithDrawAmount ? (
          <WithdrawComponent
            profileDetails={profileDetails}
            amount={uiState.data.amount}
            setAmount={(amount: string) => handleDataUpdate('amount', amount)}
            withdrawLoading={transactionHook.withdrawLoading}
            withdrawPress={() => {
              transactionHook.setIsWithDrawAmount(false);
              transactionHook.onWithdrawHandler({ amount: Number(uiState.data.amount) });
              handleDataUpdate('amount', "");
              WithdrawAmount.current?.close();
            }}
            cancelPress={() => {
              WithdrawAmount.current?.close();
              transactionHook.setIsWithDrawAmount(false);
            }}
          />
        ) : (
          <WithdrawAmountComponent
            setIsExpanded={(expanded: boolean) => handleUIToggle('isExpanded', expanded)}
            isExpanded={uiState.ui.isExpanded}
            accontNumber={transactionHook.accountNumber}
            onChangeAccountNumber={transactionHook.onChangeAccountNumber}
            code={transactionHook.ifscCode}
            onChangeCode={transactionHook.onChangeCode}
            accountHolderName={transactionHook.accountHolder}
            onChangeHolderName={transactionHook.onChangeHolderName}
            bankName={transactionHook.bankName}
            onChangeBankName={transactionHook.onChangeBankName}
            branchName={transactionHook.branchName}
            onChangeBranchName={transactionHook.onChangeBranchName}
            insertLoading={transactionHook.insertLoading}
            withdrawLoading={transactionHook.withdrawLoading}
            onInsertBankHandler={transactionHook.onInsertBankHandler}
            onPressWithdrawHandler={() => transactionHook.setIsWithDrawAmount(true)}
            isOldAcc={transactionHook.isOldAcc}
            isOldAccount={getBankResponse?.data?.account_number}
            cancelPress={() => WithdrawAmount.current?.close()}
          />
        )}
      </BottomSheetWrap>

      <BottomSheetWrap snapPoints={["20%", "30%"]} bottomSheetRef={ShareProfileRef}>
        <ShareProfileComponent
          onShare={() => {
            onShare({
              id: `https://qoneqt.com/profile/${profileDetails?.id}`,
            });
          }}
          copyToClipboard={() => copyToClipboard(profileDetails?.id || "")}
        />
      </BottomSheetWrap>

      <BottomSheetWrap snapPoints={["20%", "50%"]} bottomSheetRef={DeletePostRef}>
        <PostOptionComponent onPressDeletePost={onPressDeletePost} />
      </BottomSheetWrap>

      <NotificationPermissionModal
        visible={uiState.modals.isModalVisible}
        onClose={() => {
          handleModalToggle('isModalVisible', false);
          kycHandler();
        }}
        allowPermission={askNotificationPermission}
      />

<CommentsBottomSheet
        onOpenSheet={CommentSheetRef}
        commentData={postCommentsHook.commentData}
        onPress={(id: string) => {
          CommentSheetRef.current?.close();
          router.push({
            pathname: "/profile/[id]",
            params: { id: id, isProfile: "false" },
          });
        }}
        setIndex={onChangeSheetIndex}
      />

      <Modal
        visible={uiState.modals.modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => handleModalToggle('modalVisible', false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => handleModalToggle('modalVisible', false)}
        >
          <ImageFallBackUser
            imageData={profileDetails?.profile_pic || ""}
            fullName={fname}
            widths={250}
            heights={250}
            borders={5}
          />
        </TouchableOpacity>
      </Modal>
    </ViewWrapper>
  );
};

export default ProfileScreen;