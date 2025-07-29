import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";
import ViewWrapper from "@/components/ViewWrapper";
import NormalButton from "@/components/NormalButton";
const { width } = Dimensions.get("window");

const KycModal = () => {
  return (
    <ViewWrapper>
      <View style={styles.container}>
        <Image
          source={require("@/assets/image/image5.png")}
          style={styles.image}
        />
        <Text style={styles.title}>Your verification is being processed</Text>
        <Text style={styles.subtitle}>
          You are a verified user of Qoneqt now!
        </Text>
        <Text style={styles.subtext}>
          Help us craft your feed by selecting your preferred category of
          content
        </Text>
        <NormalButton
          label={"Continue"}
          onPress={() => {
            
            router.push("/DashboardScreen")
          }}
        />
      </View>
    </ViewWrapper>
  );
};

export default KycModal;

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
  subtext: {
    color: globalColors.neutral5,
    fontSize: 14,
    textAlign: "center",
    width: "95%",
  },
});
