import React, { useRef, useCallback, useState, useEffect } from "react";
import { Image } from "expo-image";
import {
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  RefreshControl,
  BackHandler,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import ViewWrapper from "../../../../../components/ViewWrapper";
import BottomSheetWrap from "../../../../../components/bottomSheet/BottomSheetWrap";
import { ClearChatIcon, PaperPlaneIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useGroupsDetailViewModel from "../../viewModel/GroupsDetailViewModel";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useAppStore } from "@/zustand/zustandStore";
import { useChannelStore } from "@/zustand/channelStore";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { MuteGrouprequest } from "@/redux/reducer/group/MuteGroup";
import { useIsFocused } from "@react-navigation/native";
import { setPrefsValue } from "@/utils/storage";
import Clipboard from "@react-native-clipboard/clipboard";
import MuteUnmuteComponent from "../../component/MuteUnmuteComponent";
import DeleteGroupComponent from "../../component/DeleteGroupComponent";
import MuteNotificationComponent from "../../component/MuteNotificationComponent";
import OptionComponent from "../../component/OptionComponent";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import LinkView from "../LinkView";
import GroupHeaderComponent, {
  GroupHeaderShimmer,
} from "../GroupHeaderComponent";
import ExitModalView from "../ExitModalView";
import GroupHeader from "./GroupHeader";
import { useScreenTracking } from "@/customHooks/useAnalytics";
const { width, height } = Dimensions.get("window");
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideInUp,
} from "react-native-reanimated";
import { FlatList } from "react-native-gesture-handler";
import { formatMemberCount } from "@/utils/ImageHelper";
import GroupAboutComponent from "./AboutComponent";
import GroupSubgroupComponent from "./SubgroupComponent";
import FloatingActionButton from "../FloatingBotton";

