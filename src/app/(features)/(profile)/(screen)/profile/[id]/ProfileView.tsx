import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Keyboard,
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  ArrowUpSmallIcon,
  CopyLink01Icon,
  ShareIcon,
  UnFollowIcon,
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
import { setProfileLoadingData } from "@/redux/slice/profile/ProfiledeatilsSlice";
import { setUserFeedLoading } from "@/redux/slice/profile/UserFeedsSlice";
import ShimmerView from "./ShimmerView";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import DeletePostModal from "@/components/modal/DeletePostModal";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import index from "../../../../../../components/atom/BottomTab/index";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import useKeyboardVisible from "@/app/hooks/useKeyboardVisible";

const UserProfileScreen = () => {
  const userId = useAppStore((state) => state.userId);
  const { setReportUserDetails } = useReportStore();
  const { id, isProfile } = useLocalSearchParams();
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
            if(commentIndex == -1){
              // setCommentIndex(1);
              CommentSheetRef.current?.close();
              return true;
            }
            router.back();
              
            
            return true;
          }
        );
    return () => {
      setPrefsValue("notificationInfo", "");
      if (videoRef && isVideoPlaying) {
        videoRef.pauseAsync(); // pause when navigating away
      }
      backHandler.remove();
    };
  }, []);

  const ProfileButton = ({ onPress, label }) => {
    return (
      <View style={{ width: "50%" }}>
        <LinearGradient
          colors={[
            globalColors.darkOrchidShade60,
            "transparent",
            "transparent",
            globalColors.darkOrchidShade60,
          ]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.linnerContainer}
        >
          <TouchableOpacity onPress={onPress} style={styles.linnerButton}>
            <Text style={styles.linnerText}>{label}</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  const onPressFollow = async ({ profileId, isFollow }) => {
    var followUserData = await dispatch(
      onFollowUser({
        userId: userId,
        profileId: profileId,
        isFollow: isFollow ? 0 : 1,
      })
    );
    if (followUserData.payload.success) {
      setIsFollow(!isFollow);
      showToast({ type: "success", text1: followUserData?.payload?.message });
    } else {
      showToast({
        type: "error",
        text1: `${followUserData?.payload?.message || "something went wrong"}`,
      });
    }
  };

  const onPressFollowOption = () => {
    onPressFollow({ profileId: id, isFollow: isFollow });
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
    BlockUserRef.current.expand();
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    BlockUserRef.current.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
  };
  const onPressCommentHandler = (postId: any, userId: any) => {
    dispatch(commentLoading(true));
    CommentSheetRef.current.expand();
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  };

  const debouncedEndReached = () => {
    if (!myPostListResponse.isLoaded) {
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
        : myPostListResponse.updatedData,
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
        <View style={styles.mainContainer}>
          <ProfileButton
            label={
              <View style={styles.profileButtonStyle}>
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                  }}
                >
                  {isFollow ? "Following" : "Follow"}
                </Text>
              </View>
            }
            onPress={() => onPressFollowOption()}
          />
          <ProfileButton label={"Message"} onPress={() => onPressMessage(id)} />
          <ProfileButton
            label={"Share profile"}
            onPress={() => {
              ShareProfileRef.current.expand();
            }}
          />
          <View style={{ ...styles.feedContainer, marginTop: 10 }}>
            <Text style={styles.feedCountText}>
              Feed (
              {profileDetailsData?.data?.post_count}
              )
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const onChangeSheetIndex = (index: number) => {
    setCommentIndex(index);
  };

  return (
    <ViewWrapper>
      <GoBackNavigation
        header="Profile details"
        isleftIcon
        isHome={isProfile == undefined}
        isDeepLink={isProfile == "true"}
        onPressLeftIcon={() => profileOptionRef.current.expand()}
      />
      {profileDetailsData?.data?.id == id ? (
        <View style={{ flex: 1, width: "94%", marginHorizontal: "3%" }}>
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
