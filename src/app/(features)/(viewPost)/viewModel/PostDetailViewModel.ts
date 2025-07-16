import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { PostDetailModel } from "../model/PostDetailModel";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";

import BottomSheet from "@gorhom/bottom-sheet";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { onFetchPostDetail } from "@/redux/reducer/post/PostDetailsApi";
import { useAppStore } from "@/zustand/zustandStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateCount } from "@/redux/slice/post/PostDetailSlice";

const usePostDetailViewModel = () => {
  const dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const postDetailsResponse = useAppSelector((state) => state.postDetailData);
  const [postData, setPostData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [postDetailApiCalled, setPostDetailApiCalled] = useState(true);

  const onPressCommentRef = useRef<BottomSheet>(null);
  const [commentData, setCommentData] = useState([]);

  const onPostDetailsHandler = async ({ postId }) => {
    // GetUserTokenStorage().then(token => {
    if (userId == null) {
      var userData = await AsyncStorage.getItem("user-data");
      var userValue = JSON.parse(userData);
      console.log("userValue", { postId: postId, userId: userValue.userId });
      dispatch(onFetchPostDetail({ postId: postId, userId: userValue.userId }));
      setIsLoading(true);
      setPostDetailApiCalled(true);
    } else {
      dispatch(onFetchPostDetail({ postId: postId, userId: userId }));
      setIsLoading(true);
      setPostDetailApiCalled(true);
    }

    // });
  };

  useEffect(() => {
    if (postDetailApiCalled && postDetailsResponse?.success) {
      setIsLoading(false);
      setPostDetailApiCalled(false);
      
      const post = postDetailsResponse?.data;
      if (post) {
        setPostData(post);
        dispatch(updateCount([post]));
      }
    } else if (postDetailApiCalled && !postDetailsResponse?.success) {
      setIsLoading(false);
      setPostDetailApiCalled(false);
      // Handle error state or fallback behavior here
    }
  }, [postDetailsResponse]);
  


  return { onPostDetailsHandler, postData, isLoading, onPressCommentRef,setPostData };
};

export default usePostDetailViewModel;
