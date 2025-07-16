import * as React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import { router } from "expo-router";
import GradientText from "@/components/element/GradientText";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
const ReferEarn = () => {
  return (
    <View
      style={{
        marginTop: "10%",
        borderRadius: 16,
        backgroundColor: "#373543",
        width: "100%",
        padding: "3.5%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
          }}
        >
          {`Refer & earn`}
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
          }}
        >
          1 of 3
        </Text>
      </View>
      <View
        style={{
          marginTop: 24,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
          }}
        >
          Refer people and earn up to ₹83 now!
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            marginTop: 8,
          }}
        >
          Share or copy the referral code to invite friends. Get ₹83 credited to
          your wallet upon their successful login.
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 24,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/DashboardScreen")}
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <GradientText
            style={{
              margin: 5,
              fontFamily: fontFamilies.bold,
              fontSize: 16,
              color: globalColors.darkOrchidShade20,
              letterSpacing: 0.3,
            }}
          >
            Skip
          </GradientText>
        </TouchableOpacity>

        <View
          style={{
            borderRadius: 8,
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginLeft: "55%",
          }}
        >
          <TouchableOpacity onPress={() => router.push("/UserJourney2")}>
            <View
              style={{
                backgroundColor: "#523294",
                paddingVertical: "5%",
                borderRadius: 8,
                padding: "10%",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                }}
              >
                Next Tip
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const UserJourney1 = () => {
  return (
    <ViewWrapper>
      <View
        style={{
          width: "90%",
          marginTop: "10%",
        }}
      >
        <ReferEarn />
      </View>
    </ViewWrapper>
  );
};
export default UserJourney1;
