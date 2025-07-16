import { StyleSheet, Text, View, Image, Platform } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import * as ImagePicker from "expo-image-picker";
import { onFetchChatUserDetailsApi } from "@/redux/reducer/chat/ChatUserDetailsApi";
import BottomSheet from "@gorhom/bottom-sheet";
import { checkCameraPermission, compressImageSize } from "@/utils/ImageHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useUserChatDetailViewModel = () => {
  const { hasPermission, requestPermission } = useCameraPermission();

  //vision camera
  const device = useCameraDevice("back");

  const [openCamera, setOpenCamera] = useState(false);
  const [imageData, setImageData] = useState("");
  const [imageFileData, setImageFileData] = useState(null);
  const camera = useRef<Camera>(null);
  const mediaRef = useRef<BottomSheet>(null);

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

    //  Update state with the image file object
    setImageFileData(imageFile);
    setImageData(imageInfo.uri);
  };

  const onTakeSelfieHandler = async () => {
    try{
    if (checkCameraPermission()) {
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
        setImageData(imageInfo?.uri);
        setImageFileData({
          uri: imageInfo.uri,
          name: `selfie_${Date.now()}.jpg`,
          type: "image/jpeg",
        });
      }
    } else {
      checkCameraPermission();
    }
    }catch(error){
      console.log("error",error)
    }
  };

  const onPressGallary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [3, 4],
      quality: 1,
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
      setImageFileData({
        uri: imageInfo.uri,
        name: selectedImage.fileName,
        type: selectedImage.mimeType || "application/octet-stream",
      });
      setImageData(imageInfo.uri);
    } else {
      alert("You did not select any image.");
    }
  };

  const format = useCameraFormat(device, [
    { photoResolution: { width: 328, height: 238 } },
  ]);

  const Dispatch = useAppDispatch();
  const chatUserDetailsResponse = useAppSelector(
    (state) => state.chatUserDetails
  );
  const [isLoading, setIsLoading] = useState(false);
  const [chatUserDetailsApiCalled, setChatUserDetailsApiCalled] =
    useState(false);
  const [chatUserDetails, setChatUserDetails] = useState(null);

  const onFetchUserMessageHandler = async ({ userId, profileId }) => {
    setChatUserDetailsApiCalled(true);
    setIsLoading(true);
    console.log("userValue", profileId);
    if(userId ! === undefined && userId !== null) {
    var userData = await AsyncStorage.getItem("user-data");
      var userValue = JSON.parse(userData);
      
      Dispatch(
        onFetchChatUserDetailsApi({ userId: userValue.userId, profileId: profileId })
      );
    }
    else {
      Dispatch(
        onFetchChatUserDetailsApi({ userId: userId, profileId: profileId })
      );
    }
    
    
  };

  useEffect(() => {
    if (chatUserDetailsApiCalled && chatUserDetailsResponse?.success) {
      setIsLoading(false);
      setChatUserDetailsApiCalled(false);
      setChatUserDetails(chatUserDetailsResponse?.data);
    } else if (
      chatUserDetailsApiCalled &&
      chatUserDetailsResponse?.success === false
    ) {
      setIsLoading(false);
      setChatUserDetailsApiCalled(false);
      setChatUserDetails(null);
    }
  }, [chatUserDetailsResponse]);

  return {
    hasPermission,
    requestPermission,
    onFetchUserMessageHandler,
    isLoading,
    chatUserDetails,
    onPressGallary,
    onCaptureImage,
    imageData,
    imageFileData,
    setImageFileData,
    setImageData,
    format,
    onTakeSelfieHandler,
  };
};

export default useUserChatDetailViewModel;
