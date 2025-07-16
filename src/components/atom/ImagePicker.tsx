import React, { useState } from "react";
import * as ExpoImagePicker from "expo-image-picker";

const ImagePicker = () => {
  const [selectedImage, setSelectedImage] =
    useState<ExpoImagePicker.ImagePickerResult | null>(null);

  const onImagePickerHandler = async (source: "camera" | "library") => {
    let result;

    const options: ExpoImagePicker.ImagePickerOptions = {
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    };

    if (source === "camera") {
      const { status } = await ExpoImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }
      result = await ExpoImagePicker.launchCameraAsync(options);
    } else {
      result = await ExpoImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setSelectedImage(result);
    }
  };

  const onClearImage = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    onImagePickerHandler,
    onClearImage,
  };
};

export default ImagePicker;
