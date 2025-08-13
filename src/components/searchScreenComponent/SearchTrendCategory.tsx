import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { RedirectIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

const SearchTrendCategory = ({ data }) => {
  return (
    <View
      style={{
        width: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: "5%",
      }}
    >
      <TouchableOpacity
        onPress={() => console.log("Music news")}
        style={{
          borderRadius: 8,
          borderStyle: "solid",
          borderColor: globalColors.neutral3,
          borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}
      >
        <RedirectIcon />
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            textAlign: "center",
          }}
        >
          Music news
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchTrendCategory;
