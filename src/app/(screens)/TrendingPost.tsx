import {
  View,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
  Modal,
  ScrollView,
  BackHandler,
  Keyboard,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState, useMemo, memo } from "react";
import useHomeViewModel from "@/app/(features)/(home)/viewModel/HomeViewModel";
import CommentsBottomSheet from "@/app/(features)/(viewPost)/component/CommentsBottomSheet";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useReportStore } from "@/zustand/reportStore";
import ProfileOptionBottomSheet from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";
import useBlockUserHook from "@/customHooks/BlockUserHook";
import { router } from "expo-router";
import { useIdStore } from "@/customHooks/CommentUpdateStore";
import { useIsFocused } from "@react-navigation/native";
import PostLoaderComponent from "@/components/PostLoaderComponent";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setTrendingLoading, trendingUserPost } from "@/redux/slice/home/TrendingPostSlice";
import { throttle } from "lodash"; // Optimize onScroll
import HomePostContainer from "@/components/element/HomePostContainer";
import React from "react";
import DeletePostModal from "@/components/modal/DeletePostModal";
import { setHomePostSlice } from "@/redux/slice/home/HomePostSlice";
import { selectHomePostResponse, selectTrendingPostResponse } from "@/redux/selectors/homeSelectors";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import ViewWrapper from "@/components/ViewWrapper";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { logEvent } from "@/customHooks/useAnalytics";
import { upgradePostData } from "@/redux/slice/post/PostDetailSlice";
import useKeyboardVisible from "../hooks/useKeyboardVisible";

const { width } = Dimensions.get("window");

const TrendingPost = () => {
  const { onFetchTrendingHandler } = useHomeViewModel();
  const { setPostId, setPostedByUserId, postId } = usePostDetailStore();
  const { setID } = useIdStore();
  const isFocused = useIsFocused();

  const { setReportUserDetails, reportUserDetails } = useReportStore();
  const { onFetchCommentHandler, commentData } = usePostCommentsHook();
  const { onPressBlockHandler, blockLoading } = useBlockUserHook();
  const [commentIndex, setCommentIndex] = useState(-1);
  const keyboardVisible = useKeyboardVisible();
  
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  // Bottom Sheet Refs
  const CommentSheetRef = useRef<BottomSheet>(null);
  const BlockUserRef = useRef<BottomSheet>(null);
  const profileOptionRef = useRef<BottomSheet>(null);

  useEffect(() => {
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
      backHandler.remove();
    };
  }, []);

  // Redux
  const trendingPostResponse = useSelector(
      selectTrendingPostResponse,
      shallowEqual
    );
  const homePostResponse = useSelector(selectHomePostResponse, shallowEqual);
  const userDetailsData = useSelector((state: any) => state.myProfileData, shallowEqual);
  const dispatch = useDispatch();

  /** Fetch Data When User Reaches End */
  const debouncedEndReached = useCallback(() => {
    if (!trendingPostResponse.isLoaded) {
      dispatch(setTrendingLoading(true));
      onFetchTrendingHandler();
    }
  }, [trendingPostResponse.isLoaded, dispatch, onFetchTrendingHandler]);

  const handleScroll = useMemo(
    () =>
      throttle((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        // Extract values immediately to avoid synthetic event reuse issues
        const { layoutMeasurement, contentOffset, contentSize } =
          event.nativeEvent;

        if (
          layoutMeasurement?.height + contentOffset?.y >=
          contentSize?.height - 20
        ) {
          debouncedEndReached();
        }
      }, 300),
    [debouncedEndReached]
  );

  /** Handle Comment Sheet Open */
  const onPressCommentHandler = useCallback((postId: any, userId: any) => {
    dispatch(commentLoading(true));
    CommentSheetRef.current?.expand();
    // router.push("/Comment");
    setShowCommentModal(true);
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  }, []);

  /** Fetch Data on Focus */
  useEffect(() => {
    onFetchTrendingHandler();
  }, [isFocused]);

  /** Handle Report */
  const onPressReportOption = useCallback(({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId,
      name,
      profilePic: ProfilePic,
      reportType: "post",
    });
    profileOptionRef.current?.close();
    router.push("/ReportProfileScreen");
  }, []);

  /** Handle Block User */
  const onPressBlockOption = useCallback(() => {
    profileOptionRef.current?.close();
    BlockUserRef.current?.expand();
  }, []);

  /** Handle Blocking Submission */
  const onSubmitBlockHandler = useCallback(({ profileId, isBlock }) => {
    BlockUserRef.current?.close();
    onPressBlockHandler({ profileId, isBlock });
  }, []);

  /** Handle Post Options */
  const onPressPostOption = useCallback(({ userData }) => {
    setReportUserDetails({
      name: userData?.full_name,
      userId: userData?.id,
      profilePic: userData?.profile_pic,
      reportId: userData?.id,
    });

    profileOptionRef?.current?.expand();
  }, []);

   const onPressPost = (data: any) => {
      logEvent("post_click", {
            post_id: data?.id,
            type: "trending",
          });
          const { setID } = useIdStore.getState();
      
            setID("4");
        
      
  dispatch(upgradePostData(data));
          router.push({
            pathname: "/post/[id]",
            params: {
              id: data?.id,
              Type: "trending",
              isNotification: "here",
              categoryName: data?.loop_group?.category.category_name,
            },
          });
    }

  const renderTrendingPost = useCallback(({index, item}: any) => {
    return (
      <View
              key={index}
              style={{
                marginVertical: "5%",
                width: "100%",
              }}
            >
              <HomePostContainer
                Type={"trending"}
                onPressComment={(postId, userId) => {
                  setID("4");
                  onPressCommentHandler(postId, userId);
                }}
                onPressPostOption={(data) => onPressPostOption({ userData: data })}
                data={item}
                index={index}
                key={index}
                postPress={() => {
                  onPressPost(item);
                }}
                userInfo={userDetailsData?.data}
              />
            </View>
    )
  },[onPressCommentHandler, onPressPostOption]);

  const onPressDeleteOption = () => {
    setIsDeleteModal(true);
    profileOptionRef.current.close();
  };

  const updateDeletePostModal = (postId: any) => {
      const updatedData = trendingPostResponse?.data.filter(
        (item: any) => item?.id != postId
      );
      const updateHomeData = homePostResponse?.UpdatedData.filter(
        (item: any) => item?.id != postId
      );
      dispatch(trendingUserPost(updatedData));
      dispatch(setHomePostSlice(updateHomeData));
    };

  const deletePostHandler = () => {
    setIsDeleteModal(false);
    dispatch(
          //@ts-ignore
          onDeletePost({ post_id: postId, user_id: userId })
        );
        updateDeletePostModal(postId);
  };

