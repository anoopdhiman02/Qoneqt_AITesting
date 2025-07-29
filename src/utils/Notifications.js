import { showToast } from "@/components/atom/ToastMessageComponent";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { PermissionsAndroid, Platform } from "react-native";

// notification setup 1
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// notification register 2
// Request permission and handle FCM token registration
export const registerForPushNotifications = async () => {
  let hasPermission = false;

  if (Platform.OS === "ios") {
    const authStatus = await messaging().requestPermission();
    hasPermission =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      await messaging().registerDeviceForRemoteMessages();
    
    // Configure iOS foreground presentation options - critical for iOS foreground notifications
    // await messaging().setForegroundNotificationPresentationOptions({
    //   alert: true,  // Required to show notification in foreground
    //   badge: true,
    //   sound: true,
    // });
  } else if (Platform.OS === "android") {
    if (Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      hasPermission = result === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      hasPermission = true; // Android < 13 has notifications enabled by default
    }
  }

  if (!hasPermission) {
    console.warn("Notification permission denied");
    return null;
  }

  // Register for remote messages
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();

  // Subscribe to a topic (optional)
  await messaging()
    .subscribeToTopic("general")
    .catch((error) => {
      console.error("Error subscribing to topic:", error);
    });

  return token;
};

// 3config notificatio redirection
// Configure push notifications for handling in different app states
export const configurePushNotification = () => {
  // Request permission for notifications
  messaging()
    .requestPermission()
    .then((authStatus) => {
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
      }
    })
    .catch((error) => console.error("Error requesting permission:", error));

  // Handle foreground notifications
  messaging().onMessage(async (remoteMessage) => {
     // For iOS - ensure foreground notifications display
     if (Platform.OS === 'ios') {
      // Reinforce iOS-specific notification settings for foreground
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,  // Critical for iOS foreground display
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title || "New Notification",
        body: remoteMessage.notification?.body || "You have a new message",
        data: remoteMessage.data,
        sound: 'default', // Add sound to iOS notifications
        // Add this for iOS
        _displayInForeground: true
      },
      trigger: null,
    });
  });

  // Handle background notifications
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const { data, notification } = remoteMessage;
    // Handle the specific notification type
    if (data?.push_type === "notification" && data?.type === "like") {
      // You can store this in AsyncStorage or handle it when app opens
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title || "New Notification",
        body: remoteMessage.notification?.body || "You have a new message",
        data: remoteMessage.data,
      },
      trigger: null,
    });
  });

  // Handle notification when the app is opened from a background state
  messaging().onNotificationOpenedApp((remoteMessage) => {
    if (remoteMessage) {
      console.log("remoteMessage1212>>", remoteMessage);
      handleNotificationRedirect(remoteMessage);
    }
  });

  // Handle notification when the app is opened from a closed state
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        // let screen = remoteMessage?.data?.type;
        // switch (screen) {
        //   case "like":
        //     router.push({
        //       pathname: "/post/[id]",
        //       params: { id: remoteMessage?.data?.post_id },
        //     });
        //     break;
        //   case "post":
        //     router.push({
        //       pathname: "/post/[id]",
        //       params: { id: remoteMessage?.data?.post_id },
        //     });
        //     break;

        //   case "group":
        //     router.push({
        //       pathname: "/groups",
        //       params: { groupId: remoteMessage?.data?.group_id },
        //     });
        //     break;
        //   case "profile":
        //     router.push({
        //       pathname: "/profile/[id]",
        //       params: {
        //         id: remoteMessage?.data?.profile_id,
        //         isProfile: "true",
        //         isNotification: "false",
        //       },
        //     });
        //     break;
        //   case "user chat":
        //     router.push({
        //       pathname: "/UserChatScreen",
        //       params: {
        //         id: remoteMessage?.data?.id,
        //         from: 1,
        //         isNotification: true,
        //       },
        //     });
        //     break;

        //   case "channel info":
        //     break;
        //   case "channel chat":
        //     router.push({
        //       pathname: "/ChannelChatScreen",
        //       params: {
        //         id: remoteMessage?.data?.id,
        //         from: 2,
        //         name: channelName,
        //         logo: channelLogo,
        //       },
        //     });
        //     break;
        //   default:
        //     break;
        // }
        console.log("remoteMessage1212", remoteMessage);
        handleNotificationRedirect(remoteMessage);
      } else {
      }
    })
    .catch((error) =>
      console.error("Error getting initial notification:", error)
    );
};

