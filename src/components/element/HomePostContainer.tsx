import { Share, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import React, {
  memo,
  useCallback,
  useRef,
  useState,
  useMemo,
  Component,
  PureComponent,
} from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  ChannelsIcon,
  ChatIcon,
  CommentIcon,
  LikeIcon,
  OptionsIcon,
  Repost02Icon,
  ShareIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import BottomSheetWrap from "../bottomSheet/BottomSheetWrap";
import PostLikeComponent from "@/app/(features)/(viewPost)/component/PostLikeComponent";
import moment from "moment";
import { showToast } from "../atom/ToastMessageComponent";
import { useAppStore } from "@/zustand/zustandStore";
import MediaPost from "../MediaPost";
import { useAppSelector } from "@/utils/Hooks";
import { updateDiscoverData } from "@/redux/slice/home/DiscoverPostSlice";
import { useDispatch } from "react-redux";
import useHomeViewModel from "@/app/(features)/(home)/viewModel/HomeViewModel";
import { useIdStore } from "@/customHooks/CommentUpdateStore";
import Track_Player from "../AudioPlayer/TrackPlayer";
import { onDeletePost } from "@/redux/reducer/post/DeletePost";
import { useDeletePostId, useDeletePostModal } from "@/zustand/DeletePostModal";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import {logEvent } from "@/customHooks/useAnalytics";

interface PostContainerProps {
  data?: any;
  index: number;
  widthVal?: number;
  Type?: string;
  onPressProfile?: () => void;
  onPressGroup?: () => void;
  onPressMore?: void;
  onPressPost?: () => void;
  onPressLike?: void;
  onPressComment?: (postId?: any, userId?: any) => any;
  onPressShare?: () => void;
  onPressGift?: () => void;
  onPressPostOption?: (data?: any) => any;
  isPlaying?: boolean;
  setCurrentPlaying?: (id: any) => void;
  onDeletePostoption?: () => void;
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
    marginHorizontal: "2%",
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
      // top: -10,
      borderRadius: 8,
      backgroundColor: globalColors.neutral2,
      borderStyle: "solid",
      borderColor: globalColors.warmPink,
      borderWidth: 0.5,
      padding: 5,
      justifyContent: "center",
      alignItems: "center",
      // right: 14,
      marginTop: 5,
      marginLeft: 10,
      // alignSelf: "flex-end",
    },
    categoryText: {
      fontSize: 12,
      fontFamily: fontFamilies.semiBold,
      color: globalColors.neutral_white["200"],
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
    fontSize: 12,
    lineHeight: 14,
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
    // width: "100%",
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
    fontSize: 18,
    fontFamily: fontFamilies.regular,
    color: globalColors.warmPink,
    marginLeft: 4,
    marginBottom: 4,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 28,
    marginTop: "-2%",
  },
  bottomSheetContainer: {
    alignItems: "center",
    marginTop: "10%",
  },
  bottomSheetTitle: {
    color: globalColors.neutralWhite,
    fontSize: 23,
    textAlign: "center",
    marginBottom: "3%",
  },
  shareOptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  shareOptionTitle: {
    color: globalColors.neutralWhite,
    fontSize: 18,
    marginTop: "1%",
  },
  shareOptionSubtitle: {
    marginTop: "2.5%",
    color: "gray",
    fontSize: 12,
  },
  shareMessageTitle: {
    color: globalColors.neutralWhite,
    fontSize: 18,
    marginTop: "7%",
  },
});

// Memoized components for better performance
const MemoizedImageFallBackUser = memo(ImageFallBackUser);
const MemoizedVerifiedIcon = memo(VerifiedIcon);
const MemoizedOptionsIcon = memo(OptionsIcon);
const MemoizedCommentIcon = memo(CommentIcon);
const MemoizedShareIcon = memo(ShareIcon);
const MemoizedMediaPost = memo(MediaPost);
const MemoizedTrackPlayer = memo(Track_Player);
const MemoizedPostLikeComponent = memo(PostLikeComponent);

interface PostHeaderProps {
  data?: any;
  userId?: string;
  onPressProfile?: (userId?: any) => void;
  onPressGroup?: (groupId?: any) => void;
  onPressPostOption?: (data?: any) => void;
  setPostId?: (postId?: any) => void;
  setPostedByUserId?: (postedByUserId?: any) => void;
  setDeleteUserId?: (deleteUserId?: any) => void;
}

