import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useDerivedValue
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles';
import { HEADER_CONFIG, StickyHeaderProps } from './types';

/**
 * Professional sticky header component with smooth animations
 * 
 * Features:
 * - Shrinks avatar from 64px to 32px with scale + translate
 * - Fades title and actions based on scroll position  
 * - Transforms action buttons to compact icons in mini mode
 * - Uses react-native-reanimated for 60fps animations
 * - Blur effect for compact header mode
 * - Supports safe area insets for iOS/Android
 * - Fully typed with TypeScript
 */
const StickyHeader: React.FC<StickyHeaderProps & { scrollY: Animated.SharedValue<number> }> = ({
  title,
  avatarUri,
  onPressAvatar,
  rightActions,
  scrollY,
  onPressFollowCompact,
  onPressMessageCompact,
}) => {
  const insets = useSafeAreaInsets();

  // Calculate animation progress based on scroll position
  const progress = useDerivedValue(() => {
    return interpolate(
      scrollY.value,
      [0, HEADER_CONFIG.SCROLL_DISTANCE],
      [0, 1],
      Extrapolate.CLAMP
    );
  });

  // Animated header height with safe area
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const height = interpolate(
      progress.value,
      [0, 1],
      [HEADER_CONFIG.MAX_HEIGHT + insets.top, HEADER_CONFIG.MIN_HEIGHT + insets.top],
      Extrapolate.CLAMP
    );
    
    return {
      height,
    };
  });

  // Animated background opacity for base layer
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.3, 1],
      [0.8, 0.3, 0.1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  // Animated blur container style
  const animatedBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.2, 1],
      [0, 0.8, 1],
      Extrapolate.CLAMP
    );
    
    const height = interpolate(
      progress.value,
      [0, 0.3, 1],
      [0, HEADER_CONFIG.MIN_HEIGHT * 0.8, HEADER_CONFIG.MIN_HEIGHT + insets.top + 10],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      height,
    };
  });

  // Animated avatar scale and translation
  const animatedAvatarStyle = useAnimatedStyle(() => {
    const scaleRatio = HEADER_CONFIG.AVATAR_SIZE_SMALL / HEADER_CONFIG.AVATAR_SIZE_LARGE;
    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 0.85, scaleRatio],
      Extrapolate.CLAMP
    );
    
    const translateY = interpolate(
      progress.value,
      [0, 1],
      [0, -12],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }, { translateY }],
    };
  });

  // Animated title opacity
  const animatedTitleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.3, 0.7],
      [1, 0.7, 0],
      Extrapolate.CLAMP
    );
    
    const translateX = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0, -20, -50],
      Extrapolate.CLAMP
    );
    
    const scale = interpolate(
      progress.value,
      [0, 0.7, 1],
      [1, 0.95, 0.9],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      transform: [
        { translateX },
        { scale }
      ],
    };
  });

  // Animated actions with smooth transformation
  const animatedFollowButtonStyle = useAnimatedStyle(() => {
    // Scale and size transformation
    const scale = interpolate(
      progress.value,
      [0, 0.7, 1],
      [1, 0.9, 1],
      Extrapolate.CLAMP
    );
    
    const width = interpolate(
      progress.value,
      [0, 0.7, 1],
      [80, 50, 36],
      Extrapolate.CLAMP
    );
    
    const height = interpolate(
      progress.value,
      [0, 0.7, 1],
      [36, 36, 36],
      Extrapolate.CLAMP
    );
    
    const borderRadius = interpolate(
      progress.value,
      [0, 0.7, 1],
      [20, 19, 18],
      Extrapolate.CLAMP
    );
    
    return {
      width,
      height,
      borderRadius,
      transform: [{ scale }],
    };
  });

  const animatedMessageButtonStyle = useAnimatedStyle(() => {
    // Scale and size transformation
    const scale = interpolate(
      progress.value,
      [0, 0.7, 1],
      [1, 0.9, 1],
      Extrapolate.CLAMP
    );
    
    const width = interpolate(
      progress.value,
      [0, 0.7, 1],
      [100, 60, 36],
      Extrapolate.CLAMP
    );
    
    const height = interpolate(
      progress.value,
      [0, 0.7, 1],
      [36, 36, 36],
      Extrapolate.CLAMP
    );
    
    const borderRadius = interpolate(
      progress.value,
      [0, 0.7, 1],
      [20, 19, 18],
      Extrapolate.CLAMP
    );
    
    return {
      width,
      height,
      borderRadius,
      transform: [{ scale }],
    };
  });

  // Text opacity animation
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.5, 0.7],
      [1, 0.5, 0],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  // Icon opacity animation
  const animatedIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0.5, 0.7, 1],
      [0, 0.5, 1],
      Extrapolate.CLAMP
    );
    
    const scale = interpolate(
      progress.value,
      [0.5, 1],
      [0.8, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  // Animated border opacity
  const animatedBorderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0.7, 1],
      [0, 1],
      Extrapolate.CLAMP
    );
    
    return {
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.container, styles.shadow, animatedHeaderStyle]}>
      {/* Animated background with blur */}
      <View style={styles.backgroundContainer}>
        {/* Base dark background */}
        <Animated.View style={[styles.background, animatedBackgroundStyle]} />
        
        {/* Blur overlay */}
        <Animated.View style={[styles.blurContainer, animatedBlurStyle]}>
          <BlurView intensity={20} tint="dark" style={styles.blurView} />
        </Animated.View>
      </View>
      
      {/* Header content */}
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <View style={styles.topRow}>
          <View style={styles.leftSection}>
            {/* Animated avatar */}
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={onPressAvatar}
              activeOpacity={0.7}
            >
              <Animated.View style={animatedAvatarStyle}>
                <Image
                  source={{ uri: avatarUri }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </Animated.View>
            </TouchableOpacity>
            
            {/* Animated title */}
            <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </Animated.View>
          </View>
          
          {/* Morphing action buttons */}
          <View style={styles.morphingActionsContainer}>
            {/* Follow button that morphs */}
            <TouchableOpacity
              onPress={onPressFollowCompact}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.followButton, animatedFollowButtonStyle]}>
                {/* Text version */}
                <Animated.View style={[styles.buttonTextContainer, animatedTextStyle]}>
                  <Text style={styles.actionButtonText}>Follow</Text>
                </Animated.View>
                
                {/* Icon version */}
                <Animated.View style={[styles.buttonIconContainer, animatedIconStyle]}>
                  <Feather name="user-plus" size={18} color="#ffffff" />
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
            
            {/* Message button that morphs */}
            <TouchableOpacity
              onPress={onPressMessageCompact}
              activeOpacity={0.7}
            >
              <Animated.View style={[styles.messageButton, animatedMessageButtonStyle]}>
                {/* Text version */}
                <Animated.View style={[styles.buttonTextContainer, animatedTextStyle]}>
                  <Text style={styles.messageButtonText}>Message</Text>
                </Animated.View>
                
                {/* Icon version */}
                <Animated.View style={[styles.buttonIconContainer, animatedIconStyle]}>
                  <Feather name="message-circle" size={18} color="#ffffff" />
                </Animated.View>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Animated bottom border */}
      <Animated.View style={[styles.border, animatedBorderStyle]} />
    </Animated.View>
  );
};

export default StickyHeader; 