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
import { Alert } from "react-native";
import { selectTrendingPostResponse } from "@/redux/selectors/homeSelectors";
import { trendingUserPost } from "@/redux/slice/home/TrendingPostSlice";
import { onDeletePost } from "@/redux/reducer/post/DeletePost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPrefsValue, setPrefsValue } from "@/utils/storage";

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
  const [loaded, setLoaded] = useState(false);
  const [fileLoaded, setFileLoaded] = useState(false);
  const [audio, setAudio] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({
    id: 15213,
    name: "Global Feeds",
  });
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
  // type this

  const device = useCameraDevice("back");

  const camera = useRef<Camera>(null);

  const [file, setFile] = useState(null);

  const onPressGroup = () => {
    MyGroupRef.current?.expand();
    onSelectGroupHandler({ key: selectedGroup?.id });
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
      id: data?.id || 15213,
      name: data?.loop_name || "Global Feeds",
    });
    MyGroupRef.current?.close();
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
          allowsEditing: false,
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
        allowsEditing: false,
        aspect: [3, 4],
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
      aspect: [3, 4],
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
        setMultiSelectImages((prev) => [...prev, ...selectedAsset]);
        updateState(1);
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
      aspect: [3, 4],
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
        // setImageFileData([
        //   {
        //     uri: selectedImage.uri,
        //     name: selectedImage.fileName,
        //     type: selectedImage.mimeType || "application/octet-stream",
        //     width: selectedImage.width,
        //   },
        // ]);
        setMultiSelectImages((prev) => [...prev, ...result.assets]);
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
      return false;
    }

    return true;
  };

  const format = useCameraFormat(device, [
    { photoResolution: { width: 328, height: 238 } },
  ]);

  const onFetchGroupHandler = ({ key }) => {
    if (userId){
    dispatch(searchGroupList({ userId: userId, key: key }));
    }
  };

  useEffect(() => {
    if (userId) {
      dispatch(searchGroupList({ userId: userId, key: "" }));
    }
  }, [userId]);

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

  const generateAllBlurHashes = async (images: any[]) => {
    const imageDataArray: string[] = [];
    const imageHeightArray: string[] = [];
    const totalSteps = images.length;
    for (let i = 0; i < totalSteps; i++) {
      const image = images[i];
      const percent = Math.round(((i + 1) / totalSteps) * 90);
      dispatch(updateProgress(percent));
      if (image.uri) {
        // 🔄 Cumulative progress

        const imageInfo = await compressedImage(image.uri, image.width);
        if (imageInfo?.result?.key) {
          imageDataArray.push(imageInfo.result.key);
          imageHeightArray.push(
            imageInfo?.result?.height || image?.height || 400
          );
        }
      } else {
        imageDataArray.push(image);
        imageHeightArray.push(image?.height || 4000);
      }
    }

    return {
      imageData: imageDataArray,
      imageHeight: imageHeightArray,
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
      if (isCreatePost) router.back();

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

      const createPostResponse = await dispatch(
        createPost({
          attachment: getAttachmentType(),
          cat_id: 1,
          user_id: userId,
          description: desc,
          fileData: fileData,
          group_id: groupId || selectedGroup?.id,
          post_type: 0,
          fromApp: 1,
          imageHeight: fileDatas?.imageHeight || [],
          file_key: selectedvideo?.length > 0 ? selectedvideo[0].name ? '' : selectedvideo[0].url: audio?.length > 0 ? audio[0].name ? '' : audio[0].uri : '',
        })
      );
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
      console.error("Submit error:", e);
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
      ? postDetailResponse.updatedData
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

  const onClearImageHandler = (index) => {
    setMultiSelectImage((prev) => prev.filter((item, key) => key !== index));
    setMultiSelectImages((prev) => prev.filter((item, key) => key !== index));
    setImageFileData([]);
    setOpenCamera(false);
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
    
  };
};

export default useCreatePostViewModel;
