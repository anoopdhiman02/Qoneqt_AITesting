import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { fetchMyGroups } from "@/redux/reducer/group/FetchmyGroups";
import { fetchFollowingGroups } from "@/redux/reducer/group/FetchFollowingGroups";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useIsFocused } from "@react-navigation/native";

const useGroupListViewModel = () => {
  const [tab, setTab] = useState(0);

  const onPressTabHandler = (val) => {
    setTab(val);
  };
  const isFocused = useIsFocused();

  const Dispatch = useAppDispatch();
  //   const groupOptionSheetRef = useRef<ActionSheetRef>(null);
  const myGroupsResponse = useAppSelector((state) => state.myGroupsListData);
  const followingGroupsResponse = useAppSelector(
    (state) => state.followingGroupsResponse
  );

  const [groupAPiCalled, setGroupAPiCalled] = useState(false);
  const [followingApiCalled, setFollowingApiCalled] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [myGroupList, setMyGroupList] = useState([]);
  const [followingGroupLoading, setFollowingGroupLoading] = useState(false);
  const [followingGroupList, setFollowingGroupList] = useState([]);
  const [filterType, setFilterType] = useState("1");
  const [page, setPage] = useState(0);
  const [moreLoading, setMoreLoading] = useState(false);
  const [lastCount, setLastCount] = useState(0);

  const onFetchMyGroups = ({ userId, loadMore }) => {
    Dispatch(
      fetchMyGroups({
        userId: userId,
        lastCount: loadMore,
      })
    );
    // setPage((prevPage) => prevPage + 1);
    setGroupAPiCalled(true);
    setGroupLoading(true);
  };

  useEffect(() => {
    if (groupAPiCalled && myGroupsResponse?.success) {
      
      setMyGroupList((prev) => [
        ...prev,
        ...myGroupsResponse?.data?.filter(
          (newGroup) => !prev.some((group) => group.id === newGroup.id) // Assuming each group has a unique 'id'
        ),
      ]);
      setGroupAPiCalled(false);
      setGroupLoading(false);
    } else if (groupAPiCalled && !myGroupsResponse?.success) {
      setGroupAPiCalled(false);
      setGroupLoading(false);
    }

    // if (groupAPiCalled && myGroupsResponse?.data?.success) {
    //   let newData = myGroupsResponse?.data?.news;
    //   if (newData.length > 0) {
    //     setMyGroupList((prev) => [...prev, ...newData]);
    //   }

    //   setGroupAPiCalled(false);
    //   setGroupLoading(false);
    //   setMoreLoading(false);
    // } else if (groupAPiCalled && !myGroupsResponse?.data?.success) {
    //   setGroupAPiCalled(false);
    //   setGroupLoading(false);
    //   setMoreLoading(false);

    // }
  }, [myGroupsResponse, isFocused]);





  
  const onFetchFollowingGroups = ({ userId, loadMore }) => {
    Dispatch(
      fetchFollowingGroups({
        userId: userId,
        lastCount: loadMore,
      })
    );
    setFollowingApiCalled(true);
    setFollowingGroupLoading(true);
  };

  useEffect(() => {
    if (followingApiCalled && followingGroupsResponse.success) {
      setFollowingGroupList((prev) => [
        ...prev,
        ...followingGroupsResponse?.data.filter(
          (newGroup) => !prev.some((group) => group.id === newGroup.id) 
        ),
      ]);
      setFollowingApiCalled(true);
      setFollowingGroupLoading(true);
    } else if (followingApiCalled && !followingGroupsResponse.success) {
      setFollowingApiCalled(true);
      setFollowingGroupLoading(true);
    }
  }, [followingGroupsResponse, isFocused]);

  //   const onPressFilterHandler = () => {
  //     groupOptionSheetRef?.current?.show();
  //   };

  //   const onSelectOptionsHandler = ({ userId, type }) => {
  //     setFilterType(type);
  //     setPage(-1);
  //     setMyGroupList([]);
  //     groupOptionSheetRef?.current?.hide();
  //     onFetchMyGroups({ userId: userId, loadMore: false });
  //   };

  //   const onReachedApiHanlder = ({ userId, loadMore }) => {
  //     onFetchMyGroups({ userId: userId, loadMore: loadMore });
  //   };

  return {
    tab,
    onPressTabHandler,
    onFetchMyGroups,
    onFetchFollowingGroups,
    myGroupList,
    followingGroupList,
    groupLoading,
    followingGroupLoading,
    // groupOptionSheetRef,
    // onPressFilterHandler,
    // onSelectOptionsHandler,
    // onReachedApiHanlder,
    filterType,
    moreLoading,
  };
};

export default useGroupListViewModel;
