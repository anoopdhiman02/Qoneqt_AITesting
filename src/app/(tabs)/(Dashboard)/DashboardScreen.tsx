import {
  View,
  BackHandler,
  Alert,
  Animated,
  Linking,
  Modal,
  TouchableWithoutFeedback,
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
import { setPrefsValue } from "@/utils/storage";
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
import FloatingButton from "@/components/FloatingButton/FloatingButton";
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
import { onFetchTrendingPost } from "@/redux/reducer/home/TrendingPostApi";
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

const DashboardScreen = () => {
  useScreenTracking("DashboardScreen");
  const dispatch = useDispatch();
  const scrollViewRef: any = useRef<FlashList<any>>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollY = useRef(0);
  const onCommentRef = useRef<BottomSheet>(null);
  const [isNextPostLoading, setIsNextPostLoading] = useState(false);
  const isFocused = useIsFocused();
  const userId = useAppStore((state) => state.userId);
  const { onFetchHomeHandler, onFetchTrendingHandler } = useHomeViewModel();
  const { onFetchCommentHandler } = usePostCommentsHook();
  const { updateAvailable } = useCheckVersionStore();
  const homePostResponse = useSelector(selectHomePostResponse, shallowEqual);
  const homePostNextResponse = useSelector(
    selectHomePostNextResponse,
    shallowEqual
  );
  const trendingPostResponse = useSelector(
    selectTrendingPostResponse,
    shallowEqual
  );
  const dynamiContentStatus = useSelector(
    selectDynamicContentStatus,
    shallowEqual
  );

  const userDetailsData = useSelector((state: any) => state.myProfileData, shallowEqual);
  const userData = useSelector(selectLoginUserData, shallowEqual);
  const newPostCount = useSelector(selectNewPostCount);
  const { deletePostModal, setDeletePostModal } = useDeletePostModal();

  const [showButton, setShowButton] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<number | null>(null);
  const headerAnimation = useRef(new Animated.Value(1)).current;
  const { Selectedtab, setSelectedTab } = useHomePostStore();
  const { refreshHome } = useAppStore();
  //@ts-ignore
  const { setScrollViewRef, scrollToTop } = useScrollStore();
  const { force_update, version } = useCheckVersionStore();
  const { onPressUpdateHandler, onPressSkip } = useCheckAppVersionHook();
  const { OnRefreshHandlerHome, MyCommunities, AllGroupList } =
    useHomeViewModel();
  const { commentData, setCommentData } = useCommentStore();
  const { onPressBlockHandler, blockLoading } = useBlockUserHook();
  const { setReportUserDetails, reportUserDetails } = useReportStore();
  const { setID } = useIdStore();
  const { setRefresh_Button, refresh_Button } = useRefreshShow();
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
  const { onSetUserFromType, setIsVerified, onSetShowKycModalStore } =
    useAppStore();
  const [modalShown, setModalShown] = useState(false);
  const { isFlex, setIsFlex } = userShowAnimatedToggle();
  const [isGroup, setIsGroup] = useState(1);
  const [isFloating, setIsFloating] = useState(false);
  const [showKycBtn, setShowKycBtn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isLoginMobile = getLoggedMobile();
  const [postGroupData, setPostGroupData] = useState("");
  const { profileRef, blockUserRef } = useBottomSheetRefs();
  const videoRef = useVideoPlayerStore.getState().videoRef;
  const isVideoPlaying = useVideoPlayerStore.getState().isPlay;
  const [commentIndex, setCommentIndex] = useState(-1);
  const postDetailResponse = useSelector(
    (state: any) => state.myFeedData,
    shallowEqual
  );
  const keyboardVisible = useKeyboardVisible();
  const createPostViewModel = useCreatePostViewModel();
    const {
      onSubmitPostHandler,
    } = createPostViewModel;
  const myProfileData = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );
  const submitPostResponse = useSelector(
    (state: any) => state?.createPostData,
    shallowEqual
  );
  const getNewPost = useMemo(
    () => showButton && newPostCount?.count && newPostCount?.count != 0,
    [showButton, newPostCount]
  );

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
            post_count: myProfileData.data.post_count -1,
          },
        };
        dispatch(updateProfileData(updatedProfileDatas));
      }
    },
    [
      homePostResponse?.UpdatedData,
      trendingPostResponse?.data,
      postDetailResponse.updatedData,
    ]
  );

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [Selectedtab]);

  useEffect(() => {
    if (Array.isArray(trendingPostResponse?.data) && trendingPostResponse?.data?.length == 0 && userId) {
      onFetchHomeHandler({
        isLoadMore: false,
        isFirst: false,
        lastCount: 0,
      });
      dispatch(
        //@ts-ignore
        onFetchTrendingPost({
          userId: userId,
          lastCount: 0,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (isFocused && userId) {
      setScrollViewRef(scrollViewRef); // Store the reference in Zustand
      checkPermission();
    }
    // Notification message listener
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
    // Back button handler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        console.log("🚀 ~ backHandler ~ keyboardVisible:", keyboardVisible, commentIndex)
        if(keyboardVisible){
          Keyboard.dismiss();
          return true;
        }
        if(commentIndex == -1){
          // setCommentIndex(1);
          onCommentRef.current?.close();
          return true;
        }
        
            // commentRef.current?.close();
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
      if (timeoutRef?.current) {
        clearTimeout(timeoutRef.current);
      }
      if (videoRef && isVideoPlaying) {
        // videoRef?.pauseAsync(); // pause when navigating away
      }
    };
  }, []);

  // Ensure this runs only once on component mount
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
  }, [refreshHome]);

  useEffect(() => {
    if (userId && isFocused) {
      //@ts-ignore
      dispatch(DynamicContentStatusReq({ user_id: userId }));
      // Newfeed();
    }
  }, [userId, isFocused]);

  useEffect(() => {
    if (headerVisible) {
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
  }, [headerVisible]);

  useEffect(() => {
    if (!userDetailsData?.success) return;

    const userData = userDetailsData.data;
    const kycStatus = userData?.kyc_details?.status;

    dispatch(setUserData(userData));

    const shouldShowKyc =
      !userData?.kyc_details || [0, -1, 3, 6].includes(kycStatus);

    setShowKycBtn(shouldShowKyc);

    // Avoid re-rendering if values haven't changed
    if (userData?.profile_pic) setProfileImage(userData?.profile_pic);

    const [firstName = "", lastName = ""] =
      userData.full_name?.split(" ") || [];
    setFirstNameLocal({ first: firstName });
    setLastNameLocal({ last: lastName });
  }, [userDetailsData]);

  useEffect(() => {
    if (headerVisible) {
      translateX.value = withSpring(isFlex ? 26 : 3);
    }
  }, [headerVisible, isFlex]);

  useEffect(() => {
   if(userDetailsData?.data?.id == undefined){
    //@ts-ignore
    dispatch(fetchMyProfileDetails({ userId: userId }));
    dispatch(
      //@ts-ignore
      onFetchMyUserFeeds({ userId, profileId: userId, lastCount: 0 })
    );
   }
  }, [userDetailsData]);



  // Reset the button state if the user starts scrolling manually
  const handleScrollButton = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowButton(offsetY > 1500 && !showButton);
  };

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

  const debouncedEndReached = async () => {
    try {
      // Skip if already loading
      if (isNextPostLoading || !userId) return;
      const updatedLength = homePostResponse.UpdatedData.length;
      if (!homePostResponse.isLoaded && isFocused) {
        setIsNextPostLoading(true);

        const newCombinedData = [
          ...homePostResponse.UpdatedData,
          ...homePostNextResponse.data,
        ];
        dispatch(setHomePostSlice(newCombinedData));
        dispatch(
          //@ts-ignore
          onFetchHomeNextPost({
            userId,
            lastCount: updatedLength,
            limit_count: 100,
          })
        );
        setIsNextPostLoading(false);
      }
    } catch (error) {
      console.error("Error fetching debounced data:", error);
      setIsNextPostLoading(false); // fallback
    }
  };

  //FlatList scroll
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.current = offsetY;

    const isScrollingDown = offsetY > 1000;
    setHeaderVisible(!isScrollingDown);
  };

  const onPressHomeCommentHandler = useCallback((postId: any, userId: any) => {
    setIsComment(true);
    setCommentIndex(-1);
    dispatch(commentLoading(true));
    // router.push("/Comment");
    onCommentRef.current.expand();
     
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  }, []);

  const onPressReportOption = ({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId: reportId,
      name: name,
      profilePic: ProfilePic,
      reportType: "post",
    });
    profileRef.current.close();
    router.push("/ReportProfileScreen");
  };

  const onPressDeleteOption = () => {
    profileRef.current.close();
    setDeletePostModal(true);
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    blockUserRef.current.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
  };

  const onPressPostOption = useCallback((data: any) => {
   const userData = data?.postBy || data?.post_by;
    const groupData = data?.loop_group;
    setReportUserDetails({
      name:userData?.full_name,
      userId: userData?.id,
      profilePic: userData?.profile_pic,
      reportId: userData?.id,
    });
    setPostValue(data);
    setPostGroupData(groupData);
    setPostedByUserId(userData?.id);
    profileRef?.current?.expand();
  }, []);

  const checkPermission = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status != "granted") {
      if (!userData.isFirstTimePopup) {
        setIsModalVisible(true);
      }
    }
  };

  const onToggle = (data) => {
    setIsFlex(data);
    setIsGroup(1);
  };

  const askNotificationPermission = () => {
    setIsModalVisible(false);
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
  };

  const onPressPost = (data: any) => {
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

        if(data.file_type == "video"){
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
  }
  

  const renderHomeItem = useCallback(({ item, index }) => {
    if (item) {
      return (
        <View
          key={index}
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
              onPressPostOption(item)}}
            data={item}
            index={index}
            key={index}
            isPlaying={currentPlaying === item.id}
            setCurrentPlaying={setCurrentPlaying}
            userInfo={userDetailsData?.data}
            postPress={() => {
              onPressPost(item);
            }}
          />
        </View>
      );
    } else {
      return (
        <View>
          <PostLoaderComponent />
        </View>
      );
    }
  }, []);

  const postData = useMemo(() => {
    const rawData =
      Selectedtab === 1
        ? trendingPostResponse?.data ?? []
        : homePostResponse?.UpdatedData ?? [];
    const safeData = Array.isArray(rawData) ? rawData : [];

    const uniqueMap = new Map();
    safeData?.forEach((item) => {
      if (item?.id) {
        uniqueMap.set(item.id, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, [Selectedtab, trendingPostResponse, homePostResponse]);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (Selectedtab === 1) {
      dispatch(
        //@ts-ignore
        onFetchTrendingPost({
          userId: userId,
          lastCount: 0,
        })
      );
      setRefreshing(false);
    } else {
      var newPostData: any = await dispatch(
        // @ts-ignore
        onFetchHomePost({
          userId: userId,
          lastCount: 0,
          limit_count: 10,
        })
      );

      if (newPostData?.payload?.data?.length > 0) {
        setRefreshing(false);
        dispatch(setHomePostSlice(newPostData?.payload?.data || []));
        setPrefsValue(
          "homePostData",
          JSON.stringify(newPostData?.payload?.data || [])
        );
      } else {
        setRefreshing(false);
      }
      MyCommunities();
    }
  }, []);

  // Add this new function to track visible items
  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length === 0) return;

    // Get the index of the last visible item
    const lastVisibleIndex = Math.max(
      ...viewableItems.map((item) => item.index || 0)
    );
    const postsToTriggerAt = Math.floor(lastVisibleIndex % 16);
    if (postsToTriggerAt == 0 && lastVisibleIndex > 10) {
      Newfeed();
    }
  }, []);

  const uploadPostAgain = () => {
    onSubmitPostHandler({ isCreatePost: false });
  }
  const renderHome = useCallback(() => {
    return (
      <>
        <RenderHomeView
          Selectedtab={Selectedtab}
          setSelectedTab={setSelectedTab}
          homePostResponse={homePostResponse}
          postData={postData}
          isNextPostLoading={isNextPostLoading}
          getNewPost={getNewPost}
          refresh_Button={refresh_Button}
          newPostCount={newPostCount}
          onRefreshPostData={onRefreshPostData}
          renderHomeItem={renderHomeItem}
          scrollViewRef={scrollViewRef}
          handleScroll={handleScroll}
          handleScrollButton={handleScrollButton}
          onEndReached={debouncedEndReached}
          refreshing={refreshing}
          handleRefresh={handleRefresh}
          //@ts-ignore
          onViewableItemsChanged={onViewableItemsChanged}
          progressValue={submitPostResponse?.progress}
          progressVisible={submitPostResponse?.loading}
          isCreatePostFailed={submitPostResponse?.isFailed}
          uploadPostAgain={uploadPostAgain}
          communityData={AllGroupList?.data || []}
        />
      </>
    );
  }, [
    Selectedtab,
    postData,
    newPostCount,
    isNextPostLoading,
    debouncedEndReached,
    submitPostResponse,
  ]);

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
  }, []);

  const renderGroupView = () => {
    return (
      <View style={{ ...Styles.mainContainer }}>
        {/* <CustomGroupTab onPress={setIsGroup} isSelected={isGroup} />
        <GroupList isGroup={isGroup} /> */}
      </View>
    );
  };
  const translateX = useSharedValue(isFlex ? 18 : 0);

  const onKycPress = async () => {
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
      console.log("kycStatus", kycStatus);
      switch (kycStatus) {
        case 0: // Need OTP Verification
          onSetUserFromType(stepType === "google_auth" ? "google" : stepType);
          console.log("kycStatus", kycStatus, stepStatus);
          if (stepStatus === 1 || stepStatus === 2) {
            router.push({
              pathname: "/KycOnboardHoc",
              params: { kycStepData: stepStatus },
            });
          } else {
            console.log("contact", userId, contact, stepStatus);
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

        case 6: // Onboarding
          router.push("/KycOnboardHoc");
          break;

        case 2: // Pending
          await handleKycCompletion("/SuccessfullVerificationModal", {
            status: "pending",
          });
          break;

        case -1: // Declined
            router.push({
              pathname: path,
              params: { kycStepData: 0 },
            });
          break;

        case 3: // Rejected
          router.push({
            pathname: "/SuccessfullVerificationModal",
            params: { status: "reject" },
          });
          break;

        case 5: // PAN Pending
          await handleKycCompletion("/SuccessfullVerificationModal", {
            status: "panPending",
          });
          break;

        case 1: // Verified
          await handleKycCompletion("/DashboardScreen");
          break;

        case 4: // Selfie / Additional Step
          await handleKycCompletion("/KycOnboardHoc", {
            kycStepData: userDetailsData?.data?.kyc_details?.ask_profile ? 6 : 5,
            type,
          });
          break;
        default:
          router.replace("/DashboardScreen");
      }
    } else {
      // Fallback if not successful → Step-based handling
      let kycStepData = 0;
      if (stepStatus === 1) {
        kycStepData = 1;
      } else if (stepStatus === 2) {
        kycStepData = stepType === "event" ? 3 : 2;
      }

      const stepParams = { kycStepData, type };

      const path = isLoginMobile === 0 ? "/SelectSocialkyc" : "/KycOnboardHoc";
      console.log("stepParams", stepParams);
      router.push({ pathname: path, params: stepParams });
    }
  };


  const deletePostHandler = useCallback(async () => {
    setDeletePostModal(false);
    var deletePostData: any = await dispatch(
      //@ts-ignore
      onDeletePost({ post_id: postId, user_id: userId })
    );

    if (deletePostData?.payload?.success) {
      updateDeletePostModal(postId);
    }
  }, [postId, userId, updateDeletePostModal]);


  const handleOnPress = () => {
    // if(isComment){
    //   setIsComment(false);
    // }
  };

