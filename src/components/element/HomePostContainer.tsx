import { Share, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React, {
  memo,
  useCallback,
  useRef,
  useMemo,
  Component,
} from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  OptionsIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import PostLikeComponent from "@/app/(features)/(viewPost)/component/PostLikeComponent";
import moment from "moment";
import { useAppStore } from "@/zustand/zustandStore";
import MediaPost from "../MediaPost";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useDeletePostId } from "@/zustand/DeletePostModal";
import { logEvent } from "@/customHooks/useAnalytics";
import { Ionicons } from "@expo/vector-icons";
import RichText from "@/utils/RichText";

interface PostContainerProps {
  data?: any;
  index: number;
  widthVal?: number;
  Type?: string;
  onPressComment?: (postId?: any, userId?: any) => any;
  onPressPostOption?: (data?: any) => any;
  isPlaying?: boolean;
  setCurrentPlaying?: (id: any) => void;
  userInfo?: any;
  postPress?: () => void;
}

// Performance optimized styles - Created once and reused
const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "4%",
    width: "96%",
    marginHorizontal: "3%",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    marginLeft: "2%",
  },
  categoryButton: {
    borderRadius: 50,
    backgroundColor: globalColors.neutral2,
    borderStyle: "solid",
    borderColor: "#a78bfa",
    borderWidth: 0.8,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryText: {
    fontSize: 12,
    fontFamily: fontFamilies.semiBold,
    color: "#a78bfa",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameText: {
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    color: globalColors.neutral_white[200],
  },
  verifiedIcon: {
    marginLeft: 1,
    marginTop: 3,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  timeText: {
    fontSize: 13,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white[300],
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: globalColors.neutral7,
    marginHorizontal: 8,
  },
  groupText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white[300],
  },
  optionsContainer: {
    marginLeft: "2%",
  },
  postContentContainer: {
    flex: 1,
    marginTop: "3%",
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: "2%",
    fontFamily: fontFamilies.medium,
    color: globalColors.neutral_white[100],
    overflow: "hidden",
    paddingHorizontal: "2%",
  },
  readMoreText: {
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutral_white[300],
    marginTop: "0.5%",
    bottom: "3%",
    marginLeft: "2%",
    paddingHorizontal: "2%",
  },
  mediaContainer: {
    marginTop: "1%",
  },
  actionsContainer: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 3,
    marginTop: 5,
    padding: 5,
  },
  actionsLeft: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 16,
    padding: 4,
  },
  commentText: {
    fontSize: 17,
    fontFamily: fontFamilies.regular,
    color: "grey",
    marginLeft: 4,
    marginBottom: 4,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 28,
  },
});

// Memoized components for better performance
const MemoizedImageFallBackUser = memo(ImageFallBackUser);
const MemoizedVerifiedIcon = memo(VerifiedIcon);
const MemoizedOptionsIcon = memo(OptionsIcon);

