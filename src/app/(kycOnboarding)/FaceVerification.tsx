import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { Text, View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ButtonTwo from "../../components/buttons/ButtonTwo";
import { CameraIcon } from "@/assets/DarkIcon";
import Button1 from "@/components/buttons/Button1";
import { compressImageSize } from "@/utils/ImageHelper";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/utils/Hooks";
import { useRef } from "react";

import { showToast } from "@/components/atom/ToastMessageComponent";
import { onKycSelfie, onKycSendOtp } from "@/redux/reducer/kyc/kycDetails";
import { useAppStore } from "@/zustand/zustandStore";
import { router } from "expo-router";
import { getLoggedMobile } from "@/localDB/LocalStroage";
import {
  clearAllValues,
  setKycLoading,
} from "@/redux/slice/kyc/kycDetailsSlice";
import { fetchMyProfileDetails } from "@/redux/reducer/Profile/FetchProfileDetailsApi";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const FaceVerification = () => {
  useScreenTracking("FaceVerification");
  const profileDetailResponse: any = useAppSelector((state) => state.myProfileData);
  const LiveRef = useRef(false);
  const profileDetails = profileDetailResponse?.data?.id
    ? profileDetailResponse?.data
    : {};
  const kycDetailsResponse = useAppSelector(
    (state) => state.kycDetailsResponse
  );
  const dispatch = useDispatch();
  const { userId, userFromType, userLoginType } = useAppStore();
  const isLoginMobile = getLoggedMobile();
  const [imageFile, setImageFile] = useState({
    uri: "",
    name: "",
    type: "",
  });

  useEffect(() => {
    (async () => {
      await checkPermissions();
    })();
  }, []);

  const checkPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.status !== "granted") {
      Alert.alert(
        "Permissions required",
        "Please grant camera and media library permissions to use this feature.",
        [{ text: "OK" }]
      );
    }
  };

  const onTakeSelfieHandler = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        aspect: [3, 4],
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const imageInfo: any = await compressImageSize(asset);
        setImageFile({
          uri: imageInfo.uri,
          name: `selfie_${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }
    } catch (error) {
      console.log("error", error);
    }
    LiveRef.current = false;
  };

  const onSubmitImageHandler = async () => {
    try {
      dispatch(setKycLoading(true));
      var result: any = await dispatch(
        //@ts-ignore
        onKycSelfie({
          userId: userId,
          faceVerification: imageFile,
        })
      );
      if (result?.payload?.success) {
        if (userLoginType == "event") {
          if (userFromType == "google") {
            Alert.alert(
              "Kyc Submitted Successfully",
              "Thank you for submitting your KYC details. Our team will review and approve your document within 72 hours (3 business days). You will receive a notification once the verification process is completed.",
              [
                {
                  text: "Ok",
                  style: "default",
                  onPress: () => {
                    //@ts-ignore
                    dispatch(fetchMyProfileDetails({ userId: userId }));
                    router.replace("/DashboardScreen");
                  },
                },
              ]
            );
          } else {
            const contact =
              isLoginMobile === 0
                ? profileDetails?.kyc_details?.temp_email
                : profileDetails?.kyc_details?.phone;
            //@ts-ignore
            dispatch(onKycSendOtp({ userId: userId, contact: contact }));
            router.push({
              params: {
                contact: contact,
                countryCode: profileDetails?.ccode || "+91",
                userId: userId,
                isMobile: 1,
                login_type: 1,
                isKyc: "true",
              },
              pathname: "/VerifyKycOtpScreen",
            });
          }
        } else {
          router.push({
            pathname: "/KycOnboardHoc",
            params: { kycStepData: 2, isBasicDetail: "true" },
          });
        }
        dispatch(clearAllValues(""));
      } else {
        showToast({
          type: "error",
          text1: result?.payload?.message || "Something went wrong",
        });
      }
    } catch (error) {
      // console.error("Error updating KYC data:", error);
    }
  };

  return (
    <View style={{ width: "90%", alignItems: "center", marginTop: "10%" }}>
      {imageFile.uri ? (
        <Image
          style={{ width: "90%", height: 300 }}
          contentFit="cover"
          source={{ uri: imageFile.uri }}
        />
      ) : (
        <Image
          style={{ width: "90%", height: 300, marginTop: "10%" }}
          contentFit="cover"
          source={require("@/assets/image/image2.png")}
        />
      )}

      {!imageFile.uri ? (
        <>
          <ButtonTwo
            leftIcon={<CameraIcon />}
            label="Liveness verification"
            onPress={() => {
              if (LiveRef.current == true) return;
              LiveRef.current = true;
              onTakeSelfieHandler();
            }}
          />
        </>
      ) : (
        <>
          <ButtonTwo
            label="Take again"
            onPress={() => {
              setImageFile({ uri: "", name: "", type: "" });
            }}
          />
          <Button1
            title="Submit"
            onPress={onSubmitImageHandler}
            isLoading={kycDetailsResponse.isLoaded}
          />
        </>
      )}
    </View>
  );
};

export default FaceVerification;
