import { ReactNode } from 'react';

/**
 * Props for the StickyHeader component
 */
export interface StickyHeaderProps {
  /** Header title text */
  title: string;
  /** Avatar image URI */
  avatarUri: string;
  /** Callback when avatar is pressed */
  onPressAvatar?: () => void;
  /** Right side action buttons/components */
  rightActions?: ReactNode;
  /** Optional scroll offset for triggering animations */
  scrollOffset?: number;
  /** Callback when compact follow icon is pressed */
  onPressFollowCompact?: () => void;
  /** Callback when compact message icon is pressed */
  onPressMessageCompact?: () => void;
}

/**
 * Animation configuration constants
 */
export const HEADER_CONFIG = {
  /** Maximum header height when expanded */
  MAX_HEIGHT: 120,
  /** Minimum header height when collapsed */
  MIN_HEIGHT: 55,
  /** Avatar size when expanded */
  AVATAR_SIZE_LARGE: 64,
  /** Avatar size when collapsed */
  AVATAR_SIZE_SMALL: 32,
  /** Scroll distance to trigger full collapse */
  SCROLL_DISTANCE: 100,
  /** Animation duration in milliseconds */
  ANIMATION_DURATION: 300,
} as const;

/**
 * Hook return type for useStickyHeader
 */
export interface StickyHeaderHook {
  /** Animated header height */
  headerHeight: number;
  /** Animated avatar scale */
  avatarScale: number;
  /** Animated avatar translation Y */
  avatarTranslateY: number;
  /** Animated title opacity */
  titleOpacity: number;
  /** Animated actions opacity */
  actionsOpacity: number;
  /** Header background opacity */
  backgroundOpacity: number;
} 