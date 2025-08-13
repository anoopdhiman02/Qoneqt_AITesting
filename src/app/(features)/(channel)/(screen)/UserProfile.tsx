import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { FlashIcon, OptionsIcon, VerifiedIcon } from "@/assets/DarkIcon";

const UserProfile = () => {
  return (
    <View
      style={{
        borderRadius: 8,
        borderStyle: "solid",
        borderColor: "#565957",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: "4%",
        marginBottom: "50%",
        width: "100%",
      }}
    >
      <TouchableOpacity onPress={() => console.log("image")}>
        <Image
          style={{
            borderRadius: 24,
            width: 40,
            height: 40,
          }}
          contentFit="cover"
          source={require("@/assets/image/shortimage.png")}
        />
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "column",
          marginLeft: 12,
        }}
      >
        <View
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => console.log("Deekshith")}>
            <Text
              style={{
                fontSize: 14,
                letterSpacing: -0.1,
                lineHeight: 20,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
              }}
            >
              Deekshith
            </Text>
          </TouchableOpacity>
          <VerifiedIcon />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            @deekshith998
          </Text>
          <View
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              backgroundColor: globalColors.neutral7,
              marginLeft: 8,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 8,
            }}
          >
            <FlashIcon />

            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.light,
                color: globalColors.neutralWhite,
                marginLeft: 4,
              }}
            >
              8500 perks
            </Text>
          </View>
        </View>
      </View>
      <OptionsIcon width={24} height={24} />
    </View>
  );
};

export default UserProfile;
