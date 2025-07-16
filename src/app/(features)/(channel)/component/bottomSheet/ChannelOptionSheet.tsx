import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import {
  ClearChatIcon,
  DeleteAccountIcon,
  InfoIcon,
  MuteIcon,
  UnmuteIcon,
} from "@/assets/DarkIcon";
import { router } from "expo-router";
import { globalColors } from "@/assets/GlobalColors";

const ChannelOptionSheet = ({
  MoreRef,
  MuteNotifiRef,
  ClearConRef,
  isMuted,
  onPressChannelInfo,
}) => {
  return (
    <BottomSheetWrap bottomSheetRef={MoreRef}>
      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            color: globalColors.neutralWhite,
            fontSize: 23,
            textAlign: "center",
          }}
        >
          More
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginTop: "5%",
          }}
        >
          <MuteIcon />

          {/* <TouchableOpacity
            onPress={() => MuteNotifiRef.current.expand()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            {isMuted ? <UnmuteIcon /> : <MuteIcon />}
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                color: globalColors.neutralWhite,
                marginLeft: 12,
              }}
            >
              {isMuted ? "Mute" : "Unmute"}
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              MuteNotifiRef.current.expand();
              //   setIsMuted(!isMuted);
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: "3%",
            }}
          >
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                left: "20%",
              }}
            >
              {isMuted ? "Unmute" : "Mute"}{" "}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onPressChannelInfo()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingVertical: "3%",
          }}
        >
          <InfoIcon />

          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              left: "20%",
            }}
          >
            Channel info
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => ClearConRef.current.expand()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingVertical: "3%",
          }}
        >
          <ClearChatIcon />
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              left: "20%",
            }}
          >
            Clear chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => MoreRef.current.close()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            paddingVertical: "3%",
          }}
        >
          <DeleteAccountIcon />
          <Text
            style={{
              color: globalColors.warning,
              fontSize: 18,
              left: "20%",
            }}
          >
            Delete channel
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheetWrap>
  );
};

export default ChannelOptionSheet;

const styles = StyleSheet.create({});
