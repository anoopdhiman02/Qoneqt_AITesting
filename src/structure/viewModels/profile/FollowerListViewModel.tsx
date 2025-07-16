
import  { useState } from "react";
import { useAppDispatch } from "../../../utils/Hooks";
import { onGetFollowers } from "../../../redux/reducer/Profile/GetFollowerList";
import { onFetchFollowings } from "@/redux/reducer/Profile/FetchFollowingList";
import { useAppStore } from "@/zustand/zustandStore";
import { showToast } from '../../../components/atom/ToastMessageComponent';
const useFollowerListViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const [listLoading, setListLoading] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [hasMoreData, setHasMoreData] = useState(true);

  const onFetchFollowerList = async ({ profileId, lastCount }) => {
    try{
      setListLoading(true);
    var followerData = await Dispatch(
      onGetFollowers({
        userId: userId,
        profileId: profileId,
        lastCount: lastCount,
      })
    );
    setListLoading(false);
    if(followerData.payload.success){
      // setFollowersList((prev) => lastCount == 0 ? [...followerData.payload.data]:[...prev, ...followerData.payload?.data]);
    }
    else {
      showToast({type: 'error', text1: followerData.payload.message || ''})
    }
    
  }
  catch(err){
    setListLoading(false);
  }
  };

  const onFetchFollowingList = async ({ profileId, lastCount }) => {
    try{
    setListLoading(true);
    var followingData = await Dispatch(
      onFetchFollowings({
        userId: userId,
        profileId: profileId,
        lastCount: lastCount,
      })
    );
    setListLoading(false);
    if(followingData.payload.success){
      // setFollowingList((prev) => lastCount == 0 ? [...followingData.payload.data] :[...prev, ...followingData.payload?.data]);
    }
    else{
      showToast({type: 'error', text1: followingData.payload.message || ''})
    }
  }
  catch(err) {
    setListLoading(false);
  }
    
  };
  return {
    onFetchFollowerList,
    onFetchFollowingList,
    listLoading,
    followersList,
    followingList,
    hasMoreData,
  };
};
export default useFollowerListViewModel;
