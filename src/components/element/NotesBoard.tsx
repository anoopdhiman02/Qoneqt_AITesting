import React, { useState, useRef, useEffect } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { VerifiedIcon, VerifiedIconBig } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("screen");

const NotesBoard = ({ CompleteVerify }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const totalItems = 3;
    let scrolled = 0;

    // const autoScroll = setInterval(() => {
    //   scrolled++;
    //   if (scrolled < totalItems) {
    //     scrollViewRef.current.scrollTo({ x: scrolled * width, animated: true });
    //     setCurrentIndex(scrolled);
    //   } else {
    //     scrollViewRef.current.scrollTo({ x: 0, animated: true });
    //     setCurrentIndex(0);
    //     scrolled = 0;
    //   }
    // }, 2500);

    // return () => clearInterval(autoScroll);
  }, []);

  const renderItem = (item, index) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        key={index.toString()}
        style={{
          width: width,
          paddingHorizontal: 20,
          transform: [{ scale }],
        }}
      >
        <TouchableOpacity onPress={CompleteVerify}>
          <LinearGradient
            colors={globalColors.cardBg3}
            start={{ x: 2, y: -5 }}
            end={{ x: -4, y: 2 }}
            style={{
              flexDirection: "row",
              borderRadius: 16,
              borderColor: globalColors.darkOrchidShade60,
              borderWidth: 1,
              padding: "4.7%",
              width: "102%",
            }}
          >
            <VerifiedIconBig style={{ alignSelf: "center", right: "18%" }} />
            <View style={{ alignSelf: "center", right: "15%" }}>
              <Text
                style={{
                  fontSize: 19,
                  lineHeight: 24,
                  fontFamily: fontFamilies.medium,
                  color: globalColors.neutralWhite,
                }}
              >
                Complete blue tick verification
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral8,
                  marginTop: 4,
                }}
              >
                Earn ₹83 on completion of your bluetick verification*
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={{ alignItems: "center", marginTop: "5%" }}>
      <Animated.ScrollView
        scrollEnabled={false}
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        contentContainerStyle={{ alignItems: "center" }}
        style={{ width: width }}
      >
        {[1, 2, 3].map((_, index) => renderItem(_, index))}
      </Animated.ScrollView>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          backgroundColor: globalColors.neutral1,
          borderRadius: 64,
          borderColor: globalColors.warmPinkTint20,
          borderWidth: 1,
          paddingHorizontal: 12,
          paddingVertical: 6,
        }}
      >
        {[1, 2, 3].map((_, index) => (
          <Image
            key={index.toString()}
            style={{
              width: currentIndex === index ? 8 : 6,
              height: currentIndex === index ? 8 : 6,
              marginHorizontal: 4,
            }}
            contentFit="cover"
            source={
              currentIndex === index
                ? require("@/assets/image/dots-light.png")
                : require("@/assets/image/dots-dark.png")
            }
          />
        ))}
      </View> */}
    </View>
  );
};

export default NotesBoard;
