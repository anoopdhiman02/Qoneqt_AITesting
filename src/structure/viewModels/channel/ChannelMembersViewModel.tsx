import { View, Text } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";
import { GetUserTokenStorage } from "../../../utils/localDb/localStorage";
import { useNavigation } from "@react-navigation/native";
import GlobalContext from "../../../contexts/GlobalContext";
import { onFetchChannelMembers } from "../../../redux/reducer/channel/ChannelMembers";
import { onChannelRoleUpdate } from "../../../redux/reducer/channel/ChannelMembersRoleUpdate";
import { router } from "expo-router";
const ChannelMembersViewModel = () => {
  const Dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { userId } = useContext(GlobalContext);
  const channelMembersData = useAppSelector(
    (state) => state.channelMembersData
  );
  const ChannelMembersRoleUpdate = useAppSelector(
    (state) => state.channelMemberRoleUpdate
  );
  const [listApiCalled, setListApiCalled] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [membersList, setMembersList] = useState([]);
  const [isVisible, setIsvisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [myRole, setMyRole] = useState({});
  const [roleUpdateApiCalled, setRoleUpdateApiCalled] = useState(false);

  useEffect(() => {
    if (listApiCalled && channelMembersData?.data?.success) {
      setMembersList(channelMembersData?.data?.members);

      let userRole = channelMembersData?.data?.members.filter(
        (item) => item.user_id == userId
      );

      setMyRole(userRole[0]);
      setListApiCalled(false);
      setListLoading(false);
    } else if (listApiCalled && !channelMembersData?.data?.success) {
      setListApiCalled(false);
      setListLoading(false);
    }
  }, [channelMembersData]);

  const onFetchMembersHandler = (id) => {
    GetUserTokenStorage().then((token) => {
      Dispatch(onFetchChannelMembers({ token: token, channelId: id }));
      setListApiCalled(true);
      setListLoading(true);
    });
  };

  const onPressProfile = (id) => {
    if (userId == id) {
      router.push("/ProfileScreen");
    } else {
      router.push({
                    pathname: "/profile/[id]",
                    params: { id: id, isProfile: "true", isNotification: "false" },
                  });
    }
  };

  const updateChannelMemberRole = (role, channelId, user_id) => {
    GetUserTokenStorage().then((token) => {
      Dispatch(
        onChannelRoleUpdate({
          token: token,
          user_id: user_id,
          channel_id: channelId,
          role: role,
        })
      );
      setRoleUpdateApiCalled(true);
    });
  };

  const openActionMenu = (data) => {
    setIsvisible(true);
    setSelectedMember(data?.user_id);
  };
  const closeActionMenu = () => {
    setIsvisible(false);
  };

  const updateUserRole = ({
    index,
    channelId,
    user_id,
  }: {
    index: any;
    channelId: any;
    user_id: any;
  }) => {
    switch (index) {
      case 1:
        updateChannelMemberRole("1", channelId, user_id);

        setIsvisible(false);
        break;
      case 2:
        updateChannelMemberRole("2", channelId, user_id);

        setIsvisible(false);
        break;
      case 3:
        updateChannelMemberRole("0", channelId, user_id);

        setIsvisible(false);
        break;
    }
  };
  return {
    onFetchMembersHandler,
    listLoading,
    membersList,
    onPressProfile,
    openActionMenu,
    closeActionMenu,
    isVisible,
    selectedMember,
    updateUserRole,
    myRole,
  };
};

export default ChannelMembersViewModel;
