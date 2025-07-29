import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import NormalButton from "@/components/NormalButton";
import { router } from "expo-router";
import { BookIcon } from "@/assets/DarkIcon";

const { width } = Dimensions.get("window");

const ExitModal = () => {
  return (
    <ViewWrapper>
      <View style={styles.container}>
        <Image
          source={require("@/assets/image/welcomeImage.png")}
          style={styles.image}
        />
        <Text style={styles.title}>
          You are no longer a member of the group “Crypto Space”
        </Text>
        <Text style={styles.subtitle}>
          Join back to explore your favorite feed and channels
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: "5%",
            backgroundColor: globalColors.slateBlueShade80,
            paddingHorizontal: "4%",
            paddingVertical: "2.8%",
            borderRadius: 10,
          }}
        >
          <BookIcon />
          <Text
            style={{
              color: globalColors.neutralWhite,
              lineHeight: 24,
              left: "8%",
            }}
          >
            Refer FAQ for more groups related queries.
          </Text>
        </View>
        <NormalButton
          label={"Explore Groups"}
          onPress={() => {
            router.push("/DashboardScreen")}}
        />
      </View>
    </ViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignItems: "center",
    marginTop: "25%",
  },
  image: {
    width: (width * 90) / 100,
    height: (width * 80) / 100,
  },
  title: {
    color: globalColors.neutralWhite,
    fontSize: 20,
    marginTop: "8%",
    textAlign: "center",
  },
  subtitle: {
    color: globalColors.neutral6,
    fontSize: 14,
    textAlign: "center",
    width: "95%",
    marginTop: "5%",
  },
});

export default ExitModal;

{
  /* <StatusComponent
imageSource={require("@/assets/image/welcomeImage.png")}
title="Great! Welcome to Qoneqt"
subtitle="You have successfully completed the registration"
buttonLabel="Explore Feed"
onButtonPress={() => router.push("HomeScreen")}
/> */
}
