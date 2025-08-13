import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";
import { onFetchUserFeeds } from "../../../redux/reducer/Profile/FetchUserFeeds";
import { useAppStore } from "@/zustand/zustandStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { calculateHeight } from "@/utils/ImageHelper";
import { setUserFeedData } from "@/redux/slice/profile/UserFeedsSlice";

const useMyPostsViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const [myFeedLoading, setMyFeedLoading] = useState(false);
  const [myFeedsData, setMyFeedsData] = useState([]);
  const [moreLoading, setMoreLoading] = useState(false);
  const myPostListResponse = useAppSelector((state) => state.myFeedsListData)

  const onFetchFeedsHanlder = async ({ profileId, lastCount }) => {
    if (userId == null) {
      var userData = await AsyncStorage.getItem("user-data");
      var userValue = JSON.parse(userData);
      getFeedData({ profileId, lastCount, u_id: userValue.userId });
    } else {
      getFeedData({ profileId, lastCount, u_id: userId });
    }
  };

  const getFeedData = async ({ profileId, lastCount, u_id }) => {
  var feedNewData =  await Dispatch(
      onFetchUserFeeds({
        userId: u_id,
        profileId: profileId,
        lastCount: lastCount,
      })
    );
    if (lastCount === 0) {
      setMyFeedLoading(true);
    } else {
      setMoreLoading(true);
    }
    if(feedNewData.payload.success){
      var newPostData = await Promise.all((feedNewData.payload.data || []).map(async (item) => {
        if(item?.file_type == "image"){
          return {
            ...item,
            display_height: (await Promise.all(calculateHeight(item)))
          };
        }
        return {
          ...item
        };
      }));
      Dispatch(setUserFeedData(lastCount == 0 ? newPostData : [...myPostListResponse.updatedData, ...newPostData]));
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
