import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { sendPushNotificationApi } from "@/redux/reducer/chat/SendPushNotification";

interface Message {
  _id: string;
  message: string;
  created_at: string;
  seen: number;
  replyId: number;
  attachment: string | null;
  fileType: string;
  receiverId: string;
  user: {
    _id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  };
}

const supabase = createClient(
  "https://rbmtdkhfovbjvaryupov.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXRka2hmb3ZianZhcnl1cG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NDAwMTY3NCwiZXhwIjoxOTc5NTc3Njc0fQ._6LuzYDJEBtx0gs5ftUdhYP_smVrgw0kZAJyfIC6UHs"
);
const useMessageSupabaseViewModel = ({
  uid,
  receiverId,
  messageType,
}: {
  uid?: string;
  receiverId?: any;
  messageType: any;
}) => {
  const [supabaseChat, setSupabaseChat] = useState<Message[]>([]);
  const dispatch = useDispatch();
  const profileDetailResponse = useSelector((state: any) => state.myProfileData, shallowEqual);
  const memberAllData = useSelector((state: any) => state.channelAllMembers);

  const fetchMessagesSupabase = async () => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(receiver_id.eq.${receiverId},sender_id.eq.${uid},type.eq.${messageType},temp_del.eq.0,or(clear_ids.is.null,clear_ids.not.ilike.%${uid}%)),` +
          `and(receiver_id.eq.${uid},sender_id.eq.${receiverId},type.eq.${messageType},temp_del.eq.0,or(clear_ids.is.null,clear_ids.not.ilike.%${uid}%))`
      )
      .order("created_at", { ascending: true });

    // const { data, error } = await supabase
    //           .from('messages')
    //           .select('*')
    //           .eq("receiver_id", receiverId)
    //           .eq("type", 2)
    //           .eq("temp_del", "0")
    //           .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`) // Dynamically use the userId in the query
    //           .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
      return;
    }
    setSupabaseChat(
      data?.map((msg) => ({
        _id: msg.id,
        message: msg.message,
        created_at: msg.created_at,
        seen: msg.seen,
        replyId: msg.reply_id,
        attachment: msg.attachment,
        fileType: msg.file_type,
        receiverId: msg.receiver_id,
        user: {
          _id: `${msg.id}-${msg.sender_id}`,
          name: msg.sender_fullname,
          username: msg.sender_username,
          avatar: msg.sender_profile_pic,
        },
      })) || []
    );
  };

  const fetchChannelMessagesSupabase = async () => {
    // const { data, error } = await supabase
    //   .from("messages")
    //   .select("*")
    //   .or(
    //     `and(receiver_id.eq.${receiverId},sender_id.eq.${uid},type.eq.${messageType},temp_del.eq.0,or(clear_ids.is.null,clear_ids.not.ilike.%${uid}%)),` +
    //     `and(receiver_id.eq.${uid},sender_id.eq.${receiverId},type.eq.${messageType},temp_del.eq.0,or(clear_ids.is.null,clear_ids.not.ilike.%${uid}%))`
    //   )
    //   .order("created_at", { ascending: true });

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("receiver_id", receiverId)
      .eq("type", messageType)
      .eq("temp_del", "0")
      .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`) // Dynamically use the userId in the query
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
      return;
    }

    setSupabaseChat(
      data?.map((msg) => ({
        _id: msg.id,
        message: msg.message,
        created_at: msg.created_at,
        seen: msg.seen,
        replyId: msg.reply_id,
        attachment: msg.attachment,
        fileType: msg.file_type,
        receiverId: msg.receiver_id,
        sender_id: msg.sender_id,
        user: {
          _id: `${msg.id}-${msg.sender_id}`,
          name: msg.sender_fullname,
          username: msg.sender_username,
          avatar: msg.sender_profile_pic,
        },
      })) || []
    );
  };

  const updateSeen = async () => {
    await supabase
      .from("messages")
      .update({ seen: 1 })
      .eq("sender_id", receiverId)
      .eq("receiver_id", uid)
      .eq("seen", 0)
      .eq("type", messageType);
  };

  const clearChat = async () => {
    await supabase
      .from("messages")
      .update({ clear_ids: uid })
      .or(
        `and(receiver_id.eq.${receiverId},sender_id.eq.${uid},type.eq.${messageType}),` +
          `and(receiver_id.eq.${uid},sender_id.eq.${receiverId},type.eq.${messageType})`
      );
    showToast({ type: "success", text1: "Chat Cleared" });
  };

  const deleteMessage = async (messageId: string) => {
    await supabase
      .from("messages")
      .update({ temp_del: "1" })
      .eq("id", messageId);
    showToast({ type: "success", text1: "Message deleted" });
  };

  const insertMessage = async ({
    message,
    attach = null,
    type = "text",
    reply = 0,
    notificationType,
  }: any) => {
    try {
      await supabase.from("messages").insert([
        {
          attachment: attach,
          created_at: new Date().toISOString(),
          file_type: type,
          message,
          receiver_id: receiverId,
          reply_id: reply,
          row_id: `${uid}-${receiverId}`,
          seen: 0,
          sender_id: uid,
          type: messageType,
          sender_fullname: profileDetailResponse?.data?.full_name || "",
          sender_profile_pic: profileDetailResponse?.data?.profile_pic || "",
          sender_username: profileDetailResponse?.data?.username ||"",
        },
      ]);
      if (notificationType == "personal_chat") {
        dispatch(
          // @ts-ignore
          sendPushNotificationApi({
            user_id: Number(uid),
            receiver_id: Number(receiverId),
            push_type: "notification",
            type: "personal_chat",
            id: receiverId,
            notify_title: profileDetailResponse?.data?.full_name || "",
            notify_desc: message ? message : "",
            optional: attach ? attach : "",
            fromApp: 1,
          })
        );
      } else {
        if (memberAllData?.data?.qoneqtdb_channels[0]?.members.length > 0) {
          await Promise.all(
            memberAllData?.data?.qoneqtdb_channels[0]?.members?.map(
              async (member: any) => {
                dispatch(
                  // @ts-ignore
                  sendPushNotificationApi({
                    user_id: Number(uid),
                    receiver_id: Number(member.user_id),
                    push_type: "notification",
                    type: "channel_chat",
                    id: Number(receiverId),
                    notify_title: profileDetailResponse?.data?.full_name|| "",
                    notify_desc: message ? message : "",
                    optional: "",
                    fromApp: 1,
                  })
                );
              }
            )
          );
        }
      }
    } catch (error) {
      console.error("Error inserting message:", error.message);
    }
  };

  useEffect(() => {
    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        fetchMessagesSupabase
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    supabaseChat,
    fetchMessagesSupabase,
    fetchChannelMessagesSupabase,
    updateSeen,
    clearChat,
    deleteMessage,
    insertMessage,
  };
};

export default useMessageSupabaseViewModel;
