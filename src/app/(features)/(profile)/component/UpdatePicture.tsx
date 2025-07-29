import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import { Image } from "expo-image";
import GradientText from "@/components/element/GradientText";
import { CameraIcon, LinkedinIcon, PhotoIcon } from "@/assets/DarkIcon";
import ButtonTwo from "@/components/buttons/ButtonTwo";
import Button1 from "@/components/buttons/Button1";
import { showToast } from "@/components/atom/ToastMessageComponent";
import * as ImagePicker from "expo-image-picker";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import useProfileViewModel from "../viewModel/ProfileViewModel";
import { compressImageSize } from "@/utils/ImageHelper";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const UpdatePicture = ({ image }) => {
  useScreenTracking("UpdatePicture");
  const { onUpdatePictureHandler, picLoading } = useProfileViewModel();

  const [imageFile, setImageFile] = useState({
    uri: image ? image : "",
    name: "",
    type: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    (async () => {
      await checkPermissions();
    })();
  }, []);

  const checkPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (
      cameraPermission.status !== "granted" ||
      libraryPermission.status !== "granted"
    ) {
      Alert.alert(
        "Permissions required",
        "Please grant camera and media library permissions to use this feature.",
        [{ text: "OK" }]
      );
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const imageInfo: any = await compressImageSize(asset);
      setImageFile({
        uri: imageInfo.uri,
        name: asset.uri.split("/").pop() || "image",
        type: `image/${asset.uri.split(".").pop()}`,
      });
    }
  };

  const onTakeSelfieHandler = async () => {
    try{
    let result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            aspect: [3, 4],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            exif: false,
          });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const selfieImageInfo: any = await compressImageSize(asset);
      setImageFile({
        
        uri: selfieImageInfo.uri,
        name: `selfie_${Date.now()}.jpg`,
        type: "image/jpeg",
      });
    }
    }catch(error){
      console.log("error",error)
    }
  };

  const onSubmitImageHandler = () => {
    onUpdatePictureHandler({ data: imageFile });
  };

  const onEditPic = () => {
    setIsEdit(true);
    setImageFile({ uri: "", name: "", type: "" });
  };
  return (
    <View style={{ alignItems: "center" }}>
      {isEdit ? (
        imageFile.uri ? (
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
        )
      ) : (
        <Image
          style={{ width: "90%", height: 300 }}
          contentFit="cover"
          source={{ uri: ImageUrlConcated(imageFile.uri) }}
        />
      )}
      {/* {imageFile.uri ? (
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
      )} */}

      {!imageFile.uri ? (
        <>
          <ButtonTwo
            leftIcon={<CameraIcon />}
            label="Take a selfie"
            onPress={onTakeSelfieHandler}
          />
          <ButtonTwo
            leftIcon={<LinkedinIcon />}
            label="Upload from gallery"
            onPress={pickImageAsync}
          />
        </>
      ) : (
        <>
          <ButtonTwo
            label="Take again"
            onPress={() => {
              onEditPic();
            }}
          />
          {/* <Button1 title="Submit" onPress={onSubmitImageHandler} isLoading={false}/> */}
        </>
      )}

      {isEdit && imageFile.uri ? (
        <Button1
          title="Submit"
          onPress={onSubmitImageHandler}
          isLoading={picLoading}
        />
      ) : null}

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
    </View>
    // <View style={{}}>
    //   <View
    //     style={{
    //       justifyContent: "center",
    //       alignItems: "center",
    //       marginTop: "20%",
    //     }}
    //   >
    //     <Image
    //       style={{ borderRadius: 40, width: "20%", height: 70, left: 5 }}
    //       contentFit="cover"
    //       source={{ uri: ImageUrlConcated(image) }}
    //     />

    //     <Image
    //       style={{ borderRadius: 40, width: "20%", height: 70, left: 5 }}
    //       contentFit="cover"
    //       source={require("./../../../../assets/image/EmptyProfileIcon.webp")}
    //     />
    //     <TouchableOpacity
    //       onPress={openCamera}
    //       style={{
    //         flexDirection: "row",
    //         alignItems: "center",
    //         marginTop: 10,
    //       }}
    //     >
    //       <GradientText style={{ marginRight: 5 }}>{"Take Photo"}</GradientText>

    //       <CameraIcon />
    //     </TouchableOpacity>

    //     <ButtonTwo
    //       leftIcon={<PhotoIcon />}
    //       label="Choose Photo"
    //       onPress={onPressGallary}
    //     />

    //     <View style={{ marginTop: "60%", width: "100%" }}>
    //       <Button1 isLoading={false} title="Save" />
    //     </View>
    //   </View>
    // </View>
  );
};

export default UpdatePicture;