// Separate PostHeader component for better optimization
const PostHeader = memo(({ 
  data, 
  userId, 
  onPressPostOption,
  onShare,
  userInfo 
}: {
  data: any;
  userId: string;
  onPressPostOption: (data: any) => void;
  onShare: (data: any) => void;
  userInfo: any;
}) => {
  const { setPostId, setPostedByUserId } = usePostDetailStore();
  const { setDeleteUserId } = useDeletePostId();

  const handleProfilePress = useCallback(() => {
    logEvent("post_profile", {
      profile_id: data?.post_by?.id,
    });
    
    if (data?.post_by?.id === userId) {
      router.push({
        pathname: "/ProfileScreen",
        params: { profileId: data?.post_by?.id },
      });
    } else {
      router.push({
        pathname: "/profile/[id]",
        params: {
          id: data?.post_by?.id,
          isProfile: "true",
          isNotification: "false",
        },
      });
    }
  }, [data?.post_by?.id, userId]);

  const handleGroupPress = useCallback(() => {
    logEvent("post_group", {
      group_id: data?.loop_id_conn?.id || data?.loop_group?.id,
    });
    router.push({
      pathname: "/groups",
      params: {
        groupId: data?.loop_id_conn?.id || data?.loop_group?.id,
      },
    });
  }, [data?.loop_id_conn?.id, data?.loop_group?.id]);

  const handleOptionsPress = useCallback(() => {
    onPressPostOption(data);
    setPostId(data?.id);
    setPostedByUserId(data?.post_by?.id);
    setDeleteUserId(data?.post_by?.id);
  }, [data, onPressPostOption, setPostId, setPostedByUserId, setDeleteUserId]);

  const handleSharePress = useCallback(() => {
    onShare({ id: data?.id });
  }, [data?.id, onShare]);

  // Memoize computed values
  const timeAgo = useMemo(() => {
    return moment.utc(data?.time).utcOffset("+05:30").fromNow();
  }, [data?.time]);

  const groupName = useMemo(() => {
    return data?.loop_id_conn?.loop_name || data?.loop_group?.loop_name;
  }, [data?.loop_id_conn?.loop_name, data?.loop_group?.loop_name]);

  const userImage = useMemo(() => {
    return data?.post_by?.id === userInfo?.id ? userInfo?.profile_pic : data?.post_by?.profile_pic;
  }, [data?.post_by?.id, data?.post_by?.profile_pic, userInfo?.id, userInfo?.profile_pic]);

  const userName = useMemo(() => {
    return data?.post_by?.id === userInfo?.id ? userInfo?.full_name : data?.post_by?.full_name;
  }, [data?.post_by?.id, data?.post_by?.full_name, userInfo?.id, userInfo?.full_name]);

  return (
    <View style={{ width: "100%", paddingHorizontal: "2.5%" }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileContainer}
        >
          <MemoizedImageFallBackUser
            imageData={userImage}
            fullName={userName}
            widths={40}
            heights={40}
            borders={40}
          />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <TouchableOpacity
            onPress={handleProfilePress}
            style={styles.nameContainer}
          >
            <Text style={styles.nameText}>{userName}</Text>
            {data?.post_by?.kyc_status === 1 && (
              <MemoizedVerifiedIcon style={styles.verifiedIcon} />
            )}
          </TouchableOpacity>

          <View style={styles.metaContainer}>
            <Text style={styles.timeText}>{timeAgo}</Text>
            <View style={styles.dot} />
            <TouchableOpacity onPress={handleGroupPress}>
              <Text style={styles.groupText}>{groupName}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSharePress}
          style={styles.shareButton}
        >
          <Ionicons name="share-outline" size={22} color={"grey"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOptionsPress}
          style={styles.optionsContainer}
        >
          <MemoizedOptionsIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

// Separate PostContent component
const PostContent = memo(({ 
  data, 
  onPress 
}: { 
  data: any; 
  onPress?: () => void; 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const shouldShowReadMore = useMemo(() => {
    return data?.post_content?.length > 90 && !isExpanded;
  }, [data?.post_content?.length, isExpanded]);

  const numberOfLines = useMemo(() => {
    if (isExpanded) return undefined;
    return data?.post_content?.length < 91 ? 3 : 2;
  }, [isExpanded, data?.post_content?.length]);

  return (
    <TouchableOpacity
      onPress={shouldShowReadMore ? toggleExpand : onPress}
      style={styles.postContentContainer}
      disabled={!shouldShowReadMore && !onPress}
    >
      <Text style={styles.postText} numberOfLines={numberOfLines}>
        {/* {data?.post_content} */}
        {data?.post_content != "" && data?.post_content != null && (
          <RichText text={data?.post_content} mentions={[]} />
        )}
      </Text>
      {shouldShowReadMore && (
        <Text style={styles.readMoreText}>Read more...</Text>
      )}
    </TouchableOpacity>
  );
});

// Separate PostActions component
const PostActions = memo(({ 
  data, 
  onPressComment 
}: { 
  data: any; 
  onPressComment: (postId: any, userId: any) => void; 
}) => {
  const handleCommentPress = useCallback(() => {
    onPressComment(data?.id, data?.post_by?.id);
  }, [data?.id, data?.post_by?.id, onPressComment]);

  const commentCount = useMemo(() => {
    return (
      data?.post_comments_aggregate?.aggregate?.count ||
      data?.comment_count ||
      0
    );
  }, [data?.post_comments_aggregate?.aggregate?.count, data?.comment_count]);

  const categoryName = useMemo(() => {
    return data?.loop_id_conn?.category?.category_name || data?.loop_group?.category?.category_name || "";
  }, [data?.loop_id_conn?.category?.category_name, data?.loop_group?.category?.category_name]);

  const categoryId = useMemo(() => {
    return data?.loop_id_conn?.category?.id || data?.loop_group?.category?.id;
  }, [data?.loop_id_conn?.category?.id, data?.loop_group?.category?.id]);

  const handlePressCategory = useCallback(() => {
    if (categoryId) {
      logEvent("post_category", {
        category_id: categoryId,
      });
      router.push({
        pathname: "/CategoriesPost",
        params: { categoryId: categoryId },
      });
    }
  }, [categoryId]);

  return (
    <View style={styles.actionsContainer}>
      <View style={styles.actionsLeft}>
        <PostLikeComponent
          Liked={(data?.likeByMe || [])?.length > 0 ? 1 : 0}
          count={data?.like_count || 0}
          postId={data?.id}
          updateLikeStatus={() => {}}
        />

        <TouchableOpacity
          onPress={handleCommentPress}
          style={styles.commentButton}
        >
          <Ionicons name="chatbubble-outline" size={23} color="grey" />
          {commentCount !== 0 && (
            <Text style={styles.commentText}>{commentCount}</Text>
          )}
        </TouchableOpacity>
      </View>

      {categoryName ? (
        <TouchableOpacity
          onPress={handlePressCategory}
          style={[
            styles.categoryButton,
            { width: categoryName.length + 85 }
          ]}
        >
          <Text numberOfLines={1} style={styles.categoryText}>
            {categoryName}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
});

// Separate PostMedia component
const PostMedia = memo(({ 
  data, 
  isPlaying, 
  setCurrentPlaying 
}: { 
  data: any; 
  isPlaying?: boolean; 
  setCurrentPlaying?: (id: any) => void; 
}) => {
  if (!data?.file_type) return null;
  switch (data.file_type) {
    case "video":
      return (
        <MediaPost
          source={{
            thumbnail: data?.video_snap_path,
            url: data?.post_video,
          }}
          type={data?.file_type}
          isHome={true}
          isGroup={false}
          onPressView={() => {}}
          display_height={data?.display_height || []}
        />
      );
    
    case "image":
      return (
        <MediaPost
          source={data?.post_image ? data?.post_image.split(",") : []}
          type={data?.file_type}
          isHome={true}
          isGroup={false}
          img_height={[]}
          blurhash={data?.blurhash || []}
          display_height={data?.display_height || []}
        />
      );
    
    case "audio":
      const Track_Player = React.lazy(() => import("../AudioPlayer/TrackPlayer"));
      return (
        <React.Suspense fallback={<View style={{ height: 60 }} />}>
          <Track_Player
            Type={data.post_audio}
            id={data?.id}
            isPlaying={isPlaying}
            setCurrentPlaying={setCurrentPlaying}
          />
        </React.Suspense>
      );
    
    default:
      return null;
  }
});

// Main optimized component
const HomePostContainer = memo(({ 
  data,
  index,
  Type,
  onPressComment,
  onPressPostOption,
  isPlaying,
  setCurrentPlaying,
  userInfo,
  postPress,
}: PostContainerProps) => {
  const { userId } = useAppStore();

  const onShare = useCallback(async ({ id }: { id: string }) => {
    try {
      logEvent("post_share", {
        post_id: id,
        type: Type,
      });
      await Share.share({
        message: `https://qoneqt.com/post/${id}`,
        title: "Share Post",
      });
    } catch (error) {
      console.error(error?.message);
    }
  }, [Type]);

  if (!data) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={postPress}
    >
      <PostHeader
        data={data}
        userId={userId}
        onPressPostOption={onPressPostOption}
        onShare={onShare}
        userInfo={userInfo}
      />

      <PostContent data={data} onPress={postPress} />

      <PostMedia 
        data={data}
        isPlaying={isPlaying}
        setCurrentPlaying={setCurrentPlaying}
      />

      <PostActions
        data={data}
        onPressComment={onPressComment}
      />
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal re-rendering
  return (
    prevProps.data?.id === nextProps.data?.id &&
    prevProps.data?.like_count === nextProps.data?.like_count &&
    prevProps.data?.comment_count === nextProps.data?.comment_count &&
    prevProps.isPlaying === nextProps.isPlaying &&
    prevProps.userInfo?.id === nextProps.userInfo?.id &&
    prevProps.userInfo?.profile_pic === nextProps.userInfo?.profile_pic
  );
});

export default HomePostContainer;