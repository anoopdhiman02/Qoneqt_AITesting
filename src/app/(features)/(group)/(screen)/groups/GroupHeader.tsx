import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ArrowLeftBigIcon, OptionsIcon, Share01Icon } from "@/assets/DarkIcon";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { fontFamilies } from "@/assets/fonts";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { formatMemberCount } from "@/utils/ImageHelper";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { globalColors } from "@/assets/GlobalColors";

const GroupHeader = ({
  handleSharePress,
  HandleThreeOption,
  groupDetailsData,
  headerOpacity,
  scrollY, // Add this prop to track scroll position
}) => {
  // Enhanced header background with blur effect
  const headerBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      headerOpacity.value,
      [0, 0.3, 1],
      [0, 0.7, 0.95],
      Extrapolation.CLAMP
    );

    return {
      opacity,
    };
  });

  // Smooth content animation with enhanced movement
  const headerContentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      headerOpacity.value,
      [0, 0.4, 1],
      [0, 0.3, 1],
      Extrapolation.CLAMP
    );

    const translateY = interpolate(
      headerOpacity.value,
      [0, 0.3, 1],
      [20, 10, 0],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      headerOpacity.value,
      [0, 0.5, 1],
      [0.8, 0.9, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  // Animate the profile image with a slight delay
  const profileImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      headerOpacity.value,
      [0, 0.6, 1],
      [0.7, 0.85, 1],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      headerOpacity.value,
      [0, 0.5, 1],
      [0, 0.6, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Animate text with staggered effect and dynamic width
  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      headerOpacity.value,
      [0, 0.6, 1],
      [0, 0.4, 1],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      headerOpacity.value,
      [0, 0.4, 1],
      [30, 15, 0],
      Extrapolation.CLAMP
    );

    // Dynamic maxWidth based on header visibility
    const maxWidth = interpolate(
      headerOpacity.value,
      [0, 0.7, 1],
      [205, 215, 222],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      maxWidth,
      transform: [{ translateX }],
    };
  });

  const subtitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      headerOpacity.value,
      [0, 0.7, 1],
      [0, 0.3, 1],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      headerOpacity.value,
      [0, 0.5, 1],
      [25, 12, 0],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  // Animate header actions to hide when header content appears
  const headerActionsStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      headerOpacity.value,
      [0, 0.3, 0.7],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      headerOpacity.value,
      [0, 0.5, 1],
      [0, 15, 30],
      Extrapolation.CLAMP
    );

    return {
      opacity,
      transform: [{ translateX }],
    };
  });

  return (
    <View style={styles.headerContainer}>
      {/* Animated background overlay */}
      <Animated.View style={[styles.headerBackground, headerBackgroundStyle]} />

      <View style={styles.GrnameContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftBigIcon style={styles.backButton} width={40} height={40} />
        </TouchableOpacity>

        {/* Enhanced animated content */}
        <Animated.View
          style={[styles.animatedHeaderContent, headerContentStyle]}
        >
          <Animated.View
            style={[styles.profileImageContainer, profileImageStyle]}
          >
            <ImageFallBackUser
              imageData={groupDetailsData?.loop_logo}
              fullName={groupDetailsData?.loop_name}
              widths={36}
              heights={36}
              borders={10}
            />
          </Animated.View>

          <View style={styles.textContainer}>
            <Animated.Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[styles.groupTitle, titleStyle]}
            >
              {groupDetailsData?.loop_name || "Group Name"}
            </Animated.Text>

            <Animated.Text style={[styles.subgroupMembers, subtitleStyle]}>
              {formatMemberCount(groupDetailsData?.member_count)} members
            </Animated.Text>
          </View>
        </Animated.View>
      </View>

      <Animated.View style={[styles.headerActions, headerActionsStyle]}>
        <TouchableOpacity onPress={handleSharePress}>
          <Share01Icon />
        </TouchableOpacity>
        {groupDetailsData?.what_am_i?.id != 0 && (
          <TouchableOpacity onPress={HandleThreeOption}>
            <Ionicons name={"ellipsis-vertical"} size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

export default GroupHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: "97%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: "5%",
    position: "relative",
    zIndex: 10,
  },
  headerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
  },
  GrnameContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: fontFamilies.extraBold,
    zIndex: 2,
  },
  animatedHeaderContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: fontFamilies.extraBold,
  },
  profileImageContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginLeft: 15,
  },
  groupTitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "left",
    fontFamily: fontFamilies.extraBold,
    // maxWidth removed from static styles - now handled by animation
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  backButton: {
    marginRight: 10,
    zIndex: 3,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: "5%",
    paddingVertical: "2%",
    width: "30%",
    gap: 10,
    zIndex: 2,
  },
  subgroupMembers: {
    color: "#8954F6",
    fontSize: 10,
    fontFamily: fontFamilies.regular,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});
