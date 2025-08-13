import {
  View,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Platform,
} from "react-native";
import React, { memo, useCallback, useMemo, useEffect } from "react";
import { Styles } from "@/app/styles/dashboardStyle";
import PostLoaderComponent from "../PostLoaderComponent";
import NewPostButton from "../NewPostButton";
import { globalColors } from "@/assets/GlobalColors";
import { FlashList } from "@shopify/flash-list";
import ProgressBar from "../ProgressBar";
import CommunityStories from "@/app/(screens)/CommunitySories";

const { width } = Dimensions.get("window");

interface RenderHomeViewProps {
  Selectedtab?: number;
  setSelectedTab?: (tab: number) => void;
  homePostResponse?: any;
  postData?: any;
  isNextPostLoading?: boolean;
  getNewPost?: boolean;
  refresh_Button?: boolean;
  newPostCount?: any;
  onRefreshPostData?: any;
  renderHomeItem?: any;
  scrollViewRef?: React.RefObject<FlashList<any>>;
  handleScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  handleScrollButton?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onEndReached?: () => void;
  refreshing?: boolean;
  handleRefresh?: () => void;
  onViewableItemsChanged?: () => void;
  progressValue?: number;
  progressVisible?: boolean;
  isCreatePostFailed?: boolean;
  uploadPostAgain?: () => void;
  communityData?: any;
}

// Optimized key extractor with memoization
const keyExtractor = (item: any, index: number) => {
  return item?.id?.toString() || `post-${index}-${Date.now()}`;
};

// Optimized viewability config
const viewabilityConfig = {
  itemVisiblePercentThreshold: 60, // Increased for better performance
  minimumViewTime: 150, // Slightly increased
  waitForInteraction: true, // Better for scroll performance
};

// Optimized getItemType function for better FlashList performance
const getItemType = (item: any) => {
  if (!item?.file_type) return 'post-text-only';
  
  switch (item.file_type) {
    case "image":
      const imageCount = Array.isArray(item.post_image) 
        ? Math.min(item.post_image.length, 4)
        : 1;
      return `post-images-${imageCount}`;
    case "video":
      return 'post-video';
    case "audio":
      return 'post-audio';
    default:
      return 'post-text-only';
  }
};

// Memoized Empty Component
const EmptyComponent = memo(() => {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: 20,
      minHeight: 300 
    }}>
      <Text style={{ 
        color: globalColors.neutral_white[300], 
        fontSize: 16,
        textAlign: 'center' 
      }}>
        No posts available. Pull to refresh!
      </Text>
    </View>
  );
});

// Memoized Community Stories Header Component
const CommunityStoriesHeader = memo(({ communityData }: { communityData: any }) => {
  return <CommunityStories communityData={communityData} key="community-stories" />;
});

// Memoized Footer Component
const ListFooterComponent = memo(({ isNextPostLoading }: { isNextPostLoading: boolean }) => {
  if (!isNextPostLoading) return <View style={{ height: 20 }} />;
  
  return (
    <View style={{ paddingVertical: 20 }}>
      <ActivityIndicator
        color={globalColors?.darkOrchidTint20}
        size="large"
        style={{ bottom: 30 }}
      />
    </View>
  );
});

// Memoized Progress Bar Component
const MemoizedProgressBar = memo(ProgressBar);

// Memoized New Post Button Component
const MemoizedNewPostButton = memo(NewPostButton);

