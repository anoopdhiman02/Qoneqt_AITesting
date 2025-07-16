import { ActivityIndicator, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import CustomTopTabBar from "@/components/CustomTopTabBar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore } from "@/zustand/zustandStore";
import { useIsFocused } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { fetchMyGroups } from "@/redux/reducer/group/FetchmyGroups";
import { fetchFollowingGroups } from "@/redux/reducer/group/FetchFollowingGroups";
import { globalColors } from "@/assets/GlobalColors";
import MyGroupComponent from "../(features)/(group)/component/MyGroupComponent";
import FollowingGroupComponent from "../(features)/(group)/component/FollowingGroupComponent";
import { setMyGroupsLoading } from "@/redux/slice/group/MyGroupsSlice";
import { setFollowingGroupsLoading } from "@/redux/slice/group/FollowingGroupSlice";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { router } from "expo-router";
import { useScreenTracking } from "@/customHooks/useAnalytics";
const tabData = ["My groups", "Following groups"];

const AllGroupListScreen = () => {
  useScreenTracking("AllGroupListScreen");
  const [Selectedtab, setSelectedTab] = useState(0);
  const insets = useSafeAreaInsets();
  const { userId } = useAppStore();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const myGroupsResponse = useAppSelector((state) => state.myGroupsListData);
  const followingGroupsResponse = useAppSelector(
    (state) => state.followingGroupsResponse
  );

  useEffect(() => {
    console.log("isFocused All Group");
    fetchAllData();
  }, [userId, isFocused]);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        dispatch(
          fetchMyGroups({
            userId: userId,
            lastCount: 0,
          })
        ),
        dispatch(
          fetchFollowingGroups({
            userId: userId,
            lastCount: 0,
          })
        ),
      ]);
    } catch (error) {
      console.error("Error fetching All data:", error);
    }
  };

  const handleScroll = useCallback(() => {
    console.log("handleScroll");
    if (!myGroupsResponse.isLoaded && myGroupsResponse?.data?.length > 0) {
      dispatch(setMyGroupsLoading(true));
      dispatch(
        fetchMyGroups({
          userId: userId,
          lastCount: myGroupsResponse?.data?.length || 0,
        })
      );
    }
  }, [myGroupsResponse.isLoaded]);

  const ListEmptyComponent = () => {
    return (
      <View>
        <Text
          style={{
            color: globalColors.neutral7,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          No Group Created{" "}
        </Text>
      </View>
    );
  };

  const onEndReached = useCallback(() => {
    console.log("onEndReached");
    if (
      !followingGroupsResponse.isLoaded &&
      followingGroupsResponse?.data?.length > 0
    ) {
      dispatch(setFollowingGroupsLoading(true));
      dispatch(
        fetchFollowingGroups({
          userId: userId,
          lastCount: followingGroupsResponse?.data?.length || 0,
        })
      );
    }
  }, [followingGroupsResponse.isLoaded]);

  const ListFooterComponent = useCallback(() => {
    const shouldShowLoader =
      (Selectedtab === 1 && followingGroupsResponse.isLoaded) ||
      (Selectedtab === 0 && myGroupsResponse.isLoaded);
    if (!shouldShowLoader) return <View style={{ height: 200 }} />;

    return (
      <View style={{ paddingVertical: 16 }}>
        <ActivityIndicator size="large" color={globalColors.neutralWhite} />
      </View>
    );
  }, [
    Selectedtab,
    myGroupsResponse.isLoaded,
    followingGroupsResponse.isLoaded,
  ]);

  const handlePress = () => {
    router.push("/CreateGroupScreen");
  };

  return (
    <ViewWrapper>
      <View
        style={{
          paddingTop: insets.top / 2,
          width: "100%",
          paddingHorizontal: 10,
          flex: 1,
        }}
      >
        <CustomTopTabBar
          selectedTab={Selectedtab}
          setSelectedTab={setSelectedTab}
          tabData={tabData}
        />
        {Selectedtab === 0 ? (
          <MyGroupComponent
            data={myGroupsResponse?.data || []}
            onScroll={handleScroll}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={ListFooterComponent}
          />
        ) : (
          <FollowingGroupComponent
            data={followingGroupsResponse?.data || []}
            ListEmptyComponent={ListEmptyComponent}
            onEndReached={onEndReached}
            ListFooterComponent={ListFooterComponent}
          />
        )}
        <View style={{ position: "absolute", right: 10, bottom: 10 }}>
          <FloatingButton
            onPress={handlePress}
            size={45}
            bgColor="white"
            imageSource={undefined}
          />
        </View>
      </View>
    </ViewWrapper>
  );
};

export default AllGroupListScreen;
