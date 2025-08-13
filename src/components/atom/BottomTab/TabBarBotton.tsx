import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { icons } from "./TabIcons";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TabBarButton = (props) => {
  const { isFocused, label, routeName, color, index, labelActive } = props;

  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
      { duration: 350 }
    );
  }, [scale, isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.1]);
    const top = interpolate(scale.value, [0, 1], [0, 2]);

    return {
      // styles
      transform: [{ scale: scaleValue }],
      top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 9]);

    return {
      // styles
      opacity,
    };
  });

  return (
    <Pressable
      {...props}
      style={[
        styles.container,
        // {
        //   marginRight: index === 1 ? "10%" : 0,
        //   marginLeft: index === 2 ? "10%" : 0,
        // },
      ]}
    >
      <Animated.View style={[animatedIconStyle]}>
        {isFocused ? icons[labelActive] : icons[label]}
      </Animated.View>

      <Animated.Text
        style={[
          {
            color,
            fontSize: 11,
          },
          // animatedTextStyle,
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    paddingBottom: 10,
  },
});

export default TabBarButton;
