import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { InfoIcon, OptionsIcon } from "@/assets/DarkIcon";
import moment from "moment";

type ItemProps = {
  categoryName: string;
  channelName: string;
  channelLogo: string;
  channelId: number;
  messagerName: string;
  lastMsg: string;
  lastMsgTime: string;
  unReadCount: number;
  onPressChannel: any;
  onLongPress: any;
  showChannelOption: boolean;
  onPressMore: any;
  selectedChannel: number;
};

const ChannelItemComponent = ({
  categoryName,
  channelName,
  channelLogo,
  channelId,
  lastMsg,
  lastMsgTime,
  messagerName,
  unReadCount,
  onPressChannel,
  onLongPress,
  onPressMore,
  showChannelOption,
  selectedChannel,
}: ItemProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: globalColors.neutral2,
      }}
    >
      <TouchableOpacity
        // onLongPress={() =>
        //   onLongPress({
        //     channelItem: { channelId: channelId, channelName: channelName },
        //   })
        // }
        onPress={
          () =>
            router.push({
              pathname: "/ChannelChatScreen",
              params: {
                id: channelId,
                from: 2,
                name: channelName,
                logo: channelLogo,
              },
            })

          // router.push({
          //   pathname: "/ChannelChatScreen",
          //   params: { id: channelId },
          // })
          // onLongPress(channelId)
        }
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 10,

          width: showChannelOption ? "70%" : "90%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "75%",
          }}
        >
          {channelLogo && channelLogo.length > 0 ? (
            <Image
              source={{ uri: ImageUrlConcated(channelLogo) }}
              style={{ height: 50, width: 50, borderRadius: 5 }}
              contentFit="contain"
            />
          ) : (
            <Image
              source={require("@/assets/image/emptyGroupIcon.png")}
              style={{ height: 50, width: 50, borderRadius: 5 }}
              contentFit="contain"
            />
          )}

          <View style={{ marginLeft: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 20,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                }}
              >
                {channelName}
              </Text>
              {/* <View
                style={{
                  borderRadius: 16,
                  backgroundColor: globalColors.neutral3,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 10,
                    lineHeight: 16,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {true ? "Public" : "Private"}
                </Text>
              </View> */}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.light,
                  color: globalColors.neutralWhite,
                }}
              >
                #{channelName}
              </Text>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral8,
                  marginLeft: 8,
                  width: "60%",
                }}
              >
                {lastMsg}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: "25%",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
              left: "15%",
              bottom: "25%",
            }}
          >
            {moment.utc(lastMsgTime).utcOffset("+05:30").format("h:mm A")}
          </Text>
          {unReadCount > 10 ? (
            <View
              style={{
                borderRadius: 16,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                justifyContent: "center",
                alignItems: "center",
                width: "50%",
                marginTop: 4,
                padding: "2%",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                {"+" + unReadCount}
              </Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>

      {showChannelOption && selectedChannel === channelId ? (
        <View
          style={{
            height: "100%",
            width: "30%",
            backgroundColor: globalColors.neutral7,
            alignItems: "center",
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={onPressMore}
            style={
              {
                // backgroundColor: globalColors?.neutral6,
              }
            }
          >
            <OptionsIcon width={24} height={24} />
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutral4,
              }}
            >
              More
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default ChannelItemComponent;

const styles = StyleSheet.create({});
