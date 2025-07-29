import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useGroupListViewModel from "../viewModel/GroupListViewModel";
import MyGroupComponent from "../component/MyGroupComponent";
import { ArrowUpIcon } from "@/assets/DarkIcon";
import { useAppStore } from "@/zustand/zustandStore";
import GradientText from "@/components/element/GradientText";
import { useIsFocused } from "@react-navigation/native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const MyGroupListScreen = () => {
  useScreenTracking("MyGroupListScreen");
  const { userId } = useAppStore();
  const { onFetchMyGroups, myGroupList } = useGroupListViewModel();
  const [lastCount, setLastCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFocused = useIsFocused();

  const debouncedEndReached = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isLoading) {
        setIsLoading(true);
        onFetchMyGroups({ userId: userId, loadMore: Number(lastCount) + 5 });
        setLastCount((prev) => prev + 5);
        setTimeout(() => setIsLoading(false), 1000);
      }
    }, 500);
  }, [isLoading]);

  const handleScroll = useCallback(() => {
    debouncedEndReached();
  }, [debouncedEndReached]);

  useEffect(() => {
    onFetchMyGroups({ userId: userId, loadMore: 0 });
  }, [userId, isFocused]);

  const handleSeeAllClick = () => {
    setIsLoadingButton(true);
    onFetchMyGroups({ userId: userId, loadMore: Number(lastCount) + 5 });
    setLastCount((prev) => prev + 5);
    setTimeout(() => {
      setIsLoadingButton(false);
    }, 1000);
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

  const ListFooterComponent = () => {
    return null;
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
      <MyGroupComponent
        data={myGroupList}
        onScroll={handleScroll}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
      />
      {myGroupList.length > 4 && (
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
              <Text
                style={{
                  fontFamily: fontFamilies.bold,
                  fontSize: 18,
                  color: "white",
                  letterSpacing: 0.3,
                }}
              >
                See all
              </Text>
              <ArrowUpIcon style={{ marginLeft: 8, alignSelf: "center" }} />
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MyGroupListScreen;
