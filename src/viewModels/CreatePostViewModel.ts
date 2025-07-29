import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { createPost } from "@/redux/reducer/post/CreatePost";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
} from "react-native-vision-camera";
import { Video } from "react-native-compressor";
import DocumentPicker from "react-native-document-picker";

import * as ImagePicker from "expo-image-picker";
import { Image as CompressImage } from "react-native-compressor";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Image, Platform } from "react-native";

import { showToast } from "@/components/atom/ToastMessageComponent";
import { router } from "expo-router";
import { searchGroupList } from "@/redux/reducer/group/SearchGroupList";
import { useAppStore } from "@/zustand/zustandStore";
import { checkCameraPermission, compressedImage } from "@/utils/ImageHelper";
import { useAudioStore } from "@/zustand/AudioPlayerStore";
import {
  updateFailed,
  updateLoading,
  updatePostDetail,
  updateProgress,
} from "@/redux/slice/post/CreatePostSlice";
import { shallowEqual, useSelector } from "react-redux";
import { setHomePostSlice } from "@/redux/slice/home/HomePostSlice";
import { setMyUserFeedData } from "@/redux/slice/profile/ProfileMyFeedsSlice";
import { updateProfileData } from "@/redux/slice/profile/ProfileMyDetailsSlice";
import { updateIsUpdated } from "@/redux/slice/group/GroupFeedsListSlice";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { selectTrendingPostResponse } from "@/redux/selectors/homeSelectors";
import { onDeletePost } from "@/redux/reducer/post/DeletePost";
import { getPrefsValue, setPrefsValue } from "@/utils/storage";
import { FlatList } from "react-native";
import { getSubgroupList } from "@/redux/reducer/channel/ChannelListForPost";

