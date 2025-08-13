import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef, useCallback } from "react";
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
  sender_id: any;
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMessageIds, setAllMessageIds] = useState<Set<string>>(new Set());

  const dispatch = useDispatch();
  const profileDetailResponse = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );
  const memberAllData = useSelector((state: any) => state.channelAllMembers);

  // Pagination constants
  const PAGE_SIZE = 20;
  const subscriptionRef = useRef<any>(null);

  // Helper function to format message data
  const formatMessage = (msg: any): Message => ({
    _id: msg.id,
    message: msg.message,
    created_at: msg.created_at,
    seen: msg.seen,
    replyId: msg.reply_id,
    attachment: msg.attachment,
    fileType: msg.file_type,
    receiverId: msg.receiver_id,
    sender_id: msg.sender_id, // Add this for better handling
    user: {
      _id: `${msg.id}-${msg.sender_id}`,
      name: msg.sender_fullname,
      username: msg.sender_username,
      avatar: msg.sender_profile_pic,
    },
  });

  // Build the query condition for personal chat
  const buildPersonalChatQuery = () => {
    return (
      `and(receiver_id.eq.${receiverId},sender_id.eq.${uid},type.eq.${messageType},temp_del.eq.0,or(clear_ids.is.null,clear_ids.not.ilike.%${uid}%)),` +
      `and(receiver_id.eq.${uid},sender_id.eq.${receiverId},type.eq.${messageType},temp_del.eq.0,or(clear_ids.is.null,clear_ids.not.ilike.%${uid}%))`
    );
  };

  // Initial fetch with pagination
  const fetchMessagesWithPagination = async (
    page = 1,
    limit = PAGE_SIZE,
    resetData = false
  ) => {
    try {
      if (page > 1) {
        setIsLoadingMore(true);
      } else {
        setIsInitialLoad(true);
      }

      let query;

      if (messageType === "1") {
        // Personal chat
        query = supabase
          .from("messages")
          .select("*", { count: "exact" })
          .or(buildPersonalChatQuery());
      } else {
        // Channel chat
        query = supabase
          .from("messages")
          .select("*", { count: "exact" })
          .eq("receiver_id", receiverId)
          .eq("type", messageType)
          .eq("temp_del", "0")
          .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`);
      }

      const { data, error, count } = await query
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      const messages = data?.map(formatMessage) || [];

      if (page === 1 || resetData) {
        // Reset data for first page or explicit reset
        setSupabaseChat(messages.reverse());
        setAllMessageIds(new Set(messages.map((m) => m._id)));
        setCurrentPage(1);
      } else {
        // Append to existing messages for pagination
        setSupabaseChat((prev) => {
          const newMessages = messages.reverse();
          // Filter out duplicates
          const filteredMessages = newMessages.filter(
            (msg) => !allMessageIds.has(msg._id)
          );
          setAllMessageIds((prevIds) => {
            const newIds = new Set(prevIds);
            filteredMessages.forEach((msg) => newIds.add(msg._id));
            return newIds;
          });
          return [...filteredMessages, ...prev];
        });
        setCurrentPage(page);
      }

      // Check if there are more messages
      const totalFetched = page * limit;
      setHasMoreMessages(totalFetched < (count || 0));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingMore(false);
      setIsInitialLoad(false);
    }
  };

  // Legacy fetch function for backward compatibility
  const fetchMessagesSupabase = async () => {
    await fetchMessagesWithPagination(1, PAGE_SIZE, true);
  };

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback(
    (payload: any) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      console.log("payload: ", payload);

      switch (eventType) {
        case "INSERT":
          const newMessage = formatMessage(newRecord);

          // Check if this message belongs to current conversation
          const belongsToConversation =
            messageType === "1"
              ? (newRecord.sender_id == uid &&
                  newRecord.receiver_id == receiverId) ||
                (newRecord.sender_id == receiverId &&
                  newRecord.receiver_id == uid)
              : newRecord.receiver_id == receiverId &&
                newRecord.type == messageType;

          if (belongsToConversation && newRecord.temp_del == "0") {
            setSupabaseChat((prev) => {
              // Check if message already exists to avoid duplicates
              const exists = prev.some((msg) => msg._id == newMessage._id);
              if (!exists) {
                setAllMessageIds(
                  (prevIds) => new Set([...prevIds, newMessage._id])
                );
                return [...prev, newMessage];
              }
              return prev;
            });
          }
          break;

        case "UPDATE":
          setSupabaseChat((prev) => {
            return prev
              .map((msg) => {
                if (msg._id === oldRecord.id) {
                  // Handle soft delete
                  if (newRecord.temp_del == "1") {
                    return null; // Will be filtered out
                  }
                  // Handle other updates (like seen status)
                  return formatMessage(newRecord);
                }
                return msg;
              })
              .filter(Boolean); // Remove null values (deleted messages)
          });

          // If message was soft deleted, remove from ID set
          if (newRecord.temp_del == "1") {
            setAllMessageIds((prevIds) => {
              const newIds = new Set(prevIds);
              newIds.delete(oldRecord.id);
              return newIds;
            });
          }
          break;

        case "DELETE":
          // Handle hard delete (rare case)
          setSupabaseChat((prev) =>
            prev.filter((msg) => msg._id !== oldRecord.id)
          );
          setAllMessageIds((prevIds) => {
            const newIds = new Set(prevIds);
            newIds.delete(oldRecord.id);
            return newIds;
          });
          break;
      }
    },
    [uid, receiverId, messageType]
  );

  // Update seen status
  const updateSeen = async () => {
    await supabase
      .from("messages")
      .update({ seen: 1 })
      .eq("sender_id", receiverId)
      .eq("receiver_id", uid)
      .eq("seen", 0)
      .eq("type", messageType);
  };

  // Clear chat
  const clearChat = async () => {
    await supabase
      .from("messages")
      .update({ clear_ids: uid })
      .or(buildPersonalChatQuery());

    // Clear local state
    setSupabaseChat([]);
    setAllMessageIds(new Set());
    setCurrentPage(1);
    setHasMoreMessages(false);

    showToast({ type: "success", text1: "Chat Cleared" });
  };

  // Delete message (soft delete)
  const deleteMessage = async (messageId: string) => {
    try {
      await supabase
        .from("messages")
        .update({ temp_del: 1 })
        .eq("id", messageId);

      // Optimistically remove from local state
      setSupabaseChat((prev) => prev.filter((msg) => msg._id !== messageId));
      setAllMessageIds((prevIds) => {
        const newIds = new Set(prevIds);
        newIds.delete(messageId);
        return newIds;
      });

      showToast({ type: "success", text1: "Message deleted" });
    } catch (error) {
      console.error("Error deleting message:", error);
      showToast({ type: "error", text1: "Failed to delete message" });
    }
  };

  // Insert new message
  const insertMessage = async ({
    message,
    attach = null,
    type = "text",
    reply = 0,
    notificationType,
  }: any) => {
    try {
      // Create optimistic message for immediate UI update
      const optimisticMessage: Message = {
        _id: `temp-${Date.now()}`,
        message,
        created_at: new Date().toISOString(),
        seen: 0,
        replyId: reply,
        attachment: attach,
        fileType: type,
        receiverId: receiverId,
        sender_id: uid,
        user: {
          _id: `temp-${Date.now()}-${uid}`,
          name: profileDetailResponse?.data?.full_name || "",
          username: profileDetailResponse?.data?.username || "",
          avatar: profileDetailResponse?.data?.profile_pic || "",
        },
      };

      // Add to local state immediately
      setSupabaseChat((prev) => [...prev, optimisticMessage]);
      setAllMessageIds(
        (prevIds) => new Set([...prevIds, optimisticMessage._id])
      );

      // Insert to database
      const { data, error } = await supabase
        .from("messages")
        .insert([
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
            sender_username: profileDetailResponse?.data?.username || "",
            temp_del: 0,
          },
        ])
        .select()
        .single();

      if (error) {
        // Remove optimistic message on error
        setSupabaseChat((prev) =>
          prev.filter((msg) => msg._id !== optimisticMessage._id)
        );
        setAllMessageIds((prevIds) => {
          const newIds = new Set(prevIds);
          newIds.delete(optimisticMessage._id);
          return newIds;
        });
        throw error;
      }

      // Replace optimistic message with real message
      if (data) {
        const realMessage = formatMessage(data);
        setSupabaseChat((prev) =>
          prev.map((msg) =>
            msg._id === optimisticMessage._id ? realMessage : msg
          )
        );
        setAllMessageIds((prevIds) => {
          const newIds = new Set(prevIds);
          newIds.delete(optimisticMessage._id);
          newIds.add(realMessage._id);
          return newIds;
        });
      }

      // Send push notification
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
        // Handle channel notifications
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
                            notify_title: profileDetailResponse?.data?.full_name || "",
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
      console.error("Error inserting message:", error);
      showToast({ type: "error", text1: "Failed to send message" });
    }
  };

  // Load more messages
  const onLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreMessages) {
      const nextPage = currentPage + 1;
      fetchMessagesWithPagination(nextPage);
    }
  }, [isLoadingMore, hasMoreMessages, currentPage]);

  // Set up real-time subscription
  useEffect(() => {
    if (!uid || !receiverId) return;

    // Clean up existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Create new subscription
    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        handleRealtimeUpdate
      )
      .subscribe();

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, []);

  // Reset state when conversation changes
  useEffect(() => {
    setSupabaseChat([]);
    setAllMessageIds(new Set());
    setCurrentPage(1);
    setHasMoreMessages(true);
    setIsInitialLoad(true);
  }, [uid, receiverId, messageType]);

  return {
    supabaseChat,
    fetchMessagesSupabase,
    fetchMessagesWithPagination,
    updateSeen,
    clearChat,
    deleteMessage,
    insertMessage,
    isLoadingMore,
    hasMoreMessages,
    isInitialLoad,
    onLoadMore,
  };
};

export default useMessageSupabaseViewModel;
