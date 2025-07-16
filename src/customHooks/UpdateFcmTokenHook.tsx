import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import messaging from "@react-native-firebase/messaging";
import { onUpdateFcm } from "@/redux/reducer/UpdateFcm";
import { registerForPushNotifications } from "@/utils/Notifications";
import { useAppStore } from "@/zustand/zustandStore";

const UpdateFcmTokenHook = () => {
  const Dispatch = useAppDispatch();
  const { userId, fcmTokenStore } = useAppStore();
  const updateFcmData = useAppSelector((state) => state.UpdateFcmData);

  const [updateFcmCalled, setUpdateFcmCalled] = useState(false);

  //fcm

  useEffect(() => {
    if (updateFcmCalled && updateFcmData?.success) {
      //   SetIsFcmTokensended(true);
      setUpdateFcmCalled(false);
    } else {
      //   SetIsFcmTokensended(false);
      setUpdateFcmCalled(false);
    }
  }, [updateFcmData]);

  const onUpdateFcmHandler = async () => {
    await registerForPushNotifications().then((tok) => {
      Dispatch(onUpdateFcm({ userId: userId, fcmToken: tok || fcmTokenStore }));
    });
  };

  const onUpdateWithoutIdFcmHandler = async () => {
    await registerForPushNotifications().then((tok) => {
      Dispatch(onUpdateFcm({ fcmToken: tok || fcmTokenStore }));
    });

    // messaging()
    //   .subscribeToTopic("general")
    // setUpdateFcmCalled(true);
  };
  return { onUpdateFcmHandler, onUpdateWithoutIdFcmHandler };
};

export default UpdateFcmTokenHook;
