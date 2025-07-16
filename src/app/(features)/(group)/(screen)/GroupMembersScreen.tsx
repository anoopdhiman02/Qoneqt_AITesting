import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import Button1 from "../../../../components/buttons/Button1";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { FlashIcon, VerifiedIcon, DeleteAccountIcon } from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import useGroupMembersViewModel from "@/structure/viewModels/group/GroupMembersViewModel";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { onFetchGroupMembers } from "@/redux/reducer/group/GroupMembers";
import { useDispatch } from "react-redux";
import { useAppStore } from "@/zustand/zustandStore";
import { useAppSelector } from "@/utils/Hooks";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const GroupMembersScreen = () => {
  useScreenTracking("GroupMembersScreen");
  const [type, setType] = useState(0);
  const { groupId } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const dispatch = useDispatch();
  const { userId } = useAppStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const groupMembersData = useAppSelector((state) => state.groupMembersData);



  useEffect(() => {
    const fetchData = async () => {
      dispatch(
        //@ts-ignore
        onFetchGroupMembers({
          groupId: groupId,
          userId: userId,
          lastCount: 0,
          type: 0,
          search: "",
        })
      );
      timeoutRef.current = setTimeout(() => {
        dispatch(
          //@ts-ignore
          onFetchGroupMembers({
            groupId: groupId,
            userId: userId,
            lastCount: 0,
            type: 1,
            search: "",
          })
        );
      }, 1000);
    };
    fetchData();
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);


  const loadMoreData = () => {

      if (type == 0 && groupMembersData?.allMembersList?.length < groupMembersData?.allMembersCount && groupMembersData?.allMembersList?.length > 0) {
        dispatch(
          //@ts-ignore
          onFetchGroupMembers({
            groupId: groupId,
            userId: userId,
            lastCount: groupMembersData?.allMembersList?.length,
            type: 0,
            search: "",
          })
        );
      } else if (type == 1 && groupMembersData?.authMembersList?.length < groupMembersData?.authMembersCount && groupMembersData?.authMembersList?.length > 0) {
        dispatch(
          //@ts-ignore
          onFetchGroupMembers({
            groupId: groupId,
            userId: userId,
            lastCount: groupMembersData?.authMembersList?.length,
            type: 1,
            search: "",
          })
        );
      }
  };

  const renderMember = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        const userProfileId = item?.details?.id;
        if (userProfileId === groupId) {
          router.push({
            pathname: "/ProfileScreen",
            params: { profileId: userProfileId },
          });
        } else {
          router.push({
            pathname: "/profile/[id]",
            params: {
              id: userProfileId,
              isProfile: "true",
              isNotification: "false",
            },
          });
        }
      }}
    >
      <View
        style={{
          borderRadius: 8,
          borderWidth: 1,
          borderColor: globalColors.neutral4,
          padding: 16,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
          <ImageFallBackUser
            imageData={item?.details?.profile_pic}
            fullName={item?.details?.full_name}
            widths={38}
            heights={38}
            borders={20}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 14,
                  letterSpacing: -0.1,
                  lineHeight: 20,
                  fontFamily: "Nunito-SemiBold",
                  color: globalColors.neutralWhite,
                  marginRight: 4,
                }}
              >
                {item?.details?.full_name}
              </Text>
              {item?.details?.kyc_status === 1 && <VerifiedIcon />}
            </View>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: "Nunito-Regular",
                color: globalColors.neutralWhite,
              }}
            >
              @
              {item?.details?.social_name ||
                item?.details?.username}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <FlashIcon />
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: "Nunito-Regular",
                  color: globalColors.neutralWhite,
                }}
              >
                {item?.perks} perks
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ViewWrapper>
      <View style={{ flex: 1, width: "90%", paddingBottom: 16 }}>
        <GoBackNavigation header="Users" isDeepLink={true} />

        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setType(0);
              setSelectedTab(0);
            }}
            style={{
              flex: 1,
              paddingVertical: 8,
              backgroundColor:
                selectedTab === 0
                  ? globalColors.warmPinkShade40
                  : globalColors.darkOrchidShade60,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Nunito-Regular",
                color: globalColors.neutralWhite,
              }}
            >
              All members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelectedTab(1);
              setType(1);
            }}
            style={{
              flex: 1,
              paddingVertical: 8,
              backgroundColor:
                selectedTab === 1
                  ? globalColors.warmPinkShade40
                  : globalColors.darkOrchidShade60,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "Nunito-Regular",
                color: globalColors.neutralWhite,
              }}
            >
              Authorised members
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontSize: 20,
            fontFamily: "Nunito-Regular",
            color: globalColors.neutralWhite,
            marginBottom: 16,
          }}
        >
          {selectedTab === 0 ? groupMembersData?.allMembersCount || 0 : groupMembersData?.authMembersCount || 0} Members
        </Text>

        <FlatList
          data={selectedTab === 0 ? groupMembersData?.allMembersList || [] : groupMembersData?.authMembersList || []}
          renderItem={renderMember}
          keyExtractor={(item) => item?.details?.id.toString()}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5} // Load more data when the user is near the bottom
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={<Text style={{ fontSize: 16, fontFamily: "Nunito-Regular", color: globalColors.neutralWhite }}>No members found</Text>}
        />
      </View>

      {/* BottomSheet components for actions */}
      {/* Place your BottomSheet components here */}
    </ViewWrapper>
  );
};

export default GroupMembersScreen;
