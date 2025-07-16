import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import NormalButton from "@/components/NormalButton";
const { width } = Dimensions.get("window");

const JoinModal = () => {
  return (
    <ViewWrapper>
      <View style={styles.container}>
        <Image
          source={require("@/assets/image/welcomeImage.png")}
          style={styles.image}
        />
        <Text style={styles.title}>
          You've successfully become a member of the channel!
        </Text>
        <Text style={styles.subtitle}>Begin engaging on the channel!</Text>
        <Text style={styles.subText}>
          Available balance :<Text style={styles.subtext1}> 14000 perks</Text>
        </Text>
        <NormalButton
          label={"Explore Channel"}
          onPress={() => router.push("/ChannelGroupInfoScreen")}
        />
      </View>
    </ViewWrapper>
  );
};

export default JoinModal;

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
    fontSize: 24,
    marginTop: "8%",
    textAlign: "center",
  },
  subtitle: {
    color: globalColors.neutralWhite,
    fontSize: 18,
    textAlign: "center",
    width: "95%",
    marginTop: "5%",
  },
  subText: {
    color: globalColors.neutralWhite,
    fontSize: 16,
    textAlign: "center",
    width: "95%",
  },
  subtext1: {
    color: globalColors.neutral5,
    fontSize: 15,
    textAlign: "center",
  },
});
