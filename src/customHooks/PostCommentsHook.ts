import { View, Text, Keyboard } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { onFetchComments } from "@/redux/reducer/post/FetchComments";
import { useAppStore } from "@/zustand/zustandStore";
import { onAddComment } from "@/redux/reducer/post/AddComment";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCommentStore, useIdStore } from "./CommentUpdateStore";
import useHomeViewModel from "@/app/(features)/(home)/viewModel/HomeViewModel";
import { trendingUserPost } from "@/redux/slice/home/TrendingPostSlice";
import { UpdateData } from "@/redux/slice/post/FetchCommentsSlice";

const usePostCommentsHook = () => {
  const dispatch = useAppDispatch();
  const { userId, setRefreshHome, userInfo } = useAppStore();
  const { postId } = usePostDetailStore();
  const { id, setID } = useIdStore();
  const postDetailsResponse = useAppSelector((state) => state.postDetailData);

  const fetchCommentsResponse = useAppSelector(
    (state) => state.fetchCommentsData
  );
  const { updatePostData, updateOtherPostData } = useHomeViewModel();
  const myPostListResponse = useAppSelector((state) => state.myFeedsListData);
  const HomePostResponse = useAppSelector((state) => state.HomePostResponse);
  const discoverPostResponse = useAppSelector(
    (state) => state.DiscoverPostResponse
  );
  const TrendingPostResponse = useAppSelector(
    (state) => state.TrendingPostResponse
  );

  const addCommentData = useAppSelector((state) => state.addCommentData);
  const [commentApiCalled, setCommentApiCalled] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const { commentData, setCommentData } = useCommentStore(); // ⬅️ Use Zustand Store
  // const [commentData, setCommentData] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const [enterComment, setEnterComment] = useState("");
  const profileDetailResponse: any = useAppSelector((state) => state.myProfileData);


  const fetchCommentData = useCallback(
    async ({ userID, postId, lastCount }) => {
      var commentsData = await dispatch(
        onFetchComments({
          userId: userID,
          postId: postId,
          lastCount: lastCount,
        })
      );
      if (commentsData?.payload?.success) {
        setCommentData((prevData) => [
          ...prevData,
          ...commentsData?.payload?.data?.filter(
            (newComment) =>
              !prevData.some(
                (existingComment) => existingComment?.id === newComment?.id
              )
          ),
        ]);
      }
      // setCommentsLoading(true);
    },
    [dispatch]
  );

  const onFetchCommentHandler = async (postId, lastCount) => {
    let userID = userId;
    if (!userID) {
      const userData = await AsyncStorage.getItem("user-data");
      userID = JSON.parse(userData)?.userId;
    }
    fetchCommentData({ postId, userID, lastCount });
  };

  useEffect(() => {
    if (fetchCommentsResponse?.success) {
      setCommentsLoading(false);
      const newComments = fetchCommentsResponse?.data || [];
      setCommentData((prevData) => [
        ...prevData,
        ...newComments.filter(
          (newComment) =>
            !prevData.some(
              (existingComment) => existingComment?.id === newComment?.id
            )
        ),
      ]);
      if (newComments.length < 5) setHasMoreData(false);
    } else {
      setCommentsLoading(false);
      setHasMoreData(false);
    }
  }, [fetchCommentsResponse]);

  const onEnterCommenthandler = (text) => {
    setEnterComment(text);
  };

  // // // Handle adding comment
  // useEffect(() => {
  //   if (addCommentApi && addCommentData?.success) {
  //     setAddCommentApi(false);
  //     setAddLoading(false);

  //     setRefreshHome(true);
  //     // Fetch updated comments after adding a new comment
  //     onFetchCommentHandler(postId, 0);
  //     setEnterComment(""); // Clear input field
  //   } else if (addCommentApi && !addCommentData?.data?.success) {
  //     setAddCommentApi(false);
  //     setAddLoading(false);
  //   }
  // }, [addCommentData]);

  const onAddCommentHandler = async ({
    postId,
    parentId,
    userId,
  }) => {
    const profileDetails: any = profileDetailResponse?.data || {};
    Keyboard.dismiss();
    // Create a new comment object (optimistic UI update)
    const newComment = {
      id: Date.now(), // Temporary unique ID
      userId,
      comment: enterComment,
      createdAt: new Date(),
      user: {
        "id": profileDetails?.id,
        "full_name": profileDetails?.full_name,
        "profile_pic": profileDetails?.profile_pic,
        "username": profileDetails?.username,
        "social_name": profileDetails?.social_name,
        "kyc_status": profileDetails?.kyc_status
      } ,
      replies: [],
    };

    

    // Dispatch action to backend
    var commentsValue = await dispatch(
      onAddComment({
        userId,
        postId,
        parent: parentId,
        comment: enterComment,
        file: {},
        attachmentType: "text",
      })
    );
    if(commentsValue?.payload?.success){
      updateCommentValues({newComment,commentsValue : commentsValue?.payload?.data, parentId})
    }
    setEnterComment("");

    // Determine the data source based on `id`
    const postDataMap = {
      "1": myPostListResponse?.updatedData,
      "2": discoverPostResponse?.data,
      "3": HomePostResponse?.UpdatedData,
      "4": TrendingPostResponse?.data,
      "5": postDetailsResponse?.data,
    };

    const Data = postDataMap[id] || null;
    // Update post data based on `id`
    if (id === "1" || id === "5") {
      updatePostData(postId, Data);
    }

    if (id !== "1") {
      updateOtherPostData(postId);
    }
    setEnterComment(""); // Clear the input field
  };

  const updateCommentValues = ({newComment,commentsValue, parentId}) => {
    if(parentId == 0){
      dispatch(UpdateData([commentsValue, ...fetchCommentsResponse?.data]));
      setCommentData((prevData) => [commentsValue, ...prevData]);
    }
    else {
      var isCommentValue = fetchCommentsResponse?.data?.filter((item: any) => item?.id == parentId);
      var commentDatas = isCommentValue?.length > 0 ? fetchCommentsResponse?.data?.map((item: any) => {
        if(item?.id == parentId){
          return {...item, replies: item?.replies?.length > 0 ? [...item?.replies, {...commentsValue, replyback: commentsValue?.replyback || [] }] : [{...commentsValue, replyback: commentsValue?.replyback || [] }]}
        }
        return item;
      }): fetchCommentsResponse?.data.map((ite: any) => {
        var replyValue = ite?.replies?.map((reply: any) => {
          if(reply?.id == parentId){
            return {...reply, replyback: reply?.replyback?.length > 0 ? [...reply?.replyback, commentsValue] : [commentsValue]}
          }
          return reply;
        });
        return {...ite, replies: replyValue};
      });
      dispatch(UpdateData(commentDatas));
      setCommentData((prevData) => [commentsValue, ...prevData]);
    }
    
  }

  return {
    onFetchCommentHandler,
    commentsLoading,
    setCommentsLoading,
    hasMoreData,
    commentData,
    onEnterCommenthandler,
    onAddCommentHandler,
    enterComment,
    postId,
  };
};

export default usePostCommentsHook;
