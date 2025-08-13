import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import {
  VerifiedIcon,
} from "@/assets/DarkIcon";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { router } from "expo-router";
import moment from "moment";
import MediaPost from "../MediaPost";

interface SearchPostItemComponentProps {
  post: any;
  onPressPost?: () => void;
}

const SearchPostItemComponent = ({ post, onPressPost }: SearchPostItemComponentProps) => {
  // Safe access with fallback values
  const displayName = post?.post_by?.full_name || 'Unknown User';
  const loopName = post?.loop_group?.loop_name || '';
  const postTitle = post?.post_title || post?.post_content || '';

  return (
    <TouchableOpacity
      onPress={() => onPressPost()}
      key={post.id}
      style={{
        borderRadius: 16,
        borderStyle: "solid",
        width: "100%",
        flexDirection: "row",
        paddingVertical: "4%",
        marginTop: "3%",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          width: "96%",
          marginHorizontal: "2%",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ImageFallBackUser
              imageData={post?.post_by?.profile_pic}
              fullName={post?.post_by?.full_name || "U"}
              widths={30}
              heights={30}
              borders={16}
            />
            <View style={{ marginLeft: 9 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 16,
                    fontFamily: fontFamilies.medium,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {displayName}
                </Text>
                {post?.post_by?.is_verified && (
                  <VerifiedIcon style={{ marginLeft: 4, bottom: 2 }} />
                )}
              </View>
              <View style={{ flexDirection: "row", marginTop: 2 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutral8,
                  }}
                >
                   {moment
                                      .utc(post.time)
                                      .utcOffset("+05:30")
                                      .format("DD MMM YYYY, h:mm A")}
                  {/* {moment.utc(post.time).utcOffset("+05:30").fromNow()} */}
                </Text>
                <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: globalColors.neutral8,
                    marginLeft: 6,
                    marginTop: "3%",
                  }}
                />
                <Text
                  style={{
                    fontSize: 10,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutral9,
                    marginLeft: 4,
                  }}
                >
                  {loopName}
                </Text>
              </View>
            </View>
          </View>
          {/* <TouchableOpacity>
            <OptionsIcon style={{ marginTop: -4 }} />
          </TouchableOpacity> */}
        </View>

        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontFamily: fontFamilies.medium,
              color: globalColors.neutralWhite,
            }}
            numberOfLines={2}
          >
            {postTitle}
          </Text>
          <MediaPost
            source={
              post.post_image
                ? post.post_image.split(",")
                : post?.post_video
                ? { thumbnail: post?.video_snap_path, url: post?.post_video }
                : []
            }
            type={post.file_type}
            isHome={false}
            display_height={[]}
          />
        </View>
        {/* Uncomment for like/comment buttons */}
        {/* <View style={{ flexDirection: "row", marginTop: 16 }}>
          <TouchableOpacity style={{ flexDirection: "row", marginRight: 8 }}>
            <LikeIcon />
            <Text
              style={{
                fontSize: 12,
                lineHeight: 13,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginLeft: 4,
              }}
            >
              {post.like_count}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: "row" }}>
            <CommentIcon />
            <Text
              style={{
                fontSize: 12,
                lineHeight: 13,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginLeft: 4,
              }}
            >
              {post.post_comments_aggregate.aggregate.count}
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

export default SearchPostItemComponent;
