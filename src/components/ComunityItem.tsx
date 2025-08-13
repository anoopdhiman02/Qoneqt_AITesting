import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
} from "react-native";
import React, { useRef, useEffect } from "react";
import { router } from "expo-router";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";

const { width } = Dimensions.get("window");

const ComunityItem = ({ community, containerStyle }: any) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current; // For pulsing glow effect
  // Pulsing glow animation for active communities or unread messages
  useEffect(() => {
    if (community?.special == 1) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      );
      pulseAnimation.start();

      return () => pulseAnimation.stop();
    }
  }, [community?.special, glowAnim]);

  const handlePress = () => {
    // Press animation with glow effect
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    router.push({
      pathname: "/groups",
      params: {
        groupId: community?.id,
      },
    });
  };

  // Dynamic glow color and intensity based on unread count
  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(167, 139, 250, 0)", "rgba(167, 139, 250, 0.86)"],
  });

  const shadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 11],
  });

  const elevation = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 15],
  });

  const isSpecial = community?.special == 1;

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        key={community.id}
        style={[styles.communityContainer, containerStyle]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.communityWrapper}>
          <View style={styles.communityImageContainer}>
            <Animated.View
              style={[
                styles.communityBorder,
                // Add glowing effect when there are unread messages
                isSpecial && {
                  shadowColor: "#FF8C00",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: glowAnim,
                  shadowRadius: shadowRadius,
                  elevation: elevation,
                },
              ]}
            >
              {/* Outer glow ring for extra effect */}
              {community.what_am_i?.id <= 0 && (
                <Animated.View
                  style={[
                    styles.glowRing,
                    {
                      backgroundColor: glowColor,
                      opacity: glowAnim,
                    },
                  ]}
                />
              )}

              <View style={styles.communityImageWrapper}>
                <ImageFallBackUser
                  imageData={community.loop_logo}
                  fullName={community.loop_name}
                  widths={width * 0.15}
                  heights={width * 0.15}
                  borders={12}
                  isGroupList={undefined}
                />

                {/* Enhanced unread badge with glow */}
                {community.what_am_i?.unread > 0 && (
                  <Animated.View
                    style={[
                      styles.unreadBadge,
                    ]}
                  >
                    <Text style={styles.unreadText}>
                      {community.what_am_i.unread > 99
                        ? "99+"
                        : community.what_am_i.unread}
                    </Text>
                  </Animated.View>
                )}
              </View>
            </Animated.View>
          </View>

          <View style={styles.communityInfo}>
            {/* Community name with subtle glow when active */}
            <Animated.View
              style={[
                community.what_am_i?.unread > 0 && {
                  shadowColor: "#FFFFFF",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: glowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.3],
                  }),
                  shadowRadius: 4,
                },
              ]}
            >
              <Text style={styles.communityName} numberOfLines={1}>
                {community.loop_name}
              </Text>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ComunityItem;

const styles = StyleSheet.create({
  communityContainer: {
    marginRight: 0,
  },
  communityWrapper: {
    width: width * 0.22,
    alignItems: "center",
    overflow: "visible",
  },
  communityImageContainer: {
    marginBottom: 8,
    position: "relative",
    overflow: "visible",
  },
  communityBorder: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  // New glow ring style
  glowRing: {
    position: "absolute",
    width: width * 0.165, // Slightly larger than the image
    height: width * 0.165,
    borderRadius: 14,
    top: -(width * 0.007),
    left: -(width * 0.007),
    zIndex: -1,
  },
  communityImageWrapper: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 13,
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 1,
  },
  communityImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  unreadBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FF8C00",
    borderRadius: 12,
    minWidth: 22.5,
    height: 22.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#020015",
    elevation: 8,
    zIndex: 10,
  },
  unreadText: {
    color: "white",
    fontSize: 10,
    fontFamily: fontFamilies.extraBold,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  communityInfo: {
    alignItems: "center",
  },
  communityName: {
    color: "white",
    fontSize: 12,
    fontFamily: fontFamilies.bold,
    textAlign: "center",
    maxWidth: 85,
  },
  memberCount: {
    color: "#a78bfa",
    fontSize: 10,
    marginTop: 2,
    fontFamily: fontFamilies.regular,
  },
});
