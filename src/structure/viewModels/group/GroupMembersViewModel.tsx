import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";
import { onFetchGroupMembers } from "../../../redux/reducer/group/GroupMembers";
import { useAppStore } from "@/zustand/zustandStore";

const useGroupMembersViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  
  const groupMembersData: any = useAppSelector((state) => state.groupMembersData);

  const [listApiCalled, setListApiCalled] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [totalMember, setTotalMember] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    if (groupMembersData?.success) {
      const newMembers = groupMembersData?.data?.members || [];
      const newTotal = groupMembersData?.data?.member_count || 0;
      const allMembers = [...membersList, ...newMembers];

      setMembersList(allMembers);
      setTotalMember(newTotal);
      setHasMoreData(allMembers.length < newTotal);
      setListLoading(false);
    } else if (listApiCalled && !groupMembersData?.success) {
      setListLoading(false);
      setListApiCalled(false);
    }
  }, [groupMembersData]);

  const fetchMembers = async ({ groupId, lastCount }) => {
    try {
      setListLoading(true);
      await onFetchMembersHandler({ id: groupId, lastCount, type: 1 });
    } catch (error) {
      console.error('Error fetching members:', error);
      setListLoading(false);
    }
  };

  const onFetchMembersHandler = ({ id, type, lastCount }) => {
    Dispatch(
      onFetchGroupMembers({
        groupId: id,
        userId: userId,
        lastCount: lastCount,
        type: type,
        search: "",
      })
    );
    setListApiCalled(true);
  };

  return {
    onFetchMembersHandler,
    listLoading,
    membersList,
    totalMember,
    hasMoreData,
    setMembersList,
    fetchMembers
  };
};

export default useGroupMembersViewModel;