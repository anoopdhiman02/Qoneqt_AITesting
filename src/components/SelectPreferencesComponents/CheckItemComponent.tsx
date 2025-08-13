import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import { CheckCircleIcon } from "@/assets/DarkIcon";


const CheckItemComponent = ({ id, label, checked, onPress, categoryName }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      key={id}
      style={{
       ...styles.checkItemContainer,
       borderColor: checked
       ? globalColors.darkOrchidShade20
       : globalColors.neutral2,
       backgroundColor: checked 
       ? globalColors.darkOrchidShade80
       : globalColors.neutral1,
      }}
    >
      <Text
        style={{
          ...styles.checkItemText,
          color: checked ? globalColors.darkOrchidShade20 : globalColors.neutralWhite,
        }}
      >
        {label}
      </Text>
      {checked && (
              <View style={{
                position: "absolute",
                right: -10,
                top: -10
              }}>
                <CheckCircleIcon />
              </View>
            )}
    </TouchableOpacity>
  );
};

export default CheckItemComponent;

const styles = StyleSheet.create({
    checkItemContainer: {
        backgroundColor: globalColors.neutral1,
        borderRadius: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 12,
        marginBottom: 12,
        marginRight: 12,
        flexShrink: 1,
    },
    iconContainer: {
        width: 20,
        height: 20,
    },
    checkItemText: {
        fontSize: 14,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutral_white["200"],
    },
});
