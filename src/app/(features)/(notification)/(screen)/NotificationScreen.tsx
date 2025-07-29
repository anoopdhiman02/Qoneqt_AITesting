import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  ActivityIndicator,
  Dimensions,
  Alert,
  BackHandler,
} from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useNotificationViewModel from "../viewModel/NotificationViewModel";
import { useCallback, useEffect, useMemo, useState, memo } from "react";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { ArrowLeftBigIcon, DeleteIcon, OptionsIcon } from "@/assets/DarkIcon";
import { router } from 'expo-router';
import moment from "moment";
import { useAppStore } from "@/zustand/zustandStore";
import { Image } from "expo-image";
import { useAppSelector } from "@/utils/Hooks";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { useDispatch } from "react-redux";
import {
  onDeleteAllNotification,
  onDeleteNotification,
} from "@/redux/reducer/notification/DeleteNotification";
import {
  clearData,
  updateNotificationData,
} from "@/redux/slice/notification/FetchNotificationSlice";
import SwipeableNotificationItem from "../component/SwipeableNotificationItem";
import ViewWrapper from "@/components/ViewWrapper";
import { useIsFocused } from '@react-navigation/native';

const { height } = Dimensions.get("screen");

const RenderShimmer = () => (
  <View>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item, index) => (
      <View
        key={index.toString()}
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <View
          style={{
            width: "100%",
            height: 50,
            borderRadius: 3,
            backgroundColor: globalColors.neutral8,
          }}
        />
      </View>
    ))}
  </View>
);


