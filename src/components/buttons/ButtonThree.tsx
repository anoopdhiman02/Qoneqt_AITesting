import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  DimensionValue,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

export interface buttonProps extends ViewProps {
  label: string;
  btnType: string;
  width?: number | string;
  height?: number | string;
  onPress: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const ButtonThree = ({
  leftIcon,
  rightIcon,
  label,
  btnType,
  onPress,
  width = "100%",
  height = 50,
  ...props
}: buttonProps) => {
  return (
    <View
      style={[
        styles.buttonContainer,
        { width: width as DimensionValue, height: height as DimensionValue },
      ]}
    >
      <LinearGradient
        colors={["#2B0A6E", "#8954F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <TouchableOpacity onPress={onPress} style={styles.button}>
          <LinearGradient
            colors={["rgba(43, 10, 110, 0.8)", "#020015"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.innerShadow}
          >
            {leftIcon}
            <Text style={styles.buttonText}>{label}</Text>
            {rightIcon}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

export default ButtonThree;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 5,
    overflow: "hidden",
    marginHorizontal: 5,
    marginTop: "6%",
  },
  gradientBackground: {
    flex: 1,
    padding: 2,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    overflow: "hidden",
  },
  innerShadow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    backgroundColor: globalColors.bgDark1,
  },
  buttonText: {
    fontSize: 16,
    lineHeight: 18,
    fontFamily: fontFamilies.semiBold,
    color: globalColors.neutralWhite,
    marginLeft: 12,
  },
});
