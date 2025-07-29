import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import React from "react";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import { ArrowUpIcon, CameraIcon } from "@/assets/DarkIcon";
import { Image } from "expo-image";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { check, PERMISSIONS } from "react-native-permissions";
import Button1 from "@/components/buttons/Button1";

interface BottomViewComponentProps {
  onPressGroup: () => void;
  selectedGroup: any;
  onPressCamera: () => void;
  onSubmitPostHandler: () => void;
  onSubmitHomePostHandler: () => void;
  handlePressIn: () => void;
  handlePressOut: () => void;
  hasPermission: boolean;
  handleCameraPress: () => void;
  submitPostResponse: any;
  setIsAddModalVisible: (value: boolean) => void;
}

const BottomViewComponent: React.FC<BottomViewComponentProps> = ({
  onPressGroup,
  selectedGroup,
  onPressCamera,
  onSubmitPostHandler,
  onSubmitHomePostHandler,
  handlePressIn,
  handlePressOut,
  hasPermission,
  handleCameraPress,
  submitPostResponse,
  setIsAddModalVisible,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        borderColor: "grey",
        paddingHorizontal: 10,
        width: "100%",
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
          width: "100%",
          borderTopWidth: 0.2,
          borderColor: "grey",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: "5%",
          top: 25,
        }}
      >
        <View style={{ flex: 1.4 }}>
          <TouchableOpacity
            onPress={() => {
              onPressGroup();
            }}
            style={{
              borderRadius: 20,
              height: 40,
              borderColor: globalColors.neutral5,
              padding: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: globalColors.bgDark3,
            }}
          >
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                  fontSize: 16,
                  marginLeft: "4%",
                }}
              >
                {selectedGroup &&
                selectedGroup.name &&
                selectedGroup.name.length > 0
                  ? selectedGroup.name
                  : "Select Group"}
              </Text>
            </View>
            <ArrowUpIcon />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 0.25,
            width: 120,
            height: 35,
            borderRadius: 10,
            backgroundColor: globalColors.bgDark3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setIsAddModalVisible(true);
            }}
          >
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../../../../assets/image/attach.png")}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.25,
            width: 120,
            height: 35,
            borderRadius: 10,
            backgroundColor: globalColors.bgDark3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{}}
            onPress={hasPermission ? onPressCamera : handleCameraPress}
          >
            <CameraIcon />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 0.25,
            width: 120,
            height: 35,
            borderRadius: 10,
            backgroundColor: globalColors.bgDark3,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              showToast({
                type: "info",
                text1: "Hold to record, Release to stop",
              });
            }}
            onPressIn={async () => {
              try {
                const granted =
                  Platform.OS === "android"
                    ? await PermissionsAndroid.check(
                        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                      )
                    : true;

                if (!granted) {
                  showToast({
                    type: "info",
                    text1: "Please allow permission in settings",
                  });
                  return;
                }
                handlePressIn();
              } catch (err) {
                console.warn(err);
              }
            }}
            onPressOut={handlePressOut}
          >
            <Image
              style={{ width: 22, height: 22 }}
              source={require("../../../../../assets/image/microphone2.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Button1
        isLoading={submitPostResponse.loading}
        title="Post"
        onPress={() => {
          onSubmitPostHandler();
          // onSubmitHomePostHandler();
        }}
      />
    </View>
  );
};

export default BottomViewComponent;
