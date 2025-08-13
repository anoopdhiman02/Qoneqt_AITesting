import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { globalColors } from "@/assets/GlobalColors";
import { LinearGradient } from "expo-linear-gradient";
import { CloseBig2Icon, VerifiedIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import ButtonTwo from "../buttons/ButtonTwo";
import "text-encoding";
import QRCode from "react-native-qrcode-svg";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { router } from "expo-router";
import CryptoJS from "crypto-js";
const ProfileQRModal = ({
  visible,
  onClose,
  qrValue,
  profilePic,
  name,
  isVerified,
  onEventCreate,
}) => {
  const device = useCameraDevice("back");
  const [isScan, setIsScan] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "upc-a"],

    onCodeScanned: (codes) => {
      if (hasScanned) return; // Prevent multiple calls
      setHasScanned(true);
      try {
        const scannedValue = codes[0]?.value; // Get the scanned value
        console.log("key>>>",scannedValue)
        onClose();
        if (scannedValue?.includes("profile")) {
          const profile_id = scannedValue.split("/").pop();
          router.push({
            pathname: "/profile/[id]",
            params: { id: profile_id, isProfile: "true" },
          });
        } else if (scannedValue?.includes("post")) {
          const postId = scannedValue.split("/").pop().split("?")[0];
          const fromEventID = scannedValue.split("fromevent=")[1];
          onEventCreate({ postId, fromEventID });
        } else {
          try {
            
            const newPost = scannedValue.split("/").pop().split("?")[0];
            console.log("key",newPost)
            const fromEventID = scannedValue.split("fromevent=")[1];
            const encryptionKey = "pet-balloon-post-id";
            // const bytes = CryptoJS.AES.decrypt(
            //   decodeURIComponent(newPost),
            //   encryptionKey
            // );
            // const postId = bytes?.toString(CryptoJS.enc.Utf8);
            const decryptedBytes = CryptoJS.AES.decrypt(decodeURIComponent(newPost), encryptionKey);
        const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
            onEventCreate({ postData : decryptedText, fromEventID });
          } catch (error) {
            console.error("Decryption error:", error);
          }
        }
      } catch (error) {
        onClose();
        // setModalVisible(false);
        console.error("Error processing scanned code:", error); // Log any unexpected errors
      }

      setTimeout(() => setHasScanned(false), 3000);
    },
  });

  const flipAnim = useRef(new Animated.Value(0)).current;

  const onHandleFlip = () => {
    setIsScan(!isScan);
    Animated.timing(flipAnim, {
      toValue: isScan ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const qrNewValue = [{ data: `/profile/${qrValue}`, mode: "byte" }];

  return (
    <Modal
      transparent
      visible={visible}
      //   animationType="fade"
      style={{ backgroundColor: "red" }}
    >
      <View style={{ flex: 1 }}>
        <View
          //   onPress={() => onClose()}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <View
            style={{
              width: "90%",
              justifyContent: "center",
              alignItems: "center",
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
                paddingVertical: 25,
                paddingHorizontal: 20,
                borderRadius: 15,
                alignItems: "center",
                zIndex: 999,
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 15,
                  right: 15,
                  //   padding: 10,
                }}
                onPress={onClose}
              >
                <CloseBig2Icon />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fontFamilies.bold,
                    color: globalColors.neutralWhite,
                    textAlign: "center",
                  }}
                >
                  {name}
                </Text>

                <View style={{ marginLeft: 3 }}>
                  {isVerified == 1 ? <VerifiedIcon /> : null}
                </View>
              </View>
              {isScan ? (
                <Animated.View style={[backAnimatedStyle]}>
                  {device && (
                    <Camera
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 15,
                        overflow: "hidden",
                        backgroundColor: globalColors.bgDark2,
                      }}
                      device={device}
                      isActive={isScan}
                      photo={true}
                      codeScanner={codeScanner}
                    />
                  )}
                </Animated.View>
              ) : (
                <View style={{ backgroundColor: "white", padding: 10 }}>
                  <QRCode
                    onError={(err) => {
                      console.log(err, "qr code");
                    }}
                    color="black"
                    backgroundColor="white"
                    size={200}
                    ecl="M"
                    //@ts-ignore
                    value={qrNewValue}
                    logo={{ uri: ImageUrlConcated(profilePic) }}
                  />
                </View>
              )}

              <View
                style={{
                  height: 1,
                  backgroundColor: globalColors.neutral8,
                  width: "110%",
                  marginTop: 30,
                }}
              />

              {/* Buttons */}
              <ButtonTwo
                label={isScan ? "QR CODE" : "SCAN QR"}
                onPress={onHandleFlip}
              />
            </LinearGradient>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileQRModal;
