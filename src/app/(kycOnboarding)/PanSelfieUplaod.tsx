import { useState, useEffect, useRef } from "react";
import React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View, Alert, TouchableOpacity, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import ButtonTwo from "../../components/buttons/ButtonTwo";
import { CameraIcon, InfoIcon, LinkedinIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import Button1 from "@/components/buttons/Button1";
import { globalColors } from "@/assets/GlobalColors";
import { useKycGlobalStore } from "@/zustand/kycDataStoreZustand";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { showToast } from "@/components/atom/ToastMessageComponent";
import useKycOnboardViewModel from "./viewModel/KycOnboardViewModel";
import { compressImageSize } from "@/utils/ImageHelper";

const EmptyImageComponent = ({ onPress }) => {
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
        <Text
          style={{
            fontFamily: fontFamilies?.regular,
            fontSize: 12,
            color: globalColors?.neutralWhite,
          }}
        >
          Formats: JPEG, JPG, PNG Max file size allowed: 5 MB
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const PanSelfieUpload = () => {
  const { onSubmitPanHandler, panloading } = useKycOnboardViewModel();

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const [openCamera, setOpenCamera] = useState(false);

  const [panImage, setPanImage] = useState({
    uri: "",
    name: "",
    type: "",
  });

  const [imageFile, setImageFile] = useState({
    uri: "",
    name: "",
    type: "",
  });
  //new
  const onCaptureImage = async () => {
    const photo = await camera.current.takePhoto();

    const imageUri = photo.path;
    const imageInfo: any = await compressImageSize({ uri: imageUri });
    // Create a file object compatible with FormData
    const imageFile = {
      uri: imageInfo.uri,
      type: "image/jpeg", // Assuming the image is JPEG. Adjust if your camera uses a different format.
      name: imageUri.split("/").pop() || "captured_image.jpg", // Extract file name from path or use default
    };

    setPanImage(imageFile);
    setOpenCamera(false);

    //  Update state with the image file object
    // setImageFileData(imageFile);
    // setImageData(photo?.path);
  };

  const onPressCamera = () => {
    setOpenCamera(true);
    // setImageData("");
  };

  const onPressGallary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    // Request permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    if (!result.canceled) {
      const selectedImage = result.assets[0];
      const imageInfo: any = await compressImageSize(selectedImage);
      setPanImage({
        name: selectedImage.fileName,
        type: selectedImage.mimeType || "application/octet-stream",
        uri: imageInfo.uri,
      });
      // setImageFileData({
      //   uri: selectedImage.uri,
      //   name: selectedImage.fileName,
      //   type: selectedImage.mimeType || "application/octet-stream",
      // });
      // setImageData(selectedImage.uri);
    } else {
      showToast({ type: "error", text1: "You did not select any image." });
    }
  };

  const onTakeSelfieHandler = async () => {
    try{
    let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
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
    }catch(error){
      console.log("error",error)
    }
  };

  return (
    <ScrollView style={{ width: "100%", marginTop: "10%" }} contentContainerStyle={{alignItems:'center'}}>
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
            label="Take a selfie"
            onPress={onTakeSelfieHandler}
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
      {hasPermission ? (
        // Front Image
        panImage?.uri?.length === 0 ? (
          openCamera ? (
            <View style={styles.imageContainer}>
              <View
                style={{
                  width: "90%",
                  height: 200,
                  // width: (width * 85) / 100,
                  // height: (width * 65 * (182 / 248)) / 100,
                  borderRadius: 15,
                  overflow: "hidden",
                  marginTop: "3%",

                  // backgroundColor: globalColors.bgDark2,
                }}
              >
                <Camera
                  resizeMode="cover"
                  style={StyleSheet?.absoluteFill}
                  device={device}
                  isActive={true}
                  ref={camera}
                  photo={true}
                  photoQualityBalance="speed"
                />
              </View>

              <Button1 title="Capture" onPress={() => onCaptureImage()} />
            </View>
          ) : (
            <EmptyImageComponent onPress={() => onPressCamera()} />
          )
        ) : (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              contentFit="cover"
              source={{ uri: panImage.uri }}
            />
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
      {!panImage.uri ? (
        <>
          <ButtonTwo
            leftIcon={<CameraIcon />}
            label="Take PAN photo"
            onPress={() => onPressCamera()}
          />
          <ButtonTwo
            leftIcon={<LinkedinIcon />}
            label="Upload PAN from gallerypppp"
            onPress={() => onPressGallary()}
          />
        </>
      ) : (
        <>
          <ButtonTwo
            label="Take again"
            onPress={() => {
              setPanImage({ uri: "", name: "", type: "" });
            }}
          />

          <Button1
            title="Submit"
            onPress={() => onSubmitPanHandler({ panCard: panImage,isSelfie:1,selfieFile:imageFile })}
            isLoading={panloading}
          />
        </>
      )}

        </>
      )}
      {/* {hasPermission ? (
        // Front Image
        panImage?.uri?.length === 0 ? (
          openCamera ? (
            <View style={styles.imageContainer}>
              <View
                style={{
                  width: "90%",
                  height: 200,
                  // width: (width * 85) / 100,
                  // height: (width * 65 * (182 / 248)) / 100,
                  borderRadius: 15,
                  overflow: "hidden",
                  marginTop: "3%",

                  // backgroundColor: globalColors.bgDark2,
                }}
              >
                <Camera
                  resizeMode="cover"
                  style={StyleSheet?.absoluteFill}
                  device={device}
                  isActive={true}
                  ref={camera}
                  photo={true}
                  photoQualityBalance="speed"
                />
              </View>

              <Button1 title="Capture" onPress={() => onCaptureImage()} />
            </View>
          ) : (
            <EmptyImageComponent onPress={() => onPressCamera()} />
          )
        ) : (
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              contentFit="cover"
              source={{ uri: panImage.uri }}
            />
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
      {!panImage.uri ? (
        <>
          <ButtonTwo
            leftIcon={<CameraIcon />}
            label="Take PAN photo"
            onPress={() => onPressCamera()}
          />
          <ButtonTwo
            leftIcon={<LinkedinIcon />}
            label="Upload PAN from gallerypppp"
            onPress={() => onPressGallary()}
          />
        </>
      ) : (
        <>
          <ButtonTwo
            label="Take again"
            onPress={() => {
              setPanImage({ uri: "", name: "", type: "" });
            }}
          />

          <Button1
            title="Submit"
            onPress={() => onSubmitPanHandler({ panCard: panImage })}
            isLoading={panloading}
          />
        </>
      )} */}

      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: "10%",
          right: "17%",
        }}
      >
        <InfoIcon />
        <Text
          style={{
            fontSize: 12,
            lineHeight: 24,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutral9,
            marginLeft: 8,
          }}
        >
          Why is this needed?
        </Text>
      </View> */}
    </ScrollView>
  );
};

export default PanSelfieUpload;

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
  image: {
    width: "90%",
    height: 200,
    // width: (width * 85) / 100,
    // height: (width * 65 * (182 / 248)) / 100,
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
