import { router } from "expo-router";
import { setPrefsValue } from "./storage";

export const handleNotificationPress = (data) => {
    try {
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
    } catch (error) {
      console.error("Notification redirect error:", error);
      router.replace("/DashboardScreen");
    }
    finally{
        setPrefsValue("message", "");
    }
};