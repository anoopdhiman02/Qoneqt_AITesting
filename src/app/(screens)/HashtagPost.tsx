import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  ActivityIndicator,
  Modal,
  Keyboard,
  BackHandler,
  FlatList,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import HomePostComponent from "@/components/modules/HomePostComponent";
import useHomeViewModel from "@/app/(features)/(home)/viewModel/HomeViewModel";
import CommentsBottomSheet from "@/app/(features)/(viewPost)/component/CommentsBottomSheet";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import PostLoaderComponent from "@/components/element/PostLoaderComponent";
import { useReportStore } from "@/zustand/reportStore";
import { useAppStore } from "@/zustand/zustandStore";
import ProfileOptionBottomSheet from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";
import useBlockUserHook from "@/customHooks/BlockUserHook";
import { router, useLocalSearchParams } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import DeletePostModal from "@/components/modal/DeletePostModal";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { logEvent, useScreenTracking } from "@/customHooks/useAnalytics";
import useKeyboardVisible from "../hooks/useKeyboardVisible";
import index from "../../components/atom/BottomTab/index";
import HomePostContainer from "@/components/element/HomePostContainer";
import TrackPlayer from "react-native-track-player";
import { upgradePostData } from "@/redux/slice/post/PostDetailSlice";
import useSearchViewModel from "@/structure/viewModels/SearchViewModel";

const { width } = Dimensions.get("window");

