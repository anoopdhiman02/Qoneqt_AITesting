import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Button1 from "../../../../components/buttons/Button1";
import { router } from "expo-router";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";

const EmptyChannelModal = ({ onPressCreateGroup, onPressJoinGroup }) => (
  <View style={{ justifyContent: "center", alignItems: "center" }}>
    <Image
      style={{
        width: "90%",
        height: "50%",
        alignSelf: "center",
        marginTop: "10%",
      }}
      // contentFit="cover"
      source={require("@/assets/image/image5.png")}
    />
    <Text
      style={{
        fontSize: 20,

        fontFamily: fontFamilies.regular,
        color: globalColors.neutralWhite,
        textAlign: "center",
      }}
    >
      To activate the Sub-groups feature, kindly join or create a group.
    </Text>
    <Button1
      isLoading={false}
      title="Create group"
      onPress={onPressCreateGroup}
    />

    {/* <TouchableOpacity onPress={onPressJoinGroup}>
      <GradientText style={{ fontSize: 18, fontFamily: fontFamilies.semiBold }}>
        Join Group
      </GradientText>
    </TouchableOpacity> */}
  </View>
);

export default EmptyChannelModal;
