import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions,
  Animated,
  Modal,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import useGroupMessageSupabaseViewModel from "../../viewModel/SubgroupChatViewModel";
import { useAppStore } from "@/zustand/zustandStore";
import moment from "moment";
import { R2_PUBLIC_URL } from "@/utils/constants";
import AttachmentDrawer from "./AttachmentDrawer";
import useUserChatDetailViewModel from "@/app/(features)/(chat)/viewModel/UserChatDetailViewModel";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { determineAttachmentType, uploadToR2 } from "@/utils/r2Uploads";
import MediaGallery from "./MediaGallery";
import { DeleteMessageBottomSheet } from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { ArrowLeftBigIcon } from "@/assets/DarkIcon";
import Track_Player from "@/components/AudioPlayer/TrackPlayer";
import MediaPost from "@/components/MediaPost";
import { ActivityIndicator } from "react-native";
import RichText from "@/utils/RichText";

const { width, height } = Dimensions.get("window");

// Mock data for community members
const mockMembers = [
  {
    id: 1,
    name: "Alex Chen",
    avatar:
      "https://api.a0.dev/assets/image?text=person%20avatar%201%20professional&aspect=1:1&seed=101",
    isActive: true,
  },
  {
    id: 2,
    name: "Sarah Design",
    avatar:
      "https://api.a0.dev/assets/image?text=person%20avatar%202%20professional&aspect=1:1&seed=102",
    isActive: true,
  },
  {
    id: 3,
    name: "Michael B.",
    avatar:
      "https://api.a0.dev/assets/image?text=person%20avatar%203%20professional&aspect=1:1&seed=103",
    isActive: false,
  },
  {
    id: 4,
    name: "Jenna R.",
    avatar:
      "https://api.a0.dev/assets/image?text=person%20avatar%204%20professional&aspect=1:1&seed=104",
    isActive: true,
  },
  {
    id: 5,
    name: "Chris Tech",
    avatar:
      "https://api.a0.dev/assets/image?text=person%20avatar%205%20professional&aspect=1:1&seed=105",
    isActive: false,
  },
];

