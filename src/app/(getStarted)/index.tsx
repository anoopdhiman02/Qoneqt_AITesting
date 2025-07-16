import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Carousel from "react-native-reanimated-carousel";
import { router } from "expo-router";
import ViewWrapper from "../../components/ViewWrapper";
import Button1 from "../../components/buttons/Button1";
import { fontFamilies } from "../../assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { Image } from "expo-image";
import { setGetStartedSkipped } from "@/localDB/LocalStroage";
import { registerForPushNotifications } from "@/utils/Notifications";
import UpdateFcmTokenHook from "@/customHooks/UpdateFcmTokenHook";
import { useAppStore } from "@/zustand/zustandStore";
import { useScreenTracking } from "@/customHooks/useAnalytics";
const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 0,
    title: "Build your own community",
    text: "Customize your experience: Public, Private, and Premium groups await on our Web 3.0 platform.",
    image: require("../../assets/image/slider1.png"),
  },
  {
    id: 1,
    title: "Craft & share content",
    text: "Choose a loop, create your post, add content, and effortlessly share it with your community.",
    image: require("../../assets/image/slider2.png"),
  },
  {
    id: 2,
    title: "Get blue tick verification",
    text: "Optimize your Qoneqt profile by verifying yourself and unlocking a blue checkmark!",
    image: require("../../assets/image/slider3.png"),
  },
  {
    id: 3,
    title: "Tokenize, Vote & Control",
    text: "Take control on our Web 3.0 social media: vote, create, manage your social token.",
    image: require("../../assets/image/slider4.png"),
  },
  {
    id: 4,
    title: "Safer & secure community",
    text: "Legitimacy prioritized, unauthorized activities rejected, user privacy emphasized.",
    image: require("../../assets/image/slider5.png"),
  },
];

const Slide = ({ title, text, image }) => (
  <View style={{ justifyContent: "center", alignItems: "center", width: "90%", alignSelf: "center", height: "104%" }}>
    <Image contentFit="contain" source={image} style={{ width: width * 0.9, height: height * 0.5 }} />
    <View style={{ justifyContent: "center", alignItems: "center", width: "110%" }}>
      <Text style={{ fontFamily: fontFamilies.bold, color: globalColors.neutralWhite, fontSize: 28, textAlign: "center" }}>{title}</Text>
      <Text style={{ textAlign: "center", fontFamily: fontFamilies.medium, fontSize: 16, color: globalColors.neutral7, marginBottom: "15%" }}>{text}</Text>
    </View>
  </View>
);

const index = () => {
  useScreenTracking("GetStarted");
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const { onUpdateWithoutIdFcmHandler } = UpdateFcmTokenHook();
  const { setFcmTokenStore } = useAppStore();

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ index: activeIndex });
    }
  }, [activeIndex]);

  const onGetStartedHandler = async () => {
    requestNotificationPermission();
    setGetStartedSkipped(true);
    router.replace("/LoginScreen");
  };

  const requestNotificationPermission = () => {
    registerForPushNotifications().then((token) => {
      onUpdateWithoutIdFcmHandler();
      setFcmTokenStore(token);
    });
  };

  return (
    <ViewWrapper>
      <View style={{ width: "90%", flex: 1, marginVertical: "5%" }}>
        <TouchableOpacity onPress={onGetStartedHandler} style={{ alignSelf: "flex-end", marginBottom: "5%" }}>
          <Text style={{ color: globalColors.warmPinkTint20, fontSize: 20, letterSpacing: 0.3 }}>Skip</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                backgroundColor: index === activeIndex ? globalColors.neutralWhite : globalColors.neutral2,
                height: 3,
                borderRadius: 10,
                width: "17%",
                marginHorizontal: 5,
              }}
            />
          ))}
        </View>
        <Carousel
          ref={carouselRef}
          width={width * 0.9}
          height={height * 0.65}
          data={slides}
          loop={false}
          onSnapToItem={setActiveIndex}
          onProgressChange={(_, progress) => setActiveIndex(Math.round(progress))}
          renderItem={({ item }) => <Slide {...item} />}
        />
        <Button1 title={activeIndex === slides.length - 1 ? "Get Started" : "Continue"} onPress={activeIndex === slides.length - 1 ? onGetStartedHandler : handleNext}  />
      </View>
    </ViewWrapper>
  );
};

export default index;