const NotificationScreen = () => {
  useScreenTracking("NotificationScreen");
  const { userId } = useAppStore();
  const { onFecthNotification, listLoading } = useNotificationViewModel();
  const [selectedTab, setSelectedTab] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [allNotificationData, setAllNotificationData] = useState([]);
  const [postNotificationData, setPostNotificationData] = useState([]);
  const [groupNotificationData, setGroupNotificationData] = useState([]);
  const notificationsData: any = useAppSelector(
    (state) => state.fetchNotificationsData
  );
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  useEffect(() => {
    if (notificationsData?.type === 0 && notificationsData?.allData) {
      setAllNotificationData(notificationsData.allData);
    } else if (notificationsData?.type === 1 && notificationsData?.postData) {
      setPostNotificationData(notificationsData.postData);
    } else if (notificationsData?.type === 2 && notificationsData?.groupData) {
      setGroupNotificationData(notificationsData.groupData);
    }
  }, [notificationsData]);

  useEffect(() => {
    const timeouts = [];
    const fetchWithDelay = (type, delay) => {
      const timeoutId = setTimeout(() => {
        onFecthNotification({ type, lastCount: 0 });
      }, delay);
      timeouts.push(timeoutId);
    };

    fetchWithDelay(0, 0);
    fetchWithDelay(1, 500);
    fetchWithDelay(2, 1500);

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/DashboardScreen");
        }
        return true;
      }
    );

    return () => {
      backHandler.remove();
      timeouts.forEach(clearTimeout);
    };
  }, [isFocused]);
  const onSelectTabHandler = (id) => {
    setSelectedTab(id);
  };

  const handleOnOption = (id) => {
    setModalVisible(false);
    handleDeleteAllNotifications();
  };

  const handleDeleteAllNotifications = () => {
    Alert.alert(
      "Delete All Notifications",
      "Are you sure you want to delete all notifications?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeAllNotifications();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const removeAllNotifications = () => {
    //@ts-ignore
    dispatch(onDeleteAllNotification({ userId }));
    dispatch(clearData());
    setAllNotificationData([]);
  setPostNotificationData([]);
  setGroupNotificationData([]);
  };

  const TabData = [
    { id: 0, label: "All" },
    { id: 1, label: "My posts" },
    { id: 2, label: "Groups" },
    // { id: 4, label: "Groups" },
  ];

  const TabBars = ({ selectTab, onPressTab }) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ marginVertical: "7%" }}
    >
      <View style={{ flexDirection: "row", paddingHorizontal: 8 }}>
        {TabData.map((data) => (
          <TouchableOpacity
            key={data.id}
            onPress={() => onPressTab(data.id)}
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor:
                selectTab === data.id
                  ? globalColors.darkOrchidShade60
                  : globalColors.darkOrchidShade80,
              marginHorizontal: 4,
              left: "-10%",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                lineHeight: 40,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                // bottom: "12%",
              }}
            >
              {data.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const onNotificationPress = (remoteMessage) => {
    let screen = remoteMessage?.notify_type;
    switch (screen) {
      case "comment":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.redirect_id || "2",
            commentId: remoteMessage?.comment_id || "2",
          },
        });
        break;
      case "cmt_user_tag":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.redirect_id || "2",
            commentId: remoteMessage?.comment_id || "2",
          },
        });
        break;
      case "reply_user_tag":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.redirect_id || "2",
            commentId: remoteMessage?.comment_id || "2",
          },
        });
        break;
      case "tipping":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.redirect_id || "111",
          },
        });
        break;
      case "reply":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.redirect_id || "111",
            commentId: remoteMessage?.comment_id || "111",
          },
        });
        break;
      case "like":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.redirect_id || "2",
          },
        });
        break;
      case "loop_join":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug:
              remoteMessage?.loop_id || remoteMessage?.redirect_id || "india",
          },
        });
        break;
      case "personal_chat":
        router.push({
          pathname: "/UserChatScreen",
          params: {
            id: remoteMessage?.redirect_id || "2",
            from: 1,
          },
        });
        break;

      case "user_view":
        router.push({
          pathname: "/profile/[id]",
          params: {
            id: remoteMessage?.redirect_id || "2",
            isProfile: "true",
          },
        });
        break;

      case "kyc_verify_redirect":
        router.push({
          pathname: "/KycLoadingScreen",
        });
        break;

      case "post":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.redirect_id,
          },
        });
        break;

      case "group":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug: remoteMessage?.loop_id || remoteMessage?.redirect_id,
          },
        });
        break;
      case "profile":
        router.push({
          pathname: "/profile/[id]",
          params: {
            id: remoteMessage?.profile_id || remoteMessage?.redirect_id || "2",
            isProfile: "true",
          },
        });
        break;
      case "user chat":
        router.push({
          pathname: "/UserChatScreen",
          params: {
            id:
              remoteMessage?.profile_id ||
              remoteMessage?.user_id ||
              remoteMessage?.redirect_id ||
              "2",
            from: 1,
          },
        });
        break;

      case "user channel":
        router.push({
          pathname: "/UserChatScreen",
          params: {
            id:
              remoteMessage?.profile_id ||
              remoteMessage?.user_id ||
              remoteMessage?.redirect_id ||
              "225",
            from: 1,
          },
        });
        break;
      case "channel info":
        router.replace("/DashboardScreen");
        break;
      case "channel chat":
        router.replace("/DashboardScreen");
        break;

      case "loop_join":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug:
              remoteMessage?.loop_id || remoteMessage?.redirect_id || "india",
          },
        });
        break;
      case "loop_add":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug:
              remoteMessage?.loop_id || remoteMessage?.redirect_id || "india",
          },
        });
        break;
      case "loop_request":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug:
              remoteMessage?.loop_id || remoteMessage?.redirect_id || "india",
          },
        });
        break;
      case "kyc_verified":
        router.replace("/DashboardScreen");
        break; // Handle as needed
      case "accept_request":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug:
              remoteMessage?.loop_id || remoteMessage?.redirect_id || "india",
          },
        });
        break;
      case "admin_notification":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.post_id || remoteMessage?.redirect_id || "2",
          },
        });
        break;
      case "signup_bonus":
        router.replace("/DashboardScreen");
        break; // Handle as needed
      case "post_tips":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.post_id || remoteMessage?.redirect_id || "2",
          },
        });
        break; // Handle as needed
      case "user_tagging":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.post_id || remoteMessage?.redirect_id || "2",
          },
        });
        break;
      case "profile_follow":
        router.push({
          pathname: "/profile/[id]",
          params: {
            id:
              remoteMessage?.profile_id ||
              remoteMessage?.post_id ||
              remoteMessage?.redirect_id ||
              "2",
            isProfile: "true",
          },
        });
        break;
      case "topup":
        router.push("/transaction");
        break; // Handle as needed
      case "post_report":
        router.replace("/DashboardScreen");
        break; // Handle as needed
      case "chn_role_change":
        router.push({
          pathname: "/channel/[id]",
          params: {
            id:
              remoteMessage?.channel_id ||
              remoteMessage?.post_id ||
              remoteMessage?.redirect_id ||
              "",
            isDeepLink: "false",
          },
        });
        break;
      case "kyc_declined":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug:
              remoteMessage?.loop_id || remoteMessage?.redirect_id || "india",
          },
        });
        break;
      case "group_join_request":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug:
              remoteMessage?.loop_id ||
              remoteMessage?.group_slug ||
              remoteMessage?.redirect_id ||
              "india",
          },
        });
        break;
      case "group_join":
        router.push({
          pathname: "/groups/[slug]",
          params: {
            slug:
              remoteMessage?.group_slug ||
              remoteMessage?.redirect_id ||
              "india",
          },
        });
        break;
      case "message":
        router.push({
          pathname: "/UserChatScreen",
          params: {
            id: remoteMessage?.profile_id || remoteMessage?.redirect_id || "2",
            from: 1,
          },
        });
        break;
      case "withdrawal":
        router.push("/transaction");
        break;
      case "kyc_approved":
        if (remoteMessage?.profile_id) {
          router.push({
            pathname: "/profile/[id]",
            params: {
              id:
                remoteMessage?.profile_id || remoteMessage?.redirect_id || "2",
              isProfile: "true",
            },
          });
        } else {
          router.replace("/DashboardScreen");
        }
        break;
      case "referral_amount":
        router.push({
          pathname: "/ProfileScreen",
        });
        break;
      case "gifting":
        router.push({
          pathname: "/post/[id]",
          params: {
            id: remoteMessage?.post_id || remoteMessage?.redirect_id || "111",
          },
        });
        break;
      case "channel_chat":
        router.push({
          pathname: "/ChannelChatScreen",
          params: {
            id: remoteMessage?.channel_id || remoteMessage?.redirect_id || "2",
            from: 2,
          },
        });
        break;
      case "refer_user":
        router.push({
          pathname: "/refer-and-earn",
        });
        break;
      default:
        router.replace("/DashboardScreen");
        break;
    }
  };

  const deleteNotificationData = (id: number) => {
    try {
      
      // Get current data from Redux store or fallback to local state
      const getCurrentData = (reduxData, localData) => {
        return (reduxData && reduxData.length > 0) ? reduxData : localData;
      };
      
      const currentAllData = getCurrentData(notificationsData?.allData, allNotificationData);
      const currentPostData = getCurrentData(notificationsData?.postData, postNotificationData);
      const currentGroupData = getCurrentData(notificationsData?.groupData, groupNotificationData);
      
      // Check if the notification exists before trying to delete
      const notificationExists = currentAllData?.some(item => item.id == id) ||
                                currentPostData?.some(item => item.id == id) ||
                                currentGroupData?.some(item => item.id == id);
      
      if (!notificationExists) {
        console.warn("Notification with id", id, "not found");
        return;
      }
      
      // Filter out the notification with the given id
      const newData = {
        allData: currentAllData?.filter((item) => item.id !== id) || [],
        postData: currentPostData?.filter((item) => item.id !== id) || [],
        groupData: currentGroupData?.filter((item) => item.id !== id) || [],
      };
      
      // Dispatch delete action to backend
      //@ts-ignore
      dispatch(onDeleteNotification({ userId, notificationId: id }));
      
      // Update Redux store with filtered data
      dispatch(
        updateNotificationData({
          allData: newData.allData,
          postData: newData.postData,
          groupData: newData.groupData,
        })
      );
      
      // Update local state to keep them in sync
      setAllNotificationData(newData.allData);
      setPostNotificationData(newData.postData);
      setGroupNotificationData(newData.groupData);
      
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };
  const renderItem = ({ index, item }) => {
    console.log("Deleting notification with id:", notificationsData?.allData.length);
    if (item.type === "date_header") {
      return (
        <View>
          <Text
            style={{
              fontSize: 20,
              lineHeight: 26,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
              marginTop: "3%",
            }}
          >
            {item.dateGroup}
          </Text>
        </View>
      );
    }
    return (
      <SwipeableNotificationItem
        key={`notification-${item.id || index}`}
        onDelete={() => {
          
          deleteNotificationData(item.id);
        }}
        itemId={item.id}
        // disabled={disabled}
      >
        <View key={index}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginTop: "5%",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: "column", alignItems: "flex-start" }}
              onPress={() => {
                item?.sender?.id === userId
                  ? router.push({
                      pathname: "/ProfileScreen",
                      params: { profileId: item?.sender?.id },
                    })
                  : router.push({
                      pathname: "/profile/[id]",
                      params: {
                        id: item?.sender?.id,
                        isProfile: "true",
                        isNotification: "false",
                      },
                    });
              }}
            >
              {item.sender?.profile_pic && (
                <Image
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 40,
                  }}
                  //@ts-ignore
                  contentFit="cover"
                  source={{
                    uri: ImageUrlConcated(item.sender?.profile_pic),
                  }}
                />
              ) ? (
                item.sender?.profile_pic && (
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 40,
                    }}
                    contentFit="cover"
                    source={{
                      uri: ImageUrlConcated(item.sender?.profile_pic),
                    }}
                  />
                )
              ) : (
                <Image
                  style={{ borderRadius: 40, width: 40, height: 34 }}
                  contentFit="cover"
                  source={require("@/assets/image/EmptyProfileIcon.webp")}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onNotificationPress(item);
              }}
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: 12,
              }}
            >
              <Text
                style={{
                  alignSelf: "stretch",
                  fontSize: 14,
                  letterSpacing: -0.1,
                  lineHeight: 20,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                {`${item.sender?.full_name} ${item.label}`}
              </Text>
              {item?.notification_content && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    letterSpacing: -0.1,
                    lineHeight: 20,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutral9,
                    marginTop: "1%",
                  }}
                >
                  {item.notification_content}
                </Text>
              )}
              <Text
                style={{
                  fontSize: 12,
                  letterSpacing: -0.1,
                  lineHeight: 20,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                  marginTop: 2,
                }}
              >
                {moment
                  .utc(item.created_at)
                  .utcOffset("+05:30")
                  .format("D/M/Y, h:mm A")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SwipeableNotificationItem>
    );
  };

  const HeaderItem = () => {
    return (
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          width: "100%",
          marginTop: "2%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity style={{ top: "1%" }} onPress={() => router.back()}>
          <ArrowLeftBigIcon />
        </TouchableOpacity>
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontSize: 22.5,
            marginTop: "2%",
            marginRight: "30%",
          }}
        >
          Notifications
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <OptionsIcon style={{ width: 50, height: 50, top: 5 }} />
        </TouchableOpacity>
      </View>
    );
  };
  const ListEmptyComponent = () => {
    if (listLoading) {
      return <RenderShimmer />;
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              color: globalColors.neutralWhite,
              fontFamily: fontFamilies.semiBold,
            }}
          >
            No Notifications
          </Text>
        </View>
      );
    }
  };

  const updateNotificationList = () => {
    if (!listLoading) {
      switch (selectedTab) {
        case 0:
          onFecthNotification({
            type: selectedTab,
            lastCount: (notificationsData?.allData || [])?.length,
          });
          break;
        case 1:
          onFecthNotification({
            type: selectedTab,
            lastCount: (notificationsData?.postData || [])?.length,
          });
          break;
        case 2:
          onFecthNotification({
            type: selectedTab,
            lastCount: (notificationsData?.groupData || [])?.length,
          });
          break;

        default:
          break;
      }
    }
  };

  const getDateGroup = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return "Today";
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year:
          date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Create flat list data with date headers
  const flatListData = useMemo(() => {
    // Get the appropriate data based on selected tab
    const getNotificationData = () => {
      switch (selectedTab) {
        case 0:
          return notificationsData?.allData?.length > 0 
            ? notificationsData.allData 
            : allNotificationData;
        case 1:
          return notificationsData?.postData?.length > 0 
            ? notificationsData.postData 
            : postNotificationData;
        case 2:
          return notificationsData?.groupData?.length > 0 
            ? notificationsData.groupData 
            : groupNotificationData;
        default:
          return [];
      }
    };
  
    const notifyData = getNotificationData() || [];
    
    // Sort notifications by date (newest first)
    const sortedNotifications = [...notifyData].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  
    const result = [];
    let currentDateGroup = null;
  
    sortedNotifications.forEach((notification) => {
      const dateGroup = getDateGroup(notification.created_at);
  
      // Add date header if it's a new date group
      if (dateGroup !== currentDateGroup) {
        result.push({
          type: "date_header",
          id: `header_${dateGroup}`,
          dateGroup: dateGroup,
        });
        currentDateGroup = dateGroup;
      }
  
      // Add notification
      result.push({
        type: "notification",
        ...notification,
      });
    });
  
    return result;
  }, [notificationsData, selectedTab, allNotificationData, postNotificationData, groupNotificationData]);

  return (
    <ViewWrapper>
      <View style={{ width: "90%", marginBottom: "20%" }}>
        <HeaderItem />
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              marginTop: "18%",
              alignItems: "center",
              backgroundColor: "rgba(128, 128, 128, 0.2)",
            }}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View
              style={{
                width: "50%",
                backgroundColor: globalColors.darkOrchidShade60,
                borderRadius: 10,
                left: "18%",
              }}
            >
              <TouchableOpacity
                onPress={handleOnOption}
                style={{
                  marginTop: "5%",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutralWhite,
                    textAlign: "center",
                  }}
                >
                  Mark all as read
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  left: "10%",
                  width: "80%",
                  backgroundColor: globalColors.darkOrchidShade20,
                  height: 0.5,
                  marginTop: "3%",
                  marginBottom: "-4%",
                }}
              />
              <TouchableOpacity
                onPress={handleOnOption}
                style={{
                  marginTop: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutralWhite,
                    textAlign: "center",
                  }}
                >
                  Clear all
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <TabBars onPressTab={onSelectTabHandler} selectTab={selectedTab} />

        <View style={{ height: (height * 70) / 100 }}>
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            data={flatListData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            onEndReached={() => {
              if (flatListData?.length > 0) {
                updateNotificationList();
              }
            }}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      </View>
    </ViewWrapper>
  );
};
export default memo(NotificationScreen);
