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
  Animated,
  StatusBar,
  Dimensions,
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
import PostLoaderComponent from "@/components/element/PostLoaderComponent";
import { setPrefsValue } from "@/utils/storage";
import ViewWrapper from "@/components/ViewWrapper";
import CommentsBottomSheet from "@/app/(features)/(viewPost)/component/CommentsBottomSheet";
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
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import BackIcon from '@expo/vector-icons/AntDesign';

const HEADER_HEIGHT = 60;

const UserProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
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
  const myProfileData = useSelector(
      (state: any) => state.myProfileData,
      shallowEqual
    );
  const [commentIndex, setCommentIndex] = useState(-1);
  const keyboardVisible = useKeyboardVisible();

const buttonVisibleRef = useRef(false);
  // Animation values
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [-HEADER_HEIGHT, 0],
    extrapolate: 'clamp',
  });

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
        } else {
          router.replace("/DashboardScreen");
        }
        return true;
      }
    );
    
    return () => {
      backHandler.remove();
      setPrefsValue("notificationInfo", "");
      if (videoRef && isVideoPlaying) {
        videoRef.pauseAsync();
      }
      if(buttonVisibleRef.current){
        buttonVisibleRef.current = false;

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

  const onPressCommentHandler = (postId: any, userId: any) => {
    dispatch(commentLoading(true));
    CommentSheetRef.current.expand();
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  };

  const onShare = async (id) => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/profile/${id}`,
        title: "Share Profile",
      });
    } catch (error) {}
  };

  const renderPostItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      if (item?.id) {
        return (
          <MyPostContainer
            data={item}
            index={index}
            key={item.id}
            onPressComment={(postId, userId) => {
              setID("1");
              onPressCommentHandler(postId, userId);
            }}
            isPlaying={currentPlaying === item.id}
            setCurrentPlaying={setCurrentPlaying}
            isHome={true}
            currentUserID={profileDetailsData?.data?.id}
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

  const ListHeaderComponent = useCallback(() => {
    return (
      <View style={{marginTop: 60}}>
        <ProfileDetailComponent
          data={profileDetailsData?.data}
          isLoading={profileDetailsData.isLoaded}
        />
        {profileDetailsData?.data?.block_by_user == 0 ? (
          <View style={styles.mainContainer}>
            <View style={{ ...styles.feedContainer, marginTop: 10 }}>
              <View style={{ 
                alignItems: "center", 
                justifyContent: "center", 
                width: "40%", 
                borderBottomColor: globalColors.lightPink, 
                borderBottomWidth: 2, 
                paddingVertical: 3
              }}>
                <Text style={styles.feedCountText}>Feed</Text>
              </View>
            </View>
          </View>
        ) : (<View/>)}
      </View>
    );
  }, [profileDetailsData]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const handleBackPress = () => {
      if (isProfile == undefined) {
        router?.replace("/DashboardScreen");
      } else {
        if (router.canGoBack()) {
          router.back();
        } else {
          router?.replace("/DashboardScreen");
        }
    }
  };

  const ListFooterComponent = () => {
    return (
      <View style={{ height: 100 }} />
    );
  };

  return (
    <ViewWrapper>
      <StatusBar backgroundColor="transparent" translucent barStyle="light-content" />
      
      {/* Always Visible Header with Left & Right Buttons */}
      <View
        style={{
          position: 'absolute',
          top: insets.top,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          zIndex: 1001,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <BackIcon
                  disabled={buttonVisibleRef.current}
                  name="left"
                  size={24}
                  color={globalColors.neutralWhite}
                  onPress={() => {
                    if (buttonVisibleRef.current) return;
                    buttonVisibleRef.current == true;
                      handleBackPress();
                  }}
                  style={{
                    padding: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                />

        {/* Right - Action Buttons */}
        <View style={{ flexDirection: 'row', gap: 4 }}>
          <TouchableOpacity
            onPress={() => ShareProfileRef.current.expand()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ShareIcon height={20} width={20} />
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => profileOptionRef.current.expand()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: globalColors.neutralWhite, fontSize: 16 }}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Animated User Info Header (only shows when scrolling) */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT + insets.top,
          backgroundColor: globalColors.neutral1,
          zIndex: 1000,
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }],
          borderBottomWidth: 1,
          borderBottomColor: globalColors.neutral7,
          paddingTop: insets.top,
          justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 50,
        }}>
          <View style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: globalColors.neutralWhite,
            marginRight: 8,
          }}>
            <ImageFallBackUser
              imageData={profileDetailsData?.data?.profile_pic}
              fullName={profileDetailsData?.data?.full_name}
              widths={32}
              heights={32}
              borders={16}
            />
          </View>
          
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
            }}
            numberOfLines={1}
          >
            {profileDetailsData?.data?.full_name || ''}
          </Text>
        </View>
      </Animated.View>

      {/* Main Content */}
      {profileDetailsData?.data?.id == id ? (
        <View style={{ flex: 1 }}>
          <Animated.FlatList
            ListHeaderComponent={ListHeaderComponent}
            data={dataValue}
            showsVerticalScrollIndicator={false}
            renderItem={renderPostItem}
            keyExtractor={(item, index) => index.toString()}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingTop: 0 }}
            bounces={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            initialNumToRender={5}
            windowSize={10}
            ListFooterComponent={ListFooterComponent}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ShimmerView isOtherProfile={true} />
        </View>
      )}

      {/* Bottom Action Buttons */}
      {profileDetailsData?.data?.block_by_user == 0 && (
        <View style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          backgroundColor: globalColors.neutral1,
          paddingVertical:  insets.bottom == 0 ? 10 : insets.bottom,
        }}>
          {profileDetailsData?.data?.follow_by_me == 1 ? (
            <View style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <ProfileButton
                label={
                  <Text style={{
                    color: globalColors.neutralWhite,
                    fontWeight: "bold",
                  }}>
                    {"Following"}
                  </Text>
                }
                onPress={() => onPressFollowOption()}
                backgroundColor={globalColors.neutral7}
              />
              <ProfileButton
                label={
                  <Text style={{
                    color: globalColors.neutralWhite,
                    fontWeight: "bold",
                  }}>
                    {"Message"}
                  </Text>
                }
                onPress={() => onPressMessage(profileDetailsData?.data)}
                backgroundColor={globalColors.neutral7}
              />
            </View>
          ) : (
            <View style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <ProfileButton
                label={
                  <Text style={{
                    color: globalColors.neutralWhite,
                    fontWeight: "bold",
                  }}>
                    {"Follow"}
                  </Text>
                }
                onPress={() => onPressFollowOption()}
                backgroundColor={globalColors.warmPinkTint100}
              />
            </View>
          )}
        </View>
      )}

      {/* Bottom Sheets and Modals */}
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
        setIndex={(index) => setCommentIndex(index)}
      />

      <ProfileOptionBottomSheet
        screen_type={"post"}
        profileOptionRef={profileOptionRef}
        screen={"profile"}
        isBlock={profileDetailsData?.data?.block_by_me == 1}
        onPressReportOption={() => {
          setReportUserDetails({
            reportId: profileDetailsData?.data?.id,
            name: profileDetailsData?.data?.full_name,
            profilePic: profileDetailsData?.data?.profile_pic,
            reportType: "profile",
          });
          profileOptionRef.current.close();
          router.push("/ReportProfileScreen");
        }}
        onPressBlockOption={() => {
          profileOptionRef.current.close();
          if(profileDetailsData?.data?.block_by_me == 1){
            onPressBlockHandler({ profileId: profileDetailsData?.data?.id, isBlock: 0 });
            dispatch(updateProfileViewData({...profileDetailsData?.data, block_by_me: 0, follow_by_me: 0 }));
          } else {
            BlockUserRef.current.expand();
          }
        }}
        onDeletePostOption={() => profileOptionRef.current.close()}
        userId={userId}
      />

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
            onPress={() => {
              const profileUrl = `https://qoneqt.com/profile/${profileDetailsData?.data?.id}`;
              Clipboard.setString(profileUrl);
              showToast({ type: "success", text1: "Link copied to clipboard!" });
            }}
            style={styles.copyViewStyle}
          >
            <View style={styles.shareIcon}>
              <CopyLink01Icon />
            </View>
            <Text style={styles.shareText}>Copy link</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      <BlockUserBottomSheet
        BlockUserRef={BlockUserRef}
        onPressBlockButton={() => {
          BlockUserRef.current.close();
          onPressBlockHandler({ profileId: profileDetailsData?.data?.id, isBlock: 1 });
          dispatch(updateProfileViewData({...profileDetailsData?.data, block_by_me: 1}));
        }}
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
          deletePostHandler={() => {
            setIsDeleteModal(false);
            profileOptionRef.current.close();
          }}
        />
      </Modal>
    </ViewWrapper>
  );
};

export default UserProfileScreen;