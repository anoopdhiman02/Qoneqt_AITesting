import React, { useState, useEffect, useRef } from "react";
import { Image } from "expo-image";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import ButtonTwo from "../../components/buttons/ButtonTwo";
import { CameraIcon, LinkedinIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import Button1 from "@/components/buttons/Button1";
import { globalColors } from "@/assets/GlobalColors";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { showToast } from "@/components/atom/ToastMessageComponent";
import GradientText from "@/components/element/GradientText";
import { useAppStore } from "@/zustand/zustandStore";
import { compressImageSize } from "@/utils/ImageHelper";
import { useDispatch } from "react-redux";
import {
  onKycAadharUpload,
  onKycSendOtp,
} from "@/redux/reducer/kyc/kycDetails";
import { useAppSelector } from "@/utils/Hooks";
import { router } from "expo-router";
import { getLoggedMobile } from "@/localDB/LocalStroage";
import {
  clearAllValues,
  setKycLoading,
} from "@/redux/slice/kyc/kycDetailsSlice";
import { fetchMyProfileDetails } from "@/redux/reducer/Profile/FetchProfileDetailsApi";
const { width, height } = Dimensions.get("window");

const EmptyImageComponent = ({ onPress,isfrontuploaded }) => {
  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          borderRadius: 16,
          backgroundColor: globalColors.bgDark3,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
          padding: "12%",
          width: "80%",
          height: 200,
        }}
      >
        <CameraIcon />
        <View style={{ alignSelf: "center" }}>
          <Text
            style={{
              fontFamily: fontFamilies?.regular,
              fontSize: 12,
              color: globalColors?.neutral7,
              textAlign: "center",
            }}
          >{`\n`}
            Formats: JPEG, JPG, PNG{`\n`} Max file size allowed: 5 MB{`\n`}
            {`\n`}

            <Text style={{
              color: globalColors?.neutral7,
            }}>
              {isfrontuploaded ?"Tap to upload the back side of your Aadhaar card": "Tap to upload the front side of your Aadhaar card" }
            </Text>
            </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const UploadDocumentOne = () => {
  const { userFromType } = useAppStore();
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const [openCamera, setOpenCamera] = useState(false);
  const kycDetailsResponse = useAppSelector(
    (state) => state.kycDetailsResponse
  );
  const isLoginMobile = getLoggedMobile();
  const [docFrontImage, setDocFrontImage] = useState({
    uri: "",
    name: "",
    type: "",
  });

  const [docBackImage, setDocBackImage] = useState({
    uri: "",
    name: "",
    type: "",
  });

  const dispatch = useDispatch();
  const { userId } = useAppStore();
  const profileDetailResponse: any = useAppSelector((state) => state.myProfileData);
  const profileDetails: any = profileDetailResponse?.data?.id
    ? profileDetailResponse?.data
    : {};


  const onCaptureImage = async ({ isFront }) => {
    const photo = await camera.current.takePhoto();

    const imageUri = photo.path;
    const imageInfo: any = await compressImageSize({ uri: imageUri });
    // Create a file object compatible with FormData
    const imageFile = {
      uri: imageInfo.uri,
      type: "image/jpeg", // Assuming the image is JPEG. Adjust if your camera uses a different format.
      name: imageUri.split("/").pop() || "captured_image.jpg", // Extract file name from path or use default
    };

    if (isFront) {
      setDocFrontImage(imageFile);
      setOpenCamera(false);
    } else {
      setDocBackImage(imageFile);
      setOpenCamera(false);
    }
  };

  const onPressCamera = () => {
    setOpenCamera(true);
  };

  const onPressGallary = async ({ isFront }) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      const imageInfo: any = await compressImageSize(selectedImage);
      if (isFront) {
        setDocFrontImage({
          name: selectedImage.fileName,
          type: selectedImage.mimeType || "application/octet-stream",
          uri: imageInfo.uri,
        });
      } else {
        setDocBackImage({
          name: selectedImage.fileName,
          type: selectedImage.mimeType || "application/octet-stream",
          uri: selectedImage.uri,
        });
      }
    } else {
      showToast({ type: "error", text1: "You did not select any image." });
    }
  };

  const onPressReTakeHandler = ({ isFront }) => {
    if (isFront) {
      setDocFrontImage({ uri: "", name: "", type: "" });
    } else {
      setDocBackImage({ uri: "", name: "", type: "" });
    }
  };

  const uploadAadharFile = async () => {
    dispatch(setKycLoading(true));
   var result: any = await dispatch(
      //@ts-ignore
      onKycAadharUpload({
        userId: userId,
        adhaar_card_front: docFrontImage,
        adhaar_card_back: docBackImage,
      })
    );
   
    if(result?.payload?.success){
      const contact =
      isLoginMobile === 0
        ? profileDetails?.kyc_details?.temp_email
        : profileDetails?.kyc_details?.phone;
    showToast({
      type: "success",
      text1: result?.payload?.message,
    });
    if (userFromType == "google") {
       Alert.alert(
            "Kyc Submitted Successfully",
            "Thank you for submitting your KYC details. Our team will review and approve your document within 72 hours (3 business days). You will receive a notification once the verification process is completed.",
            [
              {
                text: "Understood",
                style: "default",
                onPress:()=>{
                  //@ts-ignore
        dispatch(fetchMyProfileDetails({ userId: userId }));
        router.replace("/DashboardScreen");
      dispatch(clearAllValues(""));
                }
              }
            ]
          );
     
    } else {
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
      dispatch(clearAllValues(""));
    }
    }
    else{
      showToast({
        type: "error",
        text1:
        result?.payload?.message ||
        result?.payload?.error ||
          "Document not upload",
      });
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ width: "100%", marginBottom: "20%" }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        paddingBottom: "20%",
      }}
    >
      <>
        {hasPermission ? (
          docFrontImage?.uri?.length === 0 ? (
            openCamera ? (
              <View style={styles.imageContainer}>
                <View
                  style={{
                    width: "90%",
                    height: 200,
                    borderRadius: 15,
                    overflow: "hidden",
                    marginTop: "3%",
                  }}
                >
                  <Camera
                    resizeMode="cover"
                    style={StyleSheet?.absoluteFill}
                    device={device}
                    isActive={true}
                    ref={camera}
                    photo={true}
                  />
                </View>

                <Button1
                  title="Capture"
                  onPress={() => onCaptureImage({ isFront: true })}
                />
              </View>
            ) : (
              // @ts-ignore
              <EmptyImageComponent onPress={() => onPressCamera()} />
            )
          ) : (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                contentFit="cover"
                source={{ uri: docFrontImage.uri }}
              />
              <TouchableOpacity
                onPress={() => onPressReTakeHandler({ isFront: true })}
                style={{
                  flexDirection: "row",
                  marginTop: "3%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CameraIcon />
                <GradientText
                  style={{
                    fontSize: 16,
                    lineHeight: 21,
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutralWhite,
                    marginLeft: "5%",
                  }}
                >
                  <Text
                    style={{ color: globalColors.neutralWhite, fontSize: 17 }}
                  >
                    Retake
                  </Text>
                </GradientText>
              </TouchableOpacity>
            </View>
          )
        ) : (
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => requestPermission()}
              style={{
                borderRadius: 16,
                backgroundColor: globalColors.bgDark3,
                overflow: "hidden",
                alignItems: "center",
                padding: "12%",
                width: 120,
                height: 120,
              }}
            >
              <CameraIcon />
            </TouchableOpacity>
          </View>
        )}

        {!docFrontImage.uri && (
          <>
            {/* <ButtonTwo
              leftIcon={<CameraIcon />}
              label="Take back photo"
              onPress={() => onPressCamera()}
            /> */}
            <ButtonTwo
              // leftIcon={<LinkedinIcon />}
              label="Upload back from gallery"
              onPress={() => onPressGallary({ isFront: true })}
            />
          </>
        )}
      </>
      <TouchableOpacity
        activeOpacity={0.8}
        style={{ flex: 1, width: "100%", alignItems: "center" }}
      >
        {docFrontImage?.uri?.length > 0 &&
          (docBackImage?.uri?.length === 0 ? (
            openCamera ? (
              <View style={styles.imageContainer}>
                <View
                  style={{
                    width: "90%",
                    height: 200,
                    borderRadius: 15,
                    overflow: "hidden",
                    marginTop: "3%",
                  }}
                >
                  <Camera
                    resizeMode="cover"
                    style={StyleSheet?.absoluteFill}
                    device={device}
                    isActive={true}
                    ref={camera}
                    photo={true}
                  />
                </View>

                <Button1
                  title="Capture"
                  onPress={() => onCaptureImage({ isFront: false })}
                />
              </View>
            ) : (
              <EmptyImageComponent isfrontuploaded={true} onPress={onPressCamera} />
            )
          ) : (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                contentFit="cover"
                source={{ uri: docBackImage.uri }}
              />

              <TouchableOpacity
                onPress={() => onPressReTakeHandler({ isFront: false })}
                style={{
                  flexDirection: "row",
                  marginTop: "3%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CameraIcon />
                <GradientText
                  style={{
                    fontSize: 16,
                    lineHeight: 21,
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutralWhite,
                    marginLeft: "5%",
                  }}
                >
                  <Text
                    style={{ color: globalColors.neutralWhite, fontSize: 17 }}
                  >
                    Retake
                  </Text>
                </GradientText>
              </TouchableOpacity>
            </View>
          ))}
        {docFrontImage?.uri?.length > 0 && !docBackImage.uri && (
          <>
            {/* <ButtonTwo
              leftIcon={<CameraIcon />}
              label="Take back photo"
              onPress={() => onPressCamera()}
            /> */}
            <ButtonTwo
              label="Upload back from gallery"
              onPress={() => onPressGallary({ isFront: false })}
            />
          </>
        )}
        {docFrontImage.uri && docBackImage.uri && (
          <Button1
            title="Submit"
            isLoading={kycDetailsResponse.isLoaded}
            onPress={() => {
              uploadAadharFile();
            }}
          />
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UploadDocumentOne;

const styles = StyleSheet.create({
  imageContainer: {
    borderRadius: 16,
    borderStyle: "dashed",
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 1,
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
  },
  imageView: {
    width: width * 0.85,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: "3%",
  },
  image: {
    width: width * 0.85,
    height: 200,
    borderRadius: 15,
    overflow: "hidden",
    marginTop: "3%",
  },
  placeholderText: {
    fontSize: 16,
    color: globalColors.neutralWhite,
    fontFamily: fontFamilies.regular,
  },
});