const onChangeSheetIndex = (index: number) => {
  setCommentIndex(index);
  if(index == -1){
    setIsComment(false);
  }
}
  return (
    <ViewWrapper onPress={handleOnPress} isBottomTab={true}>

      <View style={Styles.container}>
        {headerVisible && (
          <DashboardHeader
            profileImage={userData?.data?.profile_pic || profileImage || ""}
            onToggle={onToggle}
            isflex={isFlex}
            modalShown={modalShown}
            setModalShown={setModalShown} // Pass to header
            userId={userId}
          />
        )}

        <AppUpdateModal
          visible={updateAvailable}
          onSkip={()=>{
            logEvent("skip_update",{
              version: version,
            });
            onPressSkip()}}
          onUpdate={()=>{
            logEvent("update_app",{
              version: version,
            });
            onPressUpdateHandler()}}
          isForceUpdate={force_update}
          newVersion={version}
        />

        {/* Step Modal */}
        {/* {isFlex ? renderHome() : renderGroupView()} */}
        {renderHome()}
      </View>

      {showKycBtn && (
        <KycButton
          setShowKycBtn={setShowKycBtn}
          onPress={() => {
            onKycPress();
          }}
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
        <DynamicContentModal onPressModal={() => {}}  onPress={()=>onKycPress()} />
      )}

      <NotificationPermissionModal
        visible={isModalVisible}
        onClose={() => {
          AsyncStorage.setItem("isFirst", "true");
          setPrefsValue("isFirst", "true");
          dispatch(setIsFirstTime(true));
          setIsModalVisible(false);
        }}
        allowPermission={() => {
          askNotificationPermission();
        }}
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
                onCommentRef.current.close();
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