// Helper function to handle notification redirection
const handleNotificationRedirect = (remoteMessage) => {
  let screen = remoteMessage?.data?.type;
  switch (screen) {
    case "like":
      router.push({
        pathname: "/post/[id]",
        params: { id: remoteMessage?.data?.post_id },
      });
      break;
    case "post":
      router.push({
        pathname: "/post/[id]",
        params: { id: remoteMessage?.data?.post_id },
      });
      break;

    case "group":
      router.push({
        pathname: "/groups",
        params: { groupId: remoteMessage?.data?.group_id },
      });
      break;
    case "profile":
      router.push({
        pathname: "/profile/[id]",
        params: {
          id: remoteMessage?.data?.profile_id,
          isProfile: "true",
          isNotification: "false",
        },
      });
      break;
    case "user chat":
      router.push({
        pathname: "/UserChatScreen",
        params: { id: profileDetails?.id, from: 1, isNotification: true },
      });
      break;

    case "user channel":
      router.push({
        pathname: "/UserChatScreen",
        params: { id: profileDetails?.id, from: 1, isNotification: true },
      });
      break;
    case "channel info":
      break;
    case "channel chat":
      break;
    case "comment":
      router.push({
        pathname: "/post/[id]",
        params: {
          id: remoteMessage?.data?.post_id,
          commentId: remoteMessage?.data?.comment_id,
        },
      });
      break;
    case "cmt_user_tag":
      router.push({
        pathname: "/post/[id]",
        params: {
          id: remoteMessage?.data?.post_id,
          commentId: remoteMessage?.data?.comment_id,
        },
      });
      break;
    case "reply_user_tag":
      router.push({
        pathname: "/post/[id]",
        params: {
          id: remoteMessage?.data?.post_id,
          commentId: remoteMessage?.data?.comment_id,
        },
      });
      break;
    case "tipping":
      router.push({
        pathname: "/post/[id]",
        params: { id: remoteMessage?.data?.post_id },
      });
      break;
    case "reply":
      router.push({
        pathname: "/post/[id]",
        params: {
          id: remoteMessage?.data?.post_id,
          commentId: remoteMessage?.data?.comment_id,
        },
      });
      break;
    case "loop_join":
      router.push({
        pathname: "/groups",
        params: { groupId: remoteMessage?.data?.loop_id },
      });
      break;
    case "loop_add":
      router.push({
        pathname: "/groups",
        params: { groupId: remoteMessage?.data?.loop_id },
      });
      break;
    case "loop_request":
      router.push({
        pathname: "/groups",
        params: { groupId: remoteMessage?.data?.loop_id },
      });
      break;
    case "kyc_verified":
      break; // Handle as needed
    case "accept_request":
      router.push({
        pathname: "/groups",
        params: { groupId: remoteMessage?.data?.loop_id },
      });
      break;
    case "admin_notification":
      router.push({
        pathname: "/AdminNotificationScreen",
        params: { postId: remoteMessage?.data?.post_id },
      });
      break;
    case "signup_bonus":
      break; // Handle as needed
    case "post_tips":
      router.push({
        pathname: "/post/[id]",
        params: { id: remoteMessage?.data?.post_id },
      });
      break; // Handle as needed
    case "user_tagging":
      router.push({
        pathname: "/post/[id]",
        params: { id: remoteMessage?.data?.post_id },
      });
      break;
    case "profile_follow":
      router.push({
        pathname: "/profile/[id]",
        params: {
          id: remoteMessage?.data?.profile_id,
          isProfile: "true",
          isNotification: "false",
        },
      });
      break; // Handle as needed
    case "topup":
      break; // Handle as needed
    case "post_report":
      break; // Handle as needed
    case "role_change":
      break; // Handle as needed
    case "chn_role_change":
      break; // Handle as needed
    case "kyc_declined":
      break; // Handle as needed
    case "group_join_request":
      break; // Handle as needed
    case "group_join":
      break; // Handle as needed

    default:
      break;
  }
};

// Create a notification channel for Android
export const createNotificationChannel = async () => {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "General Notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};