const HashtagPost = () => {
  useScreenTracking("HashtagPost");
  const { hashtag = "qoneqt" } = useLocalSearchParams();

  const {
    onSearchInputHandler,
    onClearSearchHandler,
    searchLoading,
    hashtagsList,
    onReachEndHandler,
    selectedCategory,
    setSelectedCategory,
    onSearchData,
    onSearchHashData,
    searchQuery,
    setSearchQuery,
    totalHashtagsCount,
  } = useSearchViewModel();

  const { setPostId, setPostedByUserId, postedByUserId } = usePostDetailStore();
  const userId = useAppStore((state) => state.userId);
  const { setReportUserDetails, reportUserDetails } = useReportStore();
  const { onFetchCommentHandler, commentData } = usePostCommentsHook();
  const { onPressBlockHandler, blockLoading } = useBlockUserHook();
  const [showCommentModal, setShowCommentModal] = useState(false);
  const CommentSheetRef = useRef<BottomSheet>(null);
  const BlockUserRef = useRef<BottomSheet>(null);
  const profileOptionRef = useRef<BottomSheet>(null);
  const flatListRef = useRef<FlatList>(null);

  //loader
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [postGroupData, setPostGroupData] = useState(null);
  const [isBlock, setIsBlock] = useState(false);
  const userDetailsData = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );
  const dispatch = useDispatch();
  const [commentIndex, setCommentIndex] = useState(-1);
  const keyboardVisible = useKeyboardVisible();

  // Add pagination loading state
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const isLoadingRef = useRef(false); // Ref to prevent multiple calls

  // Add this debug useEffect to monitor data changes
  useEffect(() => {
    // console.log(`🔍 Data Update: hashtagsList.length = ${hashtagsList.length}`);
    // console.log(
    //   `🔍 First 3 items:`,
    //   hashtagsList
    //     .slice(0, 3)
    //     .map((item) => ({ id: item?.id, index: hashtagsList.indexOf(item) }))
    // );
    // console.log(
    //   `🔍 Last 3 items:`,
    //   hashtagsList
    //     .slice(-3)
    //     .map((item) => ({ id: item?.id, index: hashtagsList.indexOf(item) }))
    // );

    // Force FlatList to re-evaluate its data
    if (flatListRef.current && hashtagsList.length > 15) {
      console.log("🔄 Forcing FlatList update...");
      // Try to force a refresh
      setTimeout(() => {
        flatListRef.current?.forceUpdate?.();
      }, 100);
    }
  }, [hashtagsList.length]);
   useEffect(() => {
    setTimeout(() => {
      if (!searchLoading) setIsLoading(false);
    }, 1000);
     
   }, [hashtagsList.length]);

  const deletePostHandler = () => {
    setIsDeleteModal(false);
    profileOptionRef.current.close();
  };

  const onPressCommentHandler = (postId: any, userId: any) => {
    dispatch(commentLoading(true));
    CommentSheetRef.current.expand();
    setShowCommentModal(true);
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  };

  useEffect(() => {
    setSelectedCategory(4);
    let hash = Array.isArray(hashtag) ? hashtag[0] : hashtag;
    hash = hash.replace(/^#+/, "");
    setSearchQuery(hash);
    setTimeout(() => {
      onSearchHashData(hash);
    }, 500);

    console.log("search:", hash);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (keyboardVisible) {
          Keyboard.dismiss();
          return true;
        }
        if (commentIndex == -1) {
          CommentSheetRef.current?.close();
          return true;
        }
        router.back();
        return true;
      }
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  const onPressReportOption = ({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId: reportId,
      name: name,
      profilePic: ProfilePic,
      reportType: "post",
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

  const onPressPostOption = ({ userData, groupData }) => {
    setReportUserDetails({
      name: userData?.full_name,
      userId: userData?.id,
      profilePic: userData?.profile_pic,
      reportId: userData?.id,
    });
    setPostedByUserId(userData?.id);
    setPostGroupData(groupData);
    profileOptionRef?.current?.expand();
  };

  const onDeletePostOption = () => {
    profileOptionRef?.current?.expand();
  };

  const onChangeSheetIndex = (index: number) => {
    setCommentIndex(index);
  };

  const onPressPost = (data: any) => {
    logEvent("post_click", {
      post_id: data?.id,
      type: "category",
    });

    if (data.file_type == "video") {
      TrackPlayer.stop();
    }

    dispatch(upgradePostData(data));
    router.push({
      pathname: "/post/[id]",
      params: {
        id: data?.id,
        Type: "categories",
        isNotification: "here",
        categoryName: data?.loop_group?.category.category_name,
      },
    });
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      // Only log occasionally to reduce spam
      if (index % 10 === 0) {
        console.log(
          "Rendering item at index:",
          index,
          "Item ID:",
          item?.id,
          "Total items:",
          hashtagsList.length
        );
      }

      if (searchLoading && hashtagsList.length === 0) {
        return (
          <View
            style={{
              width: width,
              height: (width * 80 * (402 / 308)) / 100,
              marginHorizontal: 10,
              marginBottom: 20,
            }}
          >
            <PostLoaderComponent />
          </View>
        );
      }

      return (
        <HomePostContainer
          Type={"categories"}
          onPressComment={(postId) => onPressCommentHandler(postId, userId)}
          onPressPostOption={(data) => onPressPostOption(data)}
          data={item}
          index={index}
          userInfo={userDetailsData?.data}
          postPress={() => {
            onPressPost(item);
          }}
        />
      );
    },
    [hashtagsList.length, searchLoading, userId, userDetailsData?.data]
  );

  const ListFooterComponent = useCallback(() => {
    if (hashtagsList.length > 0 && (searchLoading || isPaginationLoading)) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 20,
          }}
        >
          <ActivityIndicator
            size="large"
            color={globalColors.neutral_white[100]}
          />
          <Text
            style={{ color: globalColors.neutral_white[100], marginTop: 10 }}
          >
            Loading more posts...
          </Text>
        </View>
      );
    }
    return (
      <View
        style={{
          height: 50,
        }}
      />
    );
  }, [hashtagsList.length, searchLoading, isPaginationLoading]);

  // Manual load more function
  const loadMoreData = useCallback(async () => {
    const currentData = hashtagsList || [];

    console.log("🔄 loadMoreData called");
    console.log("Current data length:", currentData.length);
    console.log("Total count:", totalHashtagsCount);
    console.log("Is loading ref:", isLoadingRef.current);
    console.log("Search loading:", searchLoading);

    if (
      isLoadingRef.current ||
      searchLoading ||
      currentData.length >= totalHashtagsCount ||
      currentData.length === 0
    ) {
      console.log("❌ Skipping load more");
      return;
    }

    isLoadingRef.current = true;
    setIsPaginationLoading(true);

    try {
      console.log("✅ Loading more data...");
      await onReachEndHandler();
    } catch (error) {
      console.error("❌ Error loading more data:", error);
    } finally {
      setIsPaginationLoading(false);
      isLoadingRef.current = false;
    }
  }, [hashtagsList, totalHashtagsCount, searchLoading, onReachEndHandler]);

  // Scroll handler with manual end detection
  const onScrollHandler = useCallback(
    (event) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;

      // Only check if we have content
      if (contentSize.height === 0) return;

      // Calculate distance from bottom
      const distanceFromEnd =
        contentSize.height - (layoutMeasurement.height + contentOffset.y);

      // Log scroll info for debugging
      if (contentOffset.y % 100 < 16) {
        // Log every ~100px to avoid spam
        // console.log("📍 Scroll info:", {
        //   contentOffset: Math.round(contentOffset.y),
        //   contentHeight: Math.round(contentSize.height),
        //   layoutHeight: Math.round(layoutMeasurement.height),
        //   distanceFromEnd: Math.round(distanceFromEnd),
        // });
      }

      // Trigger load more when within 200px of bottom
      if (distanceFromEnd < 200 && distanceFromEnd > 0) {
        console.log(
          "🎯 Near end detected, distance:",
          Math.round(distanceFromEnd)
        );
        loadMoreData();
      }
    },
    [loadMoreData]
  );


  return (
    <ViewWrapper>
      <View style={{ flex: 1, width: "98%", margin: "1%" }}>
        <GoBackNavigation
          header={"#" + hashtag + " - Posts"}
          isDeepLink={true}
        />

        <ScrollView
          style={{ flex: 1, width: "98%", marginHorizontal: "1%" }}
          showsVerticalScrollIndicator={false}
          onScroll={onScrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingBottom: 50,
            // Add this condition for centering when no data
            ...(hashtagsList.length === 0 &&
              !searchLoading &&
              !isLoading && {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "98%",
                marginHorizontal: "1%",
              }),
          }}
        >
          {/* Your existing map logic */}
          {hashtagsList.length > 0 ? (
            hashtagsList.map((item, index) => {
              // Only log occasionally to reduce spam
              if (index % 10 === 0) {
                console.log(
                  "Rendering item at index:",
                  index,
                  "Item ID:",
                  item?.id,
                  "Total items:",
                  hashtagsList.length
                );
              }

              return (
                <HomePostContainer
                  key={item?.id ? `hashtag-${item.id}` : `placeholder-${index}`}
                  Type={"categories"}
                  onPressComment={(postId) =>
                    onPressCommentHandler(postId, userId)
                  }
                  onPressPostOption={(data) => onPressPostOption(data)}
                  data={item}
                  index={index}
                  userInfo={userDetailsData?.data}
                  postPress={() => onPressPost(item)}
                />
              );
            })
          ) : (searchLoading || isLoading) && hashtagsList.length === 0 ? (
            <View
              style={{
                width: "97%",
                height: (width * 80 * (402 / 308)) / 100,
                marginHorizontal: 10,
                marginBottom: 20,
              }}
            >
              <PostLoaderComponent />
            </View>
          ) : (
            !searchLoading &&
            !isLoading &&
            hashtagsList.length === 0 && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    color: globalColors.neutral_white[100],
                    fontSize: 18,
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  {"No posts found"}
                </Text>
                {!isLoading && (
                  <Text
                    style={{
                      color: "grey",
                      fontSize: 14,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    There are no posts with #{hashtag} hashtag yet.{"\n"}
                    Be the first to create a post with this hashtag!
                  </Text>
                )}
              </View>
            )
          )}

          {/* Rest of your footer logic */}
          {hashtagsList.length > 0 &&
            (searchLoading || isPaginationLoading) && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 20,
                }}
              >
                <ActivityIndicator
                  size="large"
                  color={globalColors.neutral_white[100]}
                />
                <Text
                  style={{
                    color: globalColors.neutral_white[100],
                    marginTop: 10,
                  }}
                >
                  Loading more posts...
                </Text>
              </View>
            )}

          {/* Empty space at bottom */}
          <View style={{ height: 50 }} />
        </ScrollView>

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
          profileOptionRef={profileOptionRef}
          screen={"post"}
          screen_type={"post"}
          onPressReportOption={() =>
            onPressReportOption({
              reportId: reportUserDetails?.reportId,
              name: reportUserDetails?.name,
              ProfilePic: reportUserDetails?.profilePic,
            })
          }
          onPressBlockOption={onPressBlockOption}
          onDeletePostOption={onDeletePostOption}
          postGroupData={postGroupData}
          userId={userId}
          postedByUserId={postedByUserId}
        />

        <BlockUserBottomSheet
          BlockUserRef={BlockUserRef}
          onPressBlockButton={() =>
            onSubmitBlockHandler({
              profileId: reportUserDetails?.reportId,
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
      </View>
    </ViewWrapper>
  );
};

export default HashtagPost;
