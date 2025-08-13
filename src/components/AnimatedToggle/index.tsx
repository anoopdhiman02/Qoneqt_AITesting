import React, { useState, useEffect, useRef } from "react";
import { View, Pressable, StyleSheet, Image, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useHomePostStore } from "@/zustand/HomePostStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AnimatedToggle = ({ isflex, onToggle }) => {
  const [isOn, setIsOn] = useState(isflex);
  const translateX = useSharedValue(isflex ? 4 : 26);
  const { setSelectedTab } = useHomePostStore();
  const toggleVisibleRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsOn(isflex);
    translateX.value = withSpring(isflex ? 4 : 26);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isflex]);

  const toggleSwitch = () => {
    if (toggleVisibleRef.current) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    toggleVisibleRef.current = true;

    const newValue = !isOn;

    if (!newValue) setSelectedTab(0);

    setIsOn(newValue);
    translateX.value = withSpring(newValue ? 4 : 26);
    AsyncStorage.setItem("isFlex", JSON.stringify(newValue));
    onToggle?.(newValue);

    toggleVisibleRef.current = false;
  };

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  return (
    <Pressable
      disabled={toggleVisibleRef.current}
      onPress={toggleSwitch}
      style={styles.toggleContainer}
    >
      <View
        style={[
          styles.toggleBackground,
          isOn ?  styles.toggledBackground : styles.untoggledBackground,
        ]}
      >
        <Animated.View style={[styles.circle, animatedCircleStyle]}>
          <Image
            style={styles.icon}
            source={
              isOn
                ? require("../../assets/image/toggle3.png")
                : require("../../assets/image/toggle4.png")
            }
          />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBackground: {
    width: 55,
    height: 30,
    borderRadius: 15,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  toggledBackground: {
    backgroundColor: "#2e2e72",
  },
  untoggledBackground: {
    backgroundColor: "#d6c9ff",
  },
  circle: {
    width: 26, 
    height: 26,
    borderRadius: 13,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  icon: {
    width: 20, 
    height: 20,
    resizeMode: "contain",
  },
});

export default AnimatedToggle;
