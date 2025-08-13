import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import usePostHandlerViewModel from "@/structure/viewModels/post/PostHandlerViewModel";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import useHomeViewModel from "../../(home)/viewModel/HomeViewModel";
import { Ionicons } from "@expo/vector-icons";

interface PostLikeComponentProps {
  postId: string | number;
  Liked: number;
  count: number;
  updateLikeStatus?: (isLiked: boolean) => void;
}

const AnimatedIcon = React.memo(
  ({ isLiked, scale, translateY }: any) => {
    const animatedStyle = useAnimatedStyle(() => ({
      // @ts-ignore
      transform: [ { scale: scale.value }, { translateY: translateY.value } ]
    }));
    return (
      <Animated.View style={animatedStyle}>
        {isLiked === 1
          ? <Ionicons name="heart" size={26} color="#E27AF8" />
          : <Ionicons name="heart-outline" size={26} color="grey" />}
      </Animated.View>
    );
  },
  (prev, next) => prev.isLiked === next.isLiked
);

const PostLikeComponent = React.memo(({
  postId,
  Liked,
  count,
  updateLikeStatus
}: PostLikeComponentProps) => {
  const { onLikePostHandler } = usePostHandlerViewModel();
  const { updateOtherLikePostData } = useHomeViewModel();

  // Only track local liked state for animation/UI (destined from prop on mount or when postId changes)
  const [likedState, setLikedState] = useState(Liked);

  useEffect(() => {
    setLikedState(Liked);
  }, [Liked, postId]);

  const [isAnimating, setIsAnimating] = useState(false);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Bounce and float animation
  const triggerAnimation = useCallback(() => {
    scale.value = withSequence(
      withSpring(1.3, { damping: 20, stiffness: 800 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    translateY.value = withSequence(
      withSpring(-4, { damping: 15, stiffness: 600 }),
      withSpring(0, { damping: 12, stiffness: 200 })
    );
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 80 }),
      withTiming(1, { duration: 120 })
    );
  }, [scale, translateY, buttonScale]);

  // Debounced API call
  const debouncedApiCall = useCallback((postId, newLikedState) => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        onLikePostHandler({ postId, liked: newLikedState });
        updateOtherLikePostData(postId, newLikedState === 1 ? 1 : -1);
      }
    }, 150);
  }, [onLikePostHandler, updateOtherLikePostData]);

  // Like button press
  const onPressLikeHandler = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newLikedState = likedState === 1 ? 0 : 1;
    setLikedState(newLikedState);

    triggerAnimation();
    if (updateLikeStatus) updateLikeStatus(newLikedState === 1);
    debouncedApiCall(postId, newLikedState);
    
    setTimeout(() => { if (mountedRef.current) setIsAnimating(false); }, 300);
  }, [likedState, isAnimating, triggerAnimation, debouncedApiCall, postId, updateLikeStatus]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  // Button scale style
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }]
  }));

  // Format count, memoized
  const countText = useMemo(() => {
    if (count === 0) return "0";
    if (count >= 1000000) {
      const formatted = (count / 1000000).toFixed(1);
      return formatted.endsWith('.0') ? `${Math.floor(count / 1000000)}M` : `${formatted}M`;
    } else if (count >= 1000) {
      const formatted = (count / 1000).toFixed(1);
      return formatted.endsWith('.0') ? `${Math.floor(count / 1000)}K` : `${formatted}K`;
    }
    return count.toString();
  }, [count]);

  return (
    <Animated.View style={buttonAnimatedStyle}>
      <TouchableOpacity
        onPress={onPressLikeHandler}
        style={styles.interactionButton}
        activeOpacity={0.7}
        disabled={isAnimating}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <AnimatedIcon
          isLiked={likedState}
          scale={scale}
          translateY={translateY}
        />
        {count > 0 && (
          <Text style={[styles.interactionCount, likedState === 1 && styles.likedText]}>
            {countText}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});

export default PostLikeComponent;

const styles = StyleSheet.create({
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 50,
    minHeight: 36, // Ensure consistent touch target
  },
  interactionCount: {
    fontSize: 17,
    fontFamily: fontFamilies.regular,
    color: "grey",
    marginLeft: 6, // Slightly increased spacing
    marginBottom: 2, // Reduced bottom margin
    fontVariant: ["tabular-nums"],
  },
  likedText: {
    color: "#E27AF8", // Match the heart color
    fontFamily: fontFamilies.medium,
    fontSize: 17,
  },
});