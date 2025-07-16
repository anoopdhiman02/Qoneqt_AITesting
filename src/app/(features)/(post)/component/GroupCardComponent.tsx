import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

const GroupCardComponent = ({ data, onSelectGroup }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelectGroup(data)}
      style={{
        borderRadius: 10,
        // backgroundColor: globalColors.slateBlueShade60,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        marginTop: "1%",
        padding: "3%",
      }}
    >
       <ImageFallBackUser
        imageData={data?.loop_logo}
        fullName={data?.loop_name}
        widths={64}
        heights={64}
        borders={8} isGroupList={undefined}                                    />
      <Text
        style={{
          fontSize: 14,
          fontFamily: fontFamilies.medium,
          color: globalColors.neutralWhite,
          // textAlign: "center",
          marginLeft: "5%",
          width: "75%",
        }}
      >
        {data?.loop_name}
      </Text>
    </TouchableOpacity>
  );
};

export default GroupCardComponent;

const styles = StyleSheet.create({});
