import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Keyboard,
  BackHandler,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { globalColors } from "@/assets/GlobalColors";
import { useAppStore } from "@/zustand/zustandStore";
import { uploadToR2 } from "@/utils/r2Uploads";
import ViewWrapper from "@/components/ViewWrapper";
import useMessageSupabaseViewModel from "../viewModel/MessageSupabaseViewModel";
import useUserChatDetailViewModel from "../viewModel/UserChatDetailViewModel";
import { useReportStore } from "@/zustand/reportStore";
import useBlockUserHook from "@/customHooks/BlockUserHook";
import { setPrefsValue } from "@/utils/storage";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import { useIsFocused } from "@react-navigation/native";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import styles from "./UserChatScreen.styles";
import ClearConversation from "./Component/ClearConversation";
import ChatHeaderView from "./Component/ChatHeaderView";
import RenderEmptyState from "./Component/RenderEmptyState";
import ChatInputSection from "./Component/ChatInputSection";
import DeleteMessageChat from "./Component/DeleteMessageChat";
import CustomBottomView from "@/app/BottomSheet/CustomBottomView";
import MediaSelectView from "./Component/MediaSelectView";
import BlockUserView from "./Component/BlockUserView";
import ChatOptionView from "./Component/ChatOptionView";
import RenderChatView from "./Component/RenderChatView";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UserChatScreen = () => {
  useScreenTracking("UserChatScreen");
  const { id, from, name, logo, isNotification } = useLocalSearchParams();
  const params: any = useLocalSearchParams();
  const userId = useAppStore((state) => state.userId);
  const { setReportUserDetails } = useReportStore();

  // Stable keyboard state management to prevent flicker
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isOptionVisible, setIsOptionVisible] = useState(false);
  const [isChatOptionVisible, setIsChatOptionVisible] = useState(false);
  const [isBlockVisible, setIsBlockVisible] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const [isClearVisible, setIsClearVisible] = useState(false);
  const [isMediaVisible, setIsMediaVisible] = useState(false);
  const [isDeleteMessageVisible, setIsDeleteMessageVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardTimeoutRef = useRef(null);
  const profileTimerRef = useRef(null);
  const {
    fetchMessagesWithPagination,
    supabaseChat,
    clearChat,
    deleteMessage,
    updateSeen,
    insertMessage,
    isLoadingMore,
    isInitialLoad,
    onLoadMore,
  } = useMessageSupabaseViewModel({
    uid: userId,
    receiverId: id,
    messageType: from,
  });

  const chatUserData = params?.chatUser ? JSON.parse(params?.chatUser) : {};
  const {
    onFetchUserMessageHandler,
    chatUserDetails,
    onPressGallary,
    onCaptureImage,
    imageData,
    imageFileData,
    setImageFileData,
    setImageData,
    onTakeSelfieHandler,
  } = useUserChatDetailViewModel();

  const { blockLoading, onPressBlockHandler } = useBlockUserHook();
  const [chatText, setChatText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  let r2UploadResult = null;

  const scrollViewRef = useRef<ScrollView>(null);
  const mediaTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaViewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reportTimerRef = useRef<NodeJS.Timeout | null>(null);
  const blockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  const determineAttachmentType = (name: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const audioExtensions = ["mp3", "wav", "ogg"];
    const videoExtensions = ["mp4", "avi", "mov"];

    const extension = name ? name.split(".").pop().toLowerCase() : "jpg";

    if (imageExtensions.includes(extension)) return "image";
    if (audioExtensions.includes(extension)) return "audio";
    if (videoExtensions.includes(extension)) return "video";
    if (
      !imageExtensions.includes(extension) &&
      !audioExtensions.includes(extension) &&
      !videoExtensions.includes(extension)
    ) {
      return "null";
    }
  };

  // Comprehensive keyboard handling to eliminate flicker
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  useEffect(() => {
    updateUserData();
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
      if (mediaTimerRef.current) {
        clearTimeout(mediaTimerRef.current);
        mediaTimerRef.current = null;
      }
      if (mediaViewTimerRef.current) {
        clearTimeout(mediaViewTimerRef.current);
        mediaViewTimerRef.current = null;
      }
      if (reportTimerRef.current) {
        clearTimeout(reportTimerRef.current);
        reportTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    fetchMessagesWithPagination(1, 20, true);
    updateSeen();
  }, [id, userId]);

  useEffect(() => {
    if (isFocused) {
      onFetchUserMessageHandler({ userId: userId, profileId: id });
    }
    return () => {
      setPrefsValue("notificationInfo", "");
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
        refreshTimeout.current = null;
      }
    };
  }, [id, isFocused]);

  const onMessageSend = async (text: string) => {
    const message = text;
    if ((text === "" || text === null) && !imageData) {
      showToast({ type: "error", text1: "Please enter message" });
      return;
    }

    setChatText("");

    if (imageData) {
      const attachmentType = determineAttachmentType(imageFileData.name);
      if (attachmentType != "image") {
        showToast({ type: "error", text1: "Please select proper image" });
        setChatText(text);
        return null;
      }
      try {
        r2UploadResult = await uploadToR2(
          imageFileData,
          "chat",
          "message/" + userId + "-" + id + "/"
        );
      } catch (error) {
        console.log("Error uploading to R2:", error);
        return null;
      }
      insertMessage({
        message,
        attach: r2UploadResult.key,
        type: "image",
        notificationType: "personal_chat",
      });
      setImageFileData(null);
      setImageData("");
    } else {
      insertMessage({
        message: text,
        notificationType: "personal_chat",
        attach: "",
      });
      setChatText("");
    }
  };

  const handleRemoveImage = () => {
    setImageData("");
    setImageFileData(null);
  };

  const clearChatConfirm = async () => {
    try {
      await clearChat();
      setSelectedMessage(null);
      setIsOptionVisible(false);
      setIsClearVisible(false);
    } catch (error) {
      console.error("Error clearing chat:", error);
      showToast({ type: "error", text1: "Failed to clear chat" });
    }
  };

  const handleLongPress = (message: { receiverId: any }, id: any) => {
    if (message.receiverId != userId) {
      setSelectedMessage(id);
      setIsDeleteMessageVisible(true);
    } else {
      setSelectedMessage(null);
    }
  };

  const handleDeleteMessage = async () => {
    if (selectedMessage) {
      try {
        await deleteMessage(selectedMessage);
        setSelectedMessage(null);
        setIsDeleteMessageVisible(false);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const profilePress = () => {
    chatUserDetails?.id === userId
      ? router.push({
          pathname: "/ProfileScreen",
          params: { profileId: chatUserDetails?.id },
        })
      : router.push({
          pathname: "/profile/[id]",
          params: {
            id: chatUserDetails?.id,
            isProfile: "true",
            isNotification: "false",
          },
        });
  };

  const { updateUserData } = UserStoreDataModel();
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  };

  useEffect(() => {
    scrollToBottom();
  }, [supabaseChat]);

  const onPressReportOption = ({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId: reportId,
      name: name,
      profilePic: ProfilePic,
      reportType: "profile",
    });
    setIsOptionVisible(false);
    setIsChatOptionVisible(false);
    reportTimerRef.current = setTimeout(() => {
      router.push("/ReportProfileScreen");
    }, 100);
  };

  const onPressBlockOption = () => {
    setIsOptionVisible(false);
    setIsChatOptionVisible(false);
    setIsClearVisible(false);
    if(blockTimerRef.current){
      clearTimeout(blockTimerRef.current);
    }
    blockTimerRef.current = setTimeout(() => {
      setIsOptionVisible(true);
      setIsBlockVisible(true);
    }, 1500);
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    setIsBlockVisible(false);
    setIsOptionVisible(false);
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
      refreshTimeout.current = null;
    }

    refreshTimeout.current = setTimeout(() => {
      onFetchUserMessageHandler({ userId: userId, profileId: id });
    }, 500);

  };

  const backPre = () => {
    if (isNotification == "true") {
      router.replace("/DashboardScreen");
    } else {
      router.back();
    }
  };

  // Group chats by date and flatten for FlatList
  const flattenedChatData = useMemo(() => {
    const groupedChats = supabaseChat.reduce<Record<string, any[]>>(
      (acc, chat) => {
        const date = new Date(chat.created_at).toDateString();
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(chat);
        return acc;
      },
      {}
    );

    const sortedGroupedChats = Object.entries(groupedChats).map(
      ([date, chats]) => ({
        date,
        chats: (chats as any[]).sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      })
    );

    const flatData = [];
    sortedGroupedChats.forEach((group) => {
      flatData.push({
        type: "date",
        date: group.date,
        id: `date-${group.date}`,
      });
      group.chats.forEach((chat) => {
        flatData.push({
          type: "message",
          ...chat,
          id: chat._id,
        });
      });
    });

    return flatData.reverse();
  }, [supabaseChat]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleModal = useCallback((imageUri) => {
    if (imageUri) {
      setSelectedImage(imageUri);
      setModalVisible(true);
    }
  }, []);

  const toggleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedImage(null);
  }, []);

  const renderChatItem = useCallback(
    ({ item }) => {
      if (item.type === "date") {
        return (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        );
      }

      return (
        <RenderChatView
          item={item}
          userId={userId}
          handleLongPress={handleLongPress}
          toggleModal={toggleModal}
        />
      );
    },
    [userId, handleLongPress, toggleModal]
  );

  const renderHeader = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.heraderLoadingContainer}>
          <ActivityIndicator size="small" color={globalColors.lightShadeNew} />
          <Text style={styles.loadingText}>Loading more messages...</Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore]);

  const keyExtractor = useCallback((item, index) => {
    return item.id || `fallback-${index}-${Date.now()}`;
  }, []);

  const canSendMessages = useMemo(() => {
    return (
    (chatUserDetails?.block_by_me == 0 &&
        chatUserDetails?.block_by_user == 0 &&
        chatUserDetails?.follow_by_me == 1 &&
        chatUserDetails?.follow_by_user == 1)
    );
  }, [chatUserDetails]);

  const handleOnPress = (text) => {
    setChatText(text);
  };

  const handleProfileOption = () => {
    if (profileTimerRef.current) {
      clearTimeout(profileTimerRef.current);
      profileTimerRef.current = null;
    }
    // Dismiss keyboard immediately
    Keyboard.dismiss();

    // Wait a bit for keyboard to fully dismiss, then open bottom sheet
    profileTimerRef.current = setTimeout(() => {
      try {
        setIsOptionVisible(true);
        setIsClearVisible(false);
        setIsBlockVisible(false);
        setIsChatOptionVisible(true);
      } catch (error) {
        console.log("Error expanding bottom sheet:", error);
      }
      profileTimerRef.current = null;
    }, 300);
  };

  useEffect(() => {
    return () => {
      // Clear ALL timeouts on component unmount
      if (keyboardTimeoutRef.current) {
        clearTimeout(keyboardTimeoutRef.current);
      }
      if (profileTimerRef.current) {
        clearTimeout(profileTimerRef.current);
      }
    };
  }, []);

  const mediaViewCloseHandler = () => {
    setIsMediaVisible(false);
    if (mediaTimerRef.current) {
      clearTimeout(mediaTimerRef.current);
      mediaTimerRef.current = null;
    }
  };

  return (
    <ViewWrapper>
      <ChatHeaderView
        chatUserDetails={chatUserDetails}
        profilePress={profilePress}
        backPre={backPre}
        from={from}
        name={name}
        logo={logo}
        paramsData={params}
        onOptionsPress={() => {
          handleProfileOption();
        }}
      />

      <View style={{ flex: 1, width: "95%" }}>
        {isInitialLoad ? (
          <View style={styles.initContainer}>
            <ActivityIndicator
              size="large"
              color={globalColors.lightShadeNew}
            />
            <Text style={styles.loadingText}>Loading messages...</Text>
          </View>
        ) : flattenedChatData.length === 0 ? (
          <RenderEmptyState
            from={from}
            chatUserDetails={chatUserDetails}
            chatUserData={chatUserData}
            paramsData={params}
            setChatText={setChatText}
            sharePhotoPress={() => {
              Keyboard.dismiss();
              mediaTimerRef.current = setTimeout(() => {
                setIsMediaVisible(true);
              }, 300);
            }}
          />
        ) : (
          <FlatList
            data={flattenedChatData}
            renderItem={renderChatItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            inverted
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderHeader}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
            removeClippedSubviews={true}
            maxToRenderPerBatch={20}
            windowSize={10}
            initialNumToRender={20}
          />
        )}

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={toggleCloseModal}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={toggleCloseModal}
            activeOpacity={1}
          >
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={styles.modalImage}
              />
            )}
          </TouchableOpacity>
        </Modal>
      </View>

      <ChatInputSection
        isInitialLoad={isInitialLoad}
        canSendMessages={canSendMessages}
        chatUserDetails={chatUserDetails}
        handleOnPress={handleOnPress}
        handleRemoveImage={handleRemoveImage}
        imageData={imageData}
        isKeyboardVisible={isKeyboardVisible}
        keyboardHeight={keyboardHeight}
        userId={userId}
        chatText={chatText}
        insets={insets}
        onMessageSend={onMessageSend}
        mediaPress={() => {
          Keyboard.dismiss();
          mediaTimerRef.current = setTimeout(() => {
            setIsMediaVisible(true);
          }, 300);
        }}
      />

      <CustomBottomView
        visible={isMediaVisible}
        onClose={() => {
          mediaViewCloseHandler();
        }}
        title="Select Media"
        snapPoints={[0.6, 0.9]}
      >
        <MediaSelectView
          onCancelHandler={() => {
            mediaViewCloseHandler();
          }}
          onPressCamera={() => {
            mediaViewCloseHandler();
            if (mediaViewTimerRef.current) {
              clearTimeout(mediaViewTimerRef.current);
              mediaViewTimerRef.current = null;
            }
            mediaViewTimerRef.current = setTimeout(() => {
              onTakeSelfieHandler();
            }, 300);
          }}
          onPressGallary={() => {
            mediaViewCloseHandler();
            if (mediaViewTimerRef.current) {
              clearTimeout(mediaViewTimerRef.current);
              mediaViewTimerRef.current = null;
            }
            mediaViewTimerRef.current = setTimeout(() => {
              onPressGallary();
            }, 300);
          }}
        />
      </CustomBottomView>

      <CustomBottomView
        visible={isOptionVisible}
        onClose={() => {
          setIsOptionVisible(false);
          setIsClearVisible(false);
          setIsBlockVisible(false);
          setIsChatOptionVisible(false);
        }}
        title="Chat Option"
        snapPoints={isBlockVisible ? [0.9, 0.9] : [0.5, 0.9]}
      >
        {isClearVisible ? (
          <ClearConversation
            clearChatConfirm={clearChatConfirm}
            cancelHandler={() => {
              setIsOptionVisible(false);
              setIsClearVisible(false);
            }}
          />
        ) : isBlockVisible ? (
          <BlockUserView
            onPressBlockButton={() =>
              onSubmitBlockHandler({
                profileId: chatUserDetails?.id,
                isBlock: chatUserDetails?.block_by_me == 0 ? 1 : 0,
              })
            }
            loading={blockLoading}
            block={chatUserDetails?.block_by_me == 0 ? true : false}
          />
        ) : (
          <ChatOptionView
            onPressReportOption={() =>
              onPressReportOption({
                reportId: chatUserDetails?.id,
                name: chatUserDetails?.full_name,
                ProfilePic: chatUserDetails?.profile_pic,
              })
            }
            onPressBlockOption={onPressBlockOption}
            block={chatUserDetails?.block_by_me == 0 ? true : false}
            onPressClearOption={() => {
              setIsClearVisible(true);
            }}
            screen={"Chat"}
          />
        )}
      </CustomBottomView>
      <CustomBottomView
        visible={isDeleteMessageVisible}
        onClose={() => {
          setIsDeleteMessageVisible(false);
        }}
        title="Delete Message"
        snapPoints={[0.5, 0.9]}
      >
        <DeleteMessageChat
          handleDeleteMessage={handleDeleteMessage}
          cancelHandler={() => setIsDeleteMessageVisible(false)}
        />
      </CustomBottomView>
    </ViewWrapper>
  );
};

export default UserChatScreen;
