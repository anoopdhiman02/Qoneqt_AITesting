import React, { useState, useRef } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import DiscoverPostContainer from "../element/DiscoverPostContainer";
import PostLoaderComponent from "../element/PostLoaderComponent";

const { width } = Dimensions.get("window");

type DiscoverPostProps = {
  DiscoverPostData?: any[];
  onPressCommentHandler?: (postId: any) => void;
  onPressReportPost?: (postId: any) => void;
  discoverLoading?: boolean;
  ShareChannelRef?: any;
};

const DiscoverPostComponent: React.FC<DiscoverPostProps> = ({
  DiscoverPostData = [],
  onPressCommentHandler,
  onPressReportPost,
  discoverLoading,
  ShareChannelRef,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / width);
    setActiveIndex(currentIndex);
  };

  return (
    <View
      style={{
        width: "92%",
        height: (width * 90 * (515 / 360)) / 100,
        top: 2,
        alignSelf: "center",
      }}
    >
      {/* Title */}
      <View style={{ width: "100%", flexDirection: "row", marginRight: 10 }}>
        <Text
          style={{
            fontSize: 28,
            lineHeight: 36,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
            // left: "30%",
            // alignSelf:"center",
            bottom: "1%",
            padding: 5,
          }}
        >
          Discover
        </Text>
      </View>

      {/* FlatList for Discover Posts */}
      <FlatList
        ref={flatListRef}
        data={discoverLoading ? [1, 2, 3, 4] : DiscoverPostData}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: width * 0.9,
          offset: width * 0.9 * index,
          index,
        })}
        renderItem={({ item, index }) =>
          discoverLoading ? (
            <View
              style={{
                width: (width * 80) / 100,
                height: (width * 80 * (402 / 308)) / 100,
                marginHorizontal: 10,
              }}
            >
              <PostLoaderComponent />
            </View>
          ) : (
            <DiscoverPostContainer
              data={item}
              index={index}
              Type="Discover"
              widthVal={90}
              onPressComment={onPressCommentHandler}
              onPressReport={onPressReportPost}
              containerStyle={{
                marginRight: DiscoverPostData.length == index + 1 ? 60 : "1%",
              }}
            />
          )
        }
      />

      {/* Pagination Dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 5,
          marginBottom: 10,
        }}
      >
        {DiscoverPostData.length > 0 &&
          DiscoverPostData.map((_, index) => (
            <View
              key={index}
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor:
                  index === activeIndex
                    ? globalColors.neutralWhite
                    : globalColors.neutral5,
                marginHorizontal: 4,
              }}
            />
          ))}
      </View>
    </View>
  );
};

export default React.memo(DiscoverPostComponent);