const useCreatePostViewModel = () => {
  const dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const { recordingPath, setRecordingPath } = useAudioStore();
  const { setPostValue, postValue } = usePostDetailStore();
  //Submit post
  const submitPostResponse: any = useAppSelector(
    (state) => state?.createPostData,
    shallowEqual
  );
  const HomePostResponse = useSelector(
    (state: any) => state.HomePostResponse,
    shallowEqual
  );
  const userData = useSelector(
    (state: any) => state?.loginUserApi,
    shallowEqual
  );
  const postDetailResponse = useSelector(
    (state: any) => state.myFeedData,
    shallowEqual
  );

  const [desc, setDesc] = useState("");
  const [openCamera, setOpenCamera] = useState(false);
  const [selectedvideo, setSelectedVideo] = useState([]);
  const [multiSelectImage, setMultiSelectImage] = useState([]);
  const [multiSelectImages, setMultiSelectImages] = useState([]);
  const [imageFileData, setImageFileData] = useState([]);
  const [croppedImages, setCroppedImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [audio, setAudio] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState([]); // General is pre-selected
  const [videoUri, setVideoUri] = useState(null);
  const [downloadedAudio, setDownloadedAudio] = useState([]);
  const [progress, setProgress] = useState(0);
  const myProfileData = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );
  const trendingPostResponse = useSelector(
    selectTrendingPostResponse,
    shallowEqual
  );
  //Group select
  const imageMediaRef = useRef<BottomSheet>(null);
  const MyGroupRef = useRef<BottomSheet>(null);
  const MySubGroupRef = useRef<BottomSheet>(null);

  // NEW STATES FOR MANUAL CROPPING
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [currentCropImage, setCurrentCropImage] = useState(null);
  const [cropIndex, setCropIndex] = useState(0);
  const [allSelectedImages, setAllSelectedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [processedImages, setProcessedImages] = useState([]);

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);
  // type this

  const device = useCameraDevice("back");

  const camera = useRef<Camera>(null);

  const [file, setFile] = useState(null);

  const [prevSelectedGroupId, setPrevSelectedGroupId] = useState(null);

  const onPressGroup = () => {
    MyGroupRef.current?.expand();
    onSelectGroupHandler({ key: selectedGroup?.id });
  };

  const useCommonRatio = (images) => {
    const [commonRatio, setCommonRatio] = useState("4:5");
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const analyzeImages = async () => {
        if (!images || images.length === 0) {
          setLoading(false);
          return;
        }
  
        try {
          // Get dimensions for all images
          const dimensionsPromises = images.map(async (item: { uri: string }) => {
            const uri = item?.uri || `https://cdn.qoneqt.com/${item}`;
            return await getImageDimensions(uri);
          });
  
          const dimensionsArray = await Promise.all(dimensionsPromises);
  
          // Get ratio categories for all images
          const ratioCategories = dimensionsArray.map(({ width, height }) =>
            getAspectRatioCategory(width, height)
          );
  
          // Determine common ratio
          const uniqueRatios = Array.from(new Set(ratioCategories));
  
          if (uniqueRatios.length === 1) {
            // All images have the same ratio
            setCommonRatio(uniqueRatios[0]);
          } else {
            // Multiple ratios found, default to 4:5
            setCommonRatio("4:5");
          }
        } catch (error) {
          console.error("Error analyzing image ratios:", error);
          setCommonRatio("4:5");
        } finally {
          setLoading(false);
        }
      };
  
      analyzeImages();
    }, [images]);
  
    return { commonRatio, loading };
  };

  const getAspectRatioCategory = (width: number, height: number) => {
    const ratio = width / height;

    // Define tolerance for ratio matching
    const tolerance = 0.1;

    if (Math.abs(ratio - 1) <= tolerance) {
      return "1:1"; // Square
    } else if (Math.abs(ratio - 0.8) <= tolerance) {
      return "4:5"; // Portrait
    } else if (Math.abs(ratio - 16 / 9) <= tolerance) {
      return "16:9"; // Landscape
    }

    // Default to 4:5 if no match
    return "4:5";
  };

  // Helper function to get image dimensions
  const getImageDimensions = (uri: string) => {
    return new Promise((resolve) => {
      Image.getSize(
        uri,
        (width, height) => resolve({ width, height }),
        () => resolve({ width: 4, height: 5 }) // Default fallback
      );
    });
  };

  // Helper function to get height based on ratio
  const getHeightForRatio = (width: number, ratio: string) => {
    switch (ratio) {
      case "1:1":
        return width;
      case "4:5":
        return (width * 5) / 4;
      case "16:9":
        return (width * 9) / 16;
      default:
        return (width * 5) / 4;
    }
  };

  // MANUAL CROPPING FUNCTIONS
  const processImagesWithManualCropping = async (selectedImages) => {
    // Reset states
    setProcessedImages([]);
    setPendingImages(selectedImages);
    setAllSelectedImages(selectedImages);
    setCropIndex(0);

    // Start with first image
    if (selectedImages.length > 0) {
      setCurrentCropImage(selectedImages[0]);
      setCropModalVisible(true);
    }
  };

  // const handleCropComplete = async (croppedImageData) => {
  //   const newProcessedImages = [...processedImages, croppedImageData];
  //   setProcessedImages(newProcessedImages);

  //   const nextIndex = cropIndex + 1;

  //   if (nextIndex < allSelectedImages.length) {
  //     // Process next image
  //     setCropIndex(nextIndex);
  //     setCurrentCropImage(allSelectedImages[nextIndex]);
  //   } else {
  //     // All images processed
  //     setCropModalVisible(false);

  //     // Update your existing states with cropped images
  //     setCroppedImages(newProcessedImages);
  //     setMultiSelectImages(newProcessedImages);
  //     updateState(1);
  //   }
  // };

  const handleCropCancel = () => {
    setCropModalVisible(false);
    // Reset states
    setProcessedImages([]);
    setPendingImages([]);
    setAllSelectedImages([]);
    setCropIndex(0);
    setCurrentCropImage(null);
  };

  // Updated handleCropComplete function in your ViewModel
  const handleCropComplete = async (croppedImageData) => {
    console.log(
      "📋 ViewModel handleCropComplete called with:",
      croppedImageData
    );

    // Since the modal now provides the final cropped image,
    // we can directly use it without further processing
    const newProcessedImages = [...processedImages, croppedImageData];
    setProcessedImages(newProcessedImages);

    const nextIndex = cropIndex + 1;

    if (nextIndex < allSelectedImages.length) {
      // Process next image
      console.log("📋 Moving to next image:", nextIndex);
      setCropIndex(nextIndex);
      setCurrentCropImage(allSelectedImages[nextIndex]);
    } else {
      // All images processed
      console.log("📋 All images processed, closing modal and updating state");
      setCropModalVisible(false);

      // Update your existing states with cropped images
      setCroppedImages(newProcessedImages);
      setMultiSelectImages(newProcessedImages);

      console.log("📋 Final processed images:", newProcessedImages);
      console.log("📋 Calling updateState(1)");

      updateState(1);
    }
  };

  const Document_Picker = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
        mode: "open",
        allowMultiSelection: false,
        copyTo: "cachesDirectory",
      });
      setAudio([]);
      console.log("result>>", result);
      setDownloadedAudio([]);

      setFile(result);
    } catch (error) {}
  };

  useEffect(() => {
    if (file) {
      const determineFileType = (fileType: string, fileName: string) => {
        // Audio types
        if (fileType === "audio/x-m4a") return "audio.m4a";
        if (fileType.startsWith("audio/")) return fileType;

        // Video types
        if (fileType.startsWith("video/")) return fileType;

        // Image types
        if (fileType.startsWith("image/")) return fileType;

        const ext = fileName.split(".").pop()?.toLowerCase();
        const mimeTypes = {
          // Audio
          m4a: "audio.m4a",
          mp3: "audio/mpeg",
          wav: "audio/wav",
          ogg: "audio/ogg",
          aac: "audio/aac",
        };
        return mimeTypes[ext] || fileType;
      };
      const mediaFile = {
        uri: file[0]?.fileCopyUri || file[0].uri,
        type: determineFileType(file[0].type, file[0].name),
        name: file[0].name,
      };

      setFileLoaded(true);
      setAudio([mediaFile]);
      console.log("mediaFile>>", mediaFile);
      setDownloadedAudio([mediaFile]);

      updateState(3);
    }
    return () => {
      // setFile(null);
      // setMultiSelectImage([]);
      // setSelectedVideo([]);
      // setImageFileData([]);
      // setAudio([]);
      // setDownloadedAudio([]);
      // setRecordingPath(null);
    };
  }, [file]);

  const onSelectGroupHandler = (data: any) => {
    setSelectedGroup({
      id: data?.id,
      name: data?.loop_name,
    });
    MyGroupRef.current?.close();
    // Small delay to ensure smooth transition
    // setTimeout(() => {
    //   onFetchSubGroupHandler({key : ""});
    //   MySubGroupRef.current?.expand();
    //   // isBottomSheetOpen should remain true during this transition
    // }, 300);
  };

  const doneSubGroupHandler = () => {
    MySubGroupRef.current?.close();
  };
  

  // Handler for checkbox selection
  const handleSubGroupSelection = (subgroupId, isGeneral = false) => {
    if (isGeneral) {
      // General cannot be unselected
      return;
    }

  // Convert subgroupId to string to ensure consistency
  const stringId = subgroupId;

    setSelectedSubGroup((prev) => {
      if (prev.includes(stringId)) {
        // Remove from selection
        return prev.filter((id) => id !== stringId);
      } else {
        // Check if we've reached the maximum limit of 3
        if (prev.length >= 3) {
          // Optional: Show alert or toast message
          alert("Maximum 3 subgroups can be selected");
          return prev; // Don't add new item
        }
        // Add to selection
        return [...prev, stringId];
      }
    });
  };

  const onChangeCaptionHandler = (text: string) => {
    setDesc(text);
  };

  const updateState = (id: number) => {
    console.log("mediaFile>>12");
    if (id === 0) {
      setDesc("");
      setSelectedVideo([]);
      setImageFileData(null);
      setImageFileData([]);
    }
    if (id === 1) {
      setAudio([]);
      setSelectedVideo([]);
      setDownloadedAudio([]);
      setRecordingPath(null);
    }
    if (id === 2) {
      setMultiSelectImage([]);
      setMultiSelectImages([]);
      setAudio([]);
      setDownloadedAudio([]);
      setRecordingPath(null);
    }
    if (id === 3) {
      setSelectedVideo([]);
      setMultiSelectImage([]);
      setMultiSelectImages([]);
      setFileLoaded(false);
    }
  };

  const compressImageHandler = async (uri: string) => {
    const result = await CompressImage.compress(uri, {
      progressDivider: 10,
      downloadProgress: (progress) => {},
    });

    const imageFile = {
      uri: result,
      type: "image/jpeg",
      name: result.split("/").pop() || "captured_image.jpg",
    };
    setMultiSelectImage((prev) => [...prev, imageFile]);
    updateState(1);

    return result;
  };

  useEffect(() => {
    if (recordingPath && (!audio.length || audio[0]?.uri !== recordingPath)) {
      const determineAudioMimeType = (filePath: string) => {
        const extension = filePath.split(".").pop()?.toLowerCase() || "";
        console.log("extension>>", extension);
        const mimeTypes = {
          m4a: "audio/x-m4a",
          // mp3: "audio/mp3",
          mp3: "video/mp4",
          wav: "audio/wav",
          ogg: "audio/ogg",
          aac: "audio/aac",
          mpeg: "audio/mpeg",
        };
        const mimeType = mimeTypes[extension] || "audio/mpeg";
        return mimeType === "audio/x-m4a" ? "audio/m4a" : mimeType;
      };
      console.log("recordingPath>>", recordingPath);
      const AudioFile = {
        uri: recordingPath,
        type: determineAudioMimeType(recordingPath),
        name: recordingPath.split("/").pop() || "capturedAudio.m4a",
      };
      console.log("AudioFile>>", AudioFile);
      setAudio([AudioFile]);
      updateState(3);
    }
  }, [recordingPath]);

  const compressSelected = async (item: any) => {
    try {
      const result = await compressorVideo(item.uri);
      setVideoUri(item.uri);
      const videoFile = {
        uri: result,
        name: item.fileName || `video_${Date.now()}.mp4`,
        type: item.mimeType || "video/mp4",
      };
      setImageFileData([]);
      setSelectedVideo([videoFile]);
      updateState(2);
      setLoaded(false);
    } catch (e) {
      console.log("compressSelected error>>", JSON.stringify(e));
    }
  };

  const onCaptureImage = async () => {
    const photo = await camera.current.takePhoto({});
    compressImageHandler(photo?.path);
  };

  const onTakeSelfieHandler = async () => {
    try {
      if (checkCameraPermission()) {
        imageMediaRef.current.close();
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [3, 4],
          quality: 1,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          exif: false,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          setSelectedVideo([]);
          setImageFileData([
            {
              uri: asset.uri,
              name: asset.fileName,
              type: asset.mimeType || "application/octet-stream",
              width: asset.width,
            },
          ]);
          setMultiSelectImages([asset]);
          updateState(1);
        }
      } else {
        checkCameraPermission();
      }
    } catch (error) {
      console.log(" camera error", error);
    }
  };

  const onPressCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 5],
        quality: 1,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        exif: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setMultiSelectImages((prev) => [...prev, asset]);
        updateState(1);
        setLoaded(false);
      }
    } catch (error) {
      console.log("camera error>", error);
    }
  };

  const onPressCameraTwo = () => {
    setSelectedVideo([]);
    setIsBottomSheetOpen(true);
    imageMediaRef.current.expand();
  };

  const compressorVideo = async (selecteduri) => {
    console.log("selecteduri>>", selecteduri);
    try {
      const result = await Video.compress(
        selecteduri,
        { compressionMethod: "auto" },
        (progress) => {}
      );
      return result;
    } catch (e) {
      console.log("compressorVideo error>>", JSON.stringify(e));
      return selecteduri;
    }
  };

  const onPressGallary = async (type) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: type !== "1",
      mediaTypes:
        type === "1"
          ? ImagePicker.MediaTypeOptions.Videos
          : ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets;
      // selectedAsset.map((item) => {
      if (selectedAsset[0].type === "video" && type === "1") {
        if (selectedAsset[0].fileSize) {
          setLoaded(true);
          const fileSizeInMB = selectedAsset[0].fileSize / (1024 * 1024);
          if (fileSizeInMB > 50) {
            showToast({
              type: "error",
              text1: "Video size should be less than 50MB",
            });
            setLoaded(false);
            return;
          } else {
            compressSelected(selectedAsset[0]);
          }
        }
      } else if (selectedAsset[0].type == "image") {
        processImagesWithManualCropping(selectedAsset);
        // Process images with Instagram-style cropping
        // const cropped = [];
        // // Step 2: Loop over selected images and re-open picker for cropping
        // for (let i = 0; i < selectedAsset.length; i++) {
        //   const cropResult = await ImagePicker.launchImageLibraryAsync({
        //     allowsEditing: true,
        //     aspect: [4, 5],
        //     quality: 1,
        //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   });
        //   if (!cropResult.canceled) {
        //     cropped.push(cropResult.assets[0]);
        //   }
        // }
        // setCroppedImages(cropped);
        // setMultiSelectImages((prev) => [...prev, ...cropped]);
        // updateState(1);
      }
    } else {
      setLoaded(false);

      // showToast({
      //   type: "error",
      //   text1: "You did not select any image or video.",
      // });
    }
  };

  const getMediaType = (mimeType, uri) => {
    if (!mimeType && uri) {
      // Fallback to file extension if mimeType is not available
      const extension = uri.split(".").pop()?.toLowerCase();
      if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
        return "image";
      } else if (
        ["mp4", "mov", "avi", "mkv", "webm", "3gp"].includes(extension)
      ) {
        return "video";
      } else if (
        ["mp3", "wav", "aac", "m4a", "ogg", "flac"].includes(extension)
      ) {
        return "audio";
      }
    }

    if (mimeType) {
      if (mimeType.startsWith("image/")) return "image";
      if (mimeType.startsWith("video/")) return "video";
      if (mimeType.startsWith("audio/")) return "audio";
    }

    return "unknown";
  };

  const onPressGallaryTwo = async () => {
    // Request permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    imageMediaRef.current.close();
    // Launch image picker with all media types
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.All, // Images, Videos
      allowsMultipleSelection: true, // Set to true if you want multiple selection
    });
    if (!result.canceled) {
      const selectedImage = result.assets[0];
      // Determine media type
      const mediaType = getMediaType(selectedImage.mimeType, selectedImage.uri);
      if (mediaType === "image") {
        setSelectedVideo([]);
        const cropped = [];

        // Step 2: Loop over selected images and re-open picker for cropping
        for (let i = 0; i < result.assets.length; i++) {
          const cropResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
          });

          if (!cropResult.canceled) {
            cropped.push(cropResult.assets[0]);
          }
        }

        setCroppedImages(cropped);
        setMultiSelectImages((prev) => [...prev, ...cropped]);
      } else if (mediaType === "video") {
        const fileSizeInMB = selectedImage.fileSize / (1024 * 1024);
        if (fileSizeInMB > 50) {
          showToast({
            type: "error",
            text1: "Video size should be less than 50MB",
          });
          setLoaded(false);
          return;
        } else {
          setMultiSelectImages([]);
          compressSelected(selectedImage);
        }
      }
    } else {
      // showToast({ type: "error", text1: "You did not select any image." });
    }
  };

  const formValidation = () => {
    if (
      desc === "" &&
      multiSelectImages.length === 0 &&
      audio.length === 0 &&
      selectedvideo.length === 0
    ) {
      showToast({ type: "error", text1: "Please add description or media" });
      dispatch(updateProgress(0));
      dispatch(updateFailed(false));
      dispatch(updateLoading(false));
      return false;
    }

    if (!selectedGroup?.id) {
      showToast({ type: "error", text1: "Please select group first" });
      return false;
    }

    return true;
  };

  const format = useCameraFormat(device, [
    { photoResolution: { width: 328, height: 238 } },
  ]);

  const onFetchGroupHandler = ({ key }) => {
    if (!userId) return;
    dispatch(searchGroupList({ userId: userId, key: key }));
  };

  useEffect(() => {
    if (userId) {
      dispatch(searchGroupList({ userId: userId, key: "" }));
    }
  }, [userId]);

  const onFetchSubGroupHandler = ({ key }) => {
    if (!userId || !selectedGroup?.id) return;
    
        setSelectedSubGroup([]);
    dispatch(
      getSubgroupList({ userId: userId, groupId: selectedGroup?.id, key: "" })
    );
     MySubGroupRef.current?.expand();
  };

  useEffect(() => {
    if (userId && selectedGroup?.id) {
       
        setPrevSelectedGroupId(selectedGroup?.id);
        dispatch(
          getSubgroupList({
            userId: userId,
            groupId: selectedGroup?.id,
            key: "",
          })
          
        );
        setSelectedSubGroup([]);
        MySubGroupRef.current?.expand();
      
    }
  }, [userId, selectedGroup, prevSelectedGroupId]);

  const onSearchGroup = (data) => {
    onFetchGroupHandler({ key: data });
  };
  useEffect(() => {
    return () => {
      if (submitPostResponse?.data?.id) {
        dispatch(updatePostDetail({}));
      }
    };
  }, [submitPostResponse]);

  // const generateAllBlurHashes = async (images: any[]) => {
  //   const imageDataArray: any[] = [];
  //   const imageHeightArray: any[] = [];
  //   const totalSteps = images.length;
  //   for (let i = 0; i < totalSteps; i++) {
  //     const image = images[i];
  //     const percent = Math.round(((i + 1) / totalSteps) * 90);
  //     dispatch(updateProgress(percent));
  //     if (image.uri) {
  //       // 🔄 Cumulative progress

  //       const imageInfo = await compressedImage(image.uri, image.width);
  //       if (imageInfo?.result?.key) {
  //         imageDataArray.push(imageInfo.result.key);
  //         imageHeightArray.push(
  //           imageInfo?.result?.height || image?.height || 400
  //         );
  //       }
  //       else{
  //         console.log("image>>", image)
  //         imageDataArray.push({uri: Platform.OS === "android" ? image.uri : image.uri.replace("file://", ""), type: image.mimeType, name: image.fileName});
  //         imageHeightArray.push(image?.height || 400);
  //       }
  //     } else {
  //       imageDataArray.push(image);
  //       imageHeightArray.push(image?.height || 400);
  //     }
  //   }

  //   return {
  //     imageData: imageDataArray,
  //     imageHeight: imageHeightArray,
  //   };
  // };


  const generateAllBlurHashes = async (images: any[]) => {
    const imageDataArray: any[] = [];
    const imageRatioArray: any[] = []; // Changed from imageHeightArray to imageRatioArray
    const totalSteps = images.length;

    for (let i = 0; i < totalSteps; i++) {
      const image = images[i];
      const percent = Math.round(((i + 1) / totalSteps) * 90);
      dispatch(updateProgress(percent));

      if (image.uri) {
        // Get image dimensions to calculate ratio
        const dimensions = await getImageDimensions(image.uri) as { width: number; height: number };
        const ratio = getAspectRatioCategory(
          dimensions.width,
          dimensions.height
        );

        const imageInfo = await compressedImage(image.uri, image.width);
        if (imageInfo?.result?.key) {
          imageDataArray.push(imageInfo.result.key);
          imageRatioArray.push(ratio); // Store the ratio instead of height
        } else {
          console.log("image>>", image);
          imageDataArray.push({
            uri:
              Platform.OS === "android"
                ? image.uri
                : image.uri.replace("file://", ""),
            type: image.mimeType,
            name: image.fileName,
          });
          imageRatioArray.push(ratio); // Store the ratio instead of height
        }
      } else {
        // For images without URI, try to get ratio from existing dimensions or default
        let ratio = "4:5"; // default ratio
        if (image.width && image.height) {
          ratio = getAspectRatioCategory(image.width, image.height);
        }
        imageDataArray.push(image);
        imageRatioArray.push(ratio);
      }
    }

    return {
      imageData: imageDataArray,
      imageRatio: imageRatioArray, // Changed from imageHeight to imageRatio
    };
  };
  const isSubmittingRef = useRef(false);


  const onSubmitPostHandler = async ({
    isCreatePost,
    groupId,
    isLightMode,
    isProfile,
  }: any) => {
    if (isSubmittingRef.current || !formValidation()) return;

    isSubmittingRef.current = true;
    setSubmitLoading(true);

    try {
      const getAttachmentType = () => {
        if (audio?.length > 0) return "audio";
        if (selectedvideo?.length > 0)
          return selectedvideo[0].name ?  selectedvideo[0]?.type?.startsWith("video")
            ? "video"
            : "image" : "video";
        if (multiSelectImages?.length > 0) return "image";
        return "text";
      };
      dispatch(updateFailed(false));
      dispatch(updateLoading(true));
      dispatch(updateProgress(0));
      if (isCreatePost) {
        if(router.canGoBack()){
          router.back();
        }
        router.replace("/DashboardScreen");
      }

      const fileDatas = await generateAllBlurHashes(multiSelectImages);
      const fileData =
        audio?.length > 0
          ? audio[0].name ? audio: ''
          : multiSelectImages?.length > 0
          ? fileDatas.imageData
          : selectedvideo?.length > 0
          ? selectedvideo[0].name ? selectedvideo: ''
          : imageFileData?.length > 0
          ? imageFileData
          : "";

      if (getAttachmentType() == "text") {
        dispatch(updateProgress(50));
      }
// var isDataValid = getAttachmentType() == "image" ? fileData.length > 0 :  true;
      const createPostResponse =    await dispatch(
        createPost({
          attachment: getAttachmentType(),
          cat_id: 1,
          user_id: userId,
          description: desc,
          fileData: fileData,
          group_id: groupId || selectedGroup?.id,
          subgroup: selectedSubGroup,
          post_type: 0,
          fromApp: 1,
          imageHeight: fileDatas?.imageRatio || [],
          file_key: selectedvideo?.length > 0 ? selectedvideo[0].name ? '' : selectedvideo[0].url: audio?.length > 0 ? audio[0].name ? '' : audio[0].uri : '',
        })
      );
      //  : {payload:{success:false, message:"image not uploaded"}};
      const success = createPostResponse?.payload?.success;

      if (success) {
        dispatch(updateProgress(100));
        showToast({
          type: "success",
          text1: createPostResponse.payload.message,
        });
        resetMediaStates();
        updateReduxPostFeed(createPostResponse.payload.data, {
          isCreatePost,
          groupId,
          isLightMode,
        });
      } else {
        showToast({
          type: "error",
          text1: createPostResponse?.payload?.message || "Something went wrong",
        });
        dispatch(updateFailed(true));
        setOpenCamera(false);
      }
    } catch (e) {
      showToast({
        type: "error",
        text1: e?.message || "Something went wrong",
      });
      dispatch(updateFailed(true));
    } finally {
      setSubmitLoading(false);
      isSubmittingRef.current = false;
    }
  };
  const onSubmitHomePostHandler = () => {};

  const resetMediaStates = () => {
    setDesc("");
    setMultiSelectImages([]);
    setMultiSelectImage([]);
    setImageFileData([]);
    setAudio([]);
    setSelectedVideo([]);
    setDownloadedAudio([]);
  };

  const updatePostFeed = (data, newPost) => {
    return data.map((item: any) => {
      if(item.id == postValue.id){
        return {
          ...newPost
        }
      }
      return item
    })
  }

  const updateReduxPostFeed = async (
    newPost,
    { isCreatePost, groupId, isLightMode }
  ) => {
    try{
    if(postValue.id){
      
      dispatch(updateIsUpdated(true));
    const userData = Array.isArray(postDetailResponse?.updatedData)
      ? postDetailResponse.updatedData.length > 0 ? postDetailResponse.updatedData[0].post_by ? postDetailResponse.updatedData : [] : []
      : [];
    const localData = getPrefsValue("homePostData");
    const localPostData = JSON.parse(localData || "[]");
    const updatedPostData = updatePostFeed(localPostData, newPost)
    setPrefsValue("homePostData", JSON.stringify(updatedPostData));
    dispatch(setHomePostSlice(updatePostFeed(HomePostResponse.UpdatedData, newPost)));
    dispatch(setMyUserFeedData(updatePostFeed(userData, newPost)));
    var deletePostData: any = await dispatch(
      //@ts-ignore
      onDeletePost({ post_id: postValue.id, user_id: userId })
    );
    }
    else {
    dispatch(updateIsUpdated(true));
    const userData = Array.isArray(postDetailResponse?.updatedData)
      ? postDetailResponse.updatedData
      : [];
    const localData = getPrefsValue("homePostData");
    const localPostData = JSON.parse(localData || "[]");
    const updatedPostData = [newPost, ...localPostData];
    setPrefsValue("homePostData", JSON.stringify(updatedPostData));
    dispatch(setHomePostSlice([newPost, ...HomePostResponse.UpdatedData]));
    
    dispatch(setMyUserFeedData([newPost, ...userData]));

    const updatedProfileDatas = {
      data: {
        ...myProfileData.data,
        post_count: myProfileData.data.post_count + 1,
      },
    };
    dispatch(updateProfileData(updatedProfileDatas));
  }
}
catch(error){
  console.log("post error", error)
}
  };

  const onClearImageHandler = (index: number) => {
    setMultiSelectImage((prev) => prev.filter((item, key) => key !== index));
    // setMultiSelectImages((prev) => prev.filter((item, key) => key !== index));
    setImageFileData([]);
    setOpenCamera(false);

    const updatedImages = [...multiSelectImages];
    updatedImages.splice(index, 1);
    setMultiSelectImages(updatedImages); // This should be a state setter from props or context
    let newIndex = activeIndex;
    if (activeIndex >= updatedImages.length) {
      newIndex = updatedImages.length - 1;
    }

    // Delay scroll to allow FlatList to update
    setTimeout(() => {
      scrollToIndex(newIndex >= 0 ? newIndex : 0);
    }, 100);
  };

  const flatListRef = useRef<FlatList>(null);

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < multiSelectImages.length) {
      flatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
      setActiveIndex(index);
    }
  };

  return {
    onPressCamera,
    onPressGallary,
    multiSelectImage,
    onTakeSelfieHandler,
    onChangeCaptionHandler,
    onPressGroup,
    onSubmitPostHandler,
    onPressCameraTwo,
    imageMediaRef,
    MyGroupRef,
    MySubGroupRef,
    selectedvideo,
    imageFileData,
    openCamera,
    device,
    camera,
    format,
    onSelectGroupHandler,
    onSearchGroup,
    selectedGroup,
    onCaptureImage,
    desc,
    audio,
    downloadedAudio,
    setDownloadedAudio,
    setAudio,
    Document_Picker,
    onPressGallaryTwo,
    onClearImageHandler,
    setSelectedVideo,
    setLoaded,
    onSubmitHomePostHandler,
    loaded,
    setFileLoaded,
    fileLoaded,
    formValidation,
    multiSelectImages,
    submitLoading,
    setImageFileData,
    progress,
    videoUri,
    setMultiSelectImages,
    setVideoUri,
    setSelectedGroup,
    
    scrollToIndex,
    activeIndex,
    setActiveIndex,
    flatListRef,

    //Subgroup
    handleSubGroupSelection,
    selectedSubGroup,
    setSelectedSubGroup,
    isBottomSheetOpen, setIsBottomSheetOpen,
    doneSubGroupHandler,

    // NEW RETURNS FOR MANUAL CROPPING
    cropModalVisible,
    setCropModalVisible,
    currentCropImage,
    cropIndex,
    allSelectedImages,
    handleCropComplete,
    handleCropCancel,
    processedImages,
    pendingImages,
  };
};

export default useCreatePostViewModel;
