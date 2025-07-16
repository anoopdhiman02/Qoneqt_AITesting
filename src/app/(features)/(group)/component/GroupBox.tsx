import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { Image } from "expo-image";
import { GroupIcon } from "@/assets/DarkIcon";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");

interface GroupProps {
  id: number;
  logo: string;
  name: string;
  memberCount: number | string;
  onPressGroup: any;
}

const GroupBox = ({
  id,
  logo,
  name,
  memberCount,
  onPressGroup,
}: GroupProps) => {

  const formatNumber = (num: number | string) => {
    if (Number(num) >= 1_000_000) {
      return (Number(num) / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (Number(num) >= 1_000) {
      return (Number(num) / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return `${num}`;
  };
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: globalColors.darkOrchidShade80,
        flexDirection: "column",
        alignSelf: "center",
        justifyContent: "center",
        padding: "5%",
        width: (width * 45) / 110,
        height: (width * 70 * (120 / 190)) / 100,
        margin: "2%",
        right: "-5%",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          
          router.push({
            pathname: "/groups",
            params: { groupId: id },
          });
        }}
      >
        <View style={{ alignItems: "center" }}>
        <ImageFallBackUser
          isGroupList={true}
          imageData={logo}
          fullName={name}
          widths={64}
          
          heights={64}
          borders={8}
          />
          </View>

        <Text
          style={{
            fontSize: 14,
            lineHeight: 15,
            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
            textAlign: "center",
            marginTop: "10%",
          }}
          numberOfLines={2}
        >
          {name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <GroupIcon />
          <Text
            style={{
              fontSize: 13,
              lineHeight: 16,
              fontFamily: fontFamilies.regular,
              color: globalColors.darkOrchidTint20,
              marginLeft: 8,
            }}
          >
            {formatNumber(memberCount)} followers
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default GroupBox;

const styles = StyleSheet.create({});
