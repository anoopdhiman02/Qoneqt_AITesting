import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, useRef, useCallback } from "react";
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
  senderId: any;
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
  const formatMessage = (msg: any): GroupMessage => ({
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
  });

  const fetchMediaSupabase = async () => {
    const { data, error } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", groupId)
      .eq("subgroup_id", subgroupId)
      .eq("type", "image")
      .eq("temp_del", "0")
      .eq("post_id", 0)
      .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`)
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

  // Initial fetch with pagination (same pattern as UserChatScreen)
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

      const { data, error, count } = await supabase
        .from("group_messages")
        .select("*", { count: "exact" })
        .eq("group_id", groupId)
        .eq("subgroup_id", subgroupId)
        .eq("temp_del", "0")
        .or(`clear_ids.is.null,clear_ids.not.ilike.%${uid}%`)
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      const messages = data?.map(formatMessage) || [];

      if (page === 1 || resetData) {
        // Reset data for first page or explicit reset
        setSupabaseGroupChat(messages.reverse());
        setAllMessageIds(new Set(messages.map((m) => m._id)));
        setCurrentPage(1);
      } else {
        // Append to existing messages for pagination
        setSupabaseGroupChat((prev) => {
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
  const fetchInitialMessages = async () => {
    await fetchMessagesWithPagination(1, PAGE_SIZE, true);
  };

  // Handle real-time updates (same pattern as UserChatScreen)
  const handleRealtimeUpdate = useCallback(
    (payload: any) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      console.log("eventType: ", eventType);
      console.log("newRecord.group_id: ", newRecord.group_id);
      console.log("group_id: ", groupId);
      console.log("newRecord.subgroup_id: ", newRecord.subgroup_id);
      console.log("subgroup_id: ", subgroupId);

      switch (eventType) {
        case "INSERT":
          // Check if this message belongs to current conversation
          const belongsToConversation =
            newRecord.group_id == groupId &&
            newRecord.subgroup_id == subgroupId;

          if (belongsToConversation && newRecord.temp_del == "0") {
            const newMessage = formatMessage(newRecord);
            setSupabaseGroupChat((prev) => {
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
          setSupabaseGroupChat((prev) => {
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
          setSupabaseGroupChat((prev) =>
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
    [groupId, subgroupId, uid]
  );

  const updateSeen = async () => {
    await supabase
      .from("group_messages")
      .update({ seen: uid })
      .eq("group_id", groupId)
      .eq("subgroup_id", subgroupId)
      .eq("seen", 0);
  };

  const clearChat = async () => {
    await supabase
      .from("group_messages")
      .update({ clear_ids: uid })
      .eq("group_id", groupId)
      .eq("subgroup_id", subgroupId);

    // Clear local state
    setSupabaseGroupChat([]);
    setAllMessageIds(new Set());
    setCurrentPage(1);
    setHasMoreMessages(false);

    showToast({ type: "success", text1: "Chat Cleared" });
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await supabase
        .from("group_messages")
        .update({ temp_del: "1" })
        .eq("id", messageId);

      // Optimistically remove from local state
      setSupabaseGroupChat((prev) =>
        prev.filter((msg) => msg._id !== messageId)
      );
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

  const insertMessage = async ({
    message,
    attach = null,
    type = "text",
    reply = 0,
    notificationType,
  }: any) => {
    try {
      // Create optimistic message for immediate UI update
      const optimisticMessage: GroupMessage = {
        _id: `temp-${Date.now()}`,
        message,
        created_at: new Date().toISOString(),
        seen: null,
        replyId: reply,
        attachment: attach,
        fileType: type,
        groupId: groupId,
        subgroupId: subgroupId,
        senderId: uid,
        postId: 0,
        user: {
          _id: `temp-${Date.now()}-${uid}`,
          name: profileDetailResponse?.data?.full_name || "",
          username: profileDetailResponse?.data?.username || "",
          avatar: profileDetailResponse?.data?.profile_pic || "",
        },
      };

      // Add to local state immediately
      setSupabaseGroupChat((prev) => [...prev, optimisticMessage]);
      setAllMessageIds(
        (prevIds) => new Set([...prevIds, optimisticMessage._id])
      );

      // Insert to database
      const { data, error } = await supabase
        .from("group_messages")
        .insert([
          {
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
            temp_del: "0",
          },
        ])
        .select()
        .single();

      if (error) {
        // Remove optimistic message on error
        setSupabaseGroupChat((prev) =>
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
        setSupabaseGroupChat((prev) =>
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

      // Send push notification logic here if needed
    } catch (error) {
      console.error("Error inserting message:", error);
      showToast({ type: "error", text1: "Failed to send message" });
    }
  };

  // Load more messages (same pattern as UserChatScreen)
  const onLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMoreMessages) {
      const nextPage = currentPage + 1;
      fetchMessagesWithPagination(nextPage);
    }
  }, [isLoadingMore, hasMoreMessages, currentPage]);

  // Set up real-time subscription
  useEffect(() => {
    if (!uid || !groupId) return;

    // Clean up existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    // Create new subscription
    const subscription = supabase
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

    subscriptionRef.current = subscription;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [handleRealtimeUpdate]);

  // Reset state when conversation changes
  useEffect(() => {
    setSupabaseGroupChat([]);
    setAllMessageIds(new Set());
    setCurrentPage(1);
    fetchMediaSupabase();
    setHasMoreMessages(true);
    setIsInitialLoad(true);
  }, [uid, groupId, subgroupId]);

  return {
    supabaseGroupChat,
    supabaseGroupMedia,
    fetchInitialMessages,
    fetchMessagesWithPagination,
    fetchMediaSupabase,
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

export default useGroupMessageSupabaseViewModel;
