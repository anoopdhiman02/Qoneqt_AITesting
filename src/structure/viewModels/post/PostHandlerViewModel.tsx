import { Alert, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { onPostLike } from "@/redux/reducer/post/PostLikeApi";
import { useAppStore } from "@/zustand/zustandStore";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { logEvent } from "@/customHooks/useAnalytics";


const usePostHandlerViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();

  //Gift
  const [giftAmount, setGiftAmount] = useState(0);

  //delete post
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  //likes
  const onLikePostHandler = async ({
    postId,
    liked,
  }: {
    postId: string;
    liked: number;
  }) => {
    logEvent("post_like", {
      post_id: postId,
      liked: liked,
    })
    var likeData = await Dispatch(onPostLike({ postId: postId, liked: liked, userId: userId,reaction:1 }));
    if (!likeData.payload?.success) {
      if(likeData.payload?.message != "Already liked"){
        showToast({type:"error",text1:likeData.payload?.message});
      }
    }
  };

  const onPressGift = () => {
    // if (isFullKycCompleted) {
    //   sendGiftSheetRef.current?.show();
    // } else {
    //   navigation?.navigate('ProfileVerificationScreen');
    // }
  };

  const onCloseGiftSheet = () => {
    // sendGiftSheetRef.current?.hide();
  };

  const onEnterAmount = (value) => {
    setGiftAmount(value);
  };


  //delete post
  const onPressDelete = (data) => {
    if (Platform.OS === "ios") {
      Alert.alert("Post Delete", "Post will detele permanently", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Confirm Delete",
          onPress: () => onConfirmDeleteHandler(data?.id),
        },
      ]);
    } else {
      setShowDeleteModal(true);
    }
  };



  const onConfirmDeleteHandler = (data: any) => {
    // GetUserTokenStorage().then(token => {
    //   Dispatch(onDeletePost({token: token, postId: data}));
    //   setDeletePostCalled(true);
    // });
  };

  const onPressCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return {
    onLikePostHandler,
    // sendGiftSheetRef,
    onPressGift,
    onCloseGiftSheet,
    giftAmount,
    onEnterAmount,
    //delete post
    showDeleteModal,
    onPressDelete,
    onPressCancelDelete,
  };
};

export default usePostHandlerViewModel;
