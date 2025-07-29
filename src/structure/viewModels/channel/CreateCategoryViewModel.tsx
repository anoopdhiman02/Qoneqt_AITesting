import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";
import { useAppStore } from "@/zustand/zustandStore";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { router } from "expo-router";
import { onCreateGroupCategory } from "@/redux/reducer/channel/CreateGroupCategory";
import { useChannelStore } from "@/zustand/channelStore";
import useCreateChannelViewModel from "./CreateChannelViewModel";

const useCreateCategoryViewModel = () => {
  const { userId } = useAppStore();

  const { addNewCatRef } = useCreateChannelViewModel();
  const { setRefreshCategory } = useChannelStore();

  const Dispatch = useAppDispatch();
  const createGroupCategoryResponse = useAppSelector(
    (state) => state?.createGroupCategory
  );
  const [submitCategoryApiCalled, setSubmitCategoryApiCalled] = useState(false);
  const [categorySubmitLoading, setCategorySubmitLoading] = useState(false);

  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (submitCategoryApiCalled && createGroupCategoryResponse?.success) {
      setSubmitCategoryApiCalled(false);
      setCategorySubmitLoading(false);
      showToast({
        type: "success",
        text1: createGroupCategoryResponse?.message,
      });

      setCategoryName("");

      setRefreshCategory(true);
      // router.back();
    } else if (
      submitCategoryApiCalled &&
      !createGroupCategoryResponse?.success
    ) {
      setSubmitCategoryApiCalled(false);
      setCategorySubmitLoading(false);
      setCategoryName("");
      showToast({
        type: "error",
        text1: createGroupCategoryResponse?.message,
      });
    }
  }, [createGroupCategoryResponse]);

  const onCreateCategoryHandler = ({ groupId }) => {
    Dispatch(
      onCreateGroupCategory({
        user_id: userId,
        group_id: groupId,
        categoryName: categoryName,
      })
    );
    setSubmitCategoryApiCalled(true);
    setCategorySubmitLoading(true);
  };

  const onEnterCategoryHandler = (text) => {
    setCategoryName(text);
  };

  return {
    onCreateCategoryHandler,
    categorySubmitLoading,
    onEnterCategoryHandler,
    categoryName,
  };
};

export default useCreateCategoryViewModel;
