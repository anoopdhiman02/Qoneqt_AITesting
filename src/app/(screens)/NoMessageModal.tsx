import * as React from "react";
import { Image, Text, View } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import Button1 from "../../components/buttons/Button1";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import { router } from "expo-router";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
const MainComp = () => (
  <View style={{ width: "90%", marginTop: "10%" }}>
    <GoBackNavigation header="Chat" isDeepLink={true}/>
    <Image
      style={{
        width: "100%",
        height: "50%",
        alignSelf: "center",
        marginTop: "12%",
      }}
      source={require("@/assets/image/image6.png")}
    />
    <Text
      style={{
        marginTop: "20%",
        fontSize: 20,
        lineHeight: 26,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutralWhite,
        textAlign: "center",
      }}
    >
      You have no messages yet!
    </Text>
    <Button1
      isLoading={false}
      title="Save a chat"
      onPress={() => router.push("/ChatListScreen")}
    />
  </View>
);
const NoMessageModal = () => (
  <ViewWrapper>
    <MainComp />
  </ViewWrapper>
);
export default NoMessageModal;
