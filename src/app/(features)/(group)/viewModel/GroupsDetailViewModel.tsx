import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../utils/Hooks";
import { useIsFocused } from "@react-navigation/native";
import { onFetchGroupFeeds } from "../../../../redux/reducer/group/GroupFeedsListApi";
import { groupDetailsApi } from "../../../../redux/reducer/group/GroupDetails";
import { onJoinGroup } from "../../../../redux/reducer/group/JoinGroup";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useAppStore } from "@/zustand/zustandStore";
import { useChannelStore } from "@/zustand/channelStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSubgroupList } from "@/redux/reducer/channel/ChannelListForPost";

const useGroupsDetailViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const { groupId, setUserGroupRole } = useChannelStore();
  const groupDetailsData: any = useAppSelector((state) => state.groupDetailsData);
  const subgroupDetailsData = useAppSelector((state) => state.getSubGroupListData);
  const isFocused = useIsFocused();

  const joinGroupData = useAppSelector((state) => state.joinGroupData);
  const [isJoin, setIsJoin] = useState(true);

 //Group
  const [groupApiCalled, setGroupApiCalled] = useState(false);
  const [subgroupApiCalled, setSubgroupApiCalled] = useState(false);
  const [groupDetails, setGroupDetails] = useState({});
  const [subgroupDetails, setSubgroupDetails] = useState({});
  const [groupDetailLoading, setGroupDetailLoading] = useState(true);

//Feed APi
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedListData, setFeedListData] = useState([]);
  //Add group
  const [joinApiCalled, setJoinApiCalled] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const onGetGroupDetailsHandler = async (id) => {
    if (userId == null) {
      var userData = await AsyncStorage.getItem("user-data");
      var userValue = JSON.parse(userData);
      Dispatch(groupDetailsApi({ groupId: id, userId: userValue.userId }));
      setGroupApiCalled(true);
      setGroupDetailLoading(true);
    } else {
      Dispatch(groupDetailsApi({ groupId: id, userId: userId }));
      setGroupApiCalled(true);
      setGroupDetailLoading(true);
    }
  };

  useEffect(() => {
    if (groupApiCalled && groupDetailsData?.success) {
      setGroupDetails(groupDetailsData?.data);

      if (groupDetailsData?.data?.what_am_i?.length > 0) {
        setIsJoin(true);
      } else {
        setIsJoin(false);
      }
      if (groupDetailsData?.data?.what_am_i?.id) {
        setUserGroupRole(groupDetailsData?.data?.what_am_i?.role);
      } else {
        setUserGroupRole(3);
      }
      setSubgroupApiCalled(true);
      onFetchSubGroupsHandler({ groupId: groupDetailsData?.data?.id, key: "" });
      setGroupApiCalled(false);
      setGroupDetailLoading(false);
    } else if (groupApiCalled && !groupDetailsData?.success) {
      setGroupApiCalled(false);
      setGroupDetailLoading(false);
      showToast({
        type: "error",
        text1: groupDetailsData?.message || "something went wrong",
      });
    }
  }, [groupDetailsData]);

  
  useEffect(() => {
    if (subgroupApiCalled && subgroupDetailsData?.success) {
      setSubgroupDetails(subgroupDetailsData?.data);
      setSubgroupApiCalled(false);
    } else if (subgroupApiCalled && !subgroupDetailsData?.success) {
      setSubgroupApiCalled(false);
      setSubgroupDetails([]);
    }else{
      setSubgroupApiCalled(false);
      setSubgroupDetails([]);
    }
  }, [subgroupDetailsData]);

    const onFetchSubGroupsHandler = async ({ groupId, key }) => {
      if (!userId || !groupId) return;
      let id = userId;

      if (id == null) {
        const userData = await AsyncStorage.getItem("user-data");
        id = JSON.parse(userData)?.userId;
      }

      if (id) {
        Dispatch(
          getSubgroupList({ userId: id, groupId: groupId, key: "" })
        );
      // Dispatch(getSubgroupList({ userId: userId, groupId: groupId, key: "" }));
    };
  }


  const onFetchGroupPostHandler = async ({ groupId, lastCount }) => {
    let id = userId;

    if (id == null) {
      const userData = await AsyncStorage.getItem("user-data");
      id = JSON.parse(userData)?.userId;
    }
  
    if (id) {
      Dispatch(
        onFetchGroupFeeds({
          userId: id,
          groupId,
          lastCount,
          isLightMode: false,
        })
      );
      // setFeedLoading(true);
    }
  };

  const joinGroupHandler = async ({ groupId, isJoin }) => {
     setJoinLoading(true);
     setShowExitModal(false);
     var joinGroupData = await Dispatch(
       onJoinGroup({
         user_id: userId,
         groupId: groupId,
         join: 1,
       })
     );

     if (joinGroupData?.payload.success) {
       showToast({ type: "success", text1: joinGroupData?.payload.message });
       onGetGroupDetailsHandler(groupId);
       setJoinLoading(false);
     } else {
       setJoinLoading(false);
       showToast({
         type: "error",
         text1: joinGroupData?.payload.message || "something went wrong",
       });
     }
  };



  const onExitOptionHandler = async ({ groupId, isJoin }) => {
    setJoinLoading(true);
    setShowExitModal(false);
   var joinGroupData = await Dispatch(
      onJoinGroup({
        user_id: userId,
        groupId: groupId,
        join: isJoin,
      })
    );

    if (joinGroupData?.payload.success) {
      showToast({ type: "success", text1: joinGroupData?.payload.message });
      onGetGroupDetailsHandler(groupId);
      setJoinLoading(false);
    } else {
      setJoinLoading(false);
      showToast({
        type: "error",
        text1: joinGroupData?.payload.message || "something went wrong",
      });
    }
  };

  const onPressExitGroup = () => {
    setShowExitModal(true);
  };
  const onCancelExitGroup = () => {
    setShowExitModal(false);
  };

  return {
    onGetGroupDetailsHandler,
    subgroupDetails,
    groupDetails,
    groupDetailLoading,
    subgroupApiCalled,
    onFetchGroupPostHandler,
    onFetchSubGroupsHandler,
    feedListData,
    feedLoading,
    joinGroupHandler,
    joinLoading,
    isJoin,
    onPressExitGroup,
    showExitModal,
    onExitOptionHandler,
    onCancelExitGroup,
  };
};

export default useGroupsDetailViewModel;
