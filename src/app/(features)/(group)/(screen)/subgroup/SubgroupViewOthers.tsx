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
import { R2_PUBLIC_URL } from "@/utils/constants"; // Add this to your existing imports
import AttachmentDrawer from "./AttachmentDrawer"; // Adjust path as needed
import useUserChatDetailViewModel from "@/app/(features)/(chat)/viewModel/UserChatDetailViewModel";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { determineAttachmentType, uploadToR2 } from "@/utils/r2Uploads";
import MediaGallery from "./MediaGallery";
import { DeleteMessageBottomSheet } from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { ArrowLeftBigIcon } from "@/assets/DarkIcon";
import Track_Player from "@/components/AudioPlayer/TrackPlayer";
import MediaPost from "@/components/MediaPost";
import { ActivityIndicator } from "react-native"; // Add this for loading indicator

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

        {/* Remove button */}
        <TouchableOpacity style={stylesImage.removeButton} onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color="#FF6B6B" />
        </TouchableOpacity>

        {/* Image info overlay */}
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

  // Add this state variable with your other useState hooks
  const [showAttachmentDrawer, setShowAttachmentDrawer] = useState(false);

  // Add this function to handle attachment selection
  const handleAttachmentSelect = (option) => {
    console.log("Selected attachment option:", option);

    switch (option.id) {
      case "camera":
        // Handle camera functionality
        // You can use expo-image-picker or react-native-image-picker
        onTakeSelfieHandler();
        break;
      case "gallery":
        // Handle gallery selection
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

  // Add function to remove selected image
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

  const posts = [];

  // Filter posts that mention this community
  const communityPosts = posts.filter((post) => {
    const postContent =
      typeof post.content === "string"
        ? post.content
        : Array.isArray(post.content)
        ? post.content.join(" ")
        : "";
    const communityName =
      typeof community.name === "string"
        ? community.name
        : Array.isArray(community.name)
        ? community.name.join(" ")
        : "";
    return postContent.toLowerCase().includes(communityName.toLowerCase());
  });

  const {
    supabaseGroupMedia,
    //  fetchMessagesSupabase,
    fetchInitialMessages,
    fetchOlderMessages, // New function
    fetchMediaSupabase,
    supabaseGroupChat,
    clearChat,
    deleteMessage,
    updateSeen,
    insertMessage,
    isLoadingOlder, // New state
    hasMoreMessages, // New state
    isInitialLoad, // New state
  } = useGroupMessageSupabaseViewModel({
    uid: userId,
    groupId: groupId,
    subgroupId: subgroupId,
  });

  // Add these new state variables
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const [initialMessagesLoaded, setInitialMessagesLoaded] = useState(false);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [savedScrollPosition, setSavedScrollPosition] = useState(0);
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const [isContentReady, setIsContentReady] = useState(false); // New state for content readiness
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstLoadRef = useRef(true);
  const contentSizeRef = useRef({ width: 0, height: 0 });
  const hasScrolledToBottomRef = useRef(false); // Track if we've scrolled to bottom

  // Handle scroll to load older messages with better detection
  const handleScroll = useCallback(
    (event: any) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const scrollY = contentOffset.y;

      setCurrentScrollY(scrollY);
      contentSizeRef.current = contentSize;

      // Set user is scrolling
      setIsUserScrolling(true);

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to detect when user stops scrolling
      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 200);

      // Better pagination trigger - check if user is near the top
      const isNearTop = scrollY <= 200;

      if (isNearTop && hasMoreMessages && !isLoadingOlder && !isUserScrolling) {
        console.log("Triggering pagination...");
        fetchOlderMessages();
      }
    },
    [hasMoreMessages, isLoadingOlder, fetchOlderMessages]
  );

  // Handle content size change to position at bottom initially
  const handleContentSizeChange = useCallback(
    (contentWidth: number, contentHeight: number) => {
      if (
        !hasScrolledToBottomRef.current &&
        !isInitialLoad &&
        supabaseGroupChat.length > 0
      ) {
        // Immediately scroll to bottom without animation on first load
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({
            y: contentHeight,
            animated: false,
          });
          hasScrolledToBottomRef.current = true;
          setIsContentReady(true);
        }
      }
    },
    [isInitialLoad, supabaseGroupChat.length]
  );

  // Save scroll position when tab changes
  useEffect(() => {
    if (activeTab !== "Chats") {
      setSavedScrollPosition(currentScrollY);
    }
  }, [activeTab, currentScrollY]);

  // Restore scroll position when returning to Chats tab
  useEffect(() => {
    if (
      activeTab === "Chats" &&
      savedScrollPosition > 0 &&
      scrollViewRef.current &&
      hasScrolledToBottomRef.current
    ) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: savedScrollPosition,
          animated: false,
        });
      }, 100);
    }
  }, [activeTab, savedScrollPosition]);

  // Handle new messages - only scroll if it's a new message from current user
  useEffect(() => {
    if (
      hasScrolledToBottomRef.current &&
      supabaseGroupChat.length > previousMessageCount
    ) {
      const newMessages = supabaseGroupChat.slice(previousMessageCount);
      const hasNewMessageFromCurrentUser = newMessages.some(
        (msg) => msg.senderId == userId
      );

      // Only auto-scroll if user sent a message or shouldAutoScroll is set
      if (hasNewMessageFromCurrentUser || shouldAutoScroll) {
        setTimeout(() => {
          if (scrollViewRef.current && !isUserScrolling) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }, 100);
        setShouldAutoScroll(false);
      }
    }
    setPreviousMessageCount(supabaseGroupChat.length);
  }, [
    supabaseGroupChat.length,
    previousMessageCount,
    userId,
    shouldAutoScroll,
    isUserScrolling,
  ]);

  const handleSendMessage = async () => {
    if (message.trim() === "" && !imageData) return;
    setSendDisabled(true);

    let r2UploadResult = null;

    // Set flag to auto-scroll after sending
    setShouldAutoScroll(true);

    // If there's an image, send it along with the message
    if (imageData) {
      const attachmentType = determineAttachmentType(imageFileData.name);
      if (attachmentType != "image") {
        showToast({ type: "error", text1: "Please select proper image" });
        setSendDisabled(false);
        setShouldAutoScroll(false);
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
        setShouldAutoScroll(false);
        return null;
      }
      insertMessage({
        message: message.trim() || "", // Allow empty message if there's an image
        notificationType: "group_chat",
        type: "image",
        attach: r2UploadResult?.key, // Pass the image file data
      });
    } else {
      insertMessage({
        message: message.trim(),
        notificationType: "group_chat",
        attach: "",
      });
    }

    // Clear the input and image after sending
    setMessage("");
    setImageData(null);
    setImageFileData(null);
    setSendDisabled(false);
  };

  // Convert posts to message format for display in chat
  const postMessages = communityPosts.map((post, index) => ({
    id: `post-${post.id}`,
    userId: post.id,
    userName: post.author.name,
    avatar: post.author.avatar,
    message: `📝 ${post.content}`,
    timestamp: post.timestamp,
    reactions: [],
    isPost: true,
    post: post,
  }));

  // Combine regular messages with post messages
  const allMessages = [...messages, ...postMessages];

  const flatListRef = useRef(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  // Simulate typing indicator
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      const randomTyping = Math.random() > 0.6;
      setIsTyping(randomTyping);

      if (randomTyping) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(typingAnimation, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(typingAnimation, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();

        setTimeout(() => {
          setIsTyping(false);
          const randomUser =
            mockMembers[Math.floor(Math.random() * mockMembers.length)];
          const newMessage = {
            id: messages.length + 1,
            userId: randomUser.id,
            userName: randomUser.name,
            avatar: randomUser.avatar,
            message: "Just checking in! How's everyone doing today? 😊",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            reactions: [],
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }, 3000);
      }
    }, 10000); // Show typing indicator every 10 seconds

    return () => clearTimeout(typingTimeout);
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, postMessages]);

  const handleBackPress = () => {
    navigation.goBack();
  };
  // Render a single post item
  const renderPostItem = (post) => (
    <View key={post.id} style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <Image
            source={{ uri: post.author.avatar }}
            style={styles.authorAvatar}
          />
          <View style={styles.authorDetails}>
            <View style={styles.authorNameRow}>
              <Text style={styles.authorName}>{post.author.name}</Text>
              <View style={styles.communityBadge}>
                <Text style={styles.communityText}>
                  {post.author.community}
                </Text>
              </View>
            </View>
            <Text style={styles.authorUsername}>
              {post.author.username} · {post.timestamp}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#8954F6" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Post Media */}
      {post.hasMedia && (
        <View style={styles.mediaContainer}>
          <Image source={{ uri: post.mediaUrl }} style={styles.postMedia} />
        </View>
      )}

      {/* Post Actions */}
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={18} color="#8954F6" />
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="repeat-outline" size={18} color="#8954F6" />
          <Text style={styles.actionText}>{post.reposts}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={18} color="#8954F6" />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={18} color="#8954F6" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // useEffect(() => {
  //   fetchMessagesSupabase();
  //   fetchMediaSupabase();
  // }, [groupId]);

  //group chats by date
  const groupChatsByDate = (chats: any[]) => {
    const groupedChats = chats.reduce((acc, chat) => {
      const date = new Date(chat.created_at).toDateString(); // Group by date only
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
    return sortedGroupedChats;
  };

  const Chats = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleModal = (imageUri) => {
      if (imageUri) {
        setSelectedImage(imageUri);
        setModalVisible(true);
      }
    };

    const toggleCloseModal = () => {
      setModalVisible(false);
      setSelectedImage(null);
    };

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
            // console.log("Original attachment:", JSON.stringify(item));
    
            const imageUrls = item
              ? item.split(",").filter((url) => url.trim() !== "")
              : [];
    
            // console.log("Split URLs:", imageUrls);
            // console.log("URLs length:", imageUrls.length);
            // console.log("First URL:", imageUrls[0]);
    
            let itemImg = "";
            if (imageUrls.length === 0) {
              itemImg = item || ""; // Use the attachment string, not the whole item
            } else {
              itemImg = imageUrls[0];
            }
    
            // console.log("Final itemImg:", itemImg);
    
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
    

    const sortedGroupedChats = groupChatsByDate(supabaseGroupChat || []);

    if (isInitialLoad) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8954F6" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      );
    }

    if (supabaseGroupChat.length === 0 && !isInitialLoad) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbox-ellipses-outline" size={48} color="#8954F6" />
          <Text style={styles.emptyTitle}>No Messages Found</Text>
          <Text style={styles.emptyText}>
            Say "Hello 🙌🏻" to start the connection to this community!
          </Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, width: "100%" }}>
        {/* Loading indicator for older messages - only show at top */}
        {isLoadingOlder && hasMoreMessages && (
          <View style={styles.loadingOlderContainer}>
            <ActivityIndicator size="small" color="#8954F6" />
            <Text style={styles.loadingOlderText}>
              Loading older messages...
            </Text>
          </View>
        )}

        <View
          style={{
            alignSelf: "stretch",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end", // Changed to flex-end for bottom alignment
            marginVertical: 10,
          }}
        >
          {sortedGroupedChats.map((group, groupIndex) => (
            <View key={`group-${groupIndex}`} style={{ width: "100%" }}>
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
                  {group.date}
                </Text>
              </View>
              {group.chats.map((item, itemIndex) => (
                <View key={`message-${item._id}`}>
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
                      {item?.senderId != userId && (
                        <UserAvatar item={item} />
                      )}
                      <View style={styles.messageContentWrapper}>
                        {item?.senderId != userId && (
                          <Text style={styles.messageSender}>
                            {item.user.name}
                          </Text>
                        )}
                        <View
                          style={[
                            styles.messageBubble,
                            item?.senderId == userId
                              ? styles.currentUserBubble
                              : styles.otherUserBubble,
                            item?.fileType === "image" && styles.imageBubble, // Special styling for image bubbles
                            item?.fileType === "image" &&
                              item?.message == "" &&
                              styles.imageOnlyBubble, // No padding for image-only messages
                          ]}
                        >
                          {/* Image Preview - Click to Expand */}
                          {item?.fileType === "image" && (
                            <TouchableOpacity
                              onPress={() =>
                                toggleModal(R2_PUBLIC_URL + item?.attachment)
                              }
                              style={[
                                styles.imageContainer,
                                item?.message != "" && styles.imageWithText, // Add margin if there's text below
                              ]}
                            >
                              <Image
                                source={{
                                  uri: R2_PUBLIC_URL + item?.attachment,
                                }}
                                style={[
                                  styles.chatImage,
                                  item?.message == "" && styles.imageOnlyRadius, // Rounded corners for image-only
                                ]}
                              />
                            </TouchableOpacity>
                          )}
                          {item?.message != "" && (
                            <Text
                              style={[
                                styles.messageText,
                                item?.fileType === "image" &&
                                  styles.textWithImage,
                              ]}
                            >
                              {item?.message}
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
                          {/* {item.reactions.length > 0 && (
                                      <View style={styles.reactionsContainer}>
                                        {item.reactions.map((reaction, index) => (
                                          <Text key={index} style={styles.reaction}>
                                            {reaction}
                                          </Text>
                                        ))}
                                      </View>
                                    )} */}
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
                              <Text
                                style={[
                                  styles.messageSender,
                                  // item?.senderId == userId && {
                                  //   color: "rgb(5, 3, 14)",
                                  //   fontFamily: fontFamilies.semiBold,
                                  // },
                                ]}
                              >
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
                            />
                          )}
                          {item?.file_type === "audio" && (
                            <Track_Player
                              Type={item?.attachment}
                              id={item.postId}
                            />
                          )}

                          <Text style={[styles.messageText, { padding: 7 }]}>
                            {item.message}
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
              ))}
              {/* Fullscreen Image Modal */}
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
          ))}
        </View>
      </View>
    );
  };

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

  //delete message function
  const handleDeleteMessage = () => {
    if (selectedMessageId) {
      deleteMessage(selectedMessageId);
      setSelectedMessageId(null);
      DeleteMessageRef.current.close();
    }
  };

  return (
    <LinearGradient colors={["#0f0721", "#0f0721"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            {/* <Ionicons name="arrow-back" size={24} color="white" /> */}
            <ArrowLeftBigIcon width={40} height={40} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerInfo}
            // onPress={() => setShowMembers(!showMembers)}
          >
            {/* <Image
              source={{ uri: community.image }}
              style={styles.communityImage}
            /> */}
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
              //   style={styles.communityImage}
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
        {
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Chats" && styles.activeTab]}
              onPress={() => {
                setActiveTab("Chats");
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
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
        }

        {/* Members List (Collapsible) */}
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
              {/* Messages */}
              {/* <ScrollView
                showsVerticalScrollIndicator={false}
                ref={flatListRef}
                style={{
                  flex: 1,
                  width: "100%",
                }}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: 10,
                  justifyContent:
                    supabaseGroupChat.length === 0 ? "center" : "flex-end", // This will push content to the bottom
                }}
              > */}
              {/* Updated ScrollView with content size handling */}
              <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, width: "100%" }}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: 10,
                  paddingTop: 10,
                  paddingBottom: 20,
                  justifyContent:
                    supabaseGroupChat.length === 0 ? "center" : "flex-end",
                }}
                onScroll={handleScroll}
                scrollEventThrottle={150}
                onScrollBeginDrag={() => setIsUserScrolling(true)}
                onScrollEndDrag={() => {
                  setTimeout(() => setIsUserScrolling(false), 150);
                }}
                onMomentumScrollEnd={() => {
                  setTimeout(() => setIsUserScrolling(false), 100);
                }}
                onContentSizeChange={handleContentSizeChange}
                removeClippedSubviews={true}
                keyboardShouldPersistTaps="handled"
                maintainVisibleContentPosition={
                  isLoadingOlder
                    ? {
                        minIndexForVisible: 0,
                        autoscrollToTopThreshold: 50,
                      }
                    : undefined
                }
                disableIntervalMomentum={true}
                decelerationRate="normal"
                bounces={true}
                bouncesZoom={false}
                alwaysBounceVertical={false}
                overScrollMode="auto"
              >
               
                  <Chats />
                
              </ScrollView>

              {/* Typing indicator */}
              {/* {isTyping && (
                <View style={styles.typingContainer}>
                  <View style={styles.typingBubble}>
                    <Animated.View style={styles.typingDot} />
                    <Animated.View
                      style={[styles.typingDot, { marginLeft: 4 }]}
                    />
                    <Animated.View
                      style={[styles.typingDot, { marginLeft: 4 }]}
                    />
                  </View>
                </View>
              )} */}

              {/* Message Input */}
              {/* Image Preview - shows above input when image is selected */}
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
                    style={[
                      styles.input,
                      imageData && styles.inputWithImage, // Add this style for when image is selected
                    ]}
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

                      await handleSendMessage(); // Don't handle condition again here

                      // You can re-enable the button later if needed in handleSendMessage
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
          ) : activeTab === "Posts" ? (
            // Posts Tab
            <FlatList
              data={communityPosts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => renderPostItem(item)}
              contentContainerStyle={styles.postsContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons
                    name="newspaper-outline"
                    size={48}
                    color="#8954F6"
                  />
                  <Text style={styles.emptyTitle}>No Posts Yet</Text>
                  <Text style={styles.emptyText}>
                    Be the first to mention {community.name} in a post!
                  </Text>
                </View>
              }
            />
          ) : (
            // Media Tab
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
    // borderColor: globalColors.warmPink,
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
    // Add these properties to prevent layout shifts
    overflow: "hidden",
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
    // Add these properties to prevent layout shifts
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
    paddingHorizontal: 16, // Default padding for text-only messages
    paddingVertical: 10,
    // paddingBottom: 8,
  },
  messageText: {
    color: "white",
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    paddingHorizontal: 16, // Default padding for text-only messages
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
    // backgroundColor: "rgba(10, 0, 37, 0.8)",
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
  // mediaItem: {
  //   flex: 1,
  //   margin: 4,
  //   height: 160,
  //   borderRadius: 8,
  //   overflow: "hidden",
  //   position: "relative",
  // },
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
  // Image-specific bubble styles
  imageBubble: {
    padding: 2, // Minimal padding for image bubbles
    overflow: "hidden", // Ensure images don't overflow the bubble
  },

  imageOnlyBubble: {
    padding: 1, // No padding for image-only messages
    // backgroundColor: "transparent", // Let the image show through
  },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "rgba(137, 84, 246, 0.1)", // Add background color
  },

  imageWithText: {
    marginBottom: 8, // Space between image and text
  },

  chatImage: {
    width: width * 0.6,
    height: width * 0.6 * 0.75,
    maxWidth: 250,
    maxHeight: 300,
    minWidth: 150,
    minHeight: 120,
    backgroundColor: "rgba(137, 84, 246, 0.1)", // Add background color for loading
  },

  imageOnlyRadius: {
    borderRadius: 20, // Rounded corners for standalone images
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
    marginTop: 0, // No extra margin since image handles spacing
    paddingHorizontal: 12, // Horizontal padding for text
    paddingVertical: 8, // Vertical padding for text
  },

  // Add these new styles:
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