const ImagePreview = ({ imageUri, onRemove, fileName }) => {
  if (!imageUri) return null;

  return (
    <View style={stylesImage.previewContainer}>
      <View style={stylesImage.imageContainer}>
        <Image source={{ uri: imageUri }} style={stylesImage.previewImage} />
        <TouchableOpacity style={stylesImage.removeButton} onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color="#FF6B6B" />
        </TouchableOpacity>
        <View style={stylesImage.imageInfo}>
          <View style={stylesImage.imageTypeIcon}>
            <Ionicons name="image" size={16} color="#FFFFFF" />
          </View>
          <Text style={stylesImage.fileName} numberOfLines={1}>
            {fileName || "Image"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function CommunityOtherChat() {
  const {
    groupId,
    groupName,
    groupImage,
    memberCount,
    subgroupId,
    subgroupName,
    subgroupImage,
    subgroupMemberCount,
    whatAmI,
  } = useLocalSearchParams();

  const userId = useAppStore((state) => state.userId);
  const navigation = useNavigation();
  const route = useRoute();
  const { community, subgroup } = {
    community: {
      name: groupName || "General Community",
      memberCount: subgroupMemberCount,
      image: subgroupImage,
      whatAmI: whatAmI,
    },
    subgroup: { name: subgroupName, icon: "chatbubbles" },
  };

  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);

  const handleAttachmentSelect = (option) => {
    console.log("Selected attachment option:", option);

    switch (option.id) {
      case "camera":
        onTakeSelfieHandler();
        break;
      case "gallery":
        onPressGallary();
        break;
      default:
        break;
    }
  };

  const {
    onPressGallary,
    onCaptureImage,
    imageData,
    imageFileData,
    setImageFileData,
    setImageData,
    onTakeSelfieHandler,
  } = useUserChatDetailViewModel();

  const handleRemoveImage = () => {
    setImageData(null);
    setImageFileData(null);
  };

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showReactionMenu, setShowReactionMenu] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [showMembers, setShowMembers] = useState(false);
  const [activeTab, setActiveTab] = useState("Chats");
  const [showMediaTab, setShowMediaTab] = useState(false);
  const [sendDisabled, setSendDisabled] = useState(false);

  const {
    supabaseGroupMedia,
    fetchInitialMessages,
    fetchMessagesWithPagination,
    supabaseGroupChat,
    clearChat,
    deleteMessage,
    updateSeen,
    insertMessage,
    isLoadingMore,
    hasMoreMessages,
    isInitialLoad,
    onLoadMore,
  } = useGroupMessageSupabaseViewModel({
    uid: userId,
    groupId: groupId,
    subgroupId: subgroupId,
  });

  const handleSendMessage = async () => {
    if (message.trim() === "" && !imageData) return;
    setSendDisabled(true);

    let r2UploadResult = null;

    // Clear input immediately for better UX
    setMessage("");

    if (imageData) {
      const attachmentType = determineAttachmentType(imageFileData.name);
      if (attachmentType != "image") {
        showToast({ type: "error", text1: "Please select proper image" });
        setMessage(message); // Restore text on error
        setSendDisabled(false);
        return null;
      }
      try {
        r2UploadResult = await uploadToR2(
          imageFileData,
          "chat",
          "message/" + userId + "-" + subgroupName + "/"
        );
      } catch (error) {
        console.log("Error uploading to R2:", error);
        setSendDisabled(false);
        return null;
      }
      insertMessage({
        message: message.trim() || "",
        notificationType: "group_chat",
        type: "image",
        attach: r2UploadResult?.key,
      });
      setImageFileData(null);
      setImageData("");
      setSendDisabled(false);
    } else {
      insertMessage({
        message: message.trim(),
        notificationType: "group_chat",
        attach: "",
      });
      setSendDisabled(false);
    }
  };

  const subgroupMessageListRef = useRef(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Group chats by date and flatten for FlatList (same as UserChatScreen)
  const flattenedChatData = useMemo(() => {
    const groupedChats = supabaseGroupChat.reduce((acc, chat) => {
      const date = new Date(chat.created_at).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(chat);
      return acc;
    }, {});

    const sortedGroupedChats = Object.entries(groupedChats).map(
      ([date, chats]) => ({
        date,
        chats: (chats as any[]).sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      })
    );

    // Flatten the data for FlatList
    const flatData = [];
    sortedGroupedChats.forEach((group) => {
      // Add date header
      flatData.push({
        type: "date",
        date: group.date,
        id: `date-${group.date}`,
      });
      // Add messages
      group.chats.forEach((chat) => {
        flatData.push({
          type: "message",
          ...chat,
          id: chat._id,
        });
      });
    });

    return flatData.reverse(); // Reverse to show latest messages at bottom
  }, [supabaseGroupChat]);

  useEffect(() => {
    fetchMessagesWithPagination(1, 20, true); // Reset data on conversation change
    updateSeen();
  }, [groupId, subgroupId, userId]);

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

  const UserAvatar = useCallback(
    ({ item }) => (
      <View style={{ marginRight: 8 }}>
        <ImageFallBackUser
          imageData={item.user.avatar || ""}
          fullName={item.user.name}
          widths={32}
          heights={32}
          borders={16}
        />
      </View>
    ),
    []
  );

  const ImageTag = ({ item }) => {
    const imageUrls = item
      ? item.split(",").filter((url) => url.trim() !== "")
      : [];

    let itemImg = "";
    if (imageUrls.length === 0) {
      itemImg = item || "";
    } else {
      itemImg = imageUrls[0];
    }

    return (
      <Image
        source={{
          uri: R2_PUBLIC_URL + itemImg,
        }}
        style={styles.postMessageImage}
        resizeMode="cover"
      />
    );
  };

  // Better key extractor (same as UserChatScreen)
  const keyExtractor = useCallback((item) => {
    return item.id || item._id || `${item.type}-${Math.random()}`;
  }, []);

  // Improved header component for loading state (same as UserChatScreen)
  const renderHeader = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={{ padding: 20, alignItems: "center" }}>
          <ActivityIndicator size="small" color="#8954F6" />
          <Text style={{ color: "#8954F6", marginTop: 8 }}>
            Loading more messages...
          </Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore]);

  // Empty state component (same as UserChatScreen)
  const renderEmptyState = useCallback(() => {
    const displayName = `${community.name} - ${subgroup.name}`;

    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
          paddingVertical: 70,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "rgba(82, 52, 143, 0.2)",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Text
            style={{
              fontSize: 32,
              color: globalColors.neutralWhite,
            }}
          >
            💬
          </Text>
        </View>

        <Text
          style={{
            fontSize: 20,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          Start the Conversation
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutral7,
            textAlign: "center",
            lineHeight: 20,
            marginBottom: 8,
          }}
        >
          Be the first to share something in {displayName}
        </Text>

        <Text
          style={{
            fontSize: 12,
            fontFamily: fontFamilies.light,
            color: globalColors.neutral6,
            textAlign: "center",
            lineHeight: 16,
            fontStyle: "italic",
            marginBottom: 24,
          }}
        >
          Your message will be visible to all members
        </Text>

        {community.whatAmI != "0" && (
          <View
            style={{
              flexDirection: "row",
              gap: 12,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "rgba(82, 52, 143, 0.3)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(82, 52, 143, 0.5)",
              }}
              onPress={() => {
                setMessage("Hello everyone! 👋");
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 12,
                  fontFamily: fontFamilies.medium,
                }}
              >
                👋 Say Hi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "rgba(82, 52, 143, 0.3)",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(82, 52, 143, 0.5)",
              }}
              onPress={() => {
                setShowAttachmentDrawer(true);
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 12,
                  fontFamily: fontFamilies.medium,
                }}
              >
                📷 Share Photo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }, [community, subgroup, setMessage]);

  const ClearConRef = useRef<BottomSheet>(null);
  const OptionsSenderRef = useRef<BottomSheet>(null);
  const OptionsMessageRef = useRef<BottomSheet>(null);
  const DeleteMessageRef = useRef<BottomSheet>(null);

  const handleLongPress = (message: { senderId: any }, id: any) => {
    message.senderId == userId
      ? setSelectedMessageId(id)
      : setSelectedMessageId(null);
    message.senderId == userId ? DeleteMessageRef.current.expand() : null;
  };

  const handleDeleteMessage = () => {
    if (selectedMessageId) {
      deleteMessage(selectedMessageId);
      setSelectedMessageId(null);
      DeleteMessageRef.current.close();
    }
  };

  
  const renderChatItem = useCallback(
    ({ item }) => {
      if (item.type === "date") {
        return (
          <View
            style={{
              borderRadius: 24,
              backgroundColor: globalColors.neutral2,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: "2%",
              paddingHorizontal: "3%",
              marginVertical: 15,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                position: "relative",
                fontSize: 12,
                lineHeight: 20,
                fontFamily: fontFamilies.light,
                color: globalColors.neutralWhite,
                textAlign: "center",
              }}
            >
              {item.date}
            </Text>
          </View>
        );
      }

      return (
        <View>
          {item.postId == 0 ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onLongPress={() => {
                handleLongPress(item, item._id);
                setSelectedMessageId(item._id);
                setShowReactionMenu(true);
              }}
              style={[
                styles.messageWrapper,
                item?.senderId == userId
                  ? styles.currentUserMessage
                  : styles.otherUserMessage,
              ]}
            >
              {item?.senderId != userId && <UserAvatar item={item} />}
              <View style={styles.messageContentWrapper}>
                {item?.senderId != userId && (
                  <Text style={styles.messageSender}>{item.user.name}</Text>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    item?.senderId == userId
                      ? styles.currentUserBubble
                      : styles.otherUserBubble,
                    item?.fileType === "image" && styles.imageBubble,
                    item?.fileType === "image" &&
                      item?.message == "" &&
                      styles.imageOnlyBubble,
                  ]}
                >
                  {item?.fileType === "image" && (
                    <TouchableOpacity
                      onPress={() =>
                        toggleModal(R2_PUBLIC_URL + item?.attachment)
                      }
                      onLongPress={() => {
                        handleLongPress(item, item._id);
                        setSelectedMessageId(item._id);
                        setShowReactionMenu(true);
                      }}
                      delayLongPress={300}
                      style={[styles.imageContainer]}
                    >
                      <Image
                        source={{
                          uri: R2_PUBLIC_URL + item?.attachment,
                        }}
                        style={[
                          styles.chatImage,
                          item?.message == "" && styles.imageOnlyRadius,
                        ]}
                      />
                    </TouchableOpacity>
                  )}
                  {item?.message != "" && (
                    <Text
                      style={[
                        styles.messageText,
                        item?.fileType === "image" && styles.textWithImage,
                      ]}
                    >
                      <RichText
                        text={item?.message}
                        mentions={[]}
                        styles={{
                          linkText: {
                            color:
                              item?.senderId == userId
                                ? "pink"
                                : globalColors.lightShadeNew,
                            textDecorationLine: "underline",
                            fontFamily: fontFamilies.bold,
                            fontSize: 15,
                          },
                          hashtagText: {
                            color:
                              item?.senderId == userId
                                ? "pink"
                                : globalColors.lightShadeNew,
                            fontFamily: fontFamilies.bold,
                            fontSize: 15,
                          },
                        }}
                      />
                      {/* {item?.message} */}
                    </Text>
                  )}
                </View>
                <View style={styles.messageFooter}>
                  <Text style={styles.messageTime}>
                    {moment
                      .utc(item?.created_at)
                      .utcOffset("+05:30")
                      .format("h:mm A")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/post/[id]",
                  params: {
                    id: item.postId,
                    Type: "group",
                    isNotification: "here",
                  },
                })
              }
              style={[
                styles.messageWrapper,
                item?.senderId == userId
                  ? styles.currentUserMessage
                  : styles.otherUserMessage,
                styles.postMessageWrapper,
              ]}
            >
              <View style={styles.messageContentWrapperPost}>
                <View
                  style={[
                    styles.messageBubble,
                    styles.postBubble,
                    item?.senderId == userId
                      ? styles.currentUserBubblePost
                      : styles.otherUserBubblePost,
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: R2_PUBLIC_URL + item.user.avatar }}
                      style={styles.messageAvatar}
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text
                        style={{
                          textAlign: "left",
                          fontSize: 14,
                          fontFamily: fontFamilies.bold,
                          color: globalColors.neutralWhite,
                        }}
                      >
                        {item.user.name}
                      </Text>
                      <Text style={[styles.messageSender]}>
                        {moment
                          .utc(item?.created_at)
                          .utcOffset("+05:30")
                          .fromNow()}
                      </Text>
                    </View>
                  </View>

                  {item?.fileType === "image" && (
                    <ImageTag item={item?.attachment} />
                  )}
                  {item?.fileType === "video" && (
                    <MediaPost
                      source={{
                        thumbnail: "",
                        url: item?.attachment,
                      }}
                      type={"video"}
                      isHome={false}
                      isGroup={true}
                      onPressView={() => {}}
                      display_height={[]}
                    />
                  )}
                  {item?.file_type === "audio" && (
                    <Track_Player Type={item?.attachment} id={item.postId} />
                  )}

                  <Text
                    style={[
                      styles.messageText,
                      { paddingHorizontal: 6, paddingTop: 5 },
                    ]}
                  >
                    <RichText
                      text={item?.message}
                      mentions={[]}
                      styles={{
                        linkText: {
                          color:
                            item?.senderId == userId
                              ? "pink"
                              : globalColors.lightShadeNew,
                          textDecorationLine: "underline",
                          fontFamily: fontFamilies.bold,
                          fontSize: 15,
                        },
                        hashtagText: {
                          color:
                            item?.senderId == userId
                              ? "pink"
                              : globalColors.lightShadeNew,
                          fontFamily: fontFamilies.bold,
                          fontSize: 15,
                        },
                      }}
                    />
                  </Text>
                </View>
                <View style={styles.messageFooter}>
                  <Text style={styles.messageTime}>
                    {moment
                      .utc(item?.created_at)
                      .utcOffset("+05:30")
                      .format("h:mm A")}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      );
    },
    [userId, handleLongPress, toggleModal]
  );


  return (
    <LinearGradient colors={["#0f0721", "#0f0721"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <ArrowLeftBigIcon width={40} height={40} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerInfo}>
            <ImageFallBackUser
              imageData={"" + community?.image}
              fullName={
                Array.isArray(subgroup?.name)
                  ? subgroup.name.join(" ")
                  : subgroup?.name || "General Community"
              }
              widths={36}
              heights={36}
              borders={10}
              isGroupList={true}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>
                {community.name} - {subgroup.name}
              </Text>
              <Text style={styles.headerSubtitle}>
                {community.memberCount || "0"} members
              </Text>
            </View>
          </TouchableOpacity>

          {community.whatAmI != "0" && (
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-vertical" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Chats" && styles.activeTab]}
            onPress={() => {
              setActiveTab("Chats");
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Chats" && styles.activeTabText,
              ]}
            >
              Chats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Media" && styles.activeTab]}
            onPress={() => setActiveTab("Media")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "Media" && styles.activeTabText,
              ]}
            >
              Media
            </Text>
          </TouchableOpacity>
        </View>

        {/* Members List */}
        {showMembers && (
          <View style={styles.membersContainer}>
            <Text style={styles.membersTitle}>Members</Text>
            <FlatList
              data={mockMembers}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <View style={styles.memberAvatarContainer}>
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.memberAvatar}
                    />
                    {item.isActive && <View style={styles.activeIndicator} />}
                  </View>
                  <Text style={styles.memberName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.membersList}
            />
          </View>
        )}

        {/* Content Area */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.contentContainer}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          {activeTab === "Chats" ? (
            <>
              <View style={{ flex: 1, width: "100%" }}>
                {isInitialLoad ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8954F6" />
                    <Text style={styles.loadingText}>Loading messages...</Text>
                  </View>
                ) : flattenedChatData.length === 0 ? (
                  // Show empty state outside FlatList to avoid inversion
                  renderEmptyState()
                ) : (
                  <FlatList
                    ref={subgroupMessageListRef}
                    data={flattenedChatData}
                    renderItem={renderChatItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    inverted
                    onEndReached={onLoadMore}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={renderHeader} // Use ListFooterComponent for inverted FlatList
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
                    style={{
                      flex: 1,
                      backgroundColor: "rgba(0,0,0,0.9)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={toggleCloseModal}
                    activeOpacity={1}
                  >
                    {selectedImage && (
                      <Image
                        source={{ uri: selectedImage }}
                        style={{
                          width: width * 0.9,
                          height: height * 0.7,
                          resizeMode: "contain",
                          borderRadius: 10,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </Modal>
              </View>

              {/* Image Preview */}
              {imageData && (
                <ImagePreview
                  imageUri={imageData}
                  onRemove={handleRemoveImage}
                  fileName={imageFileData?.name}
                />
              )}

              {community.whatAmI != "0" && (
                <View style={styles.inputContainer}>
                  <TouchableOpacity
                    style={styles.attachButton}
                    onPress={() => setShowAttachmentDrawer(true)}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={24}
                      color="#8954F6"
                    />
                  </TouchableOpacity>
                  <TextInput
                    style={[styles.input, imageData && styles.inputWithImage]}
                    placeholder={imageData ? "Add a caption..." : "Message..."}
                    placeholderTextColor="#6c6c7d"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      message.trim() === "" && !imageData && !sendDisabled
                        ? null
                        : styles.sendButtonActive,
                    ]}
                    onPress={async () => {
                      if (sendDisabled || (message.trim() === "" && !imageData))
                        return;

                      setSendDisabled(true);
                      await handleSendMessage();
                    }}
                    disabled={
                      message.trim() === "" && !imageData && !sendDisabled
                    }
                  >
                    <Ionicons
                      name="send"
                      size={20}
                      color={
                        message.trim() === "" && !imageData && !sendDisabled
                          ? "#6c6c7d"
                          : "#E27AF8"
                      }
                    />
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <MediaGallery
              supabaseGroupMedia={supabaseGroupMedia}
              subgroup={subgroup}
            />
          )}
          <DeleteMessageBottomSheet
            DeleteMessageRef={DeleteMessageRef}
            handleDeleteMessage={handleDeleteMessage}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
      <AttachmentDrawer
        visible={showAttachmentDrawer}
        onClose={() => setShowAttachmentDrawer(false)}
        onSelectAttachment={handleAttachmentSelect}
        options={["camera", "gallery"]}
        title="Select Image"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(116, 84, 244, 0.1)",
  },
  backButton: {
    padding: 0,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  communityImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 8,
    justifyContent: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamilies.bold,
  },
  headerSubtitle: {
    color: "#8954F6",
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
  },
  moreButton: {
    padding: 8,
  },
  tabsContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderBottomColor: "transparent",
    borderBottomWidth: 0,
    marginHorizontal: 0,
    flexDirection: "row",
    borderColor: "transparent",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderRadius: 6,
    borderBottomColor: globalColors.warmPinkShade20,
    borderBottomWidth: 3,
    borderColor: "#a78bfa",
  },
  tabText: {
    color: "#6c6c7d",
    fontSize: 13,
    fontFamily: fontFamilies.semiBold,
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  membersContainer: {
    backgroundColor: "rgba(116, 84, 244, 0.05)",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(116, 84, 244, 0.1)",
  },
  membersTitle: {
    color: "white",
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
    marginLeft: 16,
    marginBottom: 8,
  },
  membersList: {
    paddingHorizontal: 16,
  },
  memberItem: {
    alignItems: "center",
    marginRight: 16,
    width: 60,
  },
  memberAvatarContainer: {
    position: "relative",
    marginBottom: 4,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#0a0025",
  },
  memberName: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    fontFamily: fontFamilies.semiBold,
  },
  contentContainer: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: "80%",
    flexDirection: "row",
    overflow: "hidden",
    paddingHorizontal: 15,
  },
  postMessageWrapper: {
    maxWidth: "90%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageContentWrapperPost: {
    flex: 1,
  },
  messageContentWrapper: {
    maxWidth: "100%",
    flexDirection: "column",
  },
  messageSender: {
    color: "#8954F6",
    fontSize: 13.5,
    fontFamily: fontFamilies.semiBold,
    marginBottom: 4,
  },
  messageBubble: {
    borderRadius: 18,
    padding: 1,
    overflow: "hidden",
  },
  currentUserBubblePost: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 4,
  },
  otherUserBubblePost: {
    borderBottomLeftRadius: 4,
  },
  currentUserBubble: {
    backgroundColor: "#8954F6",
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: "rgba(116, 84, 244, 0.15)",
    borderBottomLeftRadius: 4,
  },
  postBubble: {
    backgroundColor: "rgba(116, 84, 244, 0.2)",
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageText: {
    color: "white",
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  messageTime: {
    color: "#6c6c7d",
    fontSize: 11,
    fontFamily: fontFamilies.light,
  },
  reactionsContainer: {
    flexDirection: "row",
    marginLeft: 8,
  },
  reaction: {
    fontSize: 14,
    marginRight: 2,
  },
  typingContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  typingBubble: {
    backgroundColor: "rgba(116, 84, 244, 0.1)",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8954F6",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(116, 84, 244, 0.1)",
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(116, 84, 244, 0.1)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "white",
    marginHorizontal: 8,
    maxHeight: 100,
    fontFamily: fontFamilies.semiBold,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonActive: {
    backgroundColor: "rgba(116, 84, 244, 0.2)",
    borderRadius: 20,
  },
  postsContainer: {
    padding: 16,
  },
  postContainer: {
    backgroundColor: "rgba(116, 84, 244, 0.05)",
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(116, 84, 244, 0.1)",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  authorName: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    marginRight: 8,
  },
  communityBadge: {
    backgroundColor: "rgba(73, 46, 152, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  communityText: {
    color: "#E27AF8",
    fontSize: 10,
    fontFamily: fontFamilies.semiBold,
  },
  authorUsername: {
    color: "#8954F6",
    fontSize: 14,
    fontFamily: fontFamilies.semiBold,
  },
  postContent: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    lineHeight: 22,
    marginBottom: 12,
  },
  mediaContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  postMedia: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(116, 84, 244, 0.1)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    color: "#8954F6",
    fontSize: 14,
    marginLeft: 6,
    fontFamily: fontFamilies.regular,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    flex: 1,
  },
  emptyTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    fontFamily: fontFamilies.bold,
  },
  emptyText: {
    color: "grey",
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    textAlign: "center",
  },
  postMessageImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginTop: 8,
  },
  postMessageActions: {
    flexDirection: "row",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 8,
  },
  postMessageAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    fontFamily: fontFamilies.semiBold,
  },
  postMessageActionText: {
    color: "#8954F6",
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    marginLeft: 4,
  },
  mediaGrid: {
    padding: 4,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 5,
  },
  mediaItem: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  mediaItemImage: {
    width: "100%",
    height: "100%",
  },
  mediaItemOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
  },
  mediaItemAuthor: {
    color: "white",
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
  },
  inputWithImage: {
    backgroundColor: "rgba(116, 84, 244, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(137, 84, 246, 0.3)",
  },
  imageBubble: {
    padding: 2,
    overflow: "hidden",
  },
  imageOnlyBubble: {
    padding: 1,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(137, 84, 246, 0.1)",
  },
  chatImage: {
    width: width * 0.6,
    height: width * 0.6 * 0.75,
    maxWidth: 250,
    maxHeight: 300,
    minWidth: 150,
    minHeight: 120,
    backgroundColor: "rgba(137, 84, 246, 0.1)",
  },
  imageOnlyRadius: {
    borderRadius: 20,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  imageOverlayTime: {
    color: "white",
    fontSize: 11,
    fontFamily: fontFamilies.light,
  },
  textWithImage: {
    marginTop: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    color: "#8954F6",
    fontSize: 16,
    fontFamily: fontFamilies.semiBold,
    marginTop: 16,
  },
  loadingOlderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  loadingOlderText: {
    color: "#8954F6",
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    marginLeft: 8,
  },
});

const stylesImage = StyleSheet.create({
  previewContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(137, 84, 246, 0.1)",
    backgroundColor: "rgba(26, 13, 46, 0.95)",
  },
  imageContainer: {
    position: "relative",
    alignSelf: "flex-start",
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "rgba(137, 84, 246, 0.1)",
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "rgba(26, 13, 46, 0.9)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  imageTypeIcon: {
    marginRight: 4,
  },
  fileName: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: fontFamilies.regular,
    flex: 1,
  },
});
