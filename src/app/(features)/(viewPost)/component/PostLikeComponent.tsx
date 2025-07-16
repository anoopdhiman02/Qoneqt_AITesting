import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState, memo, useCallback, useRef, useMemo } from "react";
import usePostHandlerViewModel from "@/structure/viewModels/post/PostHandlerViewModel";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolateColor,
} from "react-native-reanimated";
import useHomeViewModel from "../../(home)/viewModel/HomeViewModel";
import { LikeIcon, UnLikeIcon } from "@/assets/DarkIcon";
interface PostLikeComponentProps {
  postId: string | number;
  Liked: number;
  count: number;
  updateLikeStatus?: (isLiked: boolean) => void;
}

// Memoized Icon Components for better performance
const MemoizedLikeIcon = memo(LikeIcon);
const MemoizedUnLikeIcon = memo(UnLikeIcon);

// Animated Icon Component
const AnimatedIcon = memo(({ isLiked, scale, translateY, colorValue }: any) => {
  //@ts-ignore
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    };
  }, [scale.value, translateY.value]);

  const colorAnimatedStyle: any = useAnimatedStyle(() => {
    return {
      tintColor: interpolateColor(
        colorValue.value,
        [0, 1],
        [globalColors.neutralWhite || '#FFFFFF', '#FF6B6B'] // Unlike to Like color transition
      ),
    };
  }, [colorValue.value]);

  return (
    <Animated.View style={[animatedStyle, colorAnimatedStyle]}>
      {isLiked === 1 ? <MemoizedLikeIcon height={24} width={24} /> : <MemoizedUnLikeIcon height={24} width={24} />}
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // Only re-render if isLiked changes
  return prevProps.isLiked === nextProps.isLiked;
});

const PostLikeComponent = memo<PostLikeComponentProps>(({ 
  postId, 
  Liked, 
  count, 
  updateLikeStatus 
}) => {
  // Hooks
  const { onLikePostHandler }: any = usePostHandlerViewModel();
  const { updateOtherLikePostData } = useHomeViewModel();
  
  // State
  const [isLiked, setIsLiked] = useState(Liked);
  const [likeCount, setLikeCount] = useState(count);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Refs for debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastPressTime = useRef(0);
  
  // Animation values
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const colorValue = useSharedValue(Liked);
  const buttonScale = useSharedValue(1);

  // Sync props with state
  // useEffect(() => {
  //   if (isLiked !== Liked || likeCount !== count) {
  //     setIsLiked(Liked);
  //     setLikeCount(count);
  //     colorValue.value = withTiming(Liked, { duration: 200 });
  //   }
  // }, [Liked, count]);

  // Optimized animation sequence
  const triggerAnimation = useCallback(() => {
    'worklet';
    
    // Heart bounce animation
    scale.value = withSequence(
      withSpring(1.4, { 
        damping: 15, 
        stiffness: 1000,
        mass: 0.8
      }),
      withSpring(0.9, { 
        damping: 10, 
        stiffness: 150,
        mass: 0.8
      }),
      withSpring(1, { 
        damping: 8, 
        stiffness: 100,
        mass: 0.8
      })
    );

    // Vertical movement animation
    translateY.value = withSequence(
      withSpring(-8, {
        damping: 12,
        stiffness: 800,
        mass: 0.5
      }),
      withSpring(0, {
        damping: 8,
        stiffness: 150,
        mass: 0.8
      })
    );

    // Button press feedback
    buttonScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );
  }, []);

  // Debounced API call
  const debouncedApiCall = useCallback((postId: string | number, newLikedState: number) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      onLikePostHandler({ postId, liked: newLikedState });
      updateOtherLikePostData(postId, newLikedState === 1 ? 1 : -1);
    }, 100); // 300ms debounce
  }, [onLikePostHandler, updateOtherLikePostData]);

  // Optimized press handler with debouncing
  const onPressLikeHandler = useCallback(() => {
    const now = Date.now();
    
    // Prevent rapid tapping (debounce UI updates)
    if (now - lastPressTime.current < 150 || isAnimating) {
      return;
    }
    
    lastPressTime.current = now;
    setIsAnimating(true);
    
    // Optimistic UI updates
    const newLikedState = isLiked === 1 ? 0 : 1;
    const updatedLikes = isLiked === 1 ? likeCount - 1 : likeCount + 1;
    
    setLikeCount(updatedLikes);
    setIsLiked(newLikedState);
    
    // Update color animation
    colorValue.value = withTiming(newLikedState, { duration: 200 });
    
    // Trigger animations
    runOnJS(triggerAnimation)();
    
    // Call parent update function
    if (updateLikeStatus) {
      updateLikeStatus(isLiked === 1);
    }
    
    // Debounced API call
    debouncedApiCall(postId, newLikedState);
    
    // Reset animation flag
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [
    isLiked, 
    likeCount, 
    isAnimating, 
    postId, 
    updateLikeStatus, 
    debouncedApiCall, 
    triggerAnimation,
    colorValue
  ]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Button animation style
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  }, [buttonScale.value]);

  // Memoized count text to prevent unnecessary re-renders
  const countText = useMemo(() => {
    // Format large numbers (e.g., 1.2K, 1.5M)
    if (likeCount >= 1000000) {
      return `${(likeCount / 1000000).toFixed(1)}M`;
    } else if (likeCount >= 1000) {
      return `${(likeCount / 1000).toFixed(1)}K`;
    }
    return likeCount.toString();
  }, [likeCount]);

  return (
    <Animated.View style={buttonAnimatedStyle}>
      <TouchableOpacity
        onPress={onPressLikeHandler}
        style={styles.interactionButton}
        activeOpacity={0.8}
        disabled={isAnimating}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Better touch target
      >
         <AnimatedIcon
          isLiked={isLiked}
          scale={scale}
          translateY={translateY}
          colorValue={colorValue}
        />
        {countText != "0" &&<Text style={[
          styles.interactionCount,
          isLiked === 1 && styles.likedText // Different style when liked
        ]}>
          {countText}
        </Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal re-rendering
  return (
    prevProps.postId === nextProps.postId &&
    prevProps.Liked === nextProps.Liked &&
    prevProps.count === nextProps.count &&
    prevProps.updateLikeStatus === nextProps.updateLikeStatus
  );
});

PostLikeComponent.displayName = 'PostLikeComponent';

export default PostLikeComponent;

const styles = StyleSheet.create({
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    // paddingVertical: 4,
    borderRadius: 8,
    minWidth: 50, // Ensure consistent button size
  },
  interactionCount: {
    fontSize: 18,
    fontFamily: fontFamilies.regular,
    color: globalColors.warmPink,
    marginLeft: 4,
    marginBottom:4,
    fontVariant: ['tabular-nums'], // Consistent number spacing
  },
  likedText: {
    color: globalColors.warmPink, // Highlight color when liked
    fontFamily: fontFamilies.medium, // Slightly bolder when liked
    fontSize: 18,
  },
});