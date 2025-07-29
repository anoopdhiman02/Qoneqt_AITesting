import React, { useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { VerifiedIcon } from "@/assets/DarkIcon";
import { router } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import { Image } from "expo-image";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import moment from "moment";
import MediaPost from "../MediaPost";


const SearchHashtagItemComponent = ({ item, onPressPost }) => {
  const { hashtag, postsCount, trending, description } = item;
  const {
    post_by,
    post_content,
    post_image,
    file_type,
    post_title,
    time,
    kyc_status,
    profile_pic,
    loop_id_conn,
    video_snap_path,
    post_video,
  } = item;

  return (
    <TouchableOpacity
      onPress={() =>
        onPressPost()
      }
      key={item.id}
      style={{
        borderRadius: 16,
        borderWidth: 1,
        width: "100%",
        flexDirection: "row",
        paddingVertical: "4%",
        marginTop: "3%",
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "column", width: "100%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ImageFallBackUser
              imageData={post_by?.profile_pic}
              fullName={post_by?.full_name}
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
                  {post_by?.full_name}
                </Text>
                {kyc_status || (
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
                    .utc(time)
                    .utcOffset("+05:30")
                    .format("DD MMM YYYY, h:mm A")}
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
                    color: globalColors.neutral8,
                    marginLeft: 4,
                  }}
                >
                  {loop_id_conn?.loop_name || item?.loop_group?.loop_name}
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
            {post_content}
          </Text>
          <MediaPost source={post_image ? post_image.split(",") : post_video ? {thumbnail: video_snap_path, url: post_video} : []} type={file_type} isHome={true} />
          {/* <Image
            style={{
              borderRadius: 8,
              width: "100%",
              height: 200,
              marginTop: 12,
            }}
            contentFit="cover"
            source={{
              uri: post_image
                ? ImageUrlConcated(post_image)
                : require("./../../assets/image/emptyPost.jpg"),
            }}
          /> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchHashtagItemComponent;
