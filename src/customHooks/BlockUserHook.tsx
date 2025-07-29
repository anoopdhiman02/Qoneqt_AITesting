import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/utils/Hooks';
import { onBlockUser } from '@/redux/reducer/Profile/BlockUser';
import { useAppStore } from '@/zustand/zustandStore';
import { showToast } from '@/components/atom/ToastMessageComponent';

const useBlockUserHook = () => {
    const Dispatch = useAppDispatch();
    const {userId} = useAppStore()
    const blockUserData = useAppSelector((state) => state.blockUserData);
      //block user
  const [blockApiCalled, setBlockApiCalled] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  //Block user
  useEffect(() => {
    if (blockApiCalled && blockUserData?.success) {

    setBlockApiCalled(false);
      setBlockLoading(false);
      showToast({type:'success', text1:blockUserData?.message})

    } else if (blockApiCalled && !blockUserData?.success) {

    setBlockApiCalled(false);
      setBlockLoading(false);
      showToast({type:'error', text1:blockUserData?.message})

    }
  }, [blockUserData]);

  const onPressBlockHandler = ({ profileId, isBlock }) => {

        Dispatch(onBlockUser({userId: userId ,profileId : profileId,isBlock : isBlock}));
        setBlockApiCalled(true);
        setBlockLoading(true);
   
  };
  return {
    onPressBlockHandler,blockLoading,
  }
}

export default useBlockUserHook