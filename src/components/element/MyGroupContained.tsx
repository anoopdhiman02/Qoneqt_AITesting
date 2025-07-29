import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import moment from "moment";
import Track_Player from "../AudioPlayer/TrackPlayer";

import { LinearGradient } from "expo-linear-gradient";
import { VerifiedIcon } from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import { useAppStore } from "@/zustand/zustandStore";
import MediaPost from "../MediaPost";
import { useIdPickerStore, userShowPicker } from "@/zustand/ReactionModalStore";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { onPostLike } from "@/redux/reducer/post/PostLikeApi";
import { updateReactions } from "@/redux/slice/group/GroupFeedsListSlice";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { logEvent } from "@/customHooks/useAnalytics";
import TrackPlayer from "react-native-track-player";
import { useDispatch } from "react-redux";
import { upgradePostData } from "@/redux/slice/post/PostDetailSlice";

const { width } = Dimensions.get("window");

const REACTIONS = [
  { id: 1, emoji: "👍" },
  { id: 2, emoji: "😁" },
  { id: 3, emoji: "❤️" },
  { id: 4, emoji: "😮" },
  { id: 5, emoji: "🥳" },
  { id: 6, emoji: "👏" },
];
interface PostContainerProps {
  data?: any;
  isPlaying?: boolean;
  setCurrentPlaying?: (id: any) => void;
  index?: number;
  PostData?: any;
  setPost?: any;
}

