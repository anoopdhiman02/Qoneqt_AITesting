import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList
} from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { router } from "expo-router";
import { useAppStore } from "@/zustand/zustandStore";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import { trendingLiteGroupReq } from "@/redux/reducer/group/trendingGroup";
import { AllGroupReq } from "@/redux/reducer/group/AllGroups";
import { groupUnreadReq } from "@/redux/reducer/group/Groupunread";
import { fetchMyGroups } from "@/redux/reducer/group/FetchmyGroups";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import {
  setMyGroupsLoading,
  upgradeMyGroupUnReadCount,
} from "@/redux/slice/group/MyGroupsSlice";
import {
  setAllGroupsLoading,
  upgradeAllGroupUnReadCount,
} from "@/redux/slice/group/AllGroupSlice";
import FloatingButton from "@/components/FloatingButton/FloatingButton";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const RenderShimmer = React.memo(() => (
  <View>
    {Array.from({ length: 6 }).map((_, index) => (
      <View key={index} style={styles.shimmerItem}>
        <ShimmerPlaceholder
          style={styles.groupLogo}
          shimmerColors={shimmerColors}
        />
        <View style={styles.groupDetails}>
          <ShimmerPlaceholder
            style={styles.namePlaceholder}
            shimmerColors={shimmerColors}
          />
          <ShimmerPlaceholder
            style={styles.descPlaceholder}
            shimmerColors={shimmerColors}
          />
        </View>
        <ShimmerPlaceholder
          style={styles.unreadBadge}
          shimmerColors={shimmerColors}
        />
      </View>
    ))}
  </View>
));

const GroupItem = React.memo(
  ({ item, index, isTrending, hasUnread, postContent, onPress }: any) => {
    const loop = item;
    return (
      <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <ImageFallBackUser
            imageData={loop.loop_logo}
            fullName={loop.loop_name}
            widths={55}
            heights={55}
            isGroupList={true}
            borders={8}
          />
          <View style={styles.itemTextContainer}>
            <Text numberOfLines={1} style={styles.groupName}>
              {loop.loop_name}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.groupDesc}
            >
              {postContent ||
                "No posts yet 😱. Be the first to share something! 🧵"}
            </Text>
          </View>
        </View>
        {hasUnread && (
          <View style={styles.unreadContainer}>
            <Text style={styles.unreadText}>
              {item?.what_am_i.unread > 99 ? "99+" : item?.what_am_i?.unread}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

const GroupList = ({ isGroup }) => {
  useScreenTracking("GroupList");
  const { userId } = useAppStore();
  const dispatch = useAppDispatch();
  const AllGroupList = useAppSelector((state) => state.allGroupSlice);
  const myGroupsResponse = useAppSelector((state) => state.myGroupsListData);
  const trendingGroup = useAppSelector((state) => state.trendingLiteGroup);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (
          myGroupsResponse?.data?.length === 0 ||
          AllGroupList?.data?.length === 0 ||
          trendingGroup?.data?.length === 0
        ) {
          await Promise.all([
            dispatch(setAllGroupsLoading(true)),
            dispatch(fetchMyGroups({ userId, lastCount: 0 })),
            dispatch(
              AllGroupReq({ fromApp: 1, last_count: 0, user_id: userId })
            ),
            dispatch(trendingLiteGroupReq({ user_id: userId, fromApp: 1, last_count: 0 })),
          ]);
        }
      } catch (error) {
        console.error("Error fetching All group data:", error);
      }
    };
    if (userId) fetchAllData();
  }, [userId]);

  const loadGroups = async (isRefreshing = false) => {
    if (
      userId == undefined ||
      (isGroup === 1
        ? AllGroupList?.data == undefined || AllGroupList?.data?.length == 0 || AllGroupList.isLoaded
        : isGroup === 2
        ? myGroupsResponse?.data == undefined || myGroupsResponse?.data?.length == 0 || myGroupsResponse.isLoaded
        : true)
    ) {
      return;
    }

    if (isGroup === 1) {
      dispatch(setAllGroupsLoading(true));
      await dispatch(
        AllGroupReq({
          fromApp: 1,
          last_count: AllGroupList?.data?.length || 0,
          user_id: userId,
        })
      );
    } else if (isGroup === 2) {
      dispatch(setMyGroupsLoading(true));
      await dispatch(
        fetchMyGroups({
          userId,
          lastCount: myGroupsResponse?.data?.length || 0,
        })
      );
    }

    if (isRefreshing) {
      setRefreshing(false);
    }
    setLoadingMore(false);
  };
  const sortedData = useMemo(() => {
    const groupData =
      isGroup === 1
        ? AllGroupList?.data || []
        : isGroup === 2
        ? myGroupsResponse?.data || []
        : isGroup === 3
        ? trendingGroup?.data || []
        : [];

    const uniqueDataMap = new Map();
    for (const item of groupData) {
      const id = item?.id;
      if (!uniqueDataMap.has(id)) {
        uniqueDataMap.set(id, item);
      }
    }

    const uniqueData = Array.from(uniqueDataMap.values());
    return uniqueData;
  }, [AllGroupList, myGroupsResponse, trendingGroup, isGroup]);

  const upgradeUnReadCount = (item) => {
    var oldData =
      isGroup === 1
        ? AllGroupList?.data || []
        : isGroup === 2
        ? myGroupsResponse?.data || []
        : [];

    const updatedData = oldData.map((oldItem) => {
      if (oldItem.id === item.id) {
        return {
          ...oldItem,
          unread: 0,
        };
      }
      return oldItem;
    });
    if (isGroup === 1) {
      dispatch(upgradeAllGroupUnReadCount(updatedData));
    }
    if (isGroup === 2) {
      dispatch(
        upgradeMyGroupUnReadCount(updatedData)
      );
    }
  };

  const onGroupPress = (item: any, index: number, hasUnread: boolean) => {
    if (hasUnread) {
      dispatch(
        groupUnreadReq({
          fromApp: 1,
          group_id: item.id,
          user_id: userId,
        })
      );
      upgradeUnReadCount(item);
    }

    router.push({
      pathname: "/GroupToggle",
      params: {
        id: item?.id,
        logo: item?.loop_logo,
        memberCount: item?.members_count,
        name: item?.loop_name,
        key: index,
      },
    });
  };

  const renderItem = useCallback(
    ({ item, index }) => {
      const isTrending = isGroup === 3;
      const postContent = isTrending
        ? item.last_post?.post_content
        : item.last_post?.[0]?.post_content;
      const hasUnread = item?.what_am_i?.unread !== 0 && !isTrending;

      return (
        <GroupItem
          item={item}
          index={index}
          isTrending={isTrending}
          hasUnread={hasUnread}
          postContent={postContent}
          onPress={() => {
            onGroupPress(item, index, hasUnread);
          }}
        />
      );
    },
    [dispatch, isGroup, userId, sortedData]
  );
  const loadingComponent = () => {
    return (
      <View style={styles.shimmerContainer}>
        <RenderShimmer />
      </View>
    );
  };

  const emptyText = () => {
    return <Text style={styles.emptyText}>No Groups Available</Text>;
  };
  const renderEmptyComponent = useCallback(() => {
    if (isGroup === 1) {
      if (AllGroupList?.data?.length == 0) {
        return AllGroupList?.isLoaded ? loadingComponent() : emptyText();
      } else if (AllGroupList?.isLoaded) {
        return <ActivityIndicator size="large" color="white" />;
      }
    } else if (isGroup === 2) {
      console.log("myGroupsResponse", myGroupsResponse?.data == undefined || myGroupsResponse?.data?.length == 0);
      if (myGroupsResponse?.data == undefined || myGroupsResponse?.data?.length == 0) {
        return myGroupsResponse?.isLoaded ? loadingComponent() : emptyText();
      } else if (!myGroupsResponse?.isLoaded) {
        return <ActivityIndicator size="large" color="white" />;
      }
    } else if (isGroup === 3) {
      if (trendingGroup?.data?.length == 0) {
        return trendingGroup?.isLoaded ? loadingComponent() : emptyText();
      } else if (!trendingGroup?.isLoaded) {
        return <ActivityIndicator size="large" color="white" />;
      }
    }
  }, [isGroup, AllGroupList, myGroupsResponse, trendingGroup]);

  const handleLoadMore = () => {
    loadGroups();
  };

  const handleRefresh = useCallback(async() => {
    setRefreshing(true);
    if(isGroup === 1){
      await dispatch(fetchMyGroups({ userId, lastCount: 0 }));
      setRefreshing(false);
    }
    else if(isGroup === 2){
      await dispatch(fetchMyGroups({ userId, lastCount: 0 }));
      setRefreshing(false);
    }
    else if(isGroup === 3){
      await dispatch(
        AllGroupReq({ fromApp: 1, last_count: 0, user_id: userId })
      );
      setRefreshing(false);
    }
    
    
  },[refreshing]);

  const renderFooter = () => {
    return loadingMore ? (
      <ActivityIndicator
        size="small"
        color="white"
        style={{ marginVertical: 20 }}
      />
    ) : null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        // bounces={false}
        data={sortedData}
        keyExtractor={(item, index) => `${item?.id}-${index}`}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
      />

      <View style={{ justifyContent: "flex-end" }}>
        <FloatingButton
          onPress={() => {
            router.push("/CreateGroupScreen");
          }}
          size={45}
          bgColor="white"
          imageSource={undefined}
        />
      </View>
    </View>
  );
};

