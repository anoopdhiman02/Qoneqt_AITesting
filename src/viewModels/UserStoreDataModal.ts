
import React, { useEffect } from "react";
import { router, SplashScreen } from "expo-router";
import { useAppDispatch } from "@/utils/Hooks";
import {
  getUserData,
} from "@/localDB/LocalStroage";
import { getPrefsValue } from "@/utils/storage";
import { setIsFirstTime } from "@/redux/slice/login/LoginUserSlice";
import { useAppStore } from "@/zustand/zustandStore";

const UserStoreDataModel = () => {
  const dispatch = useAppDispatch();
  const setUserId = useAppStore((state) => state.setUserId);
  useEffect(() => {
    hideSplesh();
  }, []);

  const hideSplesh = async () => {
    // Hide the splash screen
    await SplashScreen.hideAsync();
  };

  const updateUserData = async () => {
    const userStatus = await getUserData();
    const isFirst = getPrefsValue("isFirst");
    dispatch(
      setIsFirstTime(
        isFirst == null || isFirst == undefined ? false : isFirst === "true"
      )
    );
    setUserId(userStatus?.userId);
    
  };

  return {
    updateUserData,
  };
};

export default UserStoreDataModel;
