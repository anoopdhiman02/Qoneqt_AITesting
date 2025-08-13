import React, { useCallback, useEffect, useRef, useState, memo, useMemo } from "react";
import {
  Text,
  View,
  Share,
  Linking,
  FlatList,
  Modal,
  BackHandler,
  Keyboard,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import PostLoaderComponent from "@/components/element/PostLoaderComponent";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import MediaPost from "@/components/MediaPost";
import ProfileOptionBottomSheet from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";
import { useReportStore } from "@/zustand/reportStore";
import useBlockUserHook from "@/customHooks/BlockUserHook";
import { setPrefsValue } from "@/utils/storage";
import { useAppStore } from "@/zustand/zustandStore";
import ViewWrapper from "@/components/ViewWrapper";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import CommentsBottomSheet from "@/app/(features)/(viewPost)/component/CommentsBottomSheet";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { useCommentRef, useIdStore } from "@/customHooks/CommentUpdateStore";
import { commentLoading, UpdateData } from "@/redux/slice/post/FetchCommentsSlice";
import { onCommentDelete } from "@/redux/reducer/post/CommentDelete";
import useHomeViewModel from "@/app/(features)/(home)/viewModel/HomeViewModel";
import { onFetchPostDetail } from "@/redux/reducer/post/PostDetailsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setPostDetailsLoading, upgradePostData } from "@/redux/slice/post/PostDetailSlice";
import DeleteCommentView from "@/components/DeleteCommentView";
import Track_Player from "@/components/AudioPlayer/TrackPlayer";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import { updatePostDetail } from "@/redux/slice/post/CreatePostSlice";
import DeletePostModal from "@/components/modal/DeletePostModal";
import ProfilePostComponent from "../component/ProfilePostComponent";
import ListEmptyPostComponent from "../component/ListEmptyPostComponent";
import ListFooterPostComponent from "../component/ListFooterPostComponent";
import CommentSectionComponent from "../component/CommentSectionComponent";
import CommentRenderItem from "../component/CommentRenderItem";
import TopPostComponent from "../component/TopPostComponent";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import { setHomePostSlice } from "@/redux/slice/home/HomePostSlice";
import { setMyUserFeedData } from "@/redux/slice/profile/ProfileMyFeedsSlice";
import { trendingUserPost } from "@/redux/slice/home/TrendingPostSlice";
import { setUserFeedData } from "@/redux/slice/profile/UserFeedsSlice";
import { onDeletePost } from "@/redux/reducer/post/DeletePost";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { shallowEqual, useSelector } from "react-redux";
import useKeyboardVisible from "@/app/hooks/useKeyboardVisible";
import { calculateHeight } from "@/utils/ImageHelper";

const PostDetailScreen = () => {
  const { userId } = useAppStore();
  const params = useLocalSearchParams();
  const [lastCount, setlastCount] = useState(0);
  const [hideReplies, setHideReplies] = useState({});
  const { setPostId, postId, setPostedByUserId } = usePostDetailStore();
  useScreenTracking("PostDetailScreen/"+params?.id);
  const { setReportUserDetails, reportUserDetails } = useReportStore();
  const postDetailsResponse: any = useAppSelector((state) => state.postDetailData);
  const postData: any = useMemo(() => postDetailsResponse?.newData?.id
    ? postDetailsResponse?.newData: {}, [postDetailsResponse?.newData]);
const userDetailsData = useSelector((state: any) => state.myProfileData, shallowEqual);
  const { id, Type }: any = useLocalSearchParams();
  const fetchCommentsResponse = useAppSelector(
    (state) => state.fetchCommentsData
  );

  const [modalVisible, setModalVisible] = React.useState(false);
  const [key, setKey] = React.useState(null);
  const { setID } = useIdStore();
  const dispatch = useAppDispatch();
  const {
    setExpandModal,
    inputRef: globalInputRef,
    setCommentId,
    CommentId,
    setReplyingTo,
    repliedId,
    setRepliedId,
    setReplyStatus,
  } = useCommentRef();
  const { UpdatedeletePost } = useHomeViewModel();
  const HomePostResponse = useAppSelector((state) => state.HomePostResponse);
  const trendingPostResponse = useAppSelector(
    (state) => state.TrendingPostResponse
  );
  const {
    onFetchCommentHandler,
    commentsLoading,
    commentData,
    setCommentsLoading,
    hasMoreData,
  } = usePostCommentsHook();
  const { onPressBlockHandler, blockLoading } = useBlockUserHook();
  const onPressCommentRef = useRef<BottomSheet>(null);
  const { updateUserData } = UserStoreDataModel();
  const BlockUserRef = useRef<BottomSheet>(null);
  const profileOptionRef = useRef<BottomSheet>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const videoRef = useVideoPlayerStore.getState().videoRef;
const isVideoPlaying = useVideoPlayerStore.getState().isPlay;
const [isBlock, setIsBlock] = useState(false);
const postDetailResponse = useAppSelector((state) => state.myFeedData);
const myPostListResponse = useAppSelector((state) => state.myFeedsListData);
const [commentIndex, setCommentIndex] = useState(-1);
const keyboardVisible = useKeyboardVisible();

  const deletePostHandler = () => {
    setModalVisible(false);
    setIsDeleteModal(false);
    updateDeletePostModal(params?.id);
  };

  const updateDeletePostModal = useCallback(async(postId: any) => {
   var deletePostData: any = await dispatch(
          //@ts-ignore
          onDeletePost({ post_id: postId, user_id: userId })
        );

  if(deletePostData?.payload?.success){
    showToast({ type: "success", text1: deletePostData?.payload?.message });
    
    if(router.canGoBack()){
      router.back();
    }
    else{
      router.replace("/DashboardScreen");
    }
      const updatedData = HomePostResponse?.UpdatedData.filter(
        (item: any) => item?.id != postId
      );
      const updateTrendingData = Array.isArray(trendingPostResponse?.data)
        ? trendingPostResponse?.data.filter((item: any) => item?.id != postId)
        : [];
      const updateUserPostData = Array.isArray(postDetailResponse.updatedData)
        ? postDetailResponse.updatedData.filter((item: any) => item?.id != postId)
        : [];

      const updateMyPostData = Array.isArray(myPostListResponse.updatedData)
        ? myPostListResponse.updatedData.filter((item: any) => item?.id != postId)
        : [];
      dispatch(setHomePostSlice(updatedData));
      dispatch(setMyUserFeedData(updateUserPostData));
      dispatch(setUserFeedData(updateMyPostData))
      if (trendingPostResponse?.data) {
        dispatch(trendingUserPost(updateTrendingData));
      }
    }
    else{
      showToast({ type: "error", text1: deletePostData?.payload?.message });
    }
    }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (lastCount > 0) {
        setCommentsLoading(true);
        await onFetchCommentHandler(id, lastCount); // Fetch comments with updated lastCount
        setCommentsLoading(false);
      }
    };
    fetchData();
  }, [lastCount, id]);

  useEffect(()=>{
    if(params?.id != postData?.id){
      getPostDetailsHandler({ postId: params?.id });
      
    }

    const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            if(keyboardVisible){
              Keyboard.dismiss();
            }
            if(commentIndex != -1){
              onPressCommentRef.current.close();
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
        };

  },[])

  useEffect(() => {
    const fetchRefData = async () => {
      try {
        dispatch(commentLoading(true));
        await onFetchCommentHandler(params?.id, 0);
        if (params?.id != postData?.id && params?.postData == undefined) {
          getPostDetailsHandler({ postId: params?.id });
        }
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchRefData();
    updateUserData();
    dispatch(updatePostDetail({}));
    return () => {
      setPrefsValue("notificationInfo", "");
      if (videoRef && isVideoPlaying) {
        videoRef.pauseAsync(); // pause when navigating away
      }
    };
  }, []);

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const referCode = url.split("post/");
      if (referCode[1]) {
        getPostDetailsHandler({ postId: referCode[1] });
      }
    };
    const subscription = Linking.addEventListener("url", handleDeepLink);
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

  const getPostDetailsHandler = useCallback(async({ postId }) => {
    dispatch(setPostDetailsLoading(true));
    if (userId == null) {
      var userData = await AsyncStorage.getItem("user-data");
      var userValue = JSON.parse(userData);
      fetchPostDetailsHandler({ postId: postId, user_Id: userValue.userId });
    } else {
      fetchPostDetailsHandler({ postId: postId, user_Id: userId });
    }
  },[params?.id]);

  const fetchPostDetailsHandler = async ({ postId, user_Id }) => {
    var postDetailsValue = await dispatch(onFetchPostDetail({ postId: postId, userId: user_Id }));
    if(postDetailsValue?.payload?.success){
      var postNewData = postDetailsValue?.payload?.data.file_type == "image" ? {...postDetailsValue?.payload?.data, display_height: (await Promise.all(calculateHeight(postDetailsValue?.payload?.data)))} : postDetailsValue?.payload?.data
dispatch(upgradePostData(postNewData));
      
    }
    else{
      showToast({ type: "error", text1: postDetailsValue?.payload?.message });
    }
  };
  const toggleHideReplies = (commentId) => {
    setHideReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId], // Toggle the visibility for the specific comment ID
    }));
  };
  const onPressConfirmHandler = (key) => {
    setModalVisible(true);
    setKey(key);
  };
  const handleReplyDeleteComment = ({ ReplyId, CommentId }) => {
    if (!fetchCommentsResponse?.data) return;
    const updatedComments = fetchCommentsResponse?.data.map((item) => {
      if (item.id === CommentId) {
        return {
          ...item,
          replies: item.replies.filter((reply) => reply.id !== ReplyId),
        };
      }
      return item;
    });
    dispatch(UpdateData(updatedComments));
    dispatch(
      onCommentDelete({
        userId: userId,
        commentId: ReplyId,
        postId: postId,
      })
    );
  };

  const updateLastCount = () => {
    if (!commentsLoading && hasMoreData) {
      setlastCount((prev) => prev + 5);
    }
  };

  const UpdateDeleteCount = () => {
    if (Type == "home") {
      UpdatedeletePost(postId, HomePostResponse?.UpdatedData);
    } else if (Type === "trending") {
      UpdatedeletePost(postId, trendingPostResponse?.data);
    } else if (Type === "Profile") {
      UpdatedeletePost(postId, myPostListResponse.updatedData);
    }
  };

  const handleDeleteComment = ({ commentId }) => {
    if (!fetchCommentsResponse?.data) return;
    const newData = fetchCommentsResponse?.data.filter(
      (item: { id: any }) => item.id !== commentId
    );
    dispatch(UpdateData(newData));
    dispatch(
      onCommentDelete({
        userId: userId,
        commentId: commentId,
        postId: postId,
      })
    );
  };

 

  const PostMediaComponent = useCallback(
    ({ islocal }) => {
      if (!postData) return null; // If postData is missing, return null or a loading state.
      const { file_type, post_video, post_image, post_audio, video_snap_path } = postData;
      const imageArray = postData?.post_image
        ? postData?.post_image.split(",")
        : [];
      return (
        <View style={{flex: 1}}>
          {file_type === "video" || file_type === "image" ? (
            <MediaPost
              source={file_type === "video" ?{thumbnail: video_snap_path || '', url: post_video} : imageArray}
              type={file_type}
              isHome={true}
              display_height={postData?.display_height || []}
            />
          ) : file_type === "audio" ? (
            <Track_Player
              Type={post_audio}
              id={postData?.id}
              isPlaying={false}
              setCurrentPlaying={()=>{}}
            />
          ) : (
            <Text>No media available</Text> // Show a fallback message for unsupported media types.
          )}
        </View>
      );
    },
    [postData?.post_image]
  );
  const PostBottomComponent = useCallback(
    ({ postId, likeCount, isLiked, category, categoryId, catclick, commentsData }) => {
      const renderComment = ({ item: comment }) => {
        const hasReplies = comment.replies && comment.replies.length > 0;
        const canDelete = userId === comment?.user?.id;
        return (
          <CommentRenderItem
            comment={comment}
            onPressConfirmHandler={onPressConfirmHandler}
            setRepliedId={setRepliedId}
            hideReplies={hideReplies}
            toggleHideReplies={toggleHideReplies}
            hasReplies={hasReplies}
            CommentId={comment.id}
            userId={userId}
            replyPressHandler={() => {
              setCommentId(comment.id);
              onPressCommentRef.current.expand();
              setExpandModal(true);
              setReplyStatus(true);
              setReplyingTo(comment?.user);
              if (Type == "Discover") {
                setID("2");
              } else if (Type == "home") {
                setID("3");
              } else if (Type == "trending") {
                setID("4");
              } else if (Type == "Profile") {
                setID("1");
              }
              onPressCommentHandler(postId);
            }}
            deletePressHandler={() => {
              setCommentId(comment.id);
              onPressConfirmHandler(1);
            }}
            canDelete={canDelete}
          />
        );
      };
      return (
        <CommentSectionComponent
          isLiked={isLiked}
          likeCount={likeCount}
          postId={postId}
          Type={Type || ""}
          setID={setID}
          onPressCommentHandler={onPressCommentHandler}
          onShare={onShare}
          postData={postData}
          fetchCommentsResponse={commentsData}
          updateLastCount={updateLastCount}
          renderComment={renderComment}
          categoryName={category}
          categoryId={categoryId}
          catclick={catclick}
        />
      );
    },
    [
      postData?.likeByMe,
      postData?.comment_count,
      fetchCommentsResponse,
    ]
  );

  const onShare = async ({ id }) => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/post/${id}`,
        title: "Share Post",
      });
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const onPressGroupHandler = ({ groupId }) => {
    router.push({
      pathname: "/groups",
      params: { groupId: groupId },
    });
  };

   const onPressCategoryHandler = ({ categoryId }) => {
      router.push({
        pathname: "/CategoriesPost",
        params: { categoryId: categoryId },
      });
   };
 

  const onPressCommentHandler = (postId) => {
    onFetchCommentHandler(postId, lastCount);
    setPostId(postId);
    onPressCommentRef.current.expand();
    setPostedByUserId(userId);
  };

  const onPressReportOption = ({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId: reportId,
      name: name,
      profilePic: ProfilePic,
      reportType: "post",
      userId: postData?.post_by?.id,
    });
    profileOptionRef.current.close();
    router.push("/ReportProfileScreen");
  };
  const onPressBlockOption = () => {
    profileOptionRef.current.close();
    if(isBlock){
      onPressBlockHandler({ profileId: reportUserDetails?.userId, isBlock: 0 });
      setIsBlock(false);
    }
    else {
      BlockUserRef.current.expand();
    }
    
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    BlockUserRef.current.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
    setIsBlock(true);
  };

  const onPressPostOption = ({ userData }) => {
    setReportUserDetails({
      name: userData?.name,
      userId: userData?.id,
      profilePic: userData?.profilePic,
      reportId: userData?.postId,
    });

    profileOptionRef?.current?.expand();
  };

  const handlePressProfile = (id) => {
        if (id === userId) {
          router.push({ 
            pathname: "/ProfileScreen", 
            params: { profileId: id } 
          });
        } else {
            router.push({
              pathname: "/profile/[id]",
              params: {
                id: id,
                isProfile: "true",
                isNotification: "false",
              },
            })

        }
      };

      const backPress = () => {
        if (params.isNotification == undefined || params?.isNotification == "true") {
          updateUserData();
          router?.replace("/DashboardScreen");
        } else if(router.canGoBack()) {
          router.back();
        }
        else {
          router?.replace("/DashboardScreen");
        }
      };
const userImage = userDetailsData?.data?.id == postData?.post_by?.id ?  userDetailsData.data?.profile_pic : postData?.post_by?.profile_pic;
const userName = userDetailsData?.data?.id == postData?.post_by?.id ? userDetailsData.data?.full_name : postData?.post_by?.full_name;
  const renderPostItem = useCallback(({ index, islocal }) => {
    if (index == 0) {
      return (
        <View >
          <TopPostComponent
          profilePic={userImage}
          name={userName}
          postTime={postData?.time}
          ProfileId={postData?.post_by?.id}
          categoryType={postData?.loop_group?.category?.category_name || postData?.loop_id_conn?.category?.category_name}
          onPressGroup={onPressGroupHandler}
          groupId={postData?.loop_group?.id || postData?.loop_id_conn?.id}
          onPressPostOption={(data) => onPressPostOption({ userData: data })}
          description={postData?.post_content}
          groupName={postData?.loop_group?.loop_name || postData?.loop_id_conn?.loop_name}
          postId={postData?.id}
          handlePressProfile={()=>handlePressProfile(postData?.post_by?.id)}
          backPress={()=>backPress()}
        />
          <PostMediaComponent islocal={islocal} />
        </View>
      );
    } else {
      return (
        <PostBottomComponent
          postId={postData?.id}
          likeCount={
            (postData?.like_count || 0)
          }
          isLiked={
            (postData?.likeByMe || [])
              ?.length > 0
              ? 1
              : 0
          }
          category={
            postData?.loop_group?.category?.category_name ||
            postData?.loop_id_conn?.category?.category_name
          }
          categoryId={postData?.loop_group?.category?.id}
          catclick={onPressCategoryHandler}
          commentsData={fetchCommentsResponse}
        />
      );
    }
  }, [postData, fetchCommentsResponse]);

  const onPressDeleteOption = () => {
    profileOptionRef.current.close();
    setModalVisible(true);
    setIsDeleteModal(true);
  };

  const onChangeSheetIndex = (index) => {
    setCommentIndex(index);
  };

  const onPressEditOption = () => {
    profileOptionRef.current.close();
    router.replace("/CreatePostScreen");
  };

  return (
    <ViewWrapper>
      {/* <GoBackNavigation
        isDeepLink={params.isNotification}
        isHome={params.isNotification == "true"}
        containerStyle={{
          width: "100%",
          paddingHorizontal:5,
        }}
      /> */}
      <View style={{ flex: 1, width: "98%", alignSelf: "center", paddingTop: 30, marginHorizontal: "1%" }}>
        {(params?.id != postData?.id && postDetailsResponse.isLoaded) ||
        postDetailsResponse.isLoaded ? (
          <PostLoaderComponent />
        ) : params?.id == postData?.id ? (
         <FlatList
            bounces={false}
            data={postData?.id ? [{ id: "1" }, { id: "2" }] : []}
            //@ts-ignore
            renderItem={renderPostItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={ListFooterPostComponent}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={ListEmptyPostComponent}
          />
        ) : (
          <ProfilePostComponent data={postData} backPress={()=>backPress()} />
        )}
      </View>

      <CommentsBottomSheet
        onOpenSheet={onPressCommentRef}
        commentData={commentData}
        onPress={(id) => {
          onPressCommentRef.current.close();
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
        onDeletePostOption={onPressDeleteOption}
        userId={userId}
        isBlock={isBlock}
        postedByUserId={postData?.postBy?.id || postData?.post_by?.id}
        postGroupData={postData?.loop_group || postData?.loop_id_conn}
        onPressEditOption={onPressEditOption}
      />

      <BlockUserBottomSheet
        BlockUserRef={BlockUserRef}
        onPressBlockButton={() =>
          onSubmitBlockHandler({
            profileId: reportUserDetails?.userId,
            isBlock: 1,
          })
        }
        loading={blockLoading}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {isDeleteModal ? (
          <DeletePostModal
            setDeletePostModal={() => {
              setModalVisible(false);
              setIsDeleteModal(false);
            }}
            deletePostHandler={deletePostHandler}
          />
        ) : (
          <DeleteCommentView
            disablePress={() => setModalVisible(false)}
            onPress={() => {
              setModalVisible(false);
              UpdateDeleteCount();
              if (key === 1) {
                handleDeleteComment({
                  commentId: CommentId,
                });
              } else if (key === 2) {
                handleReplyDeleteComment({
                  ReplyId: repliedId,
                  CommentId: CommentId,
                });
              }
            }}
          />
        )}
      </Modal>
    </ViewWrapper>
  );
};

export default memo(PostDetailScreen);