// High-performance PostHeader component
const PostHeader = memo(
  ({
    data,
    userId,
    onPressProfile,
    onPressGroup,
    onPressPostOption,
    setPostId,
    setPostedByUserId,
    setDeleteUserId,
  }: PostHeaderProps) => {
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
      onPressPostOption({
        userData: data?.postBy || data?.post_by,
        groupData: data?.loop_group,
      });
      setPostId(data?.id);
      setPostedByUserId(data?.post_by?.id);
      setDeleteUserId(data?.post_by?.id);
    }, [
      data,
      onPressPostOption,
      setPostId,
      setPostedByUserId,
      setDeleteUserId,
    ]);

    const timeAgo = useMemo(() => {
      return moment.utc(data?.time).utcOffset("+05:30").fromNow();
    }, [data?.time]);

    const groupName = useMemo(() => {
      return data?.loop_id_conn?.loop_name || data?.loop_group?.loop_name;
    }, [data?.loop_id_conn?.loop_name, data?.loop_group?.loop_name]);


    return (
      <View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={handleProfilePress}
          style={styles.profileContainer}
        >
          <MemoizedImageFallBackUser
            imageData={data?.post_by?.profile_pic}
            fullName={data?.post_by?.full_name}
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
            <Text style={styles.nameText}>{data?.post_by?.full_name}</Text>
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
          onPress={handleOptionsPress}
          style={styles.optionsContainer}
        >
          <MemoizedOptionsIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison for optimal re-rendering
    return (
      prevProps.data?.id === nextProps.data?.id &&
      prevProps.data?.post_by?.id === nextProps.data?.post_by?.id &&
      prevProps.data?.post_by?.full_name ===
        nextProps.data?.post_by?.full_name &&
      prevProps.data?.post_by?.profile_pic ===
        nextProps.data?.post_by?.profile_pic &&
      prevProps.data?.post_by?.kyc_status ===
        nextProps.data?.post_by?.kyc_status &&
      prevProps.data?.time === nextProps.data?.time &&
      prevProps.userId === nextProps.userId
    );
  }
);

// Optimized PostContent component
const PostContent = memo(
  ({ data, onPress }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = useCallback(() => {
      setIsExpanded(!isExpanded);
    }, [isExpanded]);

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
          {data?.post_content}
        </Text>
        {shouldShowReadMore && (
          <Text style={styles.readMoreText}>Read more...</Text>
        )}
      </TouchableOpacity>
    );
  },
  (prevProps: any, nextProps: any) => {
    return (
      prevProps.data?.post_content === nextProps.data?.post_content &&
      prevProps.onPress === nextProps.onPress
    );
  }
);

// Optimized PostMedia component
const PostMedia = memo(
  ({ data, handlePress, isPlaying, setCurrentPlaying }: any) => {
    if (!data?.file_type) return null;

    switch (data.file_type) {
      case "video":
        return (
          <MemoizedMediaPost
            source={data?.post_video}
            type={data?.file_type}
            isHome={true}
            isGroup={false}
            onPressView={handlePress}
          />
        );
      case "image":
        return (
          <MemoizedMediaPost
            source={data?.post_image ? data?.post_image.split(",") : []}
            type={data?.file_type}
            isHome={true}
            isGroup={false}
          />
        );
      case "audio":
        return (
          <MemoizedTrackPlayer
            Type={data.post_audio}
            id={data?.id}
            isPlaying={isPlaying}
            setCurrentPlaying={setCurrentPlaying}
          />
        );
      default:
        return null;
    }
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data?.file_type === nextProps.data?.file_type &&
      prevProps.data?.post_video === nextProps.data?.post_video &&
      prevProps.data?.post_image === nextProps.data?.post_image &&
      prevProps.data?.post_audio === nextProps.data?.post_audio &&
      prevProps.data?.id === nextProps.data?.id &&
      prevProps.isPlaying === nextProps.isPlaying &&
      prevProps.setCurrentPlaying === nextProps.setCurrentPlaying
    );
  }
);