const groups = () => {
  const { groupId } = useLocalSearchParams();
  useScreenTracking("Group/" + groupId);
  const { setPostId, setPostedByUserId } = usePostDetailStore();
  const { setGroupId } = useChannelStore();
  const { userId } = useAppStore();
  const isFocused = useIsFocused();
  const { userGroupRole, refreshGroup } = useChannelStore();

  // State management
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [mute, setMute] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [select, setSelect] = useState(0);

  // Redux state
  const groupDetailsData = useAppSelector((state) => state.groupDetailsData);
  const searchSubGroups = useAppSelector((state) => state.getSubGroupListData);
  const Dispatch = useAppDispatch();

  // Custom hooks
  const {
    onGetGroupDetailsHandler,
    groupDetails,
    subgroupDetails,
    onFetchSubGroupsHandler,
    subgroupApiCalled,
    feedLoading,
    joinGroupHandler,
    isJoin,
    showExitModal,
    onPressExitGroup,
    onExitOptionHandler,
    onCancelExitGroup,
  } = useGroupsDetailViewModel();

  // Refs
  const OptionRef = useRef(null);
  const muteNotifiRef = useRef(null);
  const ShareGroupRef = useRef(null);
  const DeleteGrpRef = useRef(null);
  const MuteUnmuteRef = useRef(null);

  // Animation values
  const headerOpacity = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef("down");
  const [profileImagePosition, setProfileImagePosition] = useState({
    y: 0,
    height: 0,
  });

  // Data loading effect
  useEffect(() => {
    const fetchData = async () => {
      if (groupId != groupDetailsData?.data?.id) {
        setIsLoading(true);
        await onGetGroupDetailsHandler(groupId);
      }
    };
    fetchData();
const backHandler = BackHandler.addEventListener(
              "hardwareBackPress",
              () => {
                if (router.canGoBack()) {
                  router.back();
                }
                else{
                  router.replace("/DashboardScreen");
                }
                return true;
              }
            );
    return () => {
      setPrefsValue("notificationInfo", "");
      const videoRef = useVideoPlayerStore.getState().videoRef;
      const isVideoPlaying = useVideoPlayerStore.getState().isPlay;
      if (videoRef && isVideoPlaying) {
        videoRef.pauseAsync();
      }
      backHandler.remove();
    };
  }, []);

  // Loading state management
  useEffect(() => {
    if (isLoading && groupDetails) {
      setIsLoading(false);
    }
  }, [groupDetails]);

  // Deep link handling
  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      const referCode = url.split("groups/");
      if (referCode[1]) {
        onGetGroupDetailsHandler(referCode[1]);
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    const initialUrl = Linking.getInitialURL();
    initialUrl.then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => subscription.remove();
  }, []);

  // Group ID setup
  useEffect(() => {
    if (groupId) {
      setGroupId(groupId?.toString());
    }
  }, []);

  // Mute state management
  useEffect(() => {
    try {
      if (isFocused && groupDetailsData?.data?.what_am_i) {
        const data = groupDetailsData.data.what_am_i;
        if (data && data?.mute !== undefined) {
          setMute(data?.mute || data[0]?.mute || null);
        }
      }
    } catch (err) {
      console.error("Error in mute useEffect:", err);
    }
  }, [isFocused, groupDetailsData?.data]);

  // Animation trigger for subgroups
  useEffect(() => {
    if (selectedMenu === 0 && searchSubGroups?.data) {
      setAnimationKey((prev) => prev + 1);
    }
  }, [selectedMenu, searchSubGroups?.data]);

  // Enhanced scroll handler with better animation
  const handleScroll = useCallback(
    ({ nativeEvent }) => {
      const { contentOffset } = nativeEvent;
      const currentScrollY = contentOffset.y;

      // Track scroll direction
      if (currentScrollY > lastScrollY.current) {
        scrollDirection.current = "down";
      } else {
        scrollDirection.current = "up";
      }
      lastScrollY.current = currentScrollY;

      scrollY.value = currentScrollY;

      const profileImageBottomPosition =
        profileImagePosition.y + profileImagePosition.height - currentScrollY;

      const minThreshold = 15;
      const fadeZone = 60;

      if (currentScrollY <= minThreshold) {
        headerOpacity.value = withSpring(0, {
          damping: 18,
          stiffness: 250,
          mass: 0.7,
        });
      } else if (profileImageBottomPosition < minThreshold) {
        const progress = Math.min(
          (currentScrollY - minThreshold) / fadeZone,
          1
        );

        if (scrollDirection.current === "down") {
          headerOpacity.value = withSpring(progress, {
            damping: 12,
            stiffness: 180,
            mass: 0.5,
          });
        } else {
          headerOpacity.value = withTiming(progress, {
            duration: 200,
          });
        }
      } else {
        headerOpacity.value = withSpring(0, {
          damping: 20,
          stiffness: 300,
          mass: 0.8,
        });
      }
    },
    [profileImagePosition]
  );

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onGetGroupDetailsHandler(groupId);
      if (selectedMenu === 0) {
        await onFetchSubGroupsHandler(groupId);
      }
    } finally {
      setRefreshing(false);
    }
  }, [groupId, selectedMenu]);

  // Handlers
  const handleSharePress = useCallback(() => {
    ShareGroupRef.current?.expand();
  }, []);

  const HandleThreeOption = useCallback(() => {
    OptionRef.current?.expand();
  }, []);

  const onShare = async (slug) => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/groups/${slug}`,
        url: `https://qoneqt.com/groups/${slug}`,
        title: "Share group",
      });
    } catch (error) {
      console.error(error?.message);
    }
  };

  const copyToClipboard = (slug) => {
    const profileUrl = `https://qoneqt.com/groups/${slug}`;
    Clipboard.setString(profileUrl);
    showToast({ type: "success", text1: "Link copied to clipboard!" });
  };

  const SubmitMuteRequest = (mute, muteUntill) => {
    setMute(mute);
    Dispatch(
      MuteGrouprequest({
        user_id: userId,
        group_id: groupDetailsData?.data.id,
        mute_status: mute,
        mute_untill: muteUntill,
      })
    );
    onGetGroupDetailsHandler(groupDetailsData?.data.id);
  };

  const handleMuteToggle = async () => {
    if (mute === 1) {
      SubmitMuteRequest(0, select);
      OptionRef.current.close();
    } else {
      muteNotifiRef.current.expand();
    }
  };

  const handlePressProfile = (id) => {
    if (id === userId) {
      router.push({
        pathname: "/ProfileScreen",
        params: { profileId: id },
      });
    } else {
      router.push({
        pathname: "/profile/[id]",
        params: {
          id: id,
          isProfile: "true",
          isNotification: "false",
        },
      });
    }
  };

  const handleSubgroupPress = (subgroup) => {
    if (subgroup === "general") {
      router.push({
        pathname: "../subgroup/SubgroupViewGeneral",
        params: {
          groupId: groupDetailsData?.data?.id,
          groupName: groupDetailsData?.data?.loop_name,
          groupImage: groupDetailsData?.data?.loop_logo,
          memberCount: formatMemberCount(groupDetailsData?.data?.member_count),
          whatAmI: groupDetailsData?.data?.what_am_i?.id,
        },
      });
    } else {
      router.push({
        pathname: "../subgroup/SubgroupViewOthers",
        params: {
          subgroupId: subgroup.id,
          groupId: groupDetailsData?.data?.id,
          groupName: groupDetailsData?.data?.loop_name,
          groupImage: groupDetailsData?.data?.loop_logo,
          memberCount: formatMemberCount(groupDetailsData?.data?.member_count),
          subgroupName: subgroup.channel_name,
          subgroupMemberCount: formatMemberCount(subgroup.member_count),
          subgroupImage: subgroup.channel_image || "",
          whatAmI: groupDetailsData?.data?.what_am_i?.id,
        },
      });
    }
  };

  // Animation states
  const shouldShowShimmer =
    isLoading ||
    groupDetailsData.isLoaded ||
    groupDetailsData?.data?.id != groupId;

  const opacity = useSharedValue(shouldShowShimmer ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(shouldShowShimmer ? 1 : 0, { duration: 500 });
  }, [shouldShowShimmer]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const inverseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - opacity.value,
  }));

  const options = [
    { label: "8 hours", value: "8_hours" },
    { label: "1 week", value: "1_week" },
    { label: "Always", value: "always" },
  ];

  return (
    <ViewWrapper>
      {/* Header */}
      <GroupHeader
        handleSharePress={handleSharePress}
        HandleThreeOption={HandleThreeOption}
        groupDetailsData={groupDetailsData?.data}
        headerOpacity={headerOpacity}
        scrollY={scrollY}
      />

      {/* Main Content */}
      <ScrollView
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={globalColors.warmPinkShade40}
            colors={[globalColors.warmPinkShade40]}
          />
        }
      >
        {/* Shimmer Loading */}
        <Animated.View
          style={[animatedStyle, { position: "absolute", width: "100%" }]}
        >
          <GroupHeaderShimmer />
          <View style={styles.shimmerTabContainer}>
            <View style={styles.shimmerTab} />
            <View style={styles.shimmerTab} />
            <View style={styles.shimmerTab} />
          </View>
        </Animated.View>

        {/* Content */}
        <Animated.View style={inverseAnimatedStyle}>
          <Animated.View entering={FadeIn.duration(600)}>
            <GroupHeaderComponent
              groupId={groupDetailsData?.data?.id || ""}
              groupDesc={groupDetailsData?.data?.loop_description || ""}
              groupName={groupDetailsData?.data?.loop_name || ""}
              groupType={groupDetailsData?.data?.loop_cat || ""}
              icon={groupDetailsData?.data?.loop_logo || ""}
              channelCount={groupDetailsData?.data?.channel_count || 0}
              userCount={groupDetailsData?.data?.member_count || 0}
              category={groupDetailsData?.data?.category?.category_name || ""}
              isJoin={groupDetailsData?.data?.what_am_i?.id}
              onPressJoin={({ groupId, isJoin }) =>
                joinGroupHandler({ groupId: groupId, isJoin: isJoin })
              }
              setShowReadMore={setShowReadMore}
              setIsExpanded={setIsExpanded}
              showReadMore={showReadMore}
              isExpanded={isExpanded}
              onProfileImageLayout={""}
            />
          </Animated.View>

          {/* Tab Navigation */}
          <Animated.View
            entering={SlideInUp.delay(300).duration(500)}
            style={styles.tabContainer}
          >
            <TouchableOpacity
              onPress={() => setSelectedMenu(0)}
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    selectedMenu === 0
                      ? globalColors.warmPinkShade40
                      : globalColors.darkOrchidShade60,
                },
              ]}
            >
              <Text style={styles.tabText}>Subgroups</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedMenu(1)}
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    selectedMenu === 1
                      ? globalColors.warmPinkShade40
                      : globalColors.darkOrchidShade60,
                },
              ]}
            >
              <Text style={styles.tabText}>About</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Tab Content */}
          <Animated.View entering={FadeIn.delay(500).duration(600)}>
            {selectedMenu === 0 ? (
              <GroupSubgroupComponent
                key={animationKey}
                group={groupDetailsData?.data}
                subgroup={searchSubGroups?.data || []}
                isLoading={subgroupApiCalled}
                onSubgroupPress={handleSubgroupPress}
                showGeneral={true}
              />
            ) : (
              <GroupAboutComponent
                group={groupDetailsData?.data}
                setShowReadMore={setShowReadMore}
                setIsExpanded={setIsExpanded}
                showReadMore={showReadMore}
                isExpanded={isExpanded}
                copyToClipboard={copyToClipboard}
                handlePressProfile={() =>
                  handlePressProfile(groupDetailsData?.data?.created_by?.id)
                }
              />
            )}
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {groupDetailsData && groupDetailsData?.data?.what_am_i?.id != 0 && (
        <Animated.View
          entering={SlideInDown.delay(800).duration(500)}
          style={styles.joinButtonContainer2}
        >
          <FloatingActionButton
            onPress={() => {
              router.push({
                pathname: "/CreatePostScreen",
                params: {
                  groupId: groupDetailsData?.data?.id,
                  groupName: groupDetailsData?.data?.loop_name,
                },
              });
              // router.push("/CreatePostScreen");
            }}
            icon="add"
            backgroundColor={globalColors?.slateBlueTint20}
          />
        </Animated.View>
      )}
      {/* Join Button */}
      {groupDetailsData && groupDetailsData?.data?.what_am_i?.id == 0 && (
        <Animated.View
          entering={SlideInDown.delay(800).duration(500)}
          style={styles.joinButtonContainer}
        >
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() =>
              joinGroupHandler({
                groupId: groupDetailsData?.data?.id,
                isJoin: isJoin,
              })
            }
          >
            <LinearGradient
              colors={["#5434E4", "#8954F6"]}
              style={styles.joinButtonGradient}
            >
              <Text style={styles.joinButtonText}>Join Community</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Exit Group Modal */}
      <Modal animationType="fade" transparent={true} visible={showExitModal}>
        <ExitModalView
          onCancelExitGroup={onCancelExitGroup}
          onPress={() => onExitOptionHandler({ groupId: groupId, isJoin: 0 })}
        />
      </Modal>

      {/* Bottom Sheets */}
      <BottomSheetWrap
        snapPoints={["20%", "30%"]}
        bottomSheetRef={ShareGroupRef}
      >
        <View style={styles.shareSheetContainer}>
          <View style={styles.shareSheetHeader}>
            <Text style={styles.shareSheetTitle}>Share group info</Text>
          </View>
          <LinkView
            groupDetails={groupDetailsData?.data}
            copyToClipboard={copyToClipboard}
          />
        </View>
      </BottomSheetWrap>

      <BottomSheetWrap snapPoints={["20%", "60%"]} bottomSheetRef={OptionRef}>
        <OptionComponent
          isClaim={groupDetailsData?.data.user_id == 2 && userId != 2}
          mute={mute}
          onClaimPress={() => {
            router.push({
              pathname: "/ClaimGroupScreen",
              params: { groupid: groupDetailsData?.data?.id || "" },
            });
            OptionRef.current.close();
          }}
          onExitPress={() => {
            onPressExitGroup();
            OptionRef.current.close();
          }}
          onReportPress={() => {
            router.push("/ReportGroupScreen");
            OptionRef.current.close();
          }}
          handleMuteToggle={handleMuteToggle}
        />
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "65%"]}
        bottomSheetRef={muteNotifiRef}
      >
        <MuteNotificationComponent
          select={select}
          setSelect={setSelect}
          onCancelPress={() => muteNotifiRef.current.close()}
          onMutePress={() => {
            SubmitMuteRequest(1, select);
            muteNotifiRef.current.close();
            OptionRef.current.close();
            onGetGroupDetailsHandler(groupId);
          }}
        />
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={DeleteGrpRef}
      >
        <DeleteGroupComponent
          onCancelPress={() => DeleteGrpRef.current.close()}
          onDeletePress={() => DeleteGrpRef.current.close()}
        />
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={MuteUnmuteRef}
      >
        <MuteUnmuteComponent
          options={options}
          onCancelPress={() => MuteUnmuteRef.current.close()}
          onMutePress={() => {
            SubmitMuteRequest(1, select);
            MuteUnmuteRef.current.close();
          }}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </BottomSheetWrap>
    </ViewWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    width: "100%",
    paddingHorizontal: "2%",
  },
  shimmerTabContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  shimmerTab: {
    backgroundColor: "rgba(116, 84, 244, 0.2)",
    borderRadius: 4,
    width: 80,
    height: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 14,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    minWidth: 80,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutralWhite,
  },
  shareSheetContainer: {
    alignItems: "center",
  },
  shareSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  shareSheetTitle: {
    color: globalColors.neutralWhite,
    fontSize: 20,
    textAlign: "center",
    fontFamily: fontFamilies.semiBold,
  },
  joinButtonContainer: {
    padding: 16,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(116, 84, 244, 0.1)",
  },
  joinButtonContainer2: {
    padding: 16,
    width: "100%",
  },
  joinButton: {
    borderRadius: 24,
    overflow: "hidden",
  },
  joinButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 24,
  },
  joinButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
  },
});

export default groups;
