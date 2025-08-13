import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { useChannelStore } from "@/zustand/channelStore";
import { onFetchChannelInfo } from "@/redux/reducer/channel/ChannelInfo";
import { useAppStore } from "@/zustand/zustandStore";
import { showToast } from "@/components/atom/ToastMessageComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useChannelInfoViewModel = () => {
  const dispatch = useAppDispatch();
  const { userId } = useAppStore();

  const {
    setGroupId,
    setGroupDetails,
    setUserGroupRole,
    setChannelId,
    setChannelDetails,
    setUserChannelRole,
    userChannelRole,
    groupId,
    groupDetails,
    userGroupRole,
    channelId,
    channelDetails,
  } = useChannelStore();

  const channelInfoResponse = useAppSelector(
    (state) => state.channelInfoResponse
  );

  //Group info api
  const [apiCalled, setApiCalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [channelData, setChannelData] = useState({});

  ///Group detail api handling
  useEffect(() => {
    if (apiCalled && channelInfoResponse?.success) {
      setChannelData(channelInfoResponse?.data);

      //  setGroupId(channelInfoResponse?.data?.id);
      //  setGroupDetails({
      //   id: channelInfoResponse?.data?.id,
      //   //   loop_cat: channelInfoResponse?.data?.loop_cat,
      //   //   loop_name: channelInfoResponse?.data?.loop_name,
      //   //   unique_id: channelInfoResponse?.data?.unique_id,
      //   //   loop_logo: channelInfoResponse?.data?.loop_logo,
      //   //   slug: channelInfoResponse?.data?.slug,
      //   //   user_id: channelInfoResponse?.data?.user_id,
      //   //   role:
      //   //     channelInfoResponse?.data?.my_role[0]?.length > 0
      //   //       ? channelInfoResponse?.data?.my_role[0]?.role
      //   //       : 3,
      // });
      // setUserGroupRole(
      //   channelInfoResponse?.data?.groupRole[0]?.length > 0
      //     ? channelInfoResponse?.data?.groupRole[0]?.role
      //     : 3
      // );
      // setUserChannelRole(
      //   channelInfoResponse?.data?.groupRole[0]?.length > 0
      //     ? channelInfoResponse?.data?.groupRole[0]?.role
      //     : 3
      // );

      setApiCalled(false);
      setLoading(false);
    } else if (apiCalled && !channelInfoResponse?.success) {
      showToast({
        type: "error",
        text1: channelInfoResponse?.message || "something went wrong",
      });
      setApiCalled(false);
      setLoading(false);
    }
  }, [channelInfoResponse]);

  const onFetchChannelInfoHandler = async ({ channelId }) => {
    if (userId == null) {
      var userData = await AsyncStorage.getItem("user-data");
      var userValue = JSON.parse(userData);
      dispatch(
        onFetchChannelInfo({ userId: userValue.userId, channelId: channelId })
      );
      setApiCalled(true);
      setLoading(true);
    } else {
      dispatch(onFetchChannelInfo({ userId: userId, channelId: channelId }));
      setApiCalled(true);
      setLoading(true);
    }
  };
  return { onFetchChannelInfoHandler, loading, channelData };
};

export default useChannelInfoViewModel;
