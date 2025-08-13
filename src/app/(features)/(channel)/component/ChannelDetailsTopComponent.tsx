import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { router } from "expo-router";
import { ArrowLeftBigIcon, ArrowLeftIcon } from "@/assets/DarkIcon";

export interface headerProps {
  groupId: number | string;
  name: string;
  logo: string;
  channelCount: number;
  memberCount: number;
  userRole: number;
  onCreateChannel: () => void;
}

const ChannelDetailsTopComponent = ({
  groupId,
  channelCount,
  logo,
  memberCount,
  name,
  onCreateChannel,
  userRole,
}: headerProps) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderColor: "rgba(255, 255, 255, 0.2)",
        marginTop: "10%",
      }}
    >
      <View
        style={{
          width: "80%",
          flexDirection: "row",
          alignItems: "center",
          left: "-2%",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftBigIcon />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/groups",
              params: { groupId: groupId },
            });
          }}
          style={{ marginLeft: "3%" }}
        >
          {/* {logo && logo.length > 0 ? (
            <Image
              style={{
                borderRadius: 8,
                width: 60,
                height: 60,
                backgroundColor: globalColors.neutralWhite,
              }}
              contentFit="cover"
              source={{ uri: ImageUrlConcated(logo) }}
            />
          ) : (
            <Image
              style={{
                borderRadius: 8,
                width: 55,
                height: 55,
              }}
              contentFit="cover"
              source={require("@/assets/image/emptyGroupIcon.png")}
            />
          )} */}
          <ImageFallBackUser
                            imageData={logo}
                            fullName={name}
                            widths={60}
                            heights={60}
                            borders={5}
                          />
        </TouchableOpacity>
        <View
          style={{
            width: "100%",
            marginLeft: "3%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 22,
                width: "50%",

                textTransform: "capitalize",
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
              }}
            >
              {name}
            </Text>

            {/* //comment static data  */}

            {/* <TouchableOpacity
              style={{
                borderRadius: 16,
                backgroundColor: globalColors.neutral3,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 6,
                paddingVertical: 4,
                marginLeft: 3,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                Public
              </Text>
            </TouchableOpacity> */}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 12,
            }}
          >
            {/* <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamilies.light,
                color: globalColors.neutralWhite,
              }}
            >
              {channelCount} sub-group
            </Text> */}
            {/* <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: globalColors.neutral7,
                marginLeft: 8,
              }}
            /> */}
            <Text
              style={{
                fontSize: 12,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginLeft: 4,
              }}
            >
              {memberCount} members
            </Text>
          </View>
        </View>
      </View>

      {userRole > 0 && (
        <TouchableOpacity
          style={{
            width: "15%",
            alignItems: "flex-end",
          }}
          onPress={() =>
            router.push({
              pathname: "/CreateChannelScreen",
              params: { groupId: groupId },
            })
          }
        >
          <Image
            source={require("@/assets/image/mediumPlusIcon.png")}
            style={{ width: 50, height: 50 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChannelDetailsTopComponent;

const styles = StyleSheet.create({});
