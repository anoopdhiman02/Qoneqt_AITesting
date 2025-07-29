import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { memo } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { globalColors } from "../../assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";

export interface ButtonProps {
  title?: string;
  onPress?: () => void;
  isLoading?: boolean;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

const Button1 = ({ title= "Submit", onPress, isLoading, containerStyle, disabled = false }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.buttonContainer, ...containerStyle }}
      disabled={isLoading ? isLoading : disabled}
    >
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0.9 }}
        style={styles.gradient}
        colors={globalColors.buttonDefault}
      >
        {isLoading ? (
          <ActivityIndicator size={28} color={globalColors.darkOrchidTint60} />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default memo(Button1);

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    // marginHorizontal: "2.5%", 
    marginVertical: "7%",
    borderRadius: 8,
    overflow: "hidden",
  },
  gradient: {
    height: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  buttonText: {
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    fontSize: 16,
    lineHeight: 18,
  },
});
