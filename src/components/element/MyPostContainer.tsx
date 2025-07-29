import {
  Dimensions,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { router } from "expo-router";
import moment from "moment";
import Track_Player from "../AudioPlayer/TrackPlayer";
import {
  CommentIcon,
  ShareIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import PostLikeComponent from "@/app/(features)/(viewPost)/component/PostLikeComponent";
import { useAppStore } from "@/zustand/zustandStore";
import MediaPost from "../MediaPost";
import { useAppDispatch } from "@/utils/Hooks";
import { ClearData } from "@/redux/slice/post/FetchCommentsSlice";
import PostImage from "../PostImage";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import PostVideo from "../PostVideo";
import TrackPlayer from "react-native-track-player";
import { logEvent } from "@/customHooks/useAnalytics";
import { useDispatch } from "react-redux";
import { upgradePostData } from "@/redux/slice/post/PostDetailSlice";

const { width } = Dimensions.get("window");

interface PostContainerProps {
  data?: any;
  Type?: string;
  index?: number;
  onPressProfile?: () => void;
  onPressGroup?: () => void;
  onPressMore?: void;
  onPressPost?: () => void;
  onPressLike?: void;
  onPressComment?: (postId?: any, PostData?: any, userId?: any) => any;
  onPressShare?: () => void;
  onPressGift?: () => void;
  onPressPostDelete?: (postId?: any) => void;
  isProfile?: boolean;
  isPlaying?: boolean;
  setCurrentPlaying?: (id: any) => void;
  isSelf?: boolean | undefined;
  isGroup?: boolean | undefined;
  isHome?: boolean | undefined;
}

const MyPostContainer = React.memo(({
  data,
  index,
  Type,
  onPressComment,
  onPressPostDelete,
  isPlaying,
  setCurrentPlaying,
  isSelf=false,
  isGroup=false,
  isHome=false,
}: PostContainerProps) => {
  const { userId } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  // Memoize derived values to prevent unnecessary recalculations
  const derivedData = useMemo(() => {
    const fileType = data?.file_type;
    const isMediaPost = fileType === "video" || fileType === "image";
    const isAudio = fileType === "audio";
    const postId = data?.id;
    const postById = data?.post_by?.id;
    const isOwnPost = postById === userId;
    const commentCount = data?.post_comments_aggregate?.aggregate?.count || data?.comment_count || 0;
    const likeCount = data?.like_count || 0;
    const isLiked = (data?.likeby_me|| data?.likeByMe)?.length > 0 ? 1 : 0;
    const postContent = data?.post_content || "";
    const shouldShowReadMore = postContent.length > 100 && !isExpanded;
    const profilePic = data?.post_by?.profile_pic;
    const fullName = data?.post_by?.full_name;
    const timeAgo = moment.utc(data?.time).utcOffset("+05:30").fromNow();
    const loopName = data?.loop_id_conn?.loop_name || data?.loop_group?.loop_name || "";
    const categoryName = data?.loop_id_conn?.category?.category_name || data?.loop_group?.category?.category_name || "";
    const categoryId = data?.loop_id_conn?.category?.id || data?.loop_group?.category?.id;
    const groupId = data?.loop_id_conn?.id || data?.loop_group?.id;
    
    return {
      fileType,
      isMediaPost,
      isAudio,
      postId,
      postById,
      isOwnPost,
      commentCount,
      likeCount,
      isLiked,
      postContent,
      shouldShowReadMore,
      profilePic,
      fullName,
      timeAgo,
      loopName,
      categoryName,
      categoryId,
      groupId,
    };
  }, [data, userId, isExpanded]);

  // Memoize callbacks to prevent unnecessary re-renders
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const onShare = useCallback(async () => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/post/${derivedData.postId}`,
        title: "Share Post",
      });
    } catch (error) {
      console.error(error.message);
    }
  }, [derivedData.postId]);

  const handlePressProfile = useCallback(() => {
    if (derivedData.isOwnPost) {
      router.push({ 
        pathname: "/ProfileScreen", 
        params: { profileId: derivedData.postById } 
      });
    } else {
      router.push({
        pathname: "/profile/[id]",
        params: { 
          id: derivedData.postById, 
          isProfile: "true", 
          isNotification: "false" 
        },
      });
    }
  }, [derivedData.isOwnPost, derivedData.postById]);

  const handlePressPost = useCallback(() => {

    logEvent("post_click", {
            post_id: data?.id,
            type: "Post",
          });
      
          if (data.file_type == "video") {
            TrackPlayer.stop();
          }
      
          dispatch(upgradePostData(data));
    
          router.push({
            pathname: "/post/[id]",
            params: { id: derivedData.postId, Type: Type, isNotification: "here" },
          })
  }, [derivedData.postId]);

  const handlePressComment = useCallback(() => {
    onPressComment?.(derivedData.postId, derivedData.postById);
  }, [onPressComment]);

  const handlePressGroup = useCallback(() => {
    if (derivedData.groupId) {
      router.push({
        pathname: "/groups",
        params: { groupId: derivedData.groupId },
      });
    }
  }, [derivedData.groupId]);

  const handlePressCategory = useCallback(() => {
    if (derivedData.categoryId) {
      router.push({
        pathname: "/CategoriesPost",
        params: { categoryId: derivedData.categoryId },
      });
    }
  }, [derivedData.categoryId]);

  // Memoize media rendering to prevent unnecessary re-renders
  const renderMedia = useCallback(() => {
    if (derivedData.fileType === "video") {
      return (
        <View>
          <MediaPost
                        source={{
                          thumbnail: data?.video_snap_path,
                          url: data?.post_video,
                        }}
                        type={data?.file_type}
                        isHome={true}
                        isGroup={false}
                        onPressView={() => {
                          // handlePress();
                        }}
                      />
         
        </View>
      );
    }
    
    if (derivedData.fileType === "image") {
      return (
        <PostImage
          source={data?.post_image ? data.post_image.split(",") : []}
          type={derivedData.fileType}
          isHome={isHome}
          isGroup={false}
          blurhash={data?.blurhash || []}
          img_height={data?.img_height || []}
        />
      );
    }
    
    if (derivedData.fileType === "audio") {
      return (
        <Track_Player
          Type={data.post_audio}
          id={derivedData.postId}
          isPlaying={isPlaying}
          setCurrentPlaying={setCurrentPlaying}
        />
      );
    }
    
    return <View/>;
  }, [
    derivedData.fileType, 
    derivedData.postId, 
    data?.post_image, 
    data?.post_audio, 
    isPlaying, 
  ]);

  // Memoize styles that depend on dynamic values
  const dynamicStyles = useMemo(() => ({
    headerMarginTop: derivedData.isMediaPost || derivedData.isAudio ? 3 : 10,
    bottomMarginTop: (derivedData.isMediaPost || derivedData.isAudio) ? 30 : 30,
    bottomMarginBottom: derivedData.isMediaPost || derivedData.isAudio ? 30 : 30,
  }), [derivedData.isMediaPost, derivedData.isAudio]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePressPost}>
        {/* Header Section */}
        <View
          style={[styles.header, { marginTop: dynamicStyles.headerMarginTop }]}
        >
          <View style={styles.userInfo}>
            <TouchableOpacity disabled={isSelf} onPress={handlePressProfile}>
              <ImageFallBackUser
                imageData={derivedData.profilePic}
                fullName={derivedData.fullName}
                widths={35}
                heights={35}
                borders={16}
              />
            </TouchableOpacity>

            <View style={styles.userDetails}>
              <TouchableOpacity
                disabled={isSelf}
                onPress={handlePressProfile}
                style={styles.nameContainer}
              >
                <Text style={styles.userName}>{derivedData.fullName}</Text>
                <VerifiedIcon style={styles.verifiedIcon} />
              </TouchableOpacity>

              <View style={styles.metaInfo}>
                <Text style={styles.dateTime}>{derivedData.timeAgo}</Text>
                <View style={styles.dot} />
                <TouchableOpacity
                  disabled={isGroup}
                  style={styles.groupContainer}
                  onPress={handlePressGroup}
                >
                  <Text style={styles.groupName} numberOfLines={2}>
                    {derivedData.loopName}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View >
            <TouchableOpacity onPress={onShare} style={styles.shareButton}>
              {/* <ShareIcon height={24} width={24} /> */}
               <Ionicons name="share-outline" size={24} color={"grey"} />
            </TouchableOpacity>
            {/* <TouchableOpacity
            // onPress={handleOptionsPress}
            // style={styles.optionsContainer}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={22}
                color="#8e8e93"
              />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text
            style={styles.postContent}
            numberOfLines={
              isExpanded
                ? undefined
                : derivedData.postContent.length > 100
                ? 2
                : 3
            }
          >
            {derivedData.postContent}
          </Text>
          {derivedData.shouldShowReadMore && (
            <Text onPress={toggleExpand} style={styles.readMore}>
              Read more...
            </Text>
          )}
        </View>

        {/* Media Section */}
        <View style={styles.mediaSection}>{renderMedia()}</View>
      </TouchableOpacity>

      {/* Actions Section */}
      <View
        style={[
          styles.actionsSection,
          {
            marginTop: dynamicStyles.bottomMarginTop,
            marginBottom: dynamicStyles.bottomMarginBottom,
          },
        ]}
      >
        <View style={styles.actionsContainer}>
          <PostLikeComponent
            Liked={derivedData.isLiked}
            count={derivedData.likeCount}
            postId={derivedData.postId}
            updateLikeStatus={() => {}}
          />

          <TouchableOpacity
            onPress={handlePressComment}
            style={styles.commentButton}
          >
            <Ionicons name="chatbubble-outline" size={23} color="grey" />
            {derivedData.commentCount > 0 && (
              <Text style={styles.commentCount}>
                {derivedData.commentCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {derivedData.categoryName ? (
          <TouchableOpacity
            onPress={handlePressCategory}
            style={styles.categoryButton}
          >
            <Text numberOfLines={1} style={styles.categoryText}>
              {derivedData.categoryName}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});

MyPostContainer.displayName = 'MyPostContainer';

export default MyPostContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 20,

    borderColor: "#a621ff1f",
    borderWidth: 0.3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 8,
  },
  userInfo: {
    flexDirection: "row",
    width: "80%",
  },
  userDetails: {
    alignItems: "flex-start",
    marginLeft: 10,
  },
  nameContainer: {
    flexDirection: "row",
    width: "100%",
  },
  userName: {
    fontSize: 14,
    lineHeight: 16,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutral_white["200"],
  },
  verifiedIcon: {
    bottom: 3,
    left: "8%",
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateTime: {
    fontSize: 10.3,
    lineHeight: 16,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white["300"],
    marginLeft: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: globalColors.neutral7,
    marginLeft: 6,
  },
  groupContainer: {
    marginRight: 10,
  },
  groupName: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white["300"],
    marginLeft: 5,
    width: "100%",
  },
  categoryButton: {
    borderRadius: 50,
    backgroundColor: globalColors.neutral2,
    borderStyle: "solid",
    borderColor: globalColors.slateBlueTint20,
    borderWidth: 0.8,
    padding: 5.5,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    right: 10,
    position: "absolute",
  },
  categoryText: {
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.slateBlueTint20,
  },
  contentSection: {
    marginTop: 10,
    marginHorizontal: 8,
  },
  postContent: {
    fontSize: 14,
    fontFamily: fontFamilies.medium,
    color: globalColors.neutral_white["100"],
  },
  readMore: {
    fontSize: 14,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white["300"],
    marginTop: 2,
  },
  mediaSection: {
    marginTop: 2,
    marginBottom: 2,
  },
  actionsSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    // bottom: "2%",
    // borderColor: "white",
    // borderWidth: 0.5,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "absolute",
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginBottom: 2,
  },
  commentCount: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fontFamilies.regular,
    // color: globalColors.warmPink,
    color: "grey",
    marginLeft: 5,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginLeft: 24,
    marginBottom: 6,
  },
});