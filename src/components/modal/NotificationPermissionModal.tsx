import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { LinearGradient } from "expo-linear-gradient";
import { CloseBig2Icon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import ButtonTwo from "../buttons/ButtonTwo";

const NotificationPermissionModal = ({ visible, onClose, allowPermission }) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <LinearGradient
          colors={[
            globalColors.slateBlueShade20,
            globalColors.slateBlueShade40,
            globalColors.slateBlueShade60,
            globalColors.slateBlueShade80,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: "85%",
            paddingVertical: 35,
            paddingHorizontal: 20,
            borderRadius: 15,
            alignItems: "center",
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              padding: 10,
            }}
            onPress={onClose}
          >
            <CloseBig2Icon />
          </TouchableOpacity>

          {/* Title */}
          <Text
            style={{
              fontSize: 22,
              fontFamily: fontFamilies.bold,
              color: globalColors.neutralWhite,
              textAlign: "center",
            }}
          >
            Enable Notifications
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 14,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral8,
              textAlign: "center",
              marginTop: 10,
            }}
          >
            Stay updated with important alerts and updates. Allow notifications
            to receive real-time information.
          </Text>

          {/* Buttons */}
          <View style={{ marginTop: 20, width: "100%" }}>
            <ButtonTwo label="Allow Notifications" onPress={allowPermission} />

              <Text
               onPress={onClose}
                style={{
                  marginTop: 10,
                alignSelf: "center",
                paddingVertical: 8,
                  fontSize: 14,
                  color: globalColors.neutral8,
                  fontFamily: fontFamilies.medium,
                }}
              >
                Skip for now
              </Text>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default NotificationPermissionModal;