const MyPostContainer = ({
  data,
  index,
  PostData,
  isPlaying,
  setCurrentPlaying,
  setPost,
}: PostContainerProps) => {
  const { userId } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const Dispatch = useAppDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const { setShowPicker, showPicker } = userShowPicker();
  const { Pickerid, setPcikerID } = useIdPickerStore();
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const groupFeedsListData = useAppSelector(
    (state) => state.groupFeedsListData
  );
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
const dispatch = useDispatch();
  useEffect(() => {
    if (!showPicker) {
      setSelectedReaction(null);
      setIsExpanded(false);
      setPcikerID(null);
    }
  }, [showPicker]);

  scale.value = withSequence(withSpring(1.3, { damping: 3, stiffness: 100 }));

  translateY.value = withSequence(
    //@ts-ignore
    withSpring(-10, {
      stiffness: 1000,
      duration: 200,
      velocity: 100,
    }),
    withSpring(0, { damping: 4, stiffness: 200, velocity: 100 })
  );

  //@ts-ignore
  const emojiAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });
  const emojiAnimationMove = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const UpdateEmoji = (reactionId: number, postId: number) => {
    setPost((prevPostData: any) => {
      return prevPostData.map((item: any) => {
        if (item.id === postId) {
          const updatedLikes = [{ id: postId, reaction: reactionId }];
          return { ...item, likes: updatedLikes };
        }
        return item;
      });
    });
  };

  const removeEmoji = (reactionId: number, postId: number) => {
    setPost((prevData) => {
      return prevData.map((item: any) => {
        if (item.id === postId) {
          const updatedLikes = [{ id: postId, reaction: "" }];
          return { ...item, likes: updatedLikes };
        }
        return item;
      });
    });
  };

  const onPressPost = (data: any) => {
      logEvent("group_post_click", {
        post_id: data?.id,
        type: "Group Post",
      });
  
      if (data.file_type == "video") {
        TrackPlayer.stop();
      }
  
      dispatch(upgradePostData(data));

      router.push({
        pathname: "/post/[id]",
        params: { id: data?.id, isNotification: "here" },
      })
    };

  const renderPost = (inModal: boolean = false) => (
    <TouchableOpacity
    activeOpacity={1}
      style={styles.postContent}
      onPress={() =>
        onPressPost(data)
      }
    >
      <View style={styles.userInfo}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname:
                data?.post_by?.id === userId
                  ? "/ProfileScreen"
                  : "/profile/[id]",
              params: {
                id: data?.post_by?.id,
                isNotification: "false",
                isProfile: "true",
              },
            })
          }
        >
          <ImageFallBackUser
            imageData={data?.post_by?.profile_pic}
            fullName={data?.post_by?.full_name}
            widths={30}
            heights={30}
            borders={15}           />
        </TouchableOpacity>
        <View style={styles.userNameContainer}>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname:
                  data?.post_by?.id === userId
                    ? "/ProfileScreen"
                    : "/profile/[id]",
                params: {
                  id: data?.post_by?.id,
                  isNotification: "false",
                  isProfile: "true",
                },
              })
            }
            style={styles.userNameRow}
          >
            <Text style={styles.userName}>{data?.post_by?.full_name}</Text>
            <VerifiedIcon style={styles.verifiedIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          onPressPost(data)
        }
        style={styles.postTextContainer}
      >
        {(data?.file_type === "video" || data?.file_type === "image") && (
          <MediaPost
            source={
              data?.file_type === "video"
                ? {thumbnail: data?.video_snap_path, url: data?.post_video}
                : data?.file_type === "audio"
                ? data?.post_image
                : data?.post_image
                ? data?.post_image.split(",")
                : []
            }
            isHome={false}
            isGroup={true}
            type={data?.file_type}
          />
        )}

        <View>
          
          {data?.file_type === "audio" && (
            <Track_Player
              Type={data?.post_audio}
              id={data?.id}
              isPlaying={isPlaying}
              setCurrentPlaying={setCurrentPlaying}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={toggleExpand}
          disabled={data?.post_content?.length < 100}
        >
          <Text
            style={styles.postText}
            numberOfLines={
              isExpanded ? undefined : data?.post_content?.length > 100 ? 2 : 3
            }
          >
            {data?.post_content}
          </Text>
          {data?.post_content?.length > 100 && !isExpanded && (
            <Text style={styles.readMore}>Read more...</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.timestamp}>
          {moment.utc(data?.time).utcOffset("+05:30").fromNow()}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View>
      <LinearGradient
        colors={globalColors.cardBg3}
        start={{ x: -4.2, y: 2 }}
        end={{ x: -4, y: -5 }}
        key={index}
        style={[
          styles.postContainer,
          {
            alignSelf: data?.post_by?.id === userId ? "flex-end" : "flex-start",
          },
          showPicker && { width: "90%", alignSelf: "center" },
        ]}
      >
        <View style={styles.postWrapper}>
          <TouchableOpacity
            onLongPress={() => {
              if (!showPicker) {
                setPcikerID(data?.id);
                setShowPicker(true);
              }
            }}
          >
            {renderPost()}
          </TouchableOpacity>
        </View>
      </LinearGradient>
      {data?.likes?.length > 0 && data?.likes?.[0]?.reaction !== "" && (
        <View
          style={[
            styles.reactionStrip,
            {
              alignSelf:
                data?.post_by?.id === userId ? "flex-end" : "flex-start",
            },
          ]}
        >
          {data?.likes?.map((item: any, index: number) => (
            <Animated.View style={emojiAnimationMove}>
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setModalVisible(true);
                }}
                style={styles.reactionButton}
              >
                <Text style={styles.reactionText}>
                  {item?.reaction == 1
                    ? "👍"
                    : item?.reaction == 2
                    ? "😁"
                    : item?.reaction == 3
                    ? "❤️"
                    : item?.reaction == 4
                    ? "😮"
                    : item?.reaction == 5
                    ? "🥳"
                    : item?.reaction == 6
                    ? "👏"
                    : item?.reaction}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}

      <Modal
        transparent
        visible={showPicker && Pickerid === data?.id}
        animationType="fade"
        onDismiss={() => {
          setSelectedReaction(null);
          setShowPicker(false);
          setIsExpanded(false);
          setPcikerID(null);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setSelectedReaction(null);
            setShowPicker(false);
            setIsExpanded(false);
            setPcikerID(null);
          }}
        >
          <View style={styles.modalContainer}>
            <LinearGradient
              colors={globalColors.cardBg3}
              start={{ x: -4.2, y: 2 }}
              end={{ x: -4, y: -5 }}
              style={[
                styles.postContainer,
                { width: "90%", alignSelf: "center" },
              ]}
            >
              {renderPost(true)}
            </LinearGradient>
            <View style={styles.emojiPicker}>
              {REACTIONS.map((reaction) => (
                <TouchableOpacity
                  key={reaction.id}
                  onPress={() => {
                    Dispatch(
                      onPostLike({
                        postId: data?.id,
                        liked: 1,
                        userId: userId,
                        reaction: reaction.id,
                      })
                    );
                    emojiAnimationMove;
                    setSelectedReaction(reaction.emoji);
                    setShowPicker(false);
                    UpdateEmoji(reaction.id, data?.id);
                  }}
                  style={styles.emojiOption}
                >
                  <Animated.View style={emojiAnimation}>
                    <Text style={styles.emojiText}>{reaction.emoji}</Text>
                  </Animated.View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: globalColors.neutral2,
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: fontFamilies.bold,
                color: globalColors.neutralWhite,
                marginBottom: 10,
              }}
            >
              Remove Reaction
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Are you sure you want to remove?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  minWidth: 100,
                  alignItems: "center",
                  backgroundColor: globalColors.neutral4,
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  minWidth: 100,
                  alignItems: "center",
                  backgroundColor: globalColors.neutral4,
                }}
                onPress={() => {
                  setModalVisible(false);
                  Dispatch(
                    onPostLike({
                      postId: data?.id,
                      liked: 0,
                      userId: userId,
                      reaction: null,
                    })
                  );
                  removeEmoji(0, data?.id);
                }}
              >
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default MyPostContainer;

const styles = StyleSheet.create({
  postContainer: {
    borderRadius: 20,
    borderColor: globalColors.neutral2,
    borderWidth: 1,
    width: (width * 88) / 120,
    overflow: "hidden",
    flexDirection: "row",
    marginRight: "1%",
    minHeight: 50,
    justifyContent: "center",
    alignItems: "flex-start",
    marginVertical: "3%",
  },
  postWrapper: {
    width: "100%",
    position: "relative",
  },
  postContent: {
    width: "90%",
    height: "auto",
    margin: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userNameContainer: {
    alignItems: "flex-start",
    marginLeft: 9,
  },
  userNameRow: {
    flexDirection: "row",
  },
  userName: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutralWhite,
  },
  verifiedIcon: {
    bottom: 3,
    left: "8%",
  },
  postTextContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  postText: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutralWhite,
    marginTop: "5%",
    marginBottom: "1%",
  },
  readMore: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral9,
    marginTop: 2,
    marginBottom: "5%",
  },
  timestamp: {
    fontSize: 10.3,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    alignSelf: "flex-end",
  },
  reactionStrip: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    borderWidth: 0.01,
    borderColor: globalColors.neutral8,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    // elevation: 5,
    zIndex: 1000,
  },
  reactionButton: {
    paddingHorizontal: 3,
  },
  reactionText: {
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  emojiPicker: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 40,
    flexDirection: "row",
    width: Dimensions.get("window").width * 0.9,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  emojiOption: {
    padding: 8,
  },
  emojiText: {
    fontSize: 30,
  },
});
