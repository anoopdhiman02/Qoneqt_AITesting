import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef } from "react";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { sendPushNotificationApi } from "@/redux/reducer/chat/SendPushNotification";

interface GroupMessage {
  _id: string;
  message: string;
  created_at: string;
  seen: string | null;
  replyId: number;
  attachment: string | null;
  fileType: string;
  groupId: number;
  subgroupId?: number | 0;
  postId?: number | 0;
  senderId: number;
  user: {
    _id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  };
}

interface GroupMedia {
  _id: string;
  attachment: string | null;
  fileType: string;
  senderId: number;
}

const supabase = createClient(
  "https://rbmtdkhfovbjvaryupov.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXRka2hmb3ZianZhcnl1cG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NDAwMTY3NCwiZXhwIjoxOTc5NTc3Njc0fQ._6LuzYDJEBtx0gs5ftUdhYP_smVrgw0kZAJyfIC6UHs"
);
const useGroupMessageSupabaseViewModel = ({
  uid,
  groupId,
  subgroupId = 0,
}: {
  uid?: string;
  groupId?: any;
  subgroupId?: any;
}) => {
  const [supabaseGroupChat, setSupabaseGroupChat] = useState<GroupMessage[]>(
    []
  );

  const [supabaseGroupMedia, setSupabaseGroupMedia] = useState<GroupMedia[]>(
    []
  );

  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const dispatch = useDispatch();
  const profileDetailResponse = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );
  const memberAllData = useSelector((state: any) => state.channelAllMembers);

  // Pagination constants
  const PAGE_SIZE = 10;
  const subscriptionRef = useRef<any>(null);

  const fetchMediaSupabase = async () => {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .eq("subgroup_id", subgroupId)
      .eq("type", "image")
      .eq("temp_del", "0")
      .eq("post_id", 0)
      .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`) // Dynamically use the userId in the query
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
      return;
    }
    setSupabaseGroupMedia(
      data?.map((msg) => ({
        _id: msg.id,
        attachment: msg.attachment,
        fileType: msg.type,
        senderId: msg.sender_id,
      })) || []
    );
  };

  // const fetchMessagesSupabase = async () => {
  //   const { data, error } = await supabase
  //     .from("group_messages")
  //     .select("*")
  //     .eq("group_id", groupId)
  //     .eq("subgroup_id", subgroupId)
  //     .eq("temp_del", "0")
  //     .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`) // Dynamically use the userId in the query
  //     .order("id", { ascending: true });

  //   if (error) {
  //     console.error("Error fetching messages:", error.message);
  //     return;
  //   }
  //   setSupabaseGroupChat(
  //     data?.map((msg) => ({
  //       _id: msg.id,
  //       message: msg.message,
  //       created_at: msg.created_at,
  //       seen: msg.seen,
  //       replyId: msg.reply_id,
  //       attachment: msg.attachment,
  //       fileType: msg.type,
  //       groupId: msg.group_id,
  //       subgroupId: msg.subgroup_id,
  //       senderId: msg.sender_id,
  //       postId: msg.post_id || 0,
  //       user: {
  //         _id: `${msg.id}-${msg.sender_id}`,
  //         name: msg.sender_fullname,
  //         username: msg.sender_username,
  //         avatar: msg.sender_profile_pic,
  //       },
  //     })) || []
  //   );
  // };

  //   const fetchChannelMessagesSupabase = async () => {

  //     const { data, error } = await supabase
  //       .from("group_messages")
  //       .select("*")
  //       .eq("group_id", groupId)
  //       .eq("subgroup_id", subgroupId)
  //       .eq("temp_del", "0")
  //       .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`) // Dynamically use the userId in the query
  //       .order("id", { ascending: true });

  //     if (error) {
  //       console.error("Error fetching messages:", error.message);
  //       return;
  //     }

  //     setSupabaseGroupChat(
  //       data?.map((msg) => ({
  //         _id: msg.id,
  //         message: msg.message,
  //         created_at: msg.created_at,
  //         // seen: msg.seen,
  //         replyId: msg.reply_id,
  //         attachment: msg.attachment,
  //         fileType: msg.type,
  //         groupId: msg.receiver_id,
  //         sender_id: msg.sender_id,
  //         user: {
  //           _id: `${msg.id}-${msg.sender_id}`,
  //           name: msg.sender_fullname,
  //           username: msg.sender_username,
  //           avatar: msg.sender_profile_pic,
  //         },
  //       })) || []
  //     );
  //   };

  // Initial fetch - get latest 10 messages
  const fetchInitialMessages = async () => {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .eq("subgroup_id", subgroupId)
      .eq("temp_del", "0")
      .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`)
      .order("id", { ascending: false }) // Get latest first
      .limit(PAGE_SIZE);

    if (error) {
      console.error("Error fetching initial messages:", error.message);
      return;
    }

    const messages =
      data?.map((msg) => ({
        _id: msg.id,
        message: msg.message,
        created_at: msg.created_at,
        seen: msg.seen,
        replyId: msg.reply_id,
        attachment: msg.attachment,
        fileType: msg.type,
        groupId: msg.group_id,
        subgroupId: msg.subgroup_id,
        senderId: msg.sender_id,
        postId: msg.post_id || 0,
        user: {
          _id: `${msg.id}-${msg.sender_id}`,
          name: msg.sender_fullname,
          username: msg.sender_username,
          avatar: msg.sender_profile_pic,
        },
      })) || [];

    // Reverse to show oldest first (but we got the latest 10)
    setSupabaseGroupChat(messages.reverse());
    setHasMoreMessages(data?.length === PAGE_SIZE);
    setIsInitialLoad(false);
  };

  // Fetch older messages for pagination
  const fetchOlderMessages = async () => {
    if (isLoadingOlder || !hasMoreMessages || supabaseGroupChat.length === 0)
      return;

    setIsLoadingOlder(true);

    // Get the oldest message ID from current messages
    const oldestMessageId = supabaseGroupChat[0]?._id;
    console.log("Oldest message ID:", oldestMessageId);

    
    try {
      const { data, error } = await supabase
        .from("group_messages")
        .select("*")
        .eq("group_id", groupId)
        .eq("subgroup_id", subgroupId)
        .eq("temp_del", "0")
        .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`)
        .lt("id", oldestMessageId) // Get messages older than the oldest one we have
        .order("id", { ascending: false })
        .limit(30);

      if (error) {
        console.error("Error fetching older messages:", error.message);
        setIsLoadingOlder(false);
        return;
      }

      console.log("Fetched older messages count:", data?.length || 0);

      const olderMessages =
        data?.map((msg) => ({
          _id: msg.id,
          message: msg.message,
          created_at: msg.created_at,
          seen: msg.seen,
          replyId: msg.reply_id,
          attachment: msg.attachment,
          fileType: msg.type,
          groupId: msg.group_id,
          subgroupId: msg.subgroup_id,
          senderId: msg.sender_id,
          postId: msg.post_id || 0,
          user: {
            _id: `${msg.id}-${msg.sender_id}`,
            name: msg.sender_fullname,
            username: msg.sender_username,
            avatar: msg.sender_profile_pic,
          },
        })) || [];

      if (olderMessages.length > 0) {
        // Prepend older messages to the beginning (reverse them first since we got them in descending order)
        setSupabaseGroupChat((prev) => {
          const newMessages = [...olderMessages.reverse(), ...prev];
          console.log("Total messages after pagination:", newMessages.length);
          return newMessages;
        });
        setHasMoreMessages(olderMessages.length === PAGE_SIZE);
      } else {
        console.log("No more messages to load");
        setHasMoreMessages(false);
      }
    } catch (err) {
      console.error("Pagination error:", err);
    } finally {
      // Add a delay to prevent immediate re-triggering and allow UI to settle
      setTimeout(() => {
        setIsLoadingOlder(false);
        console.log("Pagination loading finished");
      }, 500);
    }
  };

  // Handle real-time updates
  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    console.log("eventType: ",eventType);
    console.log("newRecord.group_id: ", newRecord.group_id);
    console.log("group_id: ", groupId);
    
    console.log("newRecord.subgroup_id: ", newRecord.subgroup_id);
    console.log("subgroup_id: ", subgroupId);
    console.log("oldRecord: ", oldRecord);

    switch (eventType) {
      case "INSERT":
        // Check if this message belongs to our chat
        if (
          newRecord.group_id == groupId &&
          newRecord.subgroup_id == subgroupId
        ) {
          const newMessage = {
            _id: newRecord.id,
            message: newRecord.message,
            created_at: newRecord.created_at,
            seen: newRecord.seen,
            replyId: newRecord.reply_id,
            attachment: newRecord.attachment,
            fileType: newRecord.type,
            groupId: newRecord.group_id,
            subgroupId: newRecord.subgroup_id,
            senderId: newRecord.sender_id,
            postId: newRecord.post_id || 0,
            user: {
              _id: `${newRecord.id}-${newRecord.sender_id}`,
              name: newRecord.sender_fullname,
              username: newRecord.sender_username,
              avatar: newRecord.sender_profile_pic,
            },
          };

          // Only add if it's not already in the list (avoid duplicates)
          setSupabaseGroupChat((prev) => {
            const exists = prev.find((msg) => msg._id == newMessage._id);
            if (!exists) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }
        break;

      case "UPDATE":
        if (
          oldRecord.group_id == groupId &&
          oldRecord.subgroup_id == subgroupId
        ) {
          console.log("oldRecord: ", oldRecord.id);
          console.log("delete data: ", newRecord.type);

          setSupabaseGroupChat((prev) =>
            prev.map((msg) => {
              if (msg._id == oldRecord.id) {
                return {
                  ...msg,
                  message: newRecord.message,
                  seen: newRecord.seen,
                  attachment: newRecord.attachment,
                  fileType: newRecord.type,
                  // Update other fields as needed
                };
              }
              return msg;
            })
          );

          if (newRecord.temp_del == "1") {
            setSupabaseGroupChat((prev) =>
              prev.filter((msg) => msg._id != oldRecord.id)
            );
          }
        }else{
          setSupabaseGroupChat((prev) =>
            prev.filter((msg) => msg._id != oldRecord.id)
          );
        }
        break;

      case "DELETE":
        if (
          oldRecord.group_id == groupId &&
          oldRecord.subgroup_id == subgroupId
        ) {
          setSupabaseGroupChat((prev) =>
            prev.filter((msg) => msg._id != oldRecord.id)
          );
        }
        break;

      default:
        break;
    }
  };

  const updateSeen = async () => {
    await supabase
      .from("messages")
      .update({ seen: uid })
      .eq("group_id", groupId)
      .eq("seen", 0);
  };
  const updateSeenSubgroup = async () => {
    await supabase
      .from("messages")
      .update({ seen: uid })
      .eq("group_id", groupId)
      .eq("subgroup_id", subgroupId);
  };

  const clearChat = async () => {
    await supabase
      .from("group_messages")
      .update({ clear_ids: uid })
      .or(
        `and(receiver_id.eq.${groupId},sender_id.eq.${uid},` +
          `and(receiver_id.eq.${uid},sender_id.eq.${groupId})`
      );
    showToast({ type: "success", text1: "Chat Cleared" });
  };

  const deleteMessage = async (messageId: string) => {
    await supabase
      .from("group_messages")
      .update({ temp_del: "1" })
      .eq("id", messageId);
    showToast({ type: "success", text1: "Message deleted" });
    // Optimistically remove from local state
    setSupabaseGroupChat((prev) => prev.filter((msg) => msg._id !== messageId));
  };

  const insertMessage = async ({
    message,
    attach = null,
    type = "text",
    reply = 0,
    notificationType,
  }: any) => {
    try {
      // await supabase.from("group_messages").insert([
      //   {
      //     attachment: attach,
      //     created_at: new Date().toISOString(),
      //     type: type,
      //     message,
      //     group_id: groupId,
      //     subgroup_id: subgroupId,
      //     reply_id: reply,
      //     sender_id: uid,
      //     sender_fullname: profileDetailResponse?.data?.full_name || "",
      //     sender_profile_pic: profileDetailResponse?.data?.profile_pic || "",
      //     sender_username: profileDetailResponse?.data?.username || "",
      //   },
      // ]);

       const newMessageData = {
         attachment: attach,
         created_at: new Date().toISOString(),
         type: type,
         message,
         group_id: groupId,
         subgroup_id: subgroupId,
         reply_id: reply,
         sender_id: uid,
         sender_fullname: profileDetailResponse?.data?.full_name || "",
         sender_profile_pic: profileDetailResponse?.data?.profile_pic || "",
         sender_username: profileDetailResponse?.data?.username || "",
       };

       const { data, error } = await supabase
         .from("group_messages")
         .insert([newMessageData])
         .select()
         .single();

       if (error) throw error;

      // Optimistically add to local state
      const optimisticMessage = {
        _id: data.id,
        message: data.message,
        created_at: data.created_at,
        seen: data.seen,
        replyId: data.reply_id,
        attachment: data.attachment,
        fileType: data.type,
        groupId: data.group_id,
        subgroupId: data.subgroup_id,
        senderId: data.sender_id,
        postId: data.post_id || 0,
        user: {
          _id: `${data.id}-${data.sender_id}`,
          name: data.sender_fullname,
          username: data.sender_username,
          avatar: data.sender_profile_pic,
        },
      };

      setSupabaseGroupChat((prev) => [...prev, optimisticMessage]);
      //   if (notificationType == "personal_chat") {
      //     dispatch(
      //       // @ts-ignore
      //       sendPushNotificationApi({
      //         user_id: Number(uid),
      //         receiver_id: Number(groupId),
      //         push_type: "notification",
      //         type: "personal_chat",
      //         id: groupId,
      //         notify_title: profileDetailResponse?.data?.full_name || "",
      //         notify_desc: message ? message : "",
      //         optional: attach ? attach : "",
      //         fromApp: 1,
      //       })
      //     );
      //   } else {
      //     if (memberAllData?.data?.qoneqtdb_channels[0]?.members.length > 0) {
      //       await Promise.all(
      //         memberAllData?.data?.qoneqtdb_channels[0]?.members?.map(
      //           async (member: any) => {
      //             dispatch(
      //               // @ts-ignore
      //               sendPushNotificationApi({
      //                 user_id: Number(uid),
      //                 receiver_id: Number(member.user_id),
      //                 push_type: "notification",
      //                 type: "channel_chat",
      //                 id: Number(groupId),
      //                 notify_title: profileDetailResponse?.data?.full_name || "",
      //                 notify_desc: message ? message : "",
      //                 optional: "",
      //                 fromApp: 1,
      //               })
      //             );
      //           }
      //         )
      //       );
      //     }
      //   }
    } catch (error) {
      console.error("Error inserting message:", error.message);
    }
  };

  // useEffect(() => {
  //   function trigger() {
  //     fetchMessagesSupabase();
  //     fetchMediaSupabase();
  //   }
  //   const subscription = supabase
  //     .channel("public:group_messages")
  //     .on(
  //       "postgres_changes",
  //       { event: "*", schema: "public", table: "group_messages" },
  //       trigger
  //     )
  //     .subscribe();

  //   return () => {
  //     subscription.unsubscribe();
  //     supabase.removeChannel(subscription);
  //   };
  // }, []);

  useEffect(() => {
    // Initial data fetch
    fetchInitialMessages();
    fetchMediaSupabase();

    // Setup real-time subscription
    subscriptionRef.current = supabase
      .channel("public:group_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        handleRealtimeUpdate
      )
      .subscribe();

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  return {
    supabaseGroupChat,
    supabaseGroupMedia,
    // fetchMessagesSupabase,
    fetchInitialMessages, // Renamed from fetchMessagesSupabase
    fetchOlderMessages, // New function for pagination
    fetchMediaSupabase,
    updateSeen,
    updateSeenSubgroup,
    clearChat,
    deleteMessage,
    insertMessage,
    isLoadingOlder,
    hasMoreMessages,
    isInitialLoad,
  };
};

export default useGroupMessageSupabaseViewModel;
