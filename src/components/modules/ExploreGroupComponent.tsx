import { Dimensions, ScrollView, Text, View } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import moment from "moment";

const { width, height } = Dimensions.get("screen");

const ExploreGroupComponent = ({ exploreData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.floor(scrollPosition / (width * 0.9));
    setActiveIndex(currentIndex);
  };

  return (
    <View>
      <LinearGradient
        style={{
          overflow: "hidden",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingVertical: "15%",
          backgroundColor: globalColors.slateBlueShade80,
        }}
        locations={[0, 1]}
        colors={["#08031c", "rgba(49, 28, 143, 0)"]}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 0,
          }}
        >
          <Text
            style={{
              fontSize: 28,
              lineHeight: 36,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
            }}
          >
            Explore groups
          </Text>
          {/* <GradientText
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 17,
              color: globalColors.darkOrchid,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 21,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
              }}
            >
              See all
            </Text>
          </GradientText> */}
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{
            padding: "2.5%",
          }}
        >
          {exploreData?.map((data, index) => (
            <View
              key={data.id}
              style={{
                borderRadius: 16,
                backgroundColor: globalColors.darkOrchidShade80,
                flexDirection: "column",
                padding: "1%",
                marginTop: "2%",
                marginRight: 18,
                width: width * 0.9,
                height: height * 0.35,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    contentFit="contain"
                    style={{
                      width: 33,
                      height: 33,
                      borderRadius: 25,
                      backgroundColor: globalColors.neutral3,
                    }}
                    source={
                      data?.post_by?.profile_pic
                        ? { uri: ImageUrlConcated(data?.post_by?.profile_pic) }
                        : require("@/assets/image/EmptyProfileIcon.webp")
                    }
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 16,
                      fontFamily: fontFamilies.medium,
                      color: globalColors.neutralWhite,
                      marginLeft: 8,
                    }}
                  >
                    {data?.post_by?.full_name}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 16,
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {moment.utc(data?.time).utcOffset("+05:30").fromNow()}
                </Text>
              </View>

              <View style={{ marginTop: 8, width: "100%" }}>
                <Image
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    height: (width * 80 * (180 / 350)) / 90,
                  }}
                  contentFit="fill"
                  source={
                    data?.post_image
                      ? { uri: ImageUrlConcated(data?.post_image) }
                      : require("./../../assets/image/emptyPost.jpg")
                  }
                />
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 20,
                    fontFamily: fontFamilies.medium,
                    color: globalColors.neutralWhite,
                    marginTop: 4,
                  }}
                  numberOfLines={2}
                  ellipsizeMode="middle"
                >
                  {data?.post_content || "No content available"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: "4.5%",
          }}
        >
          {exploreData?.map((_, index) => (
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
      </LinearGradient>
    </View>
  );
};

export default ExploreGroupComponent;
