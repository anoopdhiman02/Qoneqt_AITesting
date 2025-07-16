import React, { useState } from "react";
import { Image } from "expo-image";
import { Text, View, TouchableOpacity } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import TextInputComponent from "../../components/element/TextInputComponent";
import { CloseIcon, LockIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
const Caption = () => {
  return (
    <View style={{ marginTop: "5%" }}>
      <Text
        style={{
          alignSelf: "stretch",
          fontSize: 20,
          lineHeight: 26,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutralWhite,
          textAlign: "center",
        }}
      >
        Sorry! No results found
      </Text>
      <Text
        style={{
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: 14,
          lineHeight: 18,
          textAlign: "center",
          marginTop: 12,
        }}
      >
        We could not find any search for{" | "}
        <Text
          style={{
            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
          }}
        >
          Game
        </Text>
      </Text>
    </View>
  );
};
const Images = () => {
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
      }}
    >
      <Image
        style={{
          width: 250,
          height: 250,
          alignSelf: "center",
        }}
        contentFit="cover"
        source={require("@/assets/image/image1.png")}
      />
    </View>
  );
};
const SearchNotFoundModal = () => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const SuggestedGroup = () => {
    return (
      <View style={{ width: "100%" }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              lineHeight: 26,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
              textAlign: "center",
            }}
          >
            Suggested groups
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 21,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
              }}
            >
              See all
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderRadius: 16,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            width: "50%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4%",
            marginLeft: "5%",
            marginTop: "5%",
          }}
        >
          <View
            style={{
              alignSelf: "stretch",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={{ left: "550%" }}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          <View
            style={{
              alignSelf: "stretch",
              height: 92,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity>
              <Image
                style={{
                  borderRadius: 8,
                  width: 64,
                  height: 64,
                }}
                contentFit="cover"
                source={require("./../../assets/image/emptyPost.jpg")}
              />
            </TouchableOpacity>
            <View
              style={{
                alignSelf: "stretch",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "8%",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fontFamilies.medium,
                  color: globalColors.neutralWhite,
                  textAlign: "center",
                }}
              >
                Game zone
              </Text>
              <LockIcon />
            </View>
          </View>
          <View
            style={{
              alignSelf: "stretch",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "8%",
            }}
          >
            <TouchableOpacity
              style={{
                borderRadius: 16,
                borderStyle: "solid",
                borderColor: "#3d3c4b",
                borderWidth: 0.5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 6,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 13,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                #PS5
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderRadius: 16,
                borderStyle: "solid",
                borderColor: "#3d3c4b",
                borderWidth: 0.5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 6,
                paddingVertical: 4,
                marginLeft: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 13,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                #GTA
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderRadius: 16,
                borderStyle: "solid",
                borderColor: "#3d3c4b",
                borderWidth: 0.5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 6,
                paddingVertical: 4,
                marginLeft: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 13,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                +5
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleFollow}
            style={{
              alignSelf: "stretch",
              borderRadius: 8,
              backgroundColor: "#020015",
              borderStyle: "solid",
              borderColor: "#e27af8",
              borderWidth: 0.5,
              height: 34,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              marginTop: "8%",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 15,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,
                marginLeft: 8,
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <ViewWrapper>
      <View style={{ width: "90%" }}>
        <TextInputComponent placeHolder="Game |" />
        <Caption />
        <Images />
        <SuggestedGroup />
      </View>
    </ViewWrapper>
  );
};
export default SearchNotFoundModal;
