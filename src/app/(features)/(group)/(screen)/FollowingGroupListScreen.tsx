import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator, // Import ActivityIndicator
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

const FollowingGroupListScreen = () => {
  useScreenTracking("FollowingGroupListScreen");
  const { userId } = useAppStore();
  
  const { onFetchFollowingGroups, followingGroupList } =
    useGroupListViewModel();

  const [lastCount, setLastCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false); // New state for button loading
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedEndReached = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
        onFetchFollowingGroups({ userId: userId, loadMore: followingGroupList.length });
    setLastCount(followingGroupList.length);
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
    onFetchFollowingGroups({ userId: userId, loadMore: 0 });
  }, [userId]);

  const handleSeeAllClick = () => {
    setIsLoadingButton(true); // Set button loading state to true
    onFetchFollowingGroups({ userId: userId, loadMore: followingGroupList.length });
    setLastCount(followingGroupList.length);
    setTimeout(() => {
      setIsLoadingButton(false); // Set button loading state to false after fetching
    }, 1000); // Adjust loading duration as needed
  };

  const onEndReached = () => {
        };
  
        const ListFooterComponent = () => {
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

  return (
    <View
      style={{
        width: "95%",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* <ScrollView
        contentContainerStyle={{ paddingBottom: 70 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      > */}
        <FollowingGroupComponent data={followingGroupList} ListEmptyComponent={ListEmptyComponent} onEndReached={onEndReached} ListFooterComponent={ListFooterComponent} />
      {/* </ScrollView> */}
{followingGroupList.length > 4 && (
      <TouchableOpacity
        onPress={handleSeeAllClick}
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
          flexDirection: "row",
          paddingVertical: "2%",
          paddingHorizontal: "5%",
          borderRadius: 20,
          backgroundColor: globalColors.darkOrchidShade60,
        }}
      >
        {isLoadingButton ? (
          <ActivityIndicator color={globalColors.warmPink} />
        ) : (
          <>
          <Text style={{ fontFamily: fontFamilies.bold, fontSize: 18, color: "white", letterSpacing: 0.3 }}>
          See all
          </Text>
           
            <ArrowUpIcon style={{ marginLeft: 8, alignSelf: "center" }} />
          </>
        )}
      </TouchableOpacity>)}
    </View>
  );
};

export default FollowingGroupListScreen;
