import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import ViewWrapper from "../../components/ViewWrapper";
import NormalButton from "../../components/NormalButton";
import { router } from "expo-router";
import { Image } from "expo-image";
import { globalColors } from "@/assets/GlobalColors";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = () => {
  return (
    <ViewWrapper>
      <View
        style={{
          marginTop: "20%",
          width: "95%",
          flex: 1,
          alignItems: "center",
        }}
      >
        <Image
          source={require("@/assets/image/welcomeImage.png")}
          style={{
            width: (width * 75) / 100,
            height: (width * 80) / 100,
          }}
          // resizeMode={FastImage.resizeMode.contain}
        />
        <Text style={{ color: globalColors.neutralWhite }}>
          Great! Welcome to Qoneqt
        </Text>
        <Text style={{ color: globalColors.neutralWhite }}>
          {`You have successfully completed the registrationt`}
        </Text>
        <NormalButton
          label={"Explore Feed"}
          
          onPress={() => router.replace("/DashboardScreen")}
        />
      </View>
    </ViewWrapper>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
