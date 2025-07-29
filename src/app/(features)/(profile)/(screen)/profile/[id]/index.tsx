import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Keyboard,
  Linking,
  Modal,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  CopyLink01Icon,
  ShareIcon,
} from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import useUserProfileViewModel from "../../../../(userProfile)/viewModel/UserProfileViewModel";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { onFollowUser } from "@/redux/reducer/Profile/FollowUser";
import { useAppStore } from "@/zustand/zustandStore";
import useMyPostsViewModel from "@/structure/viewModels/profile/MyPostsViewModel";
import MyPostContainer from "@/components/element/MyPostContainer";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import ProfileOptionBottomSheet from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";
import { useReportStore } from "@/zustand/reportStore";
import { LinearGradient } from "expo-linear-gradient";
import PostLoaderComponent from "@/components/element/PostLoaderComponent";
import { setPrefsValue } from "@/utils/storage";
import ViewWrapper from "@/components/ViewWrapper";
import CommentsBottomSheet from "@/app/(features)/(viewPost)/component/CommentsBottomSheet";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import ProfileDetailComponent from "@/app/(features)/(userProfile)/component/ProfileDetailComponent";
import styles from "./styles";
import { useIdStore } from "@/customHooks/CommentUpdateStore";
import { setProfileLoadingData, updateProfileViewData } from "@/redux/slice/profile/ProfiledeatilsSlice";
import { setUserFeedLoading } from "@/redux/slice/profile/UserFeedsSlice";
import ShimmerView from "./ShimmerView";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import DeletePostModal from "@/components/modal/DeletePostModal";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import { shallowEqual, useSelector } from "react-redux";
import { updateProfileData } from "@/redux/slice/profile/ProfileMyDetailsSlice";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useKeyboardVisible from "@/app/hooks/useKeyboardVisible";

const UserProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const userId = useAppStore((state) => state.userId);
  const { setReportUserDetails } = useReportStore();
  const { id, isProfile } = useLocalSearchParams();
  useScreenTracking("UserProfileScreen/"+id);
  const { setPostId, setPostedByUserId } = usePostDetailStore();
  const dispatch = useAppDispatch();
  const {
    onFetchProfileDetails,
    onPressBlockHandler,
    blockLoading,
    onPressMessage,
    isFollow,
    setIsFollow,
  } = useUserProfileViewModel();

  const { onFetchCommentHandler, commentData } = usePostCommentsHook();
  //Post
  const { onFetchFeedsHanlder } = useMyPostsViewModel();
  const myPostListResponse = useAppSelector((state) => state.myFeedsListData);
  const { setID } = useIdStore();

  const CommentSheetRef = useRef<BottomSheet>(null);
  const BlockUserRef = useRef<BottomSheet>(null);
  const profileOptionRef = useRef<BottomSheet>(null);
  const ShareProfileRef = useRef(null);
  const profileDetailsData: any = useAppSelector(
    (state) => state.fetchProfileDetails
  );
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const { updateUserData } = UserStoreDataModel();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const videoRef = useVideoPlayerStore.getState().videoRef;
  const isVideoPlaying = useVideoPlayerStore.getState().isPlay;
  const [isBlock, setIsBlock] = useState(false);
  const myProfileData = useSelector(
      (state: any) => state.myProfileData,
      shallowEqual
    );
  const [commentIndex, setCommentIndex] = useState(-1);
  const keyboardVisible = useKeyboardVisible();
  const deletePostHandler = () => {
    setIsDeleteModal(false);
    profileOptionRef.current.close();
  };

  useEffect(() => {
    const fetchProData = async () => {
      try {
        if (profileDetailsData?.data?.id != id) {
          await Promise.all([
            dispatch(setProfileLoadingData(true)),
            dispatch(setUserFeedLoading(true)),
            onFetchProfileDetails(id),
            onFetchFeedsHanlder({ profileId: id, lastCount: 0 }),
          ]);
        }
      } catch (error) {
        console.error("Error fetching pro data:", error);
      }
    };
    fetchProData();
    updateUserData();
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
    return () => {
      backHandler.remove();
      setPrefsValue("notificationInfo", "");
      if (videoRef && isVideoPlaying) {
        videoRef.pauseAsync(); // pause when navigating away
      }
    };
  }, []);

  const ProfileButton = ({ onPress, label, backgroundColor }) => {
    return (
          <TouchableOpacity onPress={onPress} style={[styles.linnerContainer, { backgroundColor }]}>
            <Text style={styles.linnerText}>{label}</Text>
          </TouchableOpacity>
    );
  };

  const onPressFollow = async ({ profileId, isFollow }) => {
    if (!profileId) {
      console.error("profileId is undefined");
      showToast({ type: "error", text1: "Something went wrong." });
      return;
    }
    setIsFollow(!isFollow);
    var followUserData = await dispatch(
      onFollowUser({
        userId: userId,
        profileId: profileId,
        isFollow: isFollow,
      })
    );
    if (followUserData.payload.success) {
      setIsFollow(!isFollow);
      showToast({ type: "success", text1: followUserData?.payload?.message });
      const updatedProfileDatas: any = {
                 data: {
                       ...myProfileData.data,
                       following_count: !isFollow ? myProfileData.data.following_count + 1 : myProfileData.data.following_count - 1
                     },
               };
               dispatch(updateProfileData(updatedProfileDatas));
    } else {
      showToast({
        type: "error",
        text1: `${followUserData?.payload?.message || "something went wrong"}`,
      });
    }
  };

  const onPressFollowOption = () => {
    if (!id || !profileDetailsData?.data) {
      console.error("Profile data or ID is missing");
      showToast({ type: "error", text1: "Unable to perform this action." });
      return;
    }
    onPressFollow({ profileId: id, isFollow: profileDetailsData?.data.follow_by_me == 1 ? 0 : 1 });
    dispatch(updateProfileViewData({
      ...profileDetailsData?.data,
      follow_by_me: profileDetailsData?.data.follow_by_me == 1 ? 0 : 1
      }));
  };

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const referCode = url.split("profile/");
      if (referCode[1]) {
        onFetchProfileDetails(referCode[1]);
        onFetchFeedsHanlder({ profileId: referCode[1], lastCount: 0 });
      }
    };

    // Add event listener for deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check for any deep link URL when the app starts
    const initialUrl = Linking.getInitialURL();
    initialUrl.then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const onPressReportOption = ({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId: reportId,
      name: name,
      profilePic: ProfilePic,
      reportType: "profile",
    });
    profileOptionRef.current.close();
    router.push("/ReportProfileScreen");
  };
  const onPressBlockOption = () => {
    profileOptionRef.current.close();
    if(profileDetailsData?.data?.block_by_me == 1){
      onPressBlockHandler({ profileId: profileDetailsData?.data?.id, isBlock: 0 });
      dispatch(updateProfileViewData({...profileDetailsData?.data,block_by_me: 0, follow_by_me: 0 }));
    }
    else {
      BlockUserRef.current.expand();
    }
    
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    BlockUserRef.current.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
    dispatch(updateProfileViewData({...profileDetailsData?.data,block_by_me: 1}));
  };
  const onPressCommentHandler = (postId: any, userId: any) => {
    dispatch(commentLoading(true));
    CommentSheetRef.current.expand();
    // router.push("/Comment");
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  };

  const debouncedEndReached = () => {
    if (!myPostListResponse.isLoaded && myPostListResponse.updatedData.length > 0) {
      dispatch(setUserFeedLoading(true));
      onFetchFeedsHanlder({
        profileId: id,
        lastCount: myPostListResponse.updatedData.length,
      });
    }
  };

  const onShare = async (id) => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/profile/${id}`,
        title: "Share Profile",
      });

      if (result.action === Share.sharedAction) {
      }
    } catch (error) {}
  };

  const copyToClipboard = (id) => {
    if (!id) {
      console.error("ID is missing");
      return;
    }
    const profileUrl = `https://qoneqt.com/profile/${id}`;
    Clipboard.setString(profileUrl);
    showToast({ type: "success", text1: "Link copied to clipboard!" });
  };

  const onPressDeleteOption = () => {
    // setDeletePostModal(true);
    profileOptionRef.current.close();
  };
  const renderPostItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      if (item?.id) {
        return (
          <MyPostContainer
            data={item} // no useMemo needed here
            index={index}
            key={item.id}
            onPressComment={(postId, userId) => {
              setID("1");
              onPressCommentHandler(postId, userId);
            }}
            isPlaying={currentPlaying === item.id}
            setCurrentPlaying={setCurrentPlaying}
            isHome={true}
          />
        );
      } else {
        return <PostLoaderComponent key={`loader-${index}`} />;
      }
    },
    [currentPlaying, onPressCommentHandler, setCurrentPlaying]
  );
  const dataValue = useMemo(
    () =>
      myPostListResponse.isLoaded && myPostListResponse.updatedData.length == 0
        ? [1, 2, 3, 4, 5]
        : profileDetailsData?.data?.block_by_user == 0 ? myPostListResponse.updatedData : [],
    [myPostListResponse]
  );

  const ListFooterComponent = () => {
    return (
      <View>
        {myPostListResponse.isLoaded &&
          myPostListResponse.updatedData.length !== 0 && (
            <View style={{ position: "absolute", bottom: 30 }}>
              <ActivityIndicator size={"large"} color={globalColors.warmPink} />
            </View>
          )}
      </View>
    );
  };
  const ListHeaderComponent = () => {
    return (
      <View>
        {/* Profile Detail */}
        <ProfileDetailComponent
          data={profileDetailsData?.data}
          isLoading={profileDetailsData.isLoaded}
        />
        {profileDetailsData?.data?.block_by_user == 0 ? (
          <View style={styles.mainContainer}>
          <View style={{ ...styles.feedContainer, marginTop: 10 }}>
            <View style={{ alignItems: "center", justifyContent: "center", width: "40%" , borderBottomColor: globalColors.lightPink, borderBottomWidth: 2, paddingVertical:3}}>
            <Text style={styles.feedCountText}>
              Feed
            </Text>
            </View>
          </View>
        </View>
        ): (<View/>)}
      </View>
    );
  };
  const onChangeSheetIndex = (index: number) => {
    setCommentIndex(index);
  };

  return (
    <ViewWrapper>
      <GoBackNavigation
        header=""
        isleftIcon
        isHome={isProfile == undefined}
        isDeepLink={isProfile == "true"}
        onPressLeftIcon={() => profileOptionRef.current.expand()}
        // isMessageIcon
        // onPressMessageIcon={() => onPressMessage(id)}
        isShareIcon
        onPressShareIcon={() => {ShareProfileRef.current.expand();}}
      />
      {profileDetailsData?.data?.id == id ? (
        <View style={{ flex: 1, width: "100%" }}>
          <FlatList
            ListHeaderComponent={ListHeaderComponent}
            data={dataValue}
            showsVerticalScrollIndicator={false}
            renderItem={renderPostItem}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={ListFooterComponent}
            onEndReached={debouncedEndReached}
            onEndReachedThreshold={0.5}
            decelerationRate={"fast"}
            disableIntervalMomentum={true}
            snapToInterval={null}
            bounces={false}
            overScrollMode="never"
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            initialNumToRender={5}
            windowSize={10}
            updateCellsBatchingPeriod={50}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ShimmerView />
        </View>
      )}
      {profileDetailsData?.data?.block_by_user == 0 ?(
      <View style={{ position: "absolute", bottom: 0, width: "100%", backgroundColor: globalColors.neutral1, paddingVertical: insets.bottom }}>
        {profileDetailsData?.data?.follow_by_me == 1 ? (
          
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
          <ProfileButton
            label={<Text
              style={{
                color: globalColors.neutralWhite,
                fontWeight: "bold",
              }}
            >
              {"Following"}
            </Text>}
            onPress={() => onPressFollowOption()}
            backgroundColor={globalColors.neutral7}
          />
          <ProfileButton
            label={<Text
              style={{
                color: globalColors.neutralWhite,
                fontWeight: "bold",
              }}
            >
              {"message"}
            </Text>} onPress={() => onPressMessage(id)}
            backgroundColor={globalColors.neutral7}
          />
        </View>
        ):
          (
            <View style={{ width: "100%",alignItems: "center", justifyContent: "center",  }}> 
            <ProfileButton
            label={<Text
              style={{
                color: globalColors.neutralWhite,
                fontWeight: "bold",
              }}
            >
              {"Follow"}
            </Text>}
            onPress={() => onPressFollowOption()}
            backgroundColor={globalColors.warmPinkTint100}
          />
             </View> 
      )}
       
        
      </View>):(<View/>)}
      {/* comment post  */}
      <CommentsBottomSheet
        onOpenSheet={CommentSheetRef}
        commentData={commentData}
        onPress={(id) => {
          CommentSheetRef.current.close();
          router.push({
            pathname: "/profile/[id]",
            params: { id: id, isProfile: "false" },
          });
        }}
        setIndex={onChangeSheetIndex}
      />

      <ProfileOptionBottomSheet
        screen_type={"post"}
        profileOptionRef={profileOptionRef}
        screen={"profile"}
        isBlock={profileDetailsData?.data?.block_by_me == 1}
        onPressReportOption={() =>
          onPressReportOption({
            reportId: profileDetailsData?.data?.id,
            name: profileDetailsData?.data?.full_name,
            ProfilePic: profileDetailsData?.data?.profile_pic,
          })
        }
        onPressBlockOption={onPressBlockOption}
        onDeletePostOption={onPressDeleteOption}
        userId={userId}
      />

      {/* 3 on press share Profile */}
      <BottomSheetWrap
        snapPoints={["20%", "30%"]}
        bottomSheetRef={ShareProfileRef}
      >
        <View>
          <Text style={styles.followingStyle}>Share profile</Text>
          <TouchableOpacity
            onPress={() => onShare(profileDetailsData?.data?.id)}
            style={styles.shareContainer}
          >
            <View style={styles.shareIcon}>
              <ShareIcon height={24} width={24} />
            </View>
            <Text style={styles.shareText}>Share via</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => copyToClipboard(profileDetailsData?.data?.id)}
            style={styles.copyViewStyle}
          >
            <View style={styles.shareIcon}>
              <CopyLink01Icon />
            </View>
            <Text style={styles.shareText}>Copy link</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>
      {/* 4  onSelect Block option from profile option sheet*/}
      <BlockUserBottomSheet
        BlockUserRef={BlockUserRef}
        onPressBlockButton={() =>
          onSubmitBlockHandler({
            profileId: profileDetailsData?.data?.id,
            isBlock: 1,
          })
        }
        loading={blockLoading}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModal}
        onRequestClose={() => setIsDeleteModal(false)}
      >
        <DeletePostModal
          setDeletePostModal={setIsDeleteModal}
          deletePostHandler={deletePostHandler}
        />
      </Modal>
    </ViewWrapper>
  );
};
export default UserProfileScreen;