const onChangeSheetIndex = (index: number) => {
  setCommentIndex(index);
}

  return (
    <ViewWrapper>
      <GoBackNavigation header="Trending Posts" isDeepLink={true} />
<View style={{ flex: 1, width: "100%" }}>
          <FlatList
            data={trendingPostResponse?.data || []}
            keyExtractor={(item, index) => index.toString()}
            //@ts-ignore
            renderItem={renderTrendingPost}
            ListEmptyComponent={
              Array.isArray(trendingPostResponse?.data) &&
              trendingPostResponse?.data?.length === 0 &&
              trendingPostResponse.isLoaded ? (
                <View style={{ flexDirection: "column" }}>
                  {[...Array(5)].map((_, index) => (
                    <View
                      key={index}
                      style={{
                        width: (width * 80) / 100,
                        height: (width * 80 * (402 / 308)) / 100,
                        marginHorizontal: 10,
                        marginBottom: 20,
                      }}
                    >
                      <PostLoaderComponent />
                    </View>
                  ))}
                </View>
              ) : null
            }
            getItemLayout={(data, index) => ({
              length: width * 0.8,
              offset: width * 0.8 * index,
              index,
            })}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews
            onEndReached={debouncedEndReached}
            onEndReachedThreshold={0.2}
            // onScroll={handleScroll}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
          />

      <CommentsBottomSheet
        onOpenSheet={CommentSheetRef}
        commentData={commentData}
        isTrending
        onPress={(id) => {
          CommentSheetRef.current?.close();
          router.push({
            pathname: "/profile/[id]",
            params: { id, isProfile: "false" },
          });
        }}
        setIndex={onChangeSheetIndex}
      /> 

      <ProfileOptionBottomSheet
        profileOptionRef={profileOptionRef}
        screen={"post"}
        screen_type={"t_post"}
        onPressReportOption={() =>
          onPressReportOption({
            reportId: reportUserDetails?.reportId,
            name: reportUserDetails?.name,
            ProfilePic: reportUserDetails?.profilePic,
          })
        }
        onPressBlockOption={onPressBlockOption}
        onDeletePostOption={onPressDeleteOption}
      />

      <BlockUserBottomSheet
        BlockUserRef={BlockUserRef}
        screen_type={"t_post"}
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

export default memo(TrendingPost);
