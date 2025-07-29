import { View, Text, TouchableOpacity, Animated } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { FlashIcon, UserIcon, VerifiedIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { Image } from "expo-image";
import { R2_PUBLIC_URL } from "@/utils/constants";
import ProfileButton from "../../(profile)/(screen)/profile/Component/ProfileButton";

const InvitedUser = ({ userName, socialName, profilePic, acceptPress, rejectPress }: any) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isButtonVisible) {
      // Slide up and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Slide down and fade out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isButtonVisible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // Slide from 50px below to original position
  });

  return (
    <TouchableOpacity 
      style={{ 
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "#282b32",
        borderWidth: 1,
        paddingTop: "5%",
        paddingHorizontal: "5%",
        marginTop: "5%",
        paddingBottom: "5%",
        overflow: 'hidden', // Important for smooth animation
      }}
      activeOpacity={1}
      onPress={() => setIsButtonVisible(!isButtonVisible)}
    >
      <View
        style={{
          flexDirection: "row",
          // alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{flexDirection: "row", alignItems: "center"}}>
        {!profilePic ? (
          <UserIcon style={{ borderRadius: 24, width: 48, height: 48 }} />
        ) : (
          <Image
            style={{ borderRadius: 24, width: 48, height: 48 }}
            contentFit="cover"
            source={{ uri: `${R2_PUBLIC_URL}${profilePic}` }}
          />
        )}

        <View style={{ marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                letterSpacing: -0.2,
                lineHeight: 20,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
              }}
            >
              {socialName}
            </Text>
            <VerifiedIcon />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "5%",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutral9,
              }}
            >
              {userName}
            </Text>
          </View>
        </View>
        </View>
        <Animated.Image
          style={{ width: 18, height: 18,transform: [{rotate: isButtonVisible ? '0deg' : '180deg'}] }}
          source={require("../../../../assets/image/down_Icon.png")}
        />
      </View>

      {/* Animated Button Container */}
      {isButtonVisible && (
        <Animated.View 
          style={{ 
            flexDirection: "row", 
            alignItems: "center", 
            justifyContent: "space-around", 
            width: "100%",
            marginTop: 15,
            opacity: opacityAnim,
            transform: [{ translateY }],
          }}
        >
          <ProfileButton
            containerStyle={{
              width: "40%",
              height: 50,
              marginTop: 0,
            }}
            label={"Accept"}
            onPress={() => {acceptPress()}}
          />
          <ProfileButton
            containerStyle={{
              width: "40%",
              height: 50,
              marginTop: 0,
            }}
            label={"Reject"}
            onPress={() => {rejectPress()}}
          />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
};

export default InvitedUser;