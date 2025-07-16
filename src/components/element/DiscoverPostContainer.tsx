import {
  Dimensions,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useRef, useState } from "react";
import { Image, ImageBackground } from "expo-image";
import { router } from "expo-router";
import moment from "moment";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  ChannelsIcon,
  ChatIcon,
  CommentIcon,
  LikeIcon,
  OptionsIcon,
  ReferAndEarnUpdated01Icon,
  Repost02Icon,
  ShareIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import index from "../../app";
import { fontFamilies } from "@/assets/fonts";
import BottomSheetWrap from "../bottomSheet/BottomSheetWrap";
import PostLikeComponent from "@/app/(features)/(viewPost)/component/PostLikeComponent";
import { useAppStore } from "@/zustand/zustandStore";
import MediaPost from "../MediaPost";
import { useAppSelector } from "@/utils/Hooks";
import { useDispatch } from "react-redux";
import { setHomePostSlice } from "@/redux/slice/home/HomePostSlice";
import { useIdStore } from "@/customHooks/CommentUpdateStore";

const { width } = Dimensions.get("window");

interface PostContainerProps {
  data?: any;
  Type?: string;

  index?: number;
  widthVal?: number;
  onPressProfile?: () => void;
  onPressGroup?: () => void;
  onPressMore?: void;
  onPressPost?: () => void;
  onPressLike?: void;
  onPressComment?: (postId: any) => any;
  onPressShare?: () => void;
  onPressGift?: () => void;
  onPressReport?: (data: any) => void;
  containerStyle?: ViewStyle;
}

const DiscoverPostContainer = ({
  data,
  index,
  Type,
  widthVal,
  onPressComment,
  onPressReport,
  containerStyle,
}: PostContainerProps) => {
  const { userId } = useAppStore();
  const buttonVisibleRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const HomePostResponse = useAppSelector((state) => state.HomePostResponse);
  const dispatch = useDispatch();
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const { id, setID } = useIdStore();

  const onShare = async ({ id }) => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/post/${id}`,
        // url: `https:/qoneqt.com/post/${id}`,
        title: "Share Post",
      });
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateLikeStatus = (isLike) => {
    var updateData = HomePostResponse?.UpdatedData.map((item, index) => {
      if (item?.id == data?.id) {
        return {
          ...item,
          like_byMe: !isLike
            ? [...item.like_byMe, userId]
            : item.like_byMe.filter((id) => id !== userId),
          like_count: !isLike ? item.like_count + 1 : item.like_count - 1,
        };
      }
      return item;
    });
    dispatch(setHomePostSlice(updateData));
  };
  return (
    <LinearGradient
      colors={globalColors.cardBg3}
      start={{ x: -4.2, y: 2 }}
      end={{ x: -4, y: -5 }}
      key={index}
      style={{
        borderRadius: 16,
        borderStyle: "solid",
        borderColor: globalColors.neutral2,
        borderWidth: 1,
        width: (width * 88) / 100,
        overflow: "hidden",
        flexDirection: "row",
        marginRight: "1%",
        height: (width * 80 * (402 / 300)) / 100,
        justifyContent: "center",
        alignItems: "center",
        ...containerStyle,
      }}
    >
      <View style={{ width: "90%", height: "90%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                data?.post_by?.id === userId
                  ? router.push({
                      pathname: "/ProfileScreen",
                      params: { profileId: data?.post_by?.id },
                    })
                  : router.push({
                      pathname: "/profile/[id]",
                      params: {
                        id: data?.post_by?.id,
                        isProfile: "true",
                        isNotification: "false",
                      },
                    });
              }}
            >
              <ImageFallBackUser
                imageData={data?.post_by?.profile_pic}
                fullName={data?.post_by?.full_name}
                widths={35}
                heights={35}
                borders={16}
              />
            </TouchableOpacity>

            <View style={{ alignItems: "flex-start", marginLeft: 9 }}>
              <TouchableOpacity
                onPress={() => {
                  data?.post_by?.id === userId
                    ? router.push({
                        pathname: "/ProfileScreen",
                        params: { profileId: data?.post_by?.id },
                      })
                    : router.push({
                        pathname: "/profile/[id]",
                        params: {
                          id: data?.post_by?.id,
                          isProfile: "true",
                          isNotification: "false",
                        },
                      });
                }}
                style={{
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 16,
                    fontFamily: fontFamilies.medium,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {data?.post_by?.full_name}
                </Text>

                {data?.post_by?.kyc_status == 1 && (
                  <VerifiedIcon style={{ bottom: 6, left: 4.5 }} />
                )}
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    lineHeight: 16,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutralWhite,
                    marginLeft: 7,
                  }}
                >
                  {moment.utc(data?.time).utcOffset("+05:30").fromNow()}
                </Text>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: globalColors.neutral8,
                    marginLeft: 6,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "/groups",
                      params: { groupId: data?.loop_id_conn?.id || data?.loop_group?.id },
                    });
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      lineHeight: 16,
                      fontFamily: fontFamilies.regular,
                      color: globalColors.neutralWhite,
                      marginLeft: 5,
                    }}
                  >
                    {data?.loop_id_conn?.loop_name || data?.loop_group?.loop_name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              onPressReport(data?.post_by);
            }}
          >
            <OptionsIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          scrollEnabled={false}
        >
          {/* Post Content */}
          <TouchableOpacity onPress={toggleExpand}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,
                marginTop: "5%",
              }}
              numberOfLines={
                isExpanded ? undefined : data?.post_content.length > 100 ? 2 : 3
              }
            >
              {data?.post_content}
            </Text>
            {data?.post_content.length > 100 && !isExpanded && (
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral9,
                  marginTop: 2,
                }}
              >
                {isExpanded ? "Read Less" : "Read More..."}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            disabled={buttonVisibleRef.current}
            onPress={() => {
              if (buttonVisibleRef.current) return; // Prevent multiple clicks
              buttonVisibleRef.current = true;
              setID("2");
              router.push({
                pathname: "/post/[id]",
                params: { id: data?.id, postData: JSON.stringify(data), index: index, Type: Type, isNotification: "here" },
              });
              setTimeout(() => {
                buttonVisibleRef.current = false; // Reset after a delay
              }, 1000);
            }}
            style={{ marginTop: 10 }}
          >
            <MediaPost
              source={
                data?.file_type === "video"
                  ? {thumbnail: data?.video_snap_path, url: data?.post_video}
                  : data?.post_image ? data?.post_image.split(",") : [] 
              }
              isHome={true}
              type={data?.file_type}
            />
          </TouchableOpacity>
        </ScrollView>

        {/* Like, Comment, and Share Section */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "50%",
            top: 8,
          }}
        >
          <PostLikeComponent
            Liked={(data?.likeby_me|| data?.like_ByMe || data?.likeByMe)?.length > 0 ? 1 : 0}
            count={(data?.like_count || 0) + (data?.likes_aggregate?.aggregate?.count || 0)}
            postId={data?.id}
            updateLikeStatus={updateLikeStatus}
          />

          <TouchableOpacity
            onPress={() => onPressComment(data?.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <CommentIcon height={24} width={24} />
            <Text
              style={{
                fontSize: 18,
                lineHeight: 18,
                fontFamily: fontFamilies.regular,
                color: globalColors.warmPink,
                marginLeft: 4,
              }}
            >
              {data?.post_comments_aggregate?.aggregate?.count}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onShare({ id: data?.id })}
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              marginLeft: 16,
            }}
          >
            <ShareIcon height={24} width={24}/>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default DiscoverPostContainer;

const styles = StyleSheet.create({});
