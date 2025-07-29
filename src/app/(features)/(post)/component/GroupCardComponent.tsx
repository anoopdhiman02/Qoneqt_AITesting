import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
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
        borders={8}
        isGroupList={data?.loop_name}
      />
      <View style={{ width: "100%" }}>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fontFamilies.bold,
            color: globalColors.neutralWhite,
            // textAlign: "center",
            marginLeft: "5%",
            width: "75%",
            marginBottom: "1%",
          }}
        >
          {data?.loop_name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginLeft: "5%",
            width: "75%",
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontFamily: fontFamilies.lightItalic,
              color: "grey",
            }}
          >
            Category:
          </Text>
          <Text
            style={{
              fontSize: 12, // Different size
              fontFamily: fontFamilies.extraBold, // Bold font family
              color: "grey",
            }}
          >
            {" " + data?.category?.category_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const SubGroupCardComponent = ({
  data,
  isSelected,
  onSelectSubGroup,
  isDisabled = false,
}) => {
  return (
    <TouchableOpacity
      onPress={() => !isDisabled && onSelectSubGroup(data.id)}
      style={{
        // borderRadius: 10,
        // backgroundColor: isSelected ? "rgba(119, 0, 255, 0.17)" : "transparent",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
        marginTop: "1%",
        padding: "3%",
        // borderWidth: isSelected ? 1 : 0,
        // borderColor: isSelected ? "rgba(119, 0, 255, 0.50)" : "transparent",
      }}
      activeOpacity={1}
    >
      <CheckboxIcon isSelected={isSelected} isDisabled={isDisabled} />
      <ImageFallBackUser
        imageData={data?.channel_image}
        fullName={data?.channel_name}
        widths={34}
        heights={34}
        borders={8}
        isGroupList={undefined}
      />
      <Text
        style={{
          fontSize: 14,
          fontFamily: fontFamilies.medium,
          color: globalColors.neutralWhite,
          marginLeft: "5%",
          width: "60%", // Adjusted width to accommodate checkbox
        }}
      >
        {data?.channel_name}
      </Text>
    </TouchableOpacity>
  );
};

// Checkbox component
export const CheckboxIcon = ({ isSelected, isDisabled = false }) => (
  <View
    style={{
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: isDisabled
        ? "#888"
        : isSelected
        ? "rgba(119, 0, 255, 0.50)"
        : "#ccc",
      backgroundColor: isSelected ? "rgba(119, 0, 255, 0.50)" : "transparent",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    }}
  >
    {isSelected && (
      <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
        ✓
      </Text>
    )}
  </View>
);

export default GroupCardComponent;

const styles = StyleSheet.create({});