export default GroupList;

const shimmerColors = [
  globalColors.neutral3,
  globalColors.neutral5,
  globalColors.neutral4,
];

const styles = StyleSheet.create({
  container: { flex: 1, margin: "2%" },
  shimmerContainer: { paddingVertical: 10, alignItems: "center" },
  emptyText: {
    fontSize: 16,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    textAlign: "center",
    marginTop: 20,
  },
  shimmerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: "3%",
    width: "100%",
    justifyContent: "space-between",
    borderRadius: 8,
    borderColor: globalColors.neutral3,
    borderBottomWidth: 1,
  },
  groupLogo: { height: 60, width: 60, borderRadius: 5 },
  groupDetails: { flex: 1, marginLeft: 12 },
  namePlaceholder: {
    width: "60%",
    height: 16,
    borderRadius: 5,
    marginBottom: 6,
  },
  descPlaceholder: { width: "80%", height: 12, borderRadius: 5 },
  unreadBadge: { height: 25, width: 30, borderRadius: 100 },
  itemContainer: {
    borderRadius: 8,
    borderColor: globalColors.neutral3,
    borderBottomWidth: 0.3,
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    width: "100%",
    justifyContent: "space-between",
  },
  itemContent: { flexDirection: "row", width: "80%", flex: 0.7 },
  itemTextContainer: { marginLeft: 12 },
  groupName: {
    fontSize: 16,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white["100"],
    marginRight: 2,
  },
  groupDesc: {
    fontSize: 13,
    fontFamily: fontFamilies.extraLight,
    color: globalColors.neutral_white["200"],
  },
  unreadContainer: {
    height: 40,
    width: 40,
    backgroundColor: globalColors.warmPinkShade20,
    borderRadius: 100,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  unreadText: {
    fontSize: 15,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    textAlign: "center",
  },
});
