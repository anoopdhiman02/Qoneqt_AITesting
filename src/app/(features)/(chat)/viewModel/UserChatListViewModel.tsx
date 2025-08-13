import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../utils/Hooks";
import { onFetchMessageListApi } from "../../../../redux/reducer/chat/FetchMessageList";
import { onFetchMessageUserListApi } from "@/redux/reducer/chat/FetchMessageUserList";
import { onFetchMessageRedisListApi } from "../../../../redux/reducer/chat/FetchMessageRedis";
import { useAppStore } from "@/zustand/zustandStore";

import { createClient } from "@supabase/supabase-js";

interface Props {
  supabaseChat: any[];
}

const supabase2 = createClient(
  "https://rbmtdkhfovbjvaryupov.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibXRka2hmb3ZianZhcnl1cG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NDAwMTY3NCwiZXhwIjoxOTc5NTc3Njc0fQ._6LuzYDJEBtx0gs5ftUdhYP_smVrgw0kZAJyfIC6UHs"
);

const useUserChatListViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();

  const fetchMessageList = useAppSelector((state) => state.fetchMessageList);
  const fetchMessageRedisList = useAppSelector(
    (state) => state.fetchMessageRedisList
  );

  const messageUserListResponse = useAppSelector(
    (state) => state.messageUserList
  );

  //fetch user chat
  const [listLoading, setListLoading] = useState(false);
  const [listApiCalled, setListApiCalled] = useState(false);
  const [listRedisLoading, setListRedisLoading] = useState(false);
  const [listRedisApiCalled, setListRedisApiCalled] = useState(false);
  const [messagesRedisList, setMessagesRedisList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);

  //fetch user chat
  const [userLoading, setUserLoading] = useState(false);
  const [userApiCalled, setUserApiCalled] = useState(false);
  const [userList, setUserList] = useState([]);

  //serch user message

  const onFectMessageRedisHandler = () => {
    Dispatch(onFetchMessageRedisListApi({ userId: userId }));
    setListRedisApiCalled(true);
    setListRedisLoading(true);
  };
  useEffect(() => {
    if (listRedisApiCalled && fetchMessageRedisList?.success) {
      setMessagesRedisList(fetchMessageRedisList?.data || []);
      setListRedisLoading(false);
      setListRedisApiCalled(false);
    } else if (listRedisApiCalled && !fetchMessageRedisList?.data?.success) {
      setListRedisLoading(false);
      setListRedisApiCalled(false);
    }
  }, [fetchMessageRedisList]);

  const onFectMessageListHandler = () => {
    Dispatch(onFetchMessageListApi({ userId: userId }));
    setListApiCalled(true);
    setListLoading(true);
  };
  useEffect(() => {
    if (listApiCalled && fetchMessageList?.success) {
      setMessagesList(fetchMessageList?.data || []);
      setListLoading(false);
      setListApiCalled(false);
    } else if (listApiCalled && !fetchMessageList?.data?.success) {
      setListLoading(false);
      setListApiCalled(false);
    }
  }, [fetchMessageList]);

  ///fetch user lits
  const onFetchUserListHandler = () => {
    setUserApiCalled(true);
    Dispatch(onFetchMessageUserListApi({ userId: userId }));
    setUserLoading(true);
  };
  useEffect(() => {
    if (userApiCalled && messageUserListResponse?.success) {
      setUserList(messageUserListResponse?.data || []);
      setUserLoading(false);
      setUserApiCalled(false);
    } else if (userApiCalled && !messageUserListResponse?.data?.success) {
      setUserLoading(false);
      setUserApiCalled(false);
    }
  }, [messageUserListResponse]);

  // Set up real-time subscription for changes in the messages table
  // const messagesSubscription = supabase2
  //   .channel("public:messages")
  //   .on(
  //     "postgres_changes",
  //     { event: "*", schema: "public", table: "messages" },
  //     (payload) => {
  //       switch (payload.eventType) {
  //         case "INSERT":
  //           onFectMessageListHandler();
  //           break;
  //         case "UPDATE":
  //           onFectMessageListHandler();
  //           break;
  //         case "DELETE":
  //           onFectMessageListHandler();
  //           break;
  //         default:
  //           break;
  //       }
  //     }
  //   )
  //   .subscribe();


  return {
    onFectMessageRedisHandler,
    onFectMessageListHandler,
    messagesList,
    listLoading,
    listRedisLoading,
    onFetchUserListHandler,
    userLoading,
    userList,
    messageUserListResponse,
    messagesRedisList,
  };
};

export default useUserChatListViewModel;
