import { useEffect } from "react";
import { useRouter } from "expo-router";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { InsertNotificationInfo } from "@/utils/InsertNotificationData";
import { useAppStore } from "@/zustand/zustandStore";
import { getUserDeatils } from "@/localDB/LocalStroage";
import notifee, { EventType } from '@notifee/react-native';
import { Platform } from "react-native";
import { handleNotificationPress } from "@/utils/notificationRedirect";

// ✅ Ensure Expo notifications are handled properly
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const useNotificationHandler = () => {
  const router = useRouter();
  const userId = useAppStore((state) => state.userId);
  var oldNotificationData = null;

  useEffect(() => {
    const handleNotificationTap = async (remoteMessage) => {
      const UserDetails = await getUserDeatils();
      InsertNotificationInfo({user_id: UserDetails?.id, push_id: remoteMessage?.data?.push_id, type: remoteMessage?.data?.type, data: remoteMessage?.data})
      if (remoteMessage?.data) handleNotificationRedirect(remoteMessage?.data);
    };

    // ✅ Show Local Notification in Foreground
    const showLocalNotification = async (remoteMessage) => {
      if (Platform.OS === 'ios') {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title || 'New Notification',
          body: remoteMessage.notification?.body || 'You have a new message!',
          data: remoteMessage.data || {},
          ios: { categoryId: 'post' },
        });
      }
      else {
        console.log("remoteMessage", remoteMessage);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification?.title || "New Notification",
            body: remoteMessage.notification?.body || "You have a new message!",
            sound: "default",
            data: remoteMessage.data || {}, // Ensure `data` is passed correctly
          },
          trigger: null, // Show instantly
        });
      }
       
    };

    // ✅ 1️⃣ Foreground Notification Listener (Firebase)
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      await showLocalNotification(remoteMessage);
    });

    // ✅ 2️⃣ Handle Background / Killed State (Firebase)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          handleNotificationTap(remoteMessage);
        }
      });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (oldNotificationData?.messageId === remoteMessage?.messageId) {
        return;
      }
      oldNotificationData = remoteMessage;
      handleNotificationTap(remoteMessage);
    });

    // ✅ 3️⃣ Listen for Foreground Notification Clicks (Fix for Foreground)
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response?.notification?.request?.content;
      handleNotificationTap(data);
    });

    const unsubscribeNotifeeForeground = notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
              case EventType.DISMISSED:
                break;
              case EventType.PRESS:
                if (detail?.notification?.data) {
                  handleNotificationRedirect(detail.notification.data);
                }
                break;
            }
    });

    return () => {
      unsubscribeForeground();
      subscription.remove();
      unsubscribeNotifeeForeground();
    };
  }, []);

  // ✅ Handle Notification Redirection
  const handleNotificationRedirect = (data) => {
    let screen = data?.type;

    switch (screen) {
      case "comment":
      case "cmt_user_tag":
      case "reply_user_tag":
      case "reply":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: data?.post_id || "2",
            commentId: data?.comment_id,
            isNotification: "true",
          },
        });
        break;
      case "like":
      case "post":
      case "post_tips":
      case "user_tagging":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: data?.post_id || "2",
            isNotification: "true",
          },
        });
        break;
      case "loop_join":
      case "loop_add":
      case "loop_request":
      case "remove_group_member":
      case "join_request":
      case "accept_request":
        router.push({
          pathname: "/groups/[slug]",
          params: { slug: data?.loop_id },
        });
        break;
      case "user_chat":
      case "personal_chat":
      case "channel_chat":
        router.push({
          pathname: "/UserChatScreen",
          params: {
            id: data?.profile_id || data?.id || data?.user_id,
            from: 1,
            isNotification: "true",
          },
        });
        break;
      case "profile_follow":
      case "profile":
      case "user_view":
        router.push({
          pathname: "/profile/[id]",
          params: { id: data?.profile_id || data?.post_id, isProfile: "true" },
        });
        break;
      case "kyc_verify_redirect":
      case "kyc_approved":
      case "kyc_verified":
      case "kyc_declined":
        router.replace("/DashboardScreen");
        break;
      case "topup":
      case "withdrawal":
        router.push("/transaction");
        break;
      case "admin_notification":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: data?.post_id,
            isNotification: "true",
          },
        });
        break;
      case "refer_user":
        router.push({
          pathname: "/refer-and-earn",
          params: { isNotification: "true" },
        });
        break;
      default:
        router.replace("/DashboardScreen");
        break;
    }
  };

  return null;
};

export default useNotificationHandler;
