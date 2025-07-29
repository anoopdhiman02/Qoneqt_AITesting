import * as ImagePicker from "expo-image-picker";
import { Camera } from "react-native-vision-camera";
import { Platform } from "react-native";
import { showToast } from "@/components/atom/ToastMessageComponent";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { uploadToR2WithCompression } from "./r2Uploads";

// Function to request camera permission
export const requestCameraPermission = async () => {
  try {
    // Request camera permissions using react-native-vision-camera
    const cameraPermission = await Camera.requestCameraPermission();
    if (cameraPermission === "granted") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.warn("Error requesting camera permission:", error);
    return false;
  }
};

// Function to check camera permission
export const checkCameraPermission = async () => {
  try {
    // Check camera permissions using react-native-vision-camera
    const cameraPermission = await Camera.getCameraPermissionStatus();

    if (cameraPermission === "granted") {
      return true;
    } else if (cameraPermission === "not-determined") {
      return await requestCameraPermission();
    } else {
      return false;
    }
  } catch (error) {
    console.warn("Error checking camera permission:", error);
    return false;
  }
};

// Function to get camera device (back camera by default)
export const getCameraDevice = async (facing = "back") => {
  const devices = await Camera.getAvailableCameraDevices();
  return devices.find((device) => device.position === facing);
};

// Function to take an image from the camera
export const takeImageFromCamera = async (cameraRef) => {
  if (!cameraRef.current) {
    console.warn("Camera reference not found");
    return null;
  }

  try {
    const photo = await cameraRef.current.takePhoto();
    const imageInfo: any = await compressImageSize({ uri: photo?.path });
    return imageInfo.uri; // Returning the path of the captured image
  } catch (error) {
    console.error("Error taking photo:", error);
    return null;
  }
};

// Function to pick an image from the gallery
export const pickImageFromGallery = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageInfo: any = await compressImageSize(result.assets[0]);
      return imageInfo?.uri; // Returning the URI of the selected image
    } else {
      showToast({ type: "error", text1: "You did not select any image." });

      return null;
    }
  } catch (error) {
    console.error("Error picking image:", error);
    return null;
  }
};

// Function to get camera format
export const getCameraFormat = (device, width = 1280, height = 720) => {
  if (!device) return null;

  const formats = device.formats;
  return formats.find(
    (format) =>
      format.photoResolution.width === width &&
      format.photoResolution.height === height
  );
};

export const compressImageSize = async (asset) => {
  // Get original file size
  // const originalFile = await FileSystem.getInfoAsync(asset.uri);
  // Compress image
  const compressedImage = await ImageManipulator.manipulateAsync(
    asset.uri,
    [], // No resize, only compression
    { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
  );
  // const compressedImageFile = await FileSystem.getInfoAsync(
  //   compressedImage.uri
  // );
  return compressedImage;
};

export const compressedImage = async (imageUri, width) => {
  try {
    const originalInfos: any = await FileSystem.getInfoAsync(imageUri);
    const newSize = originalInfos.size / (1024 * 1024);
    const stage1 = await ImageManipulator.manipulateAsync(
      imageUri,
      width > 1400 ? [{ resize: { width: 1400 } }] : [],
      { compress: newSize > 10 ? 0.7 : 1.0, format: ImageManipulator.SaveFormat.JPEG }
    )
    const uploadResult = await uploadToR2WithCompression(stage1.uri, "image/jpeg", "image");
    return { result: uploadResult };
  } catch (error) {
    console.error("Error compressing image:", error);
    return null;
  }
}


// Count morthan 1000 & Function to format member count
export const formatMemberCount = (count) => {
  if (count < 1000) {
    // Logic for counts less than 1000
    if (count < 100) {
      return `${count}`;
    }
    // Check if it's a multiple of 100
    if (count % 100 === 0) {
      return `${count}`;
    }
    const roundedDown = Math.floor(count / 10) * 10;
    return `+${roundedDown}`;
  }
  // Logic for counts 1000 and above
  if (count >= 1000 && count < 100000) {
    const thousands = Math.floor(count / 1000);
    const remainder = count % 1000;
    if (remainder === 0) {
      return `${thousands}k`;
    }
    // Check if remainder is less than 100
    if (remainder < 100) {
      return `+${thousands}k`;
    }
    // Display 1.1k, 1.2k, etc.
    const decimalPart = Math.floor(remainder / 100);
    if (remainder % 100 === 0) {
      return `${thousands}.${decimalPart}k`;
    }
    return `+${thousands}.${decimalPart}k`;
  }
  // Logic for counts of 100,000 or more (optional, adjust as per your needs)
  if (count >= 100000) {
    const lakhs = Math.floor(count / 1000);
    return `${lakhs}k`;
  }
};