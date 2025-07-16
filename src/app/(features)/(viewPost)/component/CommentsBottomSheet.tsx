import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  Component,
} from "react";
import { globalColors } from "@/assets/GlobalColors";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { FlatList } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import {
  CloseIcon,
  PaperPlaneIcon,
  UserIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import {
  useCommentRef,
  useCommentShow,
} from "@/customHooks/CommentUpdateStore";
import { useAppStore } from "@/zustand/zustandStore";
import moment from "moment";
import { fontFamilies } from "@/assets/fonts";
import { Image } from "expo-image";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import useHomeViewModel from "../../(home)/viewModel/HomeViewModel";
import { useAppSelector } from "@/utils/Hooks";
import { useDispatch } from "react-redux";
import { UpdateData } from "@/redux/slice/post/FetchCommentsSlice";
import { onCommentDelete } from "@/redux/reducer/post/CommentDelete";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import DeleteConfirmationView from "./DeleteConfirmationView";

interface CommentsBottomSheetProps {
  commentData?: any;
  isTrending?: boolean | undefined;
  onOpenSheet?: any;
  onPress?: any;
}


// Memoized components
const MemoizedUserIcon = memo(UserIcon);
const MemoizedVerifiedIcon = memo(VerifiedIcon);
const MemoizedPaperPlaneIcon = memo(PaperPlaneIcon);

// Optimized Profile Image Component
const ProfileImage = memo(
  ({ imageUri, size = 38, onPress }: any) => {
    const imageStyle = useMemo(
      () => ({
        borderRadius: size / 2,
        width: size,
        height: size,
        borderColor: globalColors.slateBlueTint20,
        borderWidth: 0.5,
        backgroundColor: globalColors.neutralWhite,
      }),
      [size]
    );

    if (!imageUri || imageUri.length === 0) {
      return (
        <View style={styles.userIconContainer}>
          <MemoizedUserIcon />
        </View>
      );
    }

    return (
      <TouchableOpacity onPress={onPress}>
        <Image
          style={imageStyle}
          contentFit="cover"
          source={{ uri: ImageUrlConcated(imageUri) }}
        />
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.imageUri === nextProps.imageUri &&
      prevProps.size === nextProps.size &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

// Optimized Reply Component
const ReplyItem = memo(
  ({
    reply,
    commentId,
    userId,
    onPress,
    onDeletePress,
    hideReplies,
    index,
    handleReplyPress,
    onDeleteReplyValuePress
  }: any) => {
    console.log("reply", JSON.stringify(reply.comment));
    const isHidden = hideReplies[commentId];
    const canDelete = userId === reply?.user?.id;
    const [isReplyView, setIsReplyView] = useState(false);
    const timeAgo = useMemo(() => {
      return moment.utc(reply?.created_at).utcOffset("+05:30").fromNow(true);
    }, [reply?.created_at]);

    const handleDeletePress = useCallback(() => {
      onDeletePress(reply.id);
    }, [reply.id, onDeletePress]);

    const handleUserPress = useCallback(() => {
      onPress(reply?.user?.id);
    }, [reply?.user?.id, onPress]);

    if (isHidden) return null;

    return (
      <View
        style={[
          styles.commentContainer,
          { marginTop: index == 0 ? "5%" : "1%" },
        ]}
      >
        <ProfileImage
          imageUri={reply?.user?.profile_pic}
          size={30}
          onPress={handleUserPress}
        />

        <View style={styles.commentContentContainer}>
          <View style={styles.userInfoContainer}>
            <TouchableOpacity onPress={handleUserPress}>
              <Text style={styles.userName}>{reply?.user?.full_name}</Text>
            </TouchableOpacity>
            <Text style={[styles.timeText, { fontSize: 11 }]}>{timeAgo}</Text>
          </View>

          <View style={styles.commentTextContainer}>
            <Text style={styles.commentText}>{reply?.comment}</Text>
          </View>
          <View style={[styles.replyButton, { marginTop: "1%" }]}>
            <TouchableOpacity
              onPress={handleReplyPress}
              style={{ marginRight: "5%" }}
            >
              <Text style={styles.replyText}>Reply</Text>
            </TouchableOpacity>
            {canDelete && (
              <TouchableOpacity onPress={handleDeletePress}>
                <Text style={styles.replyText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
          {reply?.replyback?.length > 0 && !isReplyView && (
              <TouchableOpacity
                style={{ ...styles.replyButton, marginTop: "2%" }}
                onPress={() => setIsReplyView(!isReplyView)}
              >
                <Text style={styles.viewRepliesText}>
                  {reply?.replyback?.length == 1
                    ? "View Reply...."
                    : `View ${reply?.replyback?.length} Replies....`}
                </Text>
              </TouchableOpacity>
            )}

            {/* Replies */}
            {isReplyView &&
              reply?.replyback?.map((reply: any, index: number) => (
                <ReplyBackItem
                  key={reply.id}
                  reply={reply}
                  commentId={reply.id}
                  userId={userId}
                  onPress={onPress}
                  onDeleteReplyPress={(replyId) =>{
                    onDeleteReplyValuePress({replyId: replyId, replyCommentId: reply.id})
                    // onDeletePress(replyId, item.id)
                  }}
                  hideReplies={hideReplies}
                  index={index}
                />
              ))}
        </View>
      </View>
    );
  }
);

// Optimized Reply Component
const ReplyBackItem = memo(
  ({
    reply,
    commentId,
    userId,
    onPress,
    onDeleteReplyPress,
    hideReplies,
    index,
  }: any) => {
    console.log("reply", JSON.stringify(reply));
    const isHidden = hideReplies[commentId];
    const canDelete = userId === reply?.user?.id;
    const timeAgo = useMemo(() => {
      return moment.utc(reply?.created_at).utcOffset("+05:30").fromNow(true);
    }, [reply?.created_at]);

    const handleDeletePress = useCallback(() => {
      onDeleteReplyPress(reply.id);
    }, [reply.id, onDeleteReplyPress]);

    const handleUserPress = useCallback(() => {
      onPress(reply?.user?.id);
    }, [reply?.user?.id, onPress]);

    if (isHidden) return null;

    return (
      <View
        style={[
          styles.commentContainer,
          { marginTop: index == 0 ? "5%" : "1%" },
        ]}
      >
        <ProfileImage
          imageUri={reply?.user?.profile_pic}
          size={30}
          onPress={handleUserPress}
        />

        <View style={styles.commentContentContainer}>
          <View style={styles.userInfoContainer}>
            <TouchableOpacity onPress={handleUserPress}>
              <Text style={styles.userName}>{reply?.user?.full_name}</Text>
            </TouchableOpacity>
            <Text style={[styles.timeText, { fontSize: 11 }]}>{timeAgo}</Text>
          </View>

          <View style={styles.commentTextContainer}>
            <Text style={styles.commentText}>{reply?.comment}</Text>
          </View>
            {canDelete && (
              <TouchableOpacity onPress={handleDeletePress}>
                <Text style={styles.replyText}>Delete</Text>
              </TouchableOpacity>
            )}

        </View>
      </View>
    );
    }
);

// High-performance Comment Item using Component
const CommentItem = memo(
  ({
    item,
    userId,
    hideReplies,
    onPress,
    onLongPress,
    onReplyPress,
    onDeleteReplyPress,
    onDeleteReplyValuePress,
    onToggleReplies,
  }: any) => {
    const hasReplies = item?.replies && item.replies.length > 0;
    const canDelete = userId === item?.user?.id;
    const timeAgo = moment
      .utc(item?.created_at)
      .utcOffset("+05:30")
      .fromNow(true);
    const [isView, setIsView] = useState(false);

    return (
      <View>
        <TouchableOpacity
          disabled={!canDelete}
          onLongPress={() => onLongPress(item, hasReplies)}
          style={styles.commentContainer}
        >
          <ProfileImage
            imageUri={item?.user?.profile_pic || ""}
            onPress={() => onPress(item?.user?.id)}
          />

          <View style={styles.commentContentContainer}>
            <View style={styles.userInfoContainer}>
              <TouchableOpacity onPress={() => onPress(item?.user?.id)}>
                <Text style={styles.userName}>{item?.user?.full_name}</Text>
              </TouchableOpacity>
              {item?.user?.verified && (
                <MemoizedVerifiedIcon style={styles.verifiedIcon} />
              )}
              <Text style={styles.timeText}>{timeAgo}</Text>
            </View>

            <View style={styles.commentTextContainer}>
              <Text style={styles.commentText}>{item?.comment}</Text>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={styles.replyButton}
                onPress={() => onReplyPress(item)}
              >
                <Text style={styles.replyText}>Reply</Text>
              </TouchableOpacity>
            </View>
            {item?.replies?.length > 0 && !isView && (
              <TouchableOpacity
                style={{ ...styles.replyButton, marginTop: "2%" }}
                onPress={() => setIsView(!isView)}
              >
                <Text style={styles.viewRepliesText}>
                  {item?.replies?.length == 1
                    ? "View Reply...."
                    : `View ${item?.replies?.length} Replies....`}
                </Text>
              </TouchableOpacity>
            )}

            {/* Replies */}
            {isView &&
              item?.replies?.map((reply: any, index: number) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  commentId={item.id}
                  userId={userId}
                  onPress={onPress}
                  onDeletePress={(replyId) =>
                    onDeleteReplyPress(replyId, item.id)
                  }
                  onDeleteReplyValuePress={(data) =>
                    onDeleteReplyValuePress({replyId: data.replyId, replyCommentId: data.replyCommentId, commentId: item.id})
                  }
                  hideReplies={hideReplies}
                  index={index}
                  handleReplyPress={() => onReplyPress(reply)}
                />
              ))}

            {/* {hasReplies && (
            <TouchableOpacity
              style={styles.hideRepliesButton}
              onPress={() => onToggleReplies(item.id)}
            >
              <Text style={styles.hideRepliesText}>
                {hideReplies[item.id] ? "--View Replies" : "--Hide Replies"}
              </Text>
            </TouchableOpacity>
          )} */}
          </View>
        </TouchableOpacity>
      </View>
    );
  },
  (prevProps: any, nextProps: any) => {
    return (
      prevProps.item?.id === nextProps.item?.id &&
      prevProps.item?.comment === nextProps.item?.comment &&
      prevProps.item?.created_at === nextProps.item?.created_at &&
      prevProps.item?.replies?.length === nextProps.item?.replies?.length &&
      prevProps.userId === nextProps.userId &&
      prevProps.hideReplies === nextProps.hideReplies &&
      prevProps.item?.replies === nextProps.item?.replies
    );
  }
);

const CommentsBottomSheet: FC<CommentsBottomSheetProps> = ({
  onOpenSheet,
  isTrending,
  onPress,
}) => {
  const { enterComment, onEnterCommenthandler, onAddCommentHandler } =
    usePostCommentsHook();
  const {
    inputRef: globalInputRef,
    setCommentId,
    CommentId,
    setReplyingTo,
    replyStatus,
    setReplyStatus,
    repliedId,
    setRepliedId,
    replyingTo,
  } = useCommentRef();

  const postId = usePostDetailStore(useCallback((state) => state.postId, []));
  const userId = useAppStore(useCallback((state) => state.userId, []));
  const setIsComment = usePostDetailStore(
    useCallback((state) => state.setIsComment, [])
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [reComment, setReComment] = useState(0);
  const [replyCommentId, setReplyCommentId] = useState(0);
  const [key, setKey] = useState(null);
  const [hideReplies, setHideReplies] = useState({});
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const autoFocusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();

  const { UpdatedeletePost } = useHomeViewModel();
  const fetchCommentsData = useAppSelector((state) => state.fetchCommentsData);
  const dispatch = useDispatch();
  const setShow_Button = useCommentShow(
    useCallback((state) => state.setShow_Button, [])
  );

  // Memoized values
  const commentsData = useMemo(() => {
    return fetchCommentsData?.data || [];
  }, [fetchCommentsData?.data]);

  const snapPoints = useMemo(() => ["10%", "90%"], []);
  const gradientColors = useMemo(() => ["#2B0A6E", "#07072B", "#000000"], []);

  // Enhanced keyboard listeners with height tracking
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
           console.log("hardwareBackPress");
            return true;
          }
        );
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    const keyboardWillShowListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillShow", (e) => {
            setKeyboardVisible(true);
          })
        : null;

    const keyboardWillHideListener =
      Platform.OS === "ios"
        ? Keyboard.addListener("keyboardWillHide", () => {
            setKeyboardVisible(false);
          })
        : null;

    return () => {
      backHandler.remove();
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  // Auto-focus effect when bottom sheet opens for the first time
  useEffect(() => {
    if (currentIndex === 1 && !hasOpenedBefore) {
      if (autoFocusTimeoutRef.current) {
        clearTimeout(autoFocusTimeoutRef.current);
      }

      autoFocusTimeoutRef.current = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();

          if (Platform.OS === "android") {
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }, 100);
          }
        }
        setHasOpenedBefore(true);
      }, 300);
    }

    return () => {
      if (autoFocusTimeoutRef.current) {
        clearTimeout(autoFocusTimeoutRef.current);
      }
    };
  }, [currentIndex, hasOpenedBefore]);

  // Expose bottom sheet ref to parent
  useEffect(() => {
    if (onOpenSheet && onOpenSheet.current !== bottomSheetRef.current) {
      onOpenSheet.current = bottomSheetRef.current;
    }
  }, [onOpenSheet]);

  // Optimized callbacks
  const handleSheetChange = useCallback(
    (index: number) => {
      setCurrentIndex(index);

      if (index === -1) {
        setShow_Button(true);
        setHasOpenedBefore(false);
        Keyboard.dismiss();
      } else if (index === 1) {
        setShow_Button(false);
      } else if (index === 0) {
        setTimeout(() => {
          if (bottomSheetRef.current) {
            setIsComment(false);
            Keyboard.dismiss();
            bottomSheetRef.current.close();
          }
        }, 100);
      }
    },
    [setShow_Button]
  );

  const handleAddComment = useCallback(
    (data) => {
      if (!data?.trim()) return;

      onAddCommentHandler({
        postId: postId,
        parentId: replyStatus ? CommentId : 0,
        userId: userId,
        content: data,
        timestamp: moment().toISOString(),
      });

      // Clear reply status after sending
      setReplyStatus(false);
      setReplyingTo("");
    },
    [
      postId,
      replyStatus,
      CommentId,
      userId,
      onAddCommentHandler,
      setReplyStatus,
      setReplyingTo,
    ]
  );

  const onPressConfirmHandler = useCallback((key) => {
    setModalVisible(true);
    setKey(key);
  }, []);

  const toggleHideReplies = useCallback((commentId) => {
    setHideReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  }, []);

  const handleReplyDeleteComment = useCallback(
    ({ ReplyId, CommentId, key_type, replyCommentId }) => {
      if (!fetchCommentsData?.data) return;

      const updatedComments = fetchCommentsData.data.map((item) => {
        if (item.id === CommentId) {
          if (key_type === 3) {
          var replyvalues = item.replies.map((reply) => {
            if(reply.id === ReplyId){
              return {
                ...reply,
                replyback: reply.replyback.filter((replyback) => replyback.id !== replyCommentId),
              };
            }
            return reply;
          });
          return {
            ...item,
            replies: replyvalues,
          };
        }
        return {
          ...item,
          replies: item.replies.filter((reply) => reply.id !== ReplyId),
        }
        }
        return item;
      });

      dispatch(UpdateData(updatedComments));
      
      dispatch(
        //@ts-ignore
        onCommentDelete({
          userId: userId,
          commentId: ReplyId,
          postId: postId,
        })
      );
    },
    [fetchCommentsData?.data, dispatch, userId, postId]
  );

  const UpdateDeleteCount = useCallback(
    ({ count }) => {
      UpdatedeletePost(postId, count);
    },
    [UpdatedeletePost, postId]
  );

  const handleDeleteComment = useCallback(
    ({ CommentId }) => {
      if (!fetchCommentsData?.data) return;

      const newData = fetchCommentsData.data.filter(
        (item) => item.id !== CommentId
      );
      
      dispatch(
        //@ts-ignore
        onCommentDelete({
          userId: userId,
          commentId: CommentId,
          postId: postId,
        })
      );

      dispatch(UpdateData(newData));
      setModalVisible(false);
    },
    [fetchCommentsData?.data, dispatch, userId, postId]
  );

  // Optimized render functions
  const handleLongPress = useCallback(
    (item, hasReplies) => {
      setReComment(hasReplies ? item?.replies?.length || 0 : 0);
      setCommentId(item.id);
      onPressConfirmHandler(1);
    },
    [setCommentId, onPressConfirmHandler]
  );

  const handleReplyPress = useCallback(
    (item) => {
      setCommentId(item?.id);
      inputRef.current?.focus();
      setReplyStatus(true);
      setReplyingTo(item?.user);
    },
    [setCommentId, setReplyStatus, setReplyingTo]
  );

  const handleDeleteReplyPress = useCallback(
    (replyId, commentId) => {
      setRepliedId(replyId);
      onPressConfirmHandler(2);
    },
    [setRepliedId, onPressConfirmHandler]
  );
  const handleDeleteReplyValuePress = useCallback(
    ({ replyId, replyCommentId, commentId }) => {
      // handleReplyDeleteComment({ ReplyId: replyId, CommentId: commentId });
      setRepliedId(replyId);
      setReplyCommentId(replyCommentId);
      onPressConfirmHandler(3);
    },
    [setReplyCommentId, onPressConfirmHandler, setRepliedId]
  );

  const renderComment = useCallback(
    ({ item, index }: any) => {
      return (
        <CommentItem
          key={item.id}
          item={item}
          userId={userId}
          hideReplies={hideReplies}
          onPress={onPress}
          onLongPress={handleLongPress}
          onReplyPress={handleReplyPress}
          onDeleteReplyPress={handleDeleteReplyPress}
          onToggleReplies={toggleHideReplies}
          onDeleteReplyValuePress={handleDeleteReplyValuePress}
        />
      );
    },
    [
      userId,
      hideReplies,
      onPress,
      handleLongPress,
      handleReplyPress,
      handleDeleteReplyPress,
      toggleHideReplies,
      fetchCommentsData?.data
    ]
  );

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const ListEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        {fetchCommentsData.isLoaded ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.emptyText}>No Comments</Text>
        )}
      </View>
    );
  }, [fetchCommentsData.isLoaded, fetchCommentsData.data]);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        pressBehavior="close"
        enableTouchThrough={true}
        style={styles.backdropStyle}
      />
    ),
    []
  );

  // Modal handlers
  const handleModalCancel = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleModalConfirm = useCallback(() => {
    setModalVisible(false);
    UpdateDeleteCount({ count: key === 1 ? reComment + 1 : 1 });

    if (key === 1) {
      handleDeleteComment({ CommentId });
    } else if (key === 2) {
      handleReplyDeleteComment({
        ReplyId: repliedId,
        CommentId: CommentId,
        key_type: key,
        replyCommentId: '',
      });
    }
    else if (key === 3) {
      handleReplyDeleteComment({
        ReplyId: repliedId,
        CommentId: CommentId,
        key_type: key,
        replyCommentId: replyCommentId,
      });
    }
  }, [
    key,
    reComment,
    CommentId,
    repliedId,
    UpdateDeleteCount,
    handleDeleteComment,
    handleReplyDeleteComment,
  ]);

  const handleInputBlur = useCallback(() => {
    setReplyStatus(false);
    setCommentId("");
    setReplyingTo("");
  }, [setReplyStatus, setCommentId, setReplyingTo]);

  const handleSendComment = useCallback(() => {
    handleAddComment(enterComment);
  }, [handleAddComment, enterComment]);

  const cancelReply = useCallback(() => {
    setReplyStatus(false);
    setReplyingTo("");
    setCommentId("");
    inputRef.current?.blur();
  }, [setReplyStatus, setReplyingTo, setCommentId]);

  // Calculate keyboard avoiding view behavior and offset
  const keyboardBehavior = Platform.OS === "ios" ? "padding" : "height";
  const keyboardVerticalOffset = useMemo(() => {
    if (Platform.OS === "ios") {
      return insets.bottom;
    }
    return 0;
  }, [insets.bottom]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={currentIndex}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={true}
      enablePanDownToClose
      style={styles.container}
      handleStyle={styles.handleStyle}
      handleIndicatorStyle={styles.handleIndicatorStyle}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <LinearGradient style={styles.gradientContainer} colors={gradientColors}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={keyboardBehavior}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Comments</Text>
            </View>
            {/* Comments List */}
            <View style={styles.listContainer}>
              <FlatList
                data={fetchCommentsData.isLoaded ? [] : commentsData}
                keyExtractor={keyExtractor}
                renderItem={renderComment}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={ListEmptyComponent}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                updateCellsBatchingPeriod={50}
                initialNumToRender={10}
                windowSize={10}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                  paddingBottom: isKeyboardVisible ? 0 : 20,
                }}
              />
            </View>
          </View>
          {/* Comment Input Field - Fixed at bottom */}
          <View
            style={[
              styles.inputOuterContainer,
              {
                marginBottom:isKeyboardVisible ?  insets.bottom + (Platform.OS === "ios" ? 40 : 50) : 0,
              },
            ]}
          >
            {/* Reply Indicator */}
            {replyStatus && replyingTo && (
              <View style={[styles.replyIndicator]}>
                <Text style={styles.replyIndicatorText}>
                  Replying to {replyingTo?.full_name}
                </Text>
                <TouchableOpacity onPress={cancelReply}>
                  <CloseIcon width={24} height={24} />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputContainer}>
              <View style={styles.textInputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.textInput}
                  placeholder="Enter Comment..."
                  placeholderTextColor={globalColors.neutral5}
                  onChangeText={onEnterCommenthandler}
                  value={enterComment}
                  onBlur={handleInputBlur}
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                  scrollEnabled={Platform.OS === "ios"}
                  blurOnSubmit={false}
                />
              </View>

              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendComment}
                disabled={!enterComment?.trim()}
              >
                <MemoizedPaperPlaneIcon />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalCancel}
      >
        <DeleteConfirmationView
          handleModalCancel={handleModalCancel}
          handleModalConfirm={handleModalConfirm}
        />
      </Modal>
    </BottomSheet>
  );
};

export default memo(CommentsBottomSheet);
