import {
  View,
  BackHandler,
  Alert,
  Animated,
  Linking,
  Modal,
  Keyboard,
} from "react-native";
import DashboardHeader from "@/components/element/DashboardHeader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import { router } from "expo-router";
import useHomeViewModel from "@/app/(features)/(home)/viewModel/HomeViewModel";
import { useAppStore } from "@/zustand/zustandStore";
import { globalColors } from "@/assets/GlobalColors";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import AppUpdateModal from "@/components/modal/AppUpdateModal";
import useCheckAppVersionHook from "@/customHooks/CheckAppVersionHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useCheckVersionStore } from "@/zustand/checkVersionStore";
import { useReportStore } from "@/zustand/reportStore";
import useBlockUserHook from "@/customHooks/BlockUserHook";
import {
  getLoggedMobile,
  setFirstNameLocal,
  setLastNameLocal,
  storeUserKycStatus,
} from "@/localDB/LocalStroage";
import DynamicContentModal from "@/components/modal/DynamicContentModal";
import { DynamicContentStatusReq } from "@/redux/reducer/home/DynamicContentStatus";
import { useIsFocused } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import NotificationPermissionModal from "@/components/modal/NotificationPermissionModal";
import {
  setIsFirstTime,
  setUserData,
} from "@/redux/slice/login/LoginUserSlice";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getPrefsValue, setPrefsValue } from "@/utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useScrollStore } from "@/zustand/scrollStore";
import { fetchMyProfileDetails } from "@/redux/reducer/Profile/FetchProfileDetailsApi";
import {
  useCommentStore,
  useIdStore,
  useRefreshShow,
} from "@/customHooks/CommentUpdateStore";
import messaging from "@react-native-firebase/messaging";
import { newFeedCountReq } from "@/redux/reducer/home/NewFeedCount";
import { useHomePostStore } from "@/zustand/HomePostStore";
import { Styles } from "../../styles/dashboardStyle";
import KycButton from "@/components/KycButtonView";
import { setHomePostSlice } from "@/redux/slice/home/HomePostSlice";
import { useSharedValue, withSpring } from "react-native-reanimated";
import { onKycSendOtp } from "@/redux/reducer/kyc/kycDetails";
import HomePostContainer from "@/components/element/HomePostContainer";
import { trendingUserPost } from "@/redux/slice/home/TrendingPostSlice";
import { userShowAnimatedToggle } from "@/zustand/AnimatedToggle";
import {
  onFetchHomeNextPost,
  onFetchHomePost,
} from "@/redux/reducer/home/HomePostApi";
import { onDeletePost } from "@/redux/reducer/post/DeletePost";
import { useDeletePostModal } from "@/zustand/DeletePostModal";
import {
  selectHomePostResponse,
  selectHomePostNextResponse,
  selectTrendingPostResponse,
  selectDynamicContentStatus,
  selectNewPostCount,
  selectLoginUserData,
} from "@/redux/selectors/homeSelectors";
import RenderHomeView from "@/components/Home/RenderHomeView";
import DeletePostModal from "@/components/modal/DeletePostModal";
import BottomSheets, {
  useBottomSheetRefs,
} from "@/app/BottomSheet/BottomSheet";
import { FlashList } from "@shopify/flash-list";
import PostLoaderComponent from "@/components/PostLoaderComponent";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import { setMyUserFeedData } from "@/redux/slice/profile/ProfileMyFeedsSlice";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import { resetNewFeedCount } from "@/redux/slice/home/NewFeedCountSlice";
import { updateProfileData } from "@/redux/slice/profile/ProfileMyDetailsSlice";
import useCreatePostViewModel from "@/viewModels/CreatePostViewModel";
import { logEvent, useScreenTracking } from "@/customHooks/useAnalytics";
import { upgradePostData } from "@/redux/slice/post/PostDetailSlice";
import TrackPlayer from "react-native-track-player";
import CommentsBottomSheet from "@/app/(features)/(viewPost)/component/CommentsBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import useKeyboardVisible from "@/app/hooks/useKeyboardVisible";
import { onFetchMyUserFeeds } from "@/redux/reducer/Profile/FetchUserFeeds";
import { Image } from "expo-image";
import React from "react";
import { calculateHeight } from "@/utils/ImageHelper";
import { setHomeNextPostData } from "@/redux/slice/home/HomePostNextSlice";

