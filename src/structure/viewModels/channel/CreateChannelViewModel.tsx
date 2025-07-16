import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";

import { onCreateCategoryChannel } from "../../../redux/reducer/channel/CreateCategoryChannel";
import { onFetchChannelCategoryList } from "@/redux/reducer/channel/ChannelCategoryList";
import BottomSheet from "@gorhom/bottom-sheet";
import { useAppStore } from "@/zustand/zustandStore";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import * as ImagePicker from "expo-image-picker";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { router } from "expo-router";
import { useChannelStore } from "@/zustand/channelStore";
import { compressImageSize } from "@/utils/ImageHelper";

const useCreateChannelViewModel = () => {
  const { userId } = useAppStore();
  const { setRefreshCategory, setRefreshCHannel } = useChannelStore();

  const Dispatch = useAppDispatch();

  const createChannelData = useAppSelector(
    (state) => state.createCategoryChannel
  );

  const channelCategoryListResponse = useAppSelector(
    (state) => state.channelCategoryListResponse
  );

  const imageMediaRef = useRef<BottomSheet>(null);
  const uploadImageRef = useRef<BottomSheet>(null);
  const addChannelRef = useRef<BottomSheet>(null);
  const addNewCatRef = useRef<BottomSheet>(null);

  const [apiCalled, setApiCalled] = useState(false);
  const [channelLoading, setChannelLoading] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [perk, setPerk] = useState(0);

  //image
  //vision camera
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState("back");

  const [openCamera, setOpenCamera] = useState(false);
  const [imageData, setImageData] = useState("");
  const [imageFileData, setImageFileData] = useState(null);
  const camera = useRef<Camera>(null);

  ///channel category
  const [categoryCalled, setCategoryCalled] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [selectCat, setSelectCat] = useState({
    category: "",
    id: 0,
  }); // Initialize with null

  //Group type
  const [groupType, setGroupType] = useState(1);
  useEffect(() => {
      if (apiCalled && createChannelData?.success) {
        setApiCalled(false);
      setChannelLoading(false);
        setRefreshCHannel(true);
      } else if(apiCalled && !createChannelData?.success) {
        setApiCalled(false);
      setChannelLoading(false);
      }
      
  }, [createChannelData, apiCalled]);
  

  const onCreateChannelHandler = ({ groupId }) => {

    if(channelName &&selectCat?.id && imageFileData){
      Dispatch(
        onCreateCategoryChannel({
          userId: userId,
          channelName: channelName,
          type: groupType,
          categoryId: selectCat?.id,
          groupId: groupId,
          file: imageFileData,
          perk: perk.toString(),
        })
      );
  
      setApiCalled(true);
      setChannelLoading(true);
    }
    else {
      showToast({
        type: "error",
        text1: `Please ${channelName == '' ? "enter channel name" : !selectCat?.id ? "select category": "select sub group image"}`,
      });
    }
    
   
  };

  const onChannelNamehandler = (text) => {
    setChannelName(text);
  };

  const onPerkhandler = (text) => {
    setPerk(text);
  };

  const onPressCategory = () => {
    setShowCategory(!showCategory);
  };

  const onSelectCategory = (data: any) => {
    setSelectCat({ category: data?.category, id: data?.id });
  };

  // new api

  useEffect(() => {
    if (categoryCalled && channelCategoryListResponse?.success) {
      // ToastMessage(channelCategoryListResponse?.data?.message);
      setCategoryCalled(true);
      setCategoryLoading(true);
      setCategoryList(
        channelCategoryListResponse?.data?.qoneqtdb_loop_group[0]
          ?.channel_categories
      );
      setRefreshCategory(false);
    } else if (apiCalled && !channelCategoryListResponse?.success) {
      // ToastMessage("something went wrong");
      setCategoryCalled(true);
      setCategoryLoading(true);
      setRefreshCategory(false);
    }
  }, [channelCategoryListResponse]);

  const onFetchCategory = (groupId) => {
    // GetUserTokenStorage().then((token) => {
    Dispatch(
      onFetchChannelCategoryList({
        userId: userId,
        groupId: groupId,
      })
    );
    setCategoryCalled(true);
    setCategoryLoading(true);
    // });
  };

  const handleSelectType = (id) => {
    setGroupType(id);
  };

  const onPressAddCategory = () => {
    // addChannelRef?.current?.close();
    addNewCatRef?.current?.expand();
    addChannelRef?.current?.close();
  };

  //image
  //image uplaod function
  const onCaptureImage = async () => {
    const photo = await camera.current.takePhoto();

    const imageUri = photo.path;
    const imageInfo: any = await compressImageSize({ uri: imageUri });
    const imageFile = {
      uri: imageInfo.uri,
      type: "image/jpeg", // Assuming the image is JPEG. Adjust if your camera uses a different format.
      name: imageUri.split("/").pop() || "captured_image.jpg", // Extract file name from path or use default
    };

    //  Update state with the image file object
    setImageFileData(imageFile);
    setImageData(imageInfo.uri);
  };

  const onPressCamera = () => {
    imageMediaRef?.current?.close();
    setOpenCamera(true);
    setImageData("");
  };

  const onPressGallary = async () => {
    imageMediaRef?.current?.close();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
    });

    // Request permission to access media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      showToast({
        type: "info",
        text1: "Permission to access camera roll is required!",
      });
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
      // alert("You did not select any image.");
      showToast({ type: "error", text1: "You did not select any image." });
    }
  };

  const format = useCameraFormat(device, [
    { photoResolution: { width: 328, height: 238 } },
  ]);

  const onPressUploadImage = () => {
    imageMediaRef?.current?.expand();
  };

  return {
    //imagr
    onPressUploadImage,
    imageMediaRef,
    onPressCamera,
    onPressGallary,
    onCaptureImage,
    imageData,
    openCamera,
    device,
    camera,
    format,
    //
    onChannelNamehandler,
    onPerkhandler,
    onPressCategory,
    onSelectCategory,
    showCategory,
    channelName,
    perk,
    channelLoading,
    apiCalled,
    onCreateChannelHandler,
    onFetchCategory,
    categoryLoading,
    categoryList,
    selectCat,

    uploadImageRef,
    addChannelRef,
    addNewCatRef,

    //group type
    handleSelectType,
    groupType,

    onPressAddCategory,
  };
};

export default useCreateChannelViewModel;
