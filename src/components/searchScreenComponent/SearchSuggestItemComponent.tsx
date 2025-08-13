import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { Image } from "expo-image";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { router } from "expo-router";

const SearchSuggestItemComponent = ({ postData, index }) => {
  if (!postData) return null;

  const { loop_name, loop_logo, category, subscription_type, what_am_i } =
    postData;
  const isPrivate = subscription_type === "2";
  const getFirstWhatAmI = () => {
    if (Array.isArray(what_am_i) && what_am_i.length > 0) {
      const firstItem = what_am_i[0];
      if (typeof firstItem === "object" && firstItem !== null) {
        return firstItem.role || "Unknown";
      }
    }
    return null;
  };

  const firstWhatAmI = getFirstWhatAmI();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/groups",
          params: { groupId: postData?.id },
        })
      }
      style={{
        borderRadius: 16,
        backgroundColor: globalColors.darkOrchidShade80,
        width: "44%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "5%",
        marginLeft: (index + 1) % 2 === 0 ? "2%" : "4%",
        marginRight: (index + 1) % 2 === 0 ? "4%" : "2%",
        marginBottom: "4%",
        borderWidth: 1,
        borderColor: globalColors.subgroupBorder,
      }}
    >
      <View
        style={{
          alignSelf: "stretch",
          height: 92,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <ImageFallBackUser
          imageData={loop_logo}
          fullName={loop_name}
          widths={58}
          heights={58}
          borders={10}
          isGroupList={true}
        />

        <View
          style={{
            alignSelf: "stretch",
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
              textAlign: "center",
              marginRight: 4,
            }}
            numberOfLines={2}
          >
            {loop_name}
          </Text>
          {/* {isPrivate && <LockIcon />} */}
        </View>
      </View>
      <View
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 12,
          flexWrap: "wrap",
        }}
      >
        {category && category.category_name && (
          <View
            style={{
              borderRadius: 16,
              borderStyle: "solid",
              borderColor: "#3d3c4b",
              borderWidth: 0.5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 10,
              paddingVertical: 4,
              marginRight: 4,
              marginBottom: 4,
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
              {category.category_name}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default SearchSuggestItemComponent;