// Optimized selectors with proper memoization
const selectOptimizedPostData = (state: any) => {
  const rawData = state?.homePost?.UpdatedData ?? [];
  
  // Debug log to see the actual structure
  
  const safeData = Array.isArray(rawData) ? rawData : [];
  
  if (safeData.length === 0) {
   
    return [];
  }
  
  const uniqueMap = new Map();
  safeData.forEach((item, index) => {
    if (item?.id && !uniqueMap.has(item.id)) {
      uniqueMap.set(item.id, item);
    } else if (!item?.id) {
      console.log(`⚠️ Item at index ${index} has no ID:`, item);
    }
  });
  
  const result = Array.from(uniqueMap.values());
  console.log('✅ Selector result:', result.length, 'unique items');
  return result;
};


// Interface for UI State optimization
interface UIState {
  isNextPostLoading: boolean;
  showButton: boolean;
  headerVisible: boolean;
  currentPlaying: number | null;
  commentIndex: number;
  isFloating: boolean;
  showKycBtn: boolean;
  isModalVisible: boolean;
  modalShown: boolean;
  refreshing: boolean;
}

const DashboardScreen = () => {
  useScreenTracking("DashboardScreen");
  const dispatch = useDispatch();
  
  // Refs for performance optimization
  const scrollViewRef = useRef<FlashList<any>>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollY = useRef(0);
  const onCommentRef = useRef<BottomSheet>(null);
  const lastCacheCleanup = useRef(Date.now());
  const headerAnimation = useRef(new Animated.Value(1)).current;
  
  // State optimization - group related states
  const [uiState, setUiState] = useState<UIState>({
    isNextPostLoading: false,
    showButton: false,
    headerVisible: true,
    currentPlaying: null,
    commentIndex: -1,
    isFloating: false,
    showKycBtn: false,
    isModalVisible: false,
    modalShown: false,
    refreshing: false,
  });

  const [profileImage, setProfileImage] = useState("");
  const [postGroupData, setPostGroupData] = useState("");

  // Hooks and stores
  const isFocused = useIsFocused();
  const userId = useAppStore((state) => state.userId);
  const { refreshHome } = useAppStore();
  
  // Custom hooks
  const { onFetchHomeHandler, onFetchTrendingHandler } = useHomeViewModel();
  const { onFetchCommentHandler } = usePostCommentsHook();
  const { updateAvailable } = useCheckVersionStore();
  const { onPressUpdateHandler, onPressSkip } = useCheckAppVersionHook();
  const { OnRefreshHandlerHome, MyCommunities, AllGroupList } = useHomeViewModel();
  const { onPressBlockHandler, blockLoading } = useBlockUserHook();
  
  // Zustand stores
  const { Selectedtab, setSelectedTab } = useHomePostStore();
  //@ts-ignore
  const { setScrollViewRef, scrollToTop } = useScrollStore();
  const { force_update, version } = useCheckVersionStore();
  const { commentData, setCommentData } = useCommentStore();
  const { setReportUserDetails, reportUserDetails } = useReportStore();
  const { setID } = useIdStore();
  const { setRefresh_Button, refresh_Button } = useRefreshShow();
  const { deletePostModal, setDeletePostModal } = useDeletePostModal();
  const { isFlex, setIsFlex } = userShowAnimatedToggle();
  
  const {
    setPostId,
    setPostedByUserId,
    postId,
    postedByUserId,
    setIsComment,
    isComment,
    setPostValue,
    postValue,
  } = usePostDetailStore();
  
  const { onSetUserFromType, setIsVerified, onSetShowKycModalStore } = useAppStore();

  // Selectors with proper memoization
  const homePostResponse = useSelector(selectHomePostResponse, shallowEqual);
  const homePostNextResponse = useSelector(selectHomePostNextResponse, shallowEqual);
  const trendingPostResponse = useSelector(selectTrendingPostResponse, shallowEqual);
  const dynamiContentStatus = useSelector(selectDynamicContentStatus, shallowEqual);
  const userDetailsData = useSelector((state: any) => state.myProfileData, shallowEqual);
  const userData = useSelector(selectLoginUserData, shallowEqual);
  const newPostCount = useSelector(selectNewPostCount);
  const postDetailResponse = useSelector((state: any) => state.myFeedData, shallowEqual);
  const myProfileData = useSelector((state: any) => state.myProfileData, shallowEqual);
  const submitPostResponse = useSelector((state: any) => state?.createPostData, shallowEqual);
  
  // Optimized post data with memoization
  const postData = useSelector(selectOptimizedPostData, shallowEqual);

  // Other hooks
  const videoRef = useVideoPlayerStore.getState().videoRef;
  const isVideoPlaying = useVideoPlayerStore.getState().isPlay;
  const keyboardVisible = useKeyboardVisible();
  const createPostViewModel = useCreatePostViewModel();
  const { onSubmitPostHandler } = createPostViewModel;
  const isLoginMobile = getLoggedMobile();
  const { profileRef, blockUserRef } = useBottomSheetRefs();
  const finalPostData = useMemo(() => {
    const rawData =homePostResponse?.UpdatedData ?? [];
    const safeData = Array.isArray(rawData) ? rawData : [];

    const uniqueMap = new Map();
    safeData?.forEach((item) => {
      if (item?.id) {
        uniqueMap.set(item.id, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, [homePostResponse]);
  // Memoized calculations
  const getNewPost = useMemo(
    () => uiState.showButton && newPostCount?.count && newPostCount?.count != 0,
    [uiState.showButton, newPostCount]
  );

  const translateX = useSharedValue(isFlex ? 18 : 0);

  // Optimized cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (videoRef && isVideoPlaying) {
      videoRef.pauseAsync().catch(console.warn);
    }
    
    // Periodic cache cleanup
    if (Date.now() - lastCacheCleanup.current > 300000) { // 5 minutes
      Image.clearMemoryCache();
      lastCacheCleanup.current = Date.now();
    }
  }, [videoRef, isVideoPlaying]);

  // Optimized delete post modal update
  const updateDeletePostModal = useCallback(
    (postId: any) => {
      const updatedData = homePostResponse?.UpdatedData.filter(
        (item: any) => item?.id != postId
      );
      const deletePostData = homePostResponse?.UpdatedData.filter(
        (item: any) => item?.id == postId
      );
      const updateTrendingData = Array.isArray(trendingPostResponse?.data)
        ? trendingPostResponse?.data.filter((item: any) => item?.id != postId)
        : [];
      const updateUserPostData = Array.isArray(postDetailResponse.updatedData)
        ? postDetailResponse.updatedData.filter(
            (item: any) => item?.id != postId
          )
        : [];
      
      dispatch(setHomePostSlice(updatedData));
      dispatch(setMyUserFeedData(updateUserPostData));
      
      if (trendingPostResponse?.data) {
        dispatch(trendingUserPost(updateTrendingData));
      }
      
      if (
        deletePostData?.length > 0 &&
        deletePostData?.[0]?.post_by?.id == userId
      ) {
        const updatedProfileDatas: any = {
          data: {
            ...myProfileData.data,
            post_count: myProfileData.data.post_count - 1,
          },
        };
        dispatch(updateProfileData(updatedProfileDatas));
      }
    },
    [homePostResponse?.UpdatedData, trendingPostResponse?.data, postDetailResponse.updatedData, dispatch, userId, myProfileData.data]
  );

  // Optimized scroll handler
  const handleScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.current = offsetY;

    const isScrollingDown = offsetY > 1000;
    const newHeaderVisible = !isScrollingDown;
    
    if (newHeaderVisible !== uiState.headerVisible) {
      setUiState(prev => ({ ...prev, headerVisible: newHeaderVisible }));
    }
  }, [uiState.headerVisible]);

  // Optimized scroll button handler
  const handleScrollButton = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const newShowButton = offsetY > 1500 && !uiState.showButton;
    
    if (newShowButton !== uiState.showButton) {
      setUiState(prev => ({ ...prev, showButton: newShowButton }));
    }
  }, [uiState.showButton]);

  // Optimized comment handler
  const onPressHomeCommentHandler = useCallback((postId: any, userId: any) => {
    setIsComment(true);
    setUiState(prev => ({ ...prev, commentIndex: -1 }));
    dispatch(commentLoading(true));
    onCommentRef.current?.expand();
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  }, [dispatch, onFetchCommentHandler, setIsComment, setPostId, setPostedByUserId]);

  // Optimized post option handler
  const onPressPostOption = useCallback((data: any) => {
    const userData = data?.postBy || data?.post_by;
    const groupData = data?.loop_group;
    
    setReportUserDetails({
      name: userData?.full_name,
      userId: userData?.id,
      profilePic: userData?.profile_pic,
      reportId: userData?.id,
    });
    setPostValue(data);
    setPostGroupData(groupData);
    setPostedByUserId(userData?.id);
    profileRef?.current?.expand();
  }, [setReportUserDetails, setPostValue, setPostedByUserId, profileRef]);


  const Newfeed = () => {
    if (userId && homePostResponse?.UpdatedData[0]?.id) {
      dispatch(
        //@ts-ignore
        newFeedCountReq({
          user_id: userId,
          last_id: homePostResponse?.UpdatedData[0]?.id,
        })
      );
    }
  };
  // Optimized post press handler
  const onPressPost = useCallback((data: any) => {
    logEvent("post_click", {
      post_id: data?.id,
      type: Selectedtab === 1 ? "home" : "trending",
    });
    
    const { setID } = useIdStore.getState();
    
    if (Selectedtab === 1) {
      setID("3");
    } else if (Selectedtab === 2) {
      setID("4");
    }

    if (data.file_type == "video") {
      TrackPlayer.stop();
    }

    dispatch(upgradePostData(data));
    router.push({
      pathname: "/post/[id]",
      params: {
        id: data?.id,
        Type: Selectedtab === 1 ? "home" : "trending",
        isNotification: "here",
        categoryName: data?.loop_group?.category.category_name,
      },
    });
  }, [Selectedtab, dispatch]);

  // Optimized viewable items changed handler
  const onViewableItemsChanged = useCallback(({ viewableItems, changed }: any) => {
    if (viewableItems.length === 0) return;

    const lastVisibleIndex = Math.max(
      ...viewableItems.map((item) => item.index || 0)
    );
    const postsToTriggerAt = Math.floor(lastVisibleIndex % 16);
    
    if (postsToTriggerAt == 0 && lastVisibleIndex > 10) {
      Newfeed();
    }

    // Optimized prefetching - use finalPostData
    viewableItems.forEach((viewableItem, index) => {
      if (index < viewableItems.length - 1) {
        const nextItem = finalPostData[viewableItem.index + 1];
        if (nextItem?.file_type === "image") {
          const urlsToPreload = Array.isArray(nextItem.post_image) 
            ? nextItem.post_image.slice(0, 2) // Reduced from 4 to 2
            : [nextItem.post_image];
          
          urlsToPreload.forEach(url => {
            Image.prefetch(`https://cdn.qoneqt.com/${url}`, { cachePolicy: 'memory-disk' });
          });
        }
        if (nextItem?.file_type === "video") {
          Image.prefetch(`https://cdn.qoneqt.com/${nextItem.video_snap_path}`, { cachePolicy: 'memory-disk' });
        }
      }
    });
  }, [finalPostData, Newfeed]); // Use finalPostData instead of fallbackPostData

  // Optimized refresh handler
  const handleRefresh = useCallback(async () => {
    setUiState(prev => ({ ...prev, refreshing: true }));
      var newPostData: any = await dispatch(
        // @ts-ignore
        onFetchHomePost({
          userId: userId,
          lastCount: 0,
          limit_count: 10,
        })
      );

      if (newPostData?.payload?.data?.length > 0) {
        var newData = await Promise.all(newPostData?.payload?.data?.map(async (item) => {
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
        dispatch(setHomePostSlice(newData));
        setPrefsValue(
          "homePostData",
          JSON.stringify(newData)
        );
      }
      setUiState(prev => ({ ...prev, refreshing: false }));
      MyCommunities();
  }, [ userId, dispatch, setPrefsValue, MyCommunities]);

  // Optimized render item function
  const renderHomeItem = useCallback(({ item, index }) => {
    if (!item) {
      return <PostLoaderComponent />;
    }

    return (
      <View
        key={item?.id || `post-${index}`}
        style={{
          width: "100%",
          paddingBottom: 15,
          borderBottomWidth: 0.5,
          borderBottomColor: globalColors.neutral_white[500],
        }}
      >
        <HomePostContainer
          Type={Selectedtab === 1 ? "home" : "trending"}
          onPressComment={(postId: any, userId: any) => {
            logEvent("post_comment", {
              post_id: postId,
              user_id: userId,
              type: Selectedtab === 1 ? "home" : "trending",
            });
            setCommentData(item?.comments || []);
            onPressHomeCommentHandler(postId, userId);
            setID(Selectedtab === 1 ? "3" : "4");
          }}
          onPressPostOption={(data) => {
            logEvent("post_option", {
              post_id: item?.id,
              type: Selectedtab === 1 ? "home" : "trending",
            });
            onPressPostOption(item);
          }}
          data={item}
          index={index}
          isPlaying={uiState.currentPlaying === item.id}
          setCurrentPlaying={(id) => setUiState(prev => ({ ...prev, currentPlaying: id }))}
          userInfo={userDetailsData?.data}
          postPress={() => onPressPost(item)}
        />
      </View>
    );
  }, [Selectedtab, userDetailsData, onPressHomeCommentHandler, onPressPostOption, onPressPost, uiState.currentPlaying, setCommentData, setID]);

  // Debounced end reached handler
  const debouncedEndReached = useCallback(async () => {
    try {
      if (uiState.isNextPostLoading || !userId) return;
      
      const updatedLength = homePostResponse.UpdatedData.length;
      if (!homePostResponse.isLoaded && isFocused) {
        setUiState(prev => ({ ...prev, isNextPostLoading: true }));

        const newCombinedData = [
          ...homePostResponse.UpdatedData,
          ...homePostNextResponse.data,
        ];
        dispatch(setHomePostSlice(newCombinedData));
      var newPostDataValue: any = await dispatch(
          //@ts-ignore
          onFetchHomeNextPost({
            userId,
            lastCount: updatedLength,
            limit_count: 100,
          })
        );
        if(newPostDataValue?.payload?.data?.length > 0){
          var newData = await Promise.all(newPostDataValue?.payload?.data?.map(async (item) => {
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

          // console.log("newData>>>>", JSON.stringify(newData));

          dispatch(setHomeNextPostData(newData));
          setPrefsValue("homePostData", JSON.stringify(newData));
          
        }
        setUiState(prev => ({ ...prev, isNextPostLoading: false }));
      }
    } catch (error) {
      console.error("Error fetching debounced data:", error);
      setUiState(prev => ({ ...prev, isNextPostLoading: false }));
    }
  }, [uiState.isNextPostLoading, userId, homePostResponse, homePostNextResponse, isFocused, dispatch]);

  // Optimized fetch next post
  const fetchNextPost = useCallback(async () => {
    const newPostDataValue: any = await dispatch(
      //@ts-ignore
      onFetchHomeNextPost({
        userId,
        lastCount: 10,
        limit_count: 100,
      })
    );
    
    if (newPostDataValue?.payload?.data && Array.isArray(newPostDataValue?.payload?.data) && newPostDataValue?.payload?.data?.length > 0) {
      var newData = await Promise.all(newPostDataValue?.payload?.data?.map(async (item) => {
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
      const newCombinedData = [
        ...homePostResponse.UpdatedData,
        ...newData,
      ];
      dispatch(setHomePostSlice(newCombinedData));
    }
  }, [userId, homePostResponse.UpdatedData, dispatch]);

  // Optimized refresh post data handler
  const onRefreshPostData = useCallback((newCount) => {
    dispatch(resetNewFeedCount());
    setRefresh_Button(false);
    scrollToTop();
    if (newCount && newCount > 0) {
      Promise.all([OnRefreshHandlerHome()]).catch((error) =>
        console.error("Error in onRefreshPostData:", error)
      );
    }
    MyCommunities();
  }, [dispatch, setRefresh_Button, scrollToTop, OnRefreshHandlerHome, MyCommunities]);

  // Optimized delete post handler
  const deletePostHandler = useCallback(async () => {
    setDeletePostModal(false);
    var deletePostData: any = await dispatch(
      //@ts-ignore
      onDeletePost({ post_id: postId, user_id: userId })
    );

    if (deletePostData?.payload?.success) {
      updateDeletePostModal(postId);
    }
  }, [postId, userId, updateDeletePostModal, setDeletePostModal, dispatch]);

  // Optimized KYC press handler
  const onKycPress = useCallback(async () => {
    const kycData = userDetailsData?.data?.kyc_details || {};
    const type = userDetailsData?.data?.type || 0;
    const contact = isLoginMobile === 0 ? kycData.temp_email : kycData.phone;
    const kycStatus =
      userDetailsData?.data?.kyc_details?.status ||
      userDetailsData?.data?.kyc_status;
    const stepStatus = Number(userDetailsData?.data?.kyc_details?.finished_step);
    const stepType = userDetailsData?.data?.kyc_details?.identification_type;
    
    const handleKycCompletion = async (path, params = {}) => {
      onSetShowKycModalStore(false);
      await storeUserKycStatus(1);
      setIsVerified(1);
      router.push({ pathname: path, params });
    };
    
    onSetUserFromType(stepType === "google_auth" ? "google" : stepType);
    const path = isLoginMobile === 0 ? "/SelectSocialkyc" : "/KycOnboardHoc";
    
    if (userDetailsData?.data?.kyc_details?.id) {
      switch (kycStatus) {
        case 0:
          onSetUserFromType(stepType === "google_auth" ? "google" : stepType);
          if (stepStatus === 1 || stepStatus === 2) {
            router.push({
              pathname: "/KycOnboardHoc",
              params: { kycStepData: stepStatus },
            });
          } else {
            //@ts-ignore
            dispatch(onKycSendOtp({ userId, contact }));
            router.push({
              params: {
                contact: contact,
                countryCode: "+91",
                userId: userId,
                isMobile: 1,
                login_type: 1,
                isKyc: "true",
              },
              pathname: "/VerifyKycOtpScreen",
            });
          }
          break;

        case 6:
          router.push("/KycOnboardHoc");
          break;

        case 2:
          await handleKycCompletion("/SuccessfullVerificationModal", {
            status: "pending",
          });
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
          await handleKycCompletion("/SuccessfullVerificationModal", {
            status: "panPending",
          });
          break;

        case 1:
          await handleKycCompletion("/DashboardScreen");
          break;

        case 4:
          await handleKycCompletion("/KycOnboardHoc", {
            kycStepData: userDetailsData?.data?.kyc_details?.ask_profile ? 6 : 5,
            type,
          });
          break;
        default:
          router.replace("/DashboardScreen");
      }
    } else {
      let kycStepData = 0;
      if (stepStatus === 1) {
        kycStepData = 1;
      } else if (stepStatus === 2) {
        kycStepData = stepType === "event" ? 3 : 2;
      }

      const stepParams = { kycStepData, type };
      const path = isLoginMobile === 0 ? "/SelectSocialkyc" : "/KycOnboardHoc";
      router.push({ pathname: path, params: stepParams });
    }
  }, [userDetailsData, isLoginMobile, userId, onSetShowKycModalStore, setIsVerified, onSetUserFromType, dispatch]);

  // Helper functions
  const checkPermission = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status != "granted") {
      if (!userData.isFirstTimePopup) {
        setUiState(prev => ({ ...prev, isModalVisible: true }));
      }
    }
  }, [userData.isFirstTimePopup]);

  const askNotificationPermission = useCallback(() => {
    setUiState(prev => ({ ...prev, isModalVisible: false }));
    setTimeout(async () => {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      setPrefsValue("isFirst", true);
      dispatch(setIsFirstTime(true));
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "You have denied notification permissions. Enable it from settings.",
          [
            {
              text: "Yes",
              onPress: () => {
                Linking.openSettings();
              },
            },
            { text: "No", onPress: () => {} },
          ]
        );
      }
    }, 100);
  }, [dispatch]);

  const onToggle = useCallback((data) => {
    setIsFlex(data);
  }, [setIsFlex]);

  const onChangeSheetIndex = useCallback((index: number) => {
    setUiState(prev => ({ ...prev, commentIndex: index }));
    if (index == -1) {
      setIsComment(false);
    }
  }, [setIsComment]);

  const uploadPostAgain = useCallback(() => {
    onSubmitPostHandler({ isCreatePost: false });
  }, [onSubmitPostHandler]);

  const onPressReportOption = useCallback(({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId: reportId,
      name: name,
      profilePic: ProfilePic,
      reportType: "post",
    });
    profileRef.current?.close();
    router.push("/ReportProfileScreen");
  }, [setReportUserDetails, profileRef]);

  const onPressDeleteOption = useCallback(() => {
    profileRef.current?.close();
    setDeletePostModal(true);
  }, [profileRef, setDeletePostModal]);

  const onSubmitBlockHandler = useCallback(({ profileId, isBlock }) => {
    blockUserRef.current?.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
  }, [blockUserRef, onPressBlockHandler]);

  // Effects
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [Selectedtab]);

  // Debug logging for posts
  useEffect(() => {
    console.log('📊 PostData Debug:', {
      postDataLength: postData?.length || 0,
      homePostResponseLength: homePostResponse?.UpdatedData?.length || 0,
      isHomePostLoaded: homePostResponse?.isLoaded,
      Selectedtab,
      userId,
      isFocused
    });
  }, [postData, homePostResponse, Selectedtab, userId, isFocused]);

  // Ensure we have initial data
  useEffect(() => {
    if (userId && isFocused && (!finalPostData || finalPostData.length === 0)) {
      console.log('🔄 Fetching initial home data...');
      onFetchHomeHandler({
        isLoadMore: false,
        isFirst: true,
        lastCount: 0,
      });
    }
  }, [userId, isFocused, finalPostData, onFetchHomeHandler]); // Use finalPostData

  useEffect(() => {
    if (isFocused && userId) {
      setScrollViewRef(scrollViewRef);
      checkPermission();
    }

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage?.data?.type === "kyc_verified" && isFocused) {
        dispatch(
          //@ts-ignore
          fetchMyProfileDetails({
            userId: userId,
          })
        );
      }
    });

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (keyboardVisible) {
          Keyboard.dismiss();
          return true;
        }
        if (uiState.commentIndex == -1) {
          onCommentRef.current?.close();
          return true;
        }
        
        Alert.alert("Hold on!", "Are you sure you want to exit?", [
          { text: "Cancel", style: "cancel" },
          { text: "Exit", onPress: () => BackHandler.exitApp() },
        ]);
        
        return true;
      }
    );

    return () => {
      unsubscribe();
      backHandler.remove();
      cleanup();
    };
  }, [keyboardVisible, uiState.commentIndex, isFocused, userId, setScrollViewRef, checkPermission, dispatch, cleanup]);

  useEffect(() => {
    const fetchRefData = async () => {
      try {
        if (refreshHome && isFocused) {
          await Promise.all([
            onFetchHomeHandler({
              isLoadMore: false,
              isFirst: false,
              lastCount: 0,
            }),
          ]);
        }
      } catch (error) {
        console.error("Error fetching Ref data:", error);
      }
    };
    fetchRefData();
    MyCommunities();
  }, [refreshHome, isFocused, onFetchHomeHandler, MyCommunities]);

  useEffect(() => {
    if (userId && isFocused) {
      //@ts-ignore
      dispatch(DynamicContentStatusReq({ user_id: userId }));
    }
  }, [userId, isFocused, dispatch]);

  useEffect(() => {
    if (uiState.headerVisible) {
      Animated.timing(headerAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(headerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [uiState.headerVisible, headerAnimation]);

  useEffect(() => {
    if (!userDetailsData?.success) return;

    const userData = userDetailsData.data;
    const kycStatus = userData?.kyc_details?.status;

    dispatch(setUserData(userData));

    const shouldShowKyc =
      !userData?.kyc_details || [0, -1, 3, 6].includes(kycStatus);

    setUiState(prev => ({ ...prev, showKycBtn: shouldShowKyc }));

    if (userData?.profile_pic) setProfileImage(userData?.profile_pic);

    const [firstName = "", lastName = ""] =
      userData.full_name?.split(" ") || [];
    setFirstNameLocal({ first: firstName });
    setLastNameLocal({ last: lastName });
  }, [userDetailsData, dispatch]);

  useEffect(() => {
    if (uiState.headerVisible) {
      translateX.value = withSpring(isFlex ? 26 : 3);
    }
  }, [uiState.headerVisible, isFlex, translateX]);

  useEffect(() => {
    if (userDetailsData?.data?.id == undefined) {
      //@ts-ignore
      dispatch(fetchMyProfileDetails({ userId: userId }));
      dispatch(
        //@ts-ignore
        onFetchMyUserFeeds({ userId, profileId: userId, lastCount: 0 })
      );
    }
  }, [userDetailsData, userId, dispatch]);

  useEffect(() => {
    const newCombinedData = [
      ...homePostResponse.UpdatedData,
      ...homePostNextResponse.data,
    ];
    if (!uiState.headerVisible && newCombinedData.length == 10) {
      fetchNextPost();
    }
  }, [uiState.headerVisible, homePostResponse.UpdatedData, homePostNextResponse.data, fetchNextPost]);

  // console.log("communityData>>", AllGroupList?.data);
  // Memoized render function - using finalPostData instead of fallbackPostData
  const renderHome = useMemo(() => (
    <RenderHomeView
      Selectedtab={Selectedtab}
      setSelectedTab={setSelectedTab}
      homePostResponse={homePostResponse}
      postData={finalPostData} // Use finalPostData instead of fallbackPostData
      isNextPostLoading={uiState.isNextPostLoading}
      getNewPost={getNewPost}
      refresh_Button={refresh_Button}
      newPostCount={newPostCount}
      onRefreshPostData={onRefreshPostData}
      renderHomeItem={renderHomeItem}
      scrollViewRef={scrollViewRef}
      handleScroll={handleScroll}
      handleScrollButton={handleScrollButton}
      onEndReached={debouncedEndReached}
      refreshing={uiState.refreshing}
      handleRefresh={handleRefresh}
      //@ts-ignore
      onViewableItemsChanged={onViewableItemsChanged}
      progressValue={submitPostResponse?.progress}
      progressVisible={submitPostResponse?.loading}
      isCreatePostFailed={submitPostResponse?.isFailed}
      uploadPostAgain={uploadPostAgain}
      communityData={AllGroupList?.data}
    />
  ), [
    Selectedtab,
    setSelectedTab,
    homePostResponse,
    finalPostData, // Use finalPostData instead of fallbackPostData
    uiState.isNextPostLoading,
    getNewPost,
    refresh_Button,
    newPostCount,
    onRefreshPostData,
    renderHomeItem,
    scrollViewRef,
    handleScroll,
    handleScrollButton,
    debouncedEndReached,
    uiState.refreshing,
    handleRefresh,
    onViewableItemsChanged,
    submitPostResponse?.progress,
    submitPostResponse?.loading,
    submitPostResponse?.isFailed,
    uploadPostAgain,
    AllGroupList,
  ]);

  return (
    <ViewWrapper onPress={() => {}} isBottomTab={true}>
      <View style={Styles.container}>
        {uiState.headerVisible && (
          <DashboardHeader
            profileImage={userData?.data?.profile_pic || profileImage || ""}
            onToggle={onToggle}
            isflex={isFlex}
            modalShown={uiState.modalShown}
            setModalShown={(shown) => setUiState(prev => ({ ...prev, modalShown: shown }))}
            userId={userId}
          />
        )}

        <AppUpdateModal
          visible={updateAvailable}
          onSkip={() => {
            logEvent("skip_update", {
              version: version,
            });
            onPressSkip();
          }}
          onUpdate={() => {
            logEvent("update_app", {
              version: version,
            });
            onPressUpdateHandler();
          }}
          isForceUpdate={force_update}
          newVersion={version}
        />

        {renderHome}
      </View>

      {uiState.showKycBtn && (
        <KycButton
          setShowKycBtn={(show) => setUiState(prev => ({ ...prev, showKycBtn: show }))}
          onPress={onKycPress}
        />
      )}

      <BottomSheets
        profileRef={profileRef}
        blockUserRef={blockUserRef}
        onDeletePostOption={onPressDeleteOption}
        screen="post"
        screen_type="post"
        postGroupData={postGroupData}
        userId={userId}
        postedByUserId={postedByUserId}
        onPressReportOption={() =>
          onPressReportOption({
            reportId: reportUserDetails?.reportId,
            name: reportUserDetails?.name,
            ProfilePic: reportUserDetails?.profilePic,
          })
        }
        onPressBlockOption={() => {
          profileRef.current?.close();
          blockUserRef.current?.expand();
        }}
        onSubmitBlockHandler={() =>
          onSubmitBlockHandler({
            profileId: reportUserDetails?.reportId,
            isBlock: 1,
          })
        }
        blockLoading={blockLoading}
        reportUserDetails={reportUserDetails}
        onPressEditOption={() => {
          profileRef.current?.close();
          router.push("/CreatePostScreen");
        }}
      />

      {dynamiContentStatus?.data?.status == 1 && (
        <DynamicContentModal onPressModal={() => {}} onPress={onKycPress} />
      )}

      <NotificationPermissionModal
        visible={uiState.isModalVisible}
        onClose={() => {
          AsyncStorage.setItem("isFirst", "true");
          setPrefsValue("isFirst", "true");
          dispatch(setIsFirstTime(true));
          setUiState(prev => ({ ...prev, isModalVisible: false }));
        }}
        allowPermission={askNotificationPermission}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={deletePostModal}
        onRequestClose={() => setDeletePostModal(false)}
      >
        <DeletePostModal
          setDeletePostModal={setDeletePostModal}
          deletePostHandler={deletePostHandler}
        />
      </Modal>

      <CommentsBottomSheet
        onOpenSheet={onCommentRef}
        commentData={commentData}
        screenName="Home"
        onPress={(id) => {
          onCommentRef.current?.close();
          router.push({
            pathname: "/profile/[id]",
            params: { id: id, isProfile: "false" },
          });
        }}
        setIndex={onChangeSheetIndex}
      />
    </ViewWrapper>
  );
};

export default DashboardScreen;