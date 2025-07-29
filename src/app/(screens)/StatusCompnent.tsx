import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import ViewWrapper from "../../components/ViewWrapper";
import NormalButton from "../../components/NormalButton";
import { Image } from "expo-image";
import { globalColors } from "@/assets/GlobalColors";

const { width } = Dimensions.get("window");

const StatusComponent = ({
  imageSource,
  title,
  subtitle,
  buttonLabel,
  onButtonPress,
  showButton,
}: any) => {
  return (
    <ViewWrapper>
      <View style={styles.container}>
        <Image source={imageSource} style={styles.image} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {showButton && (
          <NormalButton label={buttonLabel} onPress={onButtonPress} />
        )}
      </View>
    </ViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignItems: "center",
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
});

export default StatusComponent;

{
  /* <StatusComponent
imageSource={require("@/assets/image/welcomeImage.png")}
title="Great! Welcome to Qoneqt"
subtitle="You have successfully completed the registration"
buttonLabel="Explore Feed"
onButtonPress={() => router.push("HomeScreen")}
/> */
}
