import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { VerifiedIcon } from "@/assets/DarkIcon";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { router } from "expo-router";
import { useAppStore } from "@/zustand/zustandStore";

const SearchProfileItemComponent = ({ profileData, index }) => {
  const { userId } = useAppStore();
  const { full_name, social_name, username, kyc_status, profile_pic, id } =
    profileData;

  return (
    <TouchableOpacity
      key={index}
      onPress={() => {
        id === userId
          ? router.push({
              pathname: "/ProfileScreen",
              params: { profileId: id },
            })
          : router.push({
              pathname: "/profile/[id]",
              params: { id: id, isProfile: "true", isNotification: "false" },
            });
      }}
      style={{
        borderRadius: 16,
        backgroundColor: globalColors.neutral2,
        borderStyle: "solid",
        borderColor: globalColors.neutral3,
        borderWidth: 2,
        width: "100%",
        overflow: "hidden",
        marginVertical: 16,
      }}
    >
      <View style={{ padding: "4%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ImageFallBackUser
              imageData={profile_pic}
              fullName={full_name}
              widths={50}
              heights={50}
              borders={25}
            />
            <View style={{ marginLeft: 16, width: "75%" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 18,
                    lineHeight: 22,
                    fontFamily: fontFamilies.medium,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {full_name}
                </Text>
                {kyc_status === 1 && <VerifiedIcon style={{ marginLeft: 6 }} />}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral9,
                }}
              >
                @{social_name || username}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SearchProfileItemComponent;
