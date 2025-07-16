import { useCommentShow } from "@/customHooks/CommentUpdateStore";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const CustomSwitch = ({ value = false, onToggle }) => {
  const [isOn, setIsOn] = useState(value);
  const translateX = useSharedValue(value ? 20 : 0);
  const { setShow_Button, show_Button } = useCommentShow();
  const toggleSwitch = () => {
    const newValue = !isOn;
    if (isOn == true) {
      setShow_Button(true);
    } else {
      setShow_Button(false);
    }
    setIsOn(newValue);
    translateX.value = withTiming(newValue ? 20 : 0, { duration: 200 });
    if (onToggle) onToggle(newValue);
  };

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <Pressable
      onPress={toggleSwitch}
      style={{
        width: 50,
        height: 25,
        borderRadius: 20,
        backgroundColor: isOn ? "#4CAF50" : "#ccc",
        padding: 5,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
      }}
    >
      <Animated.View
        style={[
          {
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: "white",
          },
          animatedThumbStyle,
        ]}
      />
    </Pressable>
  );
};

export default CustomSwitch;
