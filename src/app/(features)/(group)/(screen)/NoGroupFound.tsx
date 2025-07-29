import * as React from "react";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import { CloseIcon, LockIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useScreenTracking } from "@/customHooks/useAnalytics";
const NoGroupFound = () => {
  useScreenTracking("NoGroupFound");
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
  };

  const Suggested = () => (
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
        }}
      >
        Suggested groups
      </Text>
      <TouchableOpacity onPress={() => console.log("See all")}>
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
  );

  const MainComp = () => (
    <View style={{ width: "100%", flexDirection: "row", marginTop: "5%" }}>
      <View
        style={{
          borderRadius: 16,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          width: 156,
          padding: 16,
          marginLeft: 16,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <CloseIcon />
        </View>
        <View
          style={{
            height: 92,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 5,
          }}
        >
          <TouchableOpacity onPress={() => console.log("Clicked")}>
            <Image
              style={{ borderRadius: 8, width: 64, height: 64 }}
              // contentFit="cover"
              source={require("./../../../../assets/image/emptyPost.jpg")}
            />
          </TouchableOpacity>
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
                fontSize: 14,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,
              }}
            >
              Game zone
            </Text>
            <LockIcon />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => console.log("Clicked")}
            style={{
              borderRadius: 16,
              borderStyle: "solid",
              borderColor: globalColors.neutral5,
              borderWidth: 0.5,
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
            onPress={() => console.log("Clicked")}
            style={{
              borderRadius: 16,
              borderStyle: "solid",
              borderColor: "#3d3c4b",
              borderWidth: 0.5,
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
            onPress={() => console.log("Clicked")}
            style={{
              borderRadius: 16,
              borderStyle: "solid",
              borderColor: "#3d3c4b",
              borderWidth: 0.5,
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
          onPress={handleFollowPress}
          style={{
            borderRadius: 8,
            borderStyle: "solid",
            borderColor: "#e27af8",
            borderWidth: 0.5,
            height: 34,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginTop: 12,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 15,
              fontFamily: fontFamilies.medium,
              color: globalColors.neutral9,
              marginLeft: 8,
            }}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ViewWrapper>
      <View style={{ width: "90%" }}>
        <TextInputComponent placeHolder="Games | " />
        <Text
          style={{
            fontSize: 20,
            lineHeight: 26,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
            textAlign: "center",
            marginTop: "10%",
          }}
        >
          Sorry! No results found
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 18,
            marginTop: "5%",
            textAlign: "center",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          We could not find any search for | Game
        </Text>
        <Image
          style={{
            width: "65%",
            height: "30%",
            marginTop: "10%",
            alignSelf: "center",
          }}
          // contentFit="cover"
          source={require("@/assets/image/image1.png")}
        />
        <Suggested />
        <MainComp />
      </View>
    </ViewWrapper>
  );
};
export default NoGroupFound;
