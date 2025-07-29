import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";
import { onFetchUserFeeds } from "../../../redux/reducer/Profile/FetchUserFeeds";
import { useAppStore } from "@/zustand/zustandStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useMyPostsViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const [myfeedsApiCalled, setMyFeedsApiCalled] = useState(false);
  const [myFeedLoading, setMyFeedLoading] = useState(false);
  const [myFeedsData, setMyFeedsData] = useState([]);
  const [moreLoading, setMoreLoading] = useState(false);

  const onFetchFeedsHanlder = async ({ profileId, lastCount }) => {
    if (userId == null) {
      var userData = await AsyncStorage.getItem("user-data");
      var userValue = JSON.parse(userData);
      getFeedData({ profileId, lastCount, u_id: userValue.userId });
    } else {
      getFeedData({ profileId, lastCount, u_id: userId });
    }
  };

  const getFeedData = ({ profileId, lastCount, u_id }) => {
    Dispatch(
      onFetchUserFeeds({
        userId: u_id,
        profileId: profileId,
        lastCount: lastCount,
      })
    );
    setMyFeedsApiCalled(true);
    if (lastCount === 0) {
      setMyFeedLoading(true);
    } else {
      setMoreLoading(true);
    }
  };


  return {
    onFetchFeedsHanlder,
    myFeedLoading,
    myFeedsData,
    moreLoading,
    setMyFeedsData,
  };
};

export default useMyPostsViewModel;
