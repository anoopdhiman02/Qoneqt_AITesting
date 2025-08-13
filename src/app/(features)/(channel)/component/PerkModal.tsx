import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import NormalButton from "@/components/NormalButton";
import { WalletIcon } from "@/assets/DarkIcon";
const { width } = Dimensions.get("window");

const PerkModal = () => {
  return (
    <ViewWrapper>
      <View style={styles.container}>
        <Image
          source={require("@/assets/image/welcomeImage.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Your perk request has been sent!</Text>
        <Text style={styles.subtitle}>
          We will notify you if the request gets accepted and perks added to
          your profile.
        </Text>
        <View style={styles.borderContainer}>
          <WalletIcon />
          <Text style={styles.borderText}>
            Refer FAQ for more Perks related queries.
          </Text>
        </View>
        <NormalButton
          label={"Explore Channel"}
          onPress={() => router.push("/ChannelGroupInfoScreen")}
        />
      </View>
    </ViewWrapper>
  );
};

export default PerkModal;

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
  borderContainer: {
    borderColor: globalColors.neutral5,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "95%",
    marginTop: "5%",
  },
  borderText: {
    color: globalColors.neutral6,
    fontSize: 16,
    textAlign: "center",
  },
});
