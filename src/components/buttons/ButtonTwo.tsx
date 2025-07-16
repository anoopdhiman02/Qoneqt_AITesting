import {
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import React, { memo } from "react";
import { ImageBackground } from "expo-image";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
export interface buttonProps extends ViewProps {
  label?: string;
  btnType?: string;
  width?: number | string;
  height?: number | string;
  onPress?: () => void;
  leftIcon?: any;
  rightIcon?: any;
  containerStyle?: ViewStyle;
}
const ButtonTwo = ({
  leftIcon,
  rightIcon,
  label,
  btnType,
  onPress,
  containerStyle,
  ...props
}: buttonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={{...containerStyle, height:60, marginTop: "6%",}}>
    <ImageBackground
      source={require("./ButtonContainer.png")}
      contentFit="contain"
      contentPosition={"center"}
      style={{
        // height: 60,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        height:"100%"
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height:'100%'
        }}
      >
        {leftIcon}
        <Text
          style={{
            fontSize: 16,
            lineHeight: 18,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
            // marginLeft: 12,
            // marginTop: 5,
          }}
        >
          {label}
        </Text>
        {rightIcon}
      </View>
    </ImageBackground>
    </TouchableOpacity>
  );
};
export default memo(ButtonTwo);
