import {
  View,
  Text,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { memo } from "react";
import { Styles } from "@/app/styles/dashboardStyle";
import HomePostTabs from "../element/HomePostTabs";
import PostLoaderComponent from "../PostLoaderComponent";
import NewPostButton from "../NewPostButton";
import { globalColors } from "@/assets/GlobalColors";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import ProgressBar from "../ProgressBar";
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
}

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
}) => {
  return (
    <View style={Styles.mainContainer}>
      <HomePostTabs
        currentTab={Selectedtab}
        onChangeTab={(tab) => {
          setSelectedTab(tab);
        }}
      />
      {progressVisible && (
        <ProgressBar progress={progressValue} isFailed={isCreatePostFailed} uploadPostAgain={uploadPostAgain} />
      )}
      
      <View style={Styles.mainContainer}>
        <FlashList
          ref={scrollViewRef}
          data={postData}
          renderItem={renderHomeItem}
          keyExtractor={(item: any, index: number) => item?.id?.toString()}
          estimatedItemSize={700}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          // Add these new props for pagination every 5 posts
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50,
            minimumViewTime: 300,
          }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          // Performance optimizations
          removeClippedSubviews={true}
          decelerationRate="fast" // or "fast" for quicker stop
          disableIntervalMomentum={true}
          snapToInterval={null} // ensure it's not snapping
          bounces={true} // iOS: enables bounce on overscroll
          overScrollMode="auto"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#6200ee"]} // Android spinner color
              tintColor="#6200ee" // iOS spinner color
            />
          }
          ListFooterComponent={
            <View>
              {isNextPostLoading && (
                <ActivityIndicator
                  color={globalColors?.darkOrchidTint20}
                  size={"large"}
                  style={{ bottom: 30 }}
                />
              )}
            </View>
          }
        />
        {(newPostCount ? newPostCount > 0 : false) ||
        (refresh_Button && homePostResponse?.UpdatedData.length > 50) ? (
          <NewPostButton
            count={newPostCount}
            showButton={refresh_Button}
            onPress={() => {
              onRefreshPostData(newPostCount);
            }}
          />
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

export default memo(RenderHomeView);
