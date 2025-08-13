import * as React from "react";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ViewWrapper from "../../components/ViewWrapper";
import Button1 from "../../components/buttons/Button1";
import { router, useLocalSearchParams } from "expo-router";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const SuccessfullVerificationModal = () => {
  useScreenTracking("SuccessfullVerificationModal");

  return (
    <ViewWrapper>
      <View style={{ width: "90%", marginTop: "10%" }}>
        <Image
          style={{
            width: 255,
            height: 251,
            alignSelf: "center",
            marginTop: 100,
          }}
          contentFit="cover"
          source={require("@/assets/image/image4.png")}
        />
        {/* 2 */}
        <Text
          style={{
            alignSelf: "stretch",
            fontSize: 20,
            lineHeight: 26,
            fontFamily: fontFamilies.bold,
            color: globalColors.neutralWhite,
            textAlign: "center",
          }}
        >{`Your verification is \nbeing processed`}</Text>
        <Text
          style={{
            alignSelf: "stretch",
            fontSize: 14,
            lineHeight: 21,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
            textAlign: "center",
            marginTop: 12,
          }}
        >
          You are a verified user of Qoneqt now!
        </Text>

        <Button1
          isLoading={false}
          title="Continue"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/DashboardScreen");
            }
          }}
        />
      </View>
    </ViewWrapper>
  );
};

export default SuccessfullVerificationModal;
