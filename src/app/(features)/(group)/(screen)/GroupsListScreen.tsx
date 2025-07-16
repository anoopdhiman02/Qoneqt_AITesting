import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useGroupListViewModel from "../viewModel/GroupListViewModel";
import MyGroupComponent from "../component/MyGroupComponent";
import FollowingGroupComponent from "../component/FollowingGroupComponent";
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  CloseIcon,
  MicrophoneIcon,
  SearchIcon,
} from "@/assets/DarkIcon";
import { useAppStore } from "@/zustand/zustandStore";
import GradientText from "@/components/element/GradientText";
import { router } from "expo-router";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const GroupsListScreen = () => {
  useScreenTracking("GroupsListScreen");
  const { userId } = useAppStore();
  const {
    tab,
    onPressTabHandler,
    
    onFetchMyGroups,
    onFetchFollowingGroups,
    myGroupList,
    followingGroupList,
  } = useGroupListViewModel();

  const TabData = [
    { id: 0, label: "My groups" },
    { id: 1, label: "Following groups" },
  ];

  const [lastCount, setLastCount] = useState(0);
  const [lastCount2, setLastCount2] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedEndReached = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setLastCount((prev) => prev + 5);
    timeoutRef.current = setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
        // onFetchHomeHandler();
        if (tab === 0) {
          onFetchMyGroups({ userId: userId, loadMore: lastCount });
        } else {
          onFetchFollowingGroups({ userId: userId, loadMore: lastCount });
        }
        setTimeout(() => setIsLoading(false), 1000);
      }
    }, 300);
  }, [isLoading]);

  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const paddingToBottom = 20;
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      ) {
        debouncedEndReached();
      }
    },
    [debouncedEndReached]
  );

  useEffect(() => {
    if (tab === 0) {
      onFetchMyGroups({ userId: userId, loadMore: 0 });
    } else {
      onFetchFollowingGroups({ userId: userId, loadMore: 0 });
    }
  }, [tab]);

  const TabBars = ({ selectTab, onPressTab }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: "5%",
        marginBottom: "5%",
      }}
    >
      {TabData.map((data, index) => (
        <TouchableOpacity
          key={data.id}
          onPress={() => onPressTab(data.id)}
          style={{
            flex: 1,
            paddingVertical: 7,
            marginLeft: index === 0 ? 8 : 0,
            marginRight: index === TabData.length - 1 ? 8 : 0,
            backgroundColor:
              selectTab === data.id
                ? globalColors.darkOrchidTint40
                : globalColors.darkOrchidShade60,
            shadowColor: globalColors.warmPinkShade40,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 4,
            justifyContent: "center",
            alignItems: "center",
            borderTopLeftRadius: index === 0 ? 8 : 0,
            borderBottomLeftRadius: index === 0 ? 8 : 0,
            borderTopRightRadius: index === TabData.length - 1 ? 8 : 0,
            borderBottomRightRadius: index === TabData.length - 1 ? 8 : 0,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
            }}
          >
            {data.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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

  const ListFooterComponent = () => {
    return null;
  };

  const onEndReached = () => {
  
  }

  return (
    <ViewWrapper>
      <GoBackNavigation header="Groups" isDeepLink={true}/>
      <View
        style={{
          flex: 1,
          width: "95%",
          paddingBottom: "5%",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <TabBars onPressTab={onPressTabHandler} selectTab={tab} />

        <ScrollView
          contentContainerStyle={{ paddingBottom: 10 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {tab === 0 ? (
            <MyGroupComponent data={myGroupList} ListEmptyComponent={ListEmptyComponent} ListFooterComponent={ListFooterComponent} />
          ) : (
            <FollowingGroupComponent data={followingGroupList} ListEmptyComponent={ListEmptyComponent} ListFooterComponent={ListFooterComponent} onEndReached={onEndReached} />
          )}
        </ScrollView>

        <TouchableOpacity
          onPress={() => {
            if (tab === 0) {
              setLastCount(myGroupList.length);
              onFetchMyGroups({ userId: userId, loadMore: myGroupList.length });
            } else {
              setLastCount2(followingGroupList.length);
              onFetchFollowingGroups({ userId: userId, loadMore: followingGroupList.length });
            }
          }}
          style={{
            marginBottom: "5%",
            alignSelf: "center",
            flexDirection: "row",
          }}
        >
          <GradientText
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 18,
              color: globalColors.darkOrchidShade20,
              letterSpacing: 0.3,
              marginTop: "10%",
            }}
          >
            See all
          </GradientText>
          <ArrowUpIcon style={{ top: "1%" }} />
        </TouchableOpacity>
      </View>
    </ViewWrapper>
  );
};

export default GroupsListScreen;
