import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { fontFamilies } from "@/assets/fonts";
import { Ionicons } from "@expo/vector-icons";
import { formatMemberCount } from "@/utils/ImageHelper";
import LinkView from "../LinkView";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  runOnJS,
  interpolate,
} from "react-native-reanimated";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

// Individual animated item component
const AnimatedSubgroupItem = ({
  item,
  index,
  animationProgress,
  onPress,
  showGeneral = true,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const progress = animationProgress.value;

    // Adjust index based on whether general item is shown
    const adjustedIndex = showGeneral ? index + 1 : index;

    // Fixed timing that ensures ALL items reach full opacity
    // Each item gets 150ms to animate, with 100ms delay between starts
    const itemStartTime = adjustedIndex * 0.02; // 2% delay between items
    const itemDuration = 0.15; // 15% of total animation for each item

    const itemProgress = interpolate(
      progress,
      [itemStartTime, Math.min(itemStartTime + itemDuration, 0.8)], // Ensure all items finish by 80%
      [0, 1],
      "clamp"
    );

    return {
      opacity: itemProgress,
      transform: [
        {
          translateY: interpolate(itemProgress, [0, 1], [20, 0]),
        },
      ],
    };
  });

  return (
    <AnimatedTouchableOpacity
      style={[stylenew.subgroupItem, animatedStyle]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={stylenew.subgroupIconContainer}>
        <ImageFallBackUser
          imageData={item?.channel_image}
          fullName={item?.channel_name || "Unknown"}
          widths={48}
          heights={48}
          borders={10}
        />
      </View>
      <View style={stylenew.subgroupInfo}>
        <Text style={stylenew.subgroupName}>
          {item?.channel_name || "Unknown"}
        </Text>
        <Text style={stylenew.subgroupDescription}>
          {item?.description ?? "Subgroup description not available."}
        </Text>
        <Text style={stylenew.subgroupMembers}>
          {formatMemberCount(item?.member_count || 0)} members
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8954F6" />
    </AnimatedTouchableOpacity>
  );
};

// General item component - NO ANIMATION
const GeneralItem = ({ group, onPress }) => {
  return (
    <TouchableOpacity
      style={stylenew.subgroupItem}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={stylenew.subgroupIconContainer}>
        <Ionicons name={"book"} size={24} color="#8954F6" />
      </View>
      <View style={stylenew.subgroupInfo}>
        <Text style={stylenew.subgroupName}>{"General"}</Text>
        <Text style={stylenew.subgroupDescription}>
          {"Discuss anything related to the group here."}
        </Text>
        <Text style={stylenew.subgroupMembers}>
          {formatMemberCount(group?.member_count || 0)} members
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8954F6" />
    </TouchableOpacity>
  );
};

const GroupSubgroupComponent = ({
  group,
  subgroup,
  isLoading = false,
  onSubgroupPress,
  showGeneral = true,
}) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has run

  // Single animation progress value that controls all items
  const animationProgress = useSharedValue(0);

  // Trigger animations when data is ready
  useEffect(() => {
    if (group && !isLoading && !hasAnimated) {
      startAnimations();
      setHasAnimated(true); // Mark that animation has run
    }
  }, [group, subgroup, isLoading, hasAnimated]);

  useEffect(() => {
    // Reset animation state if we're loading again (new API call)
    if (isLoading) {
      setHasAnimated(false);
      setAnimationComplete(false);
      animationProgress.value = 0;
    }
  }, [isLoading]);

  const startAnimations = () => {
    // Reset animation
    animationProgress.value = 0;
    setAnimationComplete(false);

    // Fixed duration that works for any number of items
    // Longer duration ensures all items have time to animate
    const subgroupArray = subgroup || [];
    const totalItems = subgroupArray.length; // Only count subgroup items, not general

    // Ensure minimum 2 seconds for large lists, but scale up for very large lists
    const baseDuration = 2000; // 2 seconds minimum
    const extraDuration = Math.max(0, (totalItems - 10) * 50); // +50ms per item after 10
    const totalDuration = baseDuration + extraDuration;

    // Start the master animation
    animationProgress.value = withTiming(
      1,
      {
        duration: totalDuration,
      },
      () => {
        runOnJS(setAnimationComplete)(true);
      }
    );
  };

  const renderShimmerItem = (index) => (
    <View key={`shimmer-${index}`} style={stylenew.subgroupItem}>
      <View style={[stylenew.subgroupIconContainer, stylenew.shimmer]} />
      <View style={stylenew.subgroupInfo}>
        <View
          style={[
            stylenew.shimmerText,
            { width: "60%", height: 16, marginBottom: 4 },
          ]}
        />
        <View
          style={[
            stylenew.shimmerText,
            { width: "80%", height: 12, marginBottom: 4 },
          ]}
        />
        <View style={[stylenew.shimmerText, { width: "40%", height: 12 }]} />
      </View>
      <View style={[stylenew.shimmer, { width: 20, height: 20 }]} />
    </View>
  );

  // Show loading state with shimmer
  if (isLoading) {
    const shimmerCount = Math.min((subgroup || []).length || 5, 8);
    return (
      <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
        {/* Dynamic number of shimmers based on expected count */}
        {Array.from({ length: shimmerCount }, (_, index) =>
          renderShimmerItem(index)
        )}
      </View>
    );
  }

  const subgroupArray = subgroup || [];

  return (
    <View style={{ marginVertical: 10, paddingHorizontal: 10, flex: 1 }}>
      {/* General subgroup - NO ANIMATION */}
      {showGeneral && (
        <GeneralItem
          group={group}
          onPress={() => onSubgroupPress?.("general")}
        />
      )}

      {/* Dynamic subgroups with staggered animation */}
      {subgroupArray.map((item, index) => (
        <AnimatedSubgroupItem
          key={`subgroup-${index}-${item?.id || index}`}
          item={item}
          index={index}
          animationProgress={animationProgress}
          onPress={() => onSubgroupPress?.(item)}
          showGeneral={showGeneral}
        />
      ))}
    </View>
  );
};

export default GroupSubgroupComponent;

const stylenew = StyleSheet.create({
  subgroupItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(116, 84, 244, 0.05)",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(116, 84, 244, 0.1)",
  },
  subgroupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(116, 84, 244, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  subgroupInfo: {
    flex: 1,
  },
  subgroupName: {
    color: "white",
    fontSize: 16,
    fontFamily: fontFamilies.bold,
    marginBottom: 4,
  },
  subgroupDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontFamily: fontFamilies.regular,
    marginBottom: 4,
  },
  subgroupMembers: {
    color: "#8954F6",
    fontSize: 12,
    fontFamily: fontFamilies.regular,
  },
  listContent: {
    padding: 16,
  },
  shimmer: {
    backgroundColor: "rgba(116, 84, 244, 0.2)",
    borderRadius: 8,
  },
  shimmerText: {
    backgroundColor: "rgba(116, 84, 244, 0.2)",
    borderRadius: 4,
  },
});
