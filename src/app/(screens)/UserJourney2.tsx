import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import Button1 from "@/components/buttons/Button1";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import GradientText from "@/components/element/GradientText";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";

const UserJourney2 = () => {
  const NextTipRef = useRef<BottomSheet>(null);

  const NewSearch = () => (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: "#373543",
        width: "100%",
        padding: "5%",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
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
          The all new “Search”
        </Text>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.medium,
            color: globalColors.neutralWhite,
          }}
        >
          2 of 3
        </Text>
      </View>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 20,
          fontFamily: fontFamilies.regular,
          color: globalColors.neutralWhite,
          marginTop: "10%",
        }}
      >
        The “Search” bar lets you search for all types of information regarding
        groups, hashtags, and profiles.
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <GradientText
            style={{
              fontSize: 16,
              fontFamily: fontFamilies.bold,
              color: globalColors.darkOrchidShade20,
              letterSpacing: 0.3,
            }}
          >
            Skip
          </GradientText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => NextTipRef.current?.expand()}
          style={{
            backgroundColor: "#523294",
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            marginLeft: "auto",
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
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ViewWrapper>
      <View style={{ width: "90%", marginTop: "110%" }}>
        <NewSearch />
      </View>
      <BottomSheetWrap snapPoints={["20%", "30%"]} bottomSheetRef={NextTipRef}>
        <View style={{ alignItems: "center", marginTop: "10%" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 23,
              textAlign: "center",
            }}
          >
            Are you sure you want to skip the app walkthrough?
          </Text>
          <Text
            style={{
              color: "gray",
              fontSize: 13,
              textAlign: "center",
              marginTop: "4%",
            }}
          >
            You can always choose to revisit it from “more”.
          </Text>
          <Button1
            isLoading={false}
            title="Next tip"
            onPress={() => router.push("/DashboardScreen")}
            containerStyle={{marginHorizontal: '2.5%'}}
          />
          <TouchableOpacity onPress={() => NextTipRef.current?.close()}>
            <Text style={{ color: globalColors.warmPink, fontSize: 20 }}>
              Yes
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>
    </ViewWrapper>
  );
};

export default UserJourney2;
