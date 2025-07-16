import { Dimensions, Modal, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import ButtonTwo from "../buttons/ButtonTwo";
import Button1 from "../buttons/Button1";

const { width } = Dimensions.get("window");

export interface PropsType {
  visible: boolean;
  onSkip: () => void;
  onUpdate: () => void;

  isForceUpdate?: number;
  newVersion: string;
}

const AppUpdateModal = ({
  visible,
  onUpdate,
  onSkip,
  isForceUpdate,
  newVersion,
}: PropsType) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <TouchableOpacity
        disabled
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            padding: "5%",
            width: "85%",
            backgroundColor: globalColors.darkOrchidShade60,
          }}
        >
          <Text
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 24,
              color: globalColors.neutralWhite,
              marginBottom: "5%",
            }}
          >
            Update Available
          </Text>
          <Text
            style={{
              fontFamily: fontFamilies.semiBold,
              fontSize: 14,
              color: globalColors.neutral9,
              textAlign: "center",
              lineHeight: 18,
              letterSpacing: 0.5,
            }}
          >
            A new version of the app is available. Please update to the latest
            version.
          </Text>

          <Text
            style={{
              fontFamily: fontFamilies.semiBold,
              fontSize: 14,
              color: globalColors.neutralWhite,

              textAlign: "center",
              lineHeight: 18,
            }}
          >
            {newVersion}
          </Text>

          <View
            style={{
              width: "100%",
              justifyContent: isForceUpdate === 0 ? "space-between" : "center",
              alignItems: "center",
            }}
          >
            <View style={{ width: "100%", marginBottom: "-10%" }}>
              <Button1 title="Update" onPress={onUpdate} isLoading={false} containerStyle={{marginHorizontal: '2.5%'}} />
            </View>

            {isForceUpdate == 0 && <ButtonTwo label="Skip" onPress={onSkip} />}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AppUpdateModal;