const RenderHomeView: React.FC<RenderHomeViewProps> = ({
  Selectedtab,
  setSelectedTab,
  homePostResponse,
  postData,
  isNextPostLoading,
  getNewPost,
  refresh_Button,
  newPostCount,
  onRefreshPostData,
  renderHomeItem,
  scrollViewRef,
  handleScroll,
  handleScrollButton,
  onEndReached,
  refreshing,
  handleRefresh,
  onViewableItemsChanged,
  progressValue,
  progressVisible,
  isCreatePostFailed,
  uploadPostAgain,
  communityData,
}) => {
  // Memoized refresh control
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing || false}
      onRefresh={handleRefresh}
      colors={["#6200ee"]} 
      tintColor="#6200ee" 
      progressViewOffset={0} 
      progressBackgroundColor="#ffffff"
    />
  ), [refreshing, handleRefresh]);
  // Memoized list header component
  const listHeaderComponent = useMemo(() => (
    <CommunityStoriesHeader communityData={communityData} />
  ), [communityData]);

  // Memoized list footer component
  const listFooterComponent = useMemo(() => (
    <ListFooterComponent isNextPostLoading={isNextPostLoading || false} />
  ), [isNextPostLoading]);

  // Optimized onEndReached with debouncing
  const onEndReachedThrottled = useCallback(() => {
    if (onEndReached && !isNextPostLoading) {
      onEndReached();
    }
  }, [onEndReached, isNextPostLoading]);

  // Memoized empty component
  const listEmptyComponent = useMemo(() => (
    <EmptyComponent />
  ), []);


  // Memoized FlashList props for performance
  const flashListProps = useMemo(() => ({
    ref: scrollViewRef,
    data: postData || [],
    renderItem: renderHomeItem,
    keyExtractor,
    estimatedItemSize: 500, // More accurate estimate based on your content
    
    // Performance optimizations
    getItemType,
    removeClippedSubviews: Platform.OS === 'ios' ? true : false,
    maxToRenderPerBatch: 10, // Reduced for better performance
    windowSize: 12, // Reduced memory footprint
    initialNumToRender: 6, // Start smaller
    updateCellsBatchingPeriod: 50, // Batch updates
    
    // Scroll optimizations
    onScroll: handleScroll,
    scrollEventThrottle: 16, // Increased for better performance
    decelerationRate:Platform.OS === 'ios' ? 0.998 : 0.985,
    disableIntervalMomentum: false,
    showsVerticalScrollIndicator: false,
    bounces: true,
    overScrollMode: "never" as const,
    
    // Viewability optimizations
    onViewableItemsChanged,
    viewabilityConfig,
    
    // Pagination
    onEndReached: onEndReachedThrottled,
    onEndReachedThreshold: 0.2,
    
    // Components
    ListHeaderComponent: listHeaderComponent,
    ListFooterComponent: listFooterComponent,
    ListEmptyComponent: listEmptyComponent,
    refreshControl,
    
    // Additional performance props
    drawDistance: 1200, // Reduced draw distance
    // recycleItems: true, // Remove this as it's not a valid prop
  }), [
    scrollViewRef,
    postData,
    renderHomeItem,
    handleScroll,
    onViewableItemsChanged,
    onEndReachedThrottled,
    listHeaderComponent,
    listFooterComponent,
    listEmptyComponent,
    refreshControl,
  ]);

  // Memoized new post button condition
  const shouldShowNewPostButton = useMemo(() => {
    return (newPostCount && newPostCount > 0) || 
           (refresh_Button && homePostResponse?.UpdatedData?.length > 50);
  }, [newPostCount, refresh_Button, homePostResponse?.UpdatedData?.length]);

  return (
    <View style={Styles.mainContainer}>
      {progressVisible && (
        <MemoizedProgressBar
          progress={progressValue}
          isFailed={isCreatePostFailed}
          uploadPostAgain={uploadPostAgain}
        />
      )}

      <View style={Styles.mainContainer}>
        <FlashList {...flashListProps} />
        
        {shouldShowNewPostButton && (
          <MemoizedNewPostButton
            count={newPostCount}
            showButton={refresh_Button}
            onPress={() => onRefreshPostData?.(newPostCount)}
          />
        )}
      </View>
    </View>
  );
};

export default memo(RenderHomeView, (prevProps, nextProps) => {
  // Custom comparison for optimal re-rendering
  return (
    prevProps.Selectedtab === nextProps.Selectedtab &&
    prevProps.postData?.length === nextProps.postData?.length &&
    prevProps.isNextPostLoading === nextProps.isNextPostLoading &&
    prevProps.refreshing === nextProps.refreshing &&
    prevProps.newPostCount === nextProps.newPostCount &&
    prevProps.progressVisible === nextProps.progressVisible &&
    prevProps.progressValue === nextProps.progressValue &&
    prevProps.isCreatePostFailed === nextProps.isCreatePostFailed &&
    prevProps.communityData === nextProps.communityData
  );
});