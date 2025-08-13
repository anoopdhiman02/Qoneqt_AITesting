import {
    Extrapolate,
    interpolate,
    useDerivedValue
  } from 'react-native-reanimated';
  import { HEADER_CONFIG, StickyHeaderHook } from './types';
  
  /**
   * Custom hook for sticky header animations
   * 
   * @param scrollY - Shared value representing scroll position
   * @returns Animated style values for header components
   */
  export const useStickyHeader = (scrollY: any): StickyHeaderHook => {
    // Derived animated values based on scroll position
    const progress = useDerivedValue(() => {
      return interpolate(
        scrollY.value,
        [0, HEADER_CONFIG.SCROLL_DISTANCE],
        [0, 1],
        Extrapolate.CLAMP
      );
    });
  
    // Header height animation: shrinks from MAX to MIN height
    const headerHeight = useDerivedValue(() => {
      return interpolate(
        progress.value,
        [0, 1],
        [HEADER_CONFIG.MAX_HEIGHT, HEADER_CONFIG.MIN_HEIGHT],
        Extrapolate.CLAMP
      );
    });
  
    // Avatar scale animation: shrinks from large to small size
    const avatarScale = useDerivedValue(() => {
      const scaleRatio = HEADER_CONFIG.AVATAR_SIZE_SMALL / HEADER_CONFIG.AVATAR_SIZE_LARGE;
      return interpolate(
        progress.value,
        [0, 0.5, 1],
        [1, 0.85, scaleRatio],
        Extrapolate.CLAMP
      );
    });
  
    // Avatar vertical translation: moves up as header collapses
    const avatarTranslateY = useDerivedValue(() => {
      return interpolate(
        progress.value,
        [0, 1],
        [0, -15],
        Extrapolate.CLAMP
      );
    });
  
    // Title opacity: fades out during collapse
    const titleOpacity = useDerivedValue(() => {
      return interpolate(
        progress.value,
        [0, 0.3, 0.7],
        [1, 0.7, 0],
        Extrapolate.CLAMP
      );
    });
  
    // Actions opacity: fades out during collapse
    const actionsOpacity = useDerivedValue(() => {
      return interpolate(
        progress.value,
        [0, 0.4, 0.8],
        [1, 0.6, 0],
        Extrapolate.CLAMP
      );
    });
  
    // Background opacity: increases for blur effect
    const backgroundOpacity = useDerivedValue(() => {
      return interpolate(
        progress.value,
        [0, 0.5, 1],
        [0.1, 0.7, 0.95],
        Extrapolate.CLAMP
      );
    });
  
    return {
      headerHeight: headerHeight.value,
      avatarScale: avatarScale.value,
      avatarTranslateY: avatarTranslateY.value,
      titleOpacity: titleOpacity.value,
      actionsOpacity: actionsOpacity.value,
      backgroundOpacity: backgroundOpacity.value,
    };
  }; 