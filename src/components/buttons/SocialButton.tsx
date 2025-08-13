import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  Dimensions,
} from "react-native";
import React, { FC } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { Image } from "expo-image";

interface ButtonProps {
  title?: string;
  onPress?: () => void;
  isLoading?: boolean;
  containerStyle?: ViewStyle;
  type?: string;
}

const SocialButton: FC<ButtonProps> = ({
  title,
  onPress,
  isLoading,
  containerStyle,
  type = "google",
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: Dimensions.get("window").width * 0.86,
        ...containerStyle,
      }}
      disabled={isLoading ? isLoading : false}
    >
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0.9 }}
        style={[styles.ctasprimaryCta, styles.ctasprimaryFlexBox]}
        colors={globalColors.buttonDefault}
      >
        {isLoading ? (
          <ActivityIndicator size={28} color={globalColors.darkOrchidTint60} />
        ) : (
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 15,
              alignItems: "center",
            }}
          >
            <Image
              style={{
                borderRadius: 8,
                width: 25,
                height: 25,
              }}
              contentFit="cover"
              source={
                type == "google"
                  ? require("@/assets/image/google.png")
                  : require("@/assets/image/apple.png")
              }
            />
            <Text style={[styles.postTypo2]}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  ctasprimaryCta: {
    height: 48,
    backgroundColor: "transparent",
    paddingHorizontal: 24,
  },
  ctasprimaryFlexBox: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    // flexDirection: "row",
    borderRadius: 8,
    marginTop: "7%",
  },
  postTypo2: {
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    fontSize: 20,
    marginLeft: 10,
  },
  post4: {
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
  },
});

export default SocialButton;