// Optimized PostActions component
const PostActions = memo(
  ({ data, onPressComment, onShare }: any) => {
    const handleCommentPress = useCallback(() => {
      onPressComment(data?.id, data?.post_by?.id);
    }, [data?.id, data?.post_by?.id, onPressComment]);

    const handleSharePress = useCallback(() => {
      onShare({ id: data?.id });
    }, [data?.id, onShare]);

    const commentCount = useMemo(() => {
      return (
        data?.post_comments_aggregate?.aggregate?.count ||
        data?.comment_count ||
        0
      );
    }, [data?.post_comments_aggregate?.aggregate?.count, data?.comment_count]);

    const likeCount = useMemo(() => {
      return data?.like_count + (data?.likes_aggregate?.aggregate?.count || 0);
    }, [data?.like_count]);

    const isLiked = useMemo(() => {
      return (data?.like_byMe || data?.likeByMe)?.length > 0 ? 1 : 0;
    }, [data?.like_byMe, data?.likeByMe]);
    const categoryName = data?.loop_id_conn?.category?.category_name || data?.loop_group?.category?.category_name || "";
    const categoryId = data?.loop_id_conn?.category?.id || data?.loop_group?.category?.id;
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
          <MemoizedPostLikeComponent
            Liked={isLiked}
            count={likeCount}
            postId={data?.id}
            updateLikeStatus={() => {}} // Implement if needed
          />

          <TouchableOpacity
            onPress={handleCommentPress}
            style={styles.commentButton}
          >
            <MemoizedCommentIcon height={24} width={24} />
            {commentCount != "0" && (
              <Text style={styles.commentText}>{commentCount}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSharePress}
            style={styles.shareButton}
          >
            <MemoizedShareIcon height={24} width={24} />
          </TouchableOpacity>
        </View>
        {categoryName ? (
                  <TouchableOpacity onPress={() => {handlePressCategory()}} style={{...styles.categoryButton, width: categoryName.length +85}}>
                    <Text numberOfLines={1} style={styles.categoryText}>
                      {categoryName}
                    </Text>
                  </TouchableOpacity>
                ) : null}
      </View>
    );
  },
  (prevProps: any, nextProps: any) => {
    return (
      prevProps.data?.id === nextProps.data?.id &&
      prevProps.data?.like_count === nextProps.data?.like_count &&
      prevProps.data?.comment_count === nextProps.data?.comment_count &&
      prevProps.data?.like_byMe === nextProps.data?.like_byMe &&
      prevProps.data?.likeByMe === nextProps.data?.likeByMe &&
      prevProps.onPressComment === nextProps.onPressComment
    );
  }
);

// Main component using PureComponent for maximum performance
class HomePostContainer extends PureComponent<PostContainerProps> {
  private handlePress = () => {
    logEvent("post_click", {
      post_id: this.props.data?.id,
      type: this.props.Type,
    });
    const { Type, data, index } = this.props;
    const { setID } = useIdStore.getState();
    const videoRef = useVideoPlayerStore.getState().videoRef;
    const isVideoPlaying = useVideoPlayerStore.getState().isPlay;

    if (Type === "home") {
      setID("3");
    } else if (Type === "trending") {
      setID("4");
    }
if (videoRef && isVideoPlaying) {
  videoRef.pauseAsync(); // pause when navigating away
}
    router.push({
      pathname: "/post/[id]",
      params: {
        id: data?.id,
        profileId: data?.post_by?.id,
        postData: JSON.stringify(data),
        Type: Type as any,
        isNotification: "here",
        profilePic: data?.post_by?.profile_pic,
        name: data?.post_by?.full_name,
        postTime: data?.time,
        groupId: data?.loop_id_conn?.id || data?.loop_group?.id,
        groupName: data?.loop_group?.loop_name || "",
        categoryType: data?.category_type,
        description: data?.post_content,
        postImage: data.post_image,
        postVideo: data.post_video,
        postAudio: data.post_audio,
        postType: data.file_type,
        categoryName: data?.loop_group?.category.category_name,
      },
    });
  };

  private onShare = async ({ id }: { id: string }) => {
    try {
      logEvent("post_share", {
        post_id: id,
        type: this.props.Type,
      });
      const result = await Share.share({
        message: `https://qoneqt.com/post/${id}`,
        title: "Share Post",
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  render() {
    const {
      data,
      Type,
      index,
      onPressComment,
      onPressPostOption,
      isPlaying,
      setCurrentPlaying,
    } = this.props;

    const { userId } = useAppStore.getState();
    const { setPostId, setPostedByUserId } = usePostDetailStore.getState();
    const { setDeleteUserId } = useDeletePostId.getState();
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={this.handlePress}
      >
        <PostHeader
          data={data}
          userId={userId}
          onPressPostOption={onPressPostOption}
          setPostId={setPostId}
          setPostedByUserId={setPostedByUserId}
          setDeleteUserId={setDeleteUserId}
        />

        <PostContent data={data} onPress={this.handlePress} />

        <View style={{flex: 1 }}>
          {data?.file_type === "video" && (
            <MediaPost
              source={{thumbnail: data?.video_snap_path, url: data?.post_video}}
              type={data?.file_type}
              isHome={true}
              isGroup={false}
              onPressView={() => {
                // handlePress();
              }}
            />
          )}
          {data?.file_type === "image" && (
            <MediaPost
              source={data?.post_image ? data?.post_image.split(",") : []}
              type={data?.file_type}
              isHome={true}
              isGroup={false}
              img_height={[]}
              blurhash={data?.blurhash || []}
            />
          )}
          {data?.file_type === "audio" && (
            <Track_Player
              Type={data.post_audio}
              id={data?.id}
              isPlaying={isPlaying}
              setCurrentPlaying={setCurrentPlaying}
            />
          )}
        </View>
       
        <PostActions
          data={data}
          onPressComment={onPressComment}
          onShare={this.onShare}
        />
      </TouchableOpacity>
    );
  }
}

export default HomePostContainer;
