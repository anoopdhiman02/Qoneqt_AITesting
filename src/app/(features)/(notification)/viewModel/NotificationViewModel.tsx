import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../utils/Hooks";
import { fetchNotifications } from "@/redux/reducer/notification/FetchNotificationsApi";
import { onDeleteNotification } from "@/redux/reducer/notification/DeleteNotification";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useAppStore } from "@/zustand/zustandStore";

const useNotificationViewModel = () => {
  const { userId } = useAppStore();
  const Dispatch = useAppDispatch();
  const MarkReadNotifcation: any = useAppSelector(
    (state) => state.markReadNotification
  );

  const deleteNotificationResponse: any = useAppSelector(
    (state) => state.deleteNotification
  );
  const [notifApiCalled, setNotifApiCalled] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [notificationList, setNotificationList] = useState([]);
  const [loadMore, setLoadMore] = useState(false);
  const [showOption, setShowOption] = useState(false);
  const [readNotiApiCalled, setReadNotiApiCalled] = useState(false);
  const [deleteNotiApiCalled, setDeleteNotiApiCalled] = useState(false);


  const onFecthNotification = async ({ type, lastCount }) => {
    try{
    setNotifApiCalled(true);
    if (lastCount > 0) {
      setLoadMore(true);
    } else {
      setNotificationList([]);
      setListLoading(true);
    }
    setListLoading(true);
   var notificationvalue = await Dispatch(
      fetchNotifications({
        lastCount: lastCount,
        userId: userId,
        type: type,
      })
    );
    setListLoading(false);
  }
  catch (err){
    setListLoading(false);
  }
    
  
  };


  useEffect(() => {
    if (readNotiApiCalled && MarkReadNotifcation?.data?.success) {
      setReadNotiApiCalled(false);
    } else if (readNotiApiCalled && !MarkReadNotifcation?.data?.success) {
      setReadNotiApiCalled(false);
    }
  }, [MarkReadNotifcation]);


  const onReachEndHandler = ({ type, lastCount }) => {
    setLoadMore(true);
    onFecthNotification({ type: type, lastCount: lastCount });
  };

  return {
    onFecthNotification,
    notificationList,
    listLoading,
    onReachEndHandler,
    loadMore,
    showOption,
  };
};

export default useNotificationViewModel;
