import { useContext, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";

import { useNavigation } from "@react-navigation/native";
import {
  Camera,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import * as ImagePicker from "expo-image-picker";

import { replaceSpacesWithHyphens } from "../../../utils/Helpers";
import { fetchPreferenceList } from "@/redux/reducer/Profile/PreferenceList";
import { useAppStore } from "@/zustand/zustandStore";
import BottomSheet from "@gorhom/bottom-sheet";
import { createGroup } from "@/redux/reducer/group/CreateGroup";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { router } from "expo-router";
import { compressImageSize } from "@/utils/ImageHelper";
import { setLoadingData } from "@/redux/slice/group/CreateGroupSlice";

const useCreateGroupViewModel = () => {
  const { userId } = useAppStore();
  //API
  const Dispatch = useAppDispatch();
  //Category List
  const preferenceListResponse = useAppSelector(
    (state) => state.preferenceListResponse
  );
  const createdGroupData = useAppSelector((state) => state.createGroupData);

  //category list api
  const [apiCalled, setApiCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  //create group api
  const [createApiCalled, setCreateApiCalled] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  //vision camera
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const [facing, setFacing] = useState("back");

  const [openCamera, setOpenCamera] = useState(false);
  const [imageData, setImageData] = useState("");
  const [imageFileData, setImageFileData] = useState(null);
  const camera = useRef<Camera>(null);

  const [groupType, setGroupType] = useState(1);
  const [groupName, setGroupName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState({
    id: 0,
    value: "Select Group Category",
  });
  const [amount, setAmount] = useState();
  const [subsType, setSubsType] = useState({
    id: 1,
    value: "One time",
  });
  const [feeDistribution, setFeeDistribution] = useState({
    id: 1,
    value: "Select Fees Distribution",
  });

  //Modal
  const [categoryModal, setCategoryModal] = useState(false);
  const [subsTypeModal, setSubsTypeModal] = useState(false);
  const [feeModal, setFeeModal] = useState(false);

  //bottom sheet ref
  const imageMediaRef = useRef<BottomSheet>(null);
  const addChannelRef = useRef<BottomSheet>(null);
  const subsTypeRef = useRef<BottomSheet>(null);
  const feesDistributionRef = useRef<BottomSheet>(null);
  //APi Handling

  useEffect(() => {
    if (createApiCalled && createdGroupData?.success && !createdGroupData?.isLoaded) {
      showToast({ type: "success", text1: createdGroupData?.message });
      
      router?.replace({
        pathname: "/groups",
        params: { groupId: createdGroupData?.data?.id },
      });
    } else if (createApiCalled && !createdGroupData?.success && !createdGroupData?.isLoaded) {
      showToast({ type: "error", text1: createdGroupData?.message });
      setSubmitLoading(false);
      setCreateApiCalled(false);
      // router?.back();
    }
  }, [createdGroupData]);
  // useEffect(() => {
  //   if (createApiCalled && createdGroupData?.data?.success) {
  //     setSubmitLoading(false);
  //     setCreateApiCalled(false);
  //     // onSetRefreshHomeFunc(true);
  //     // onSetRefreshGroupFunc(true);

  //     // ToastMessage("Group created succesfully");
  //     setGroupType(1);
  //     setGroupName("");
  //     setDesc("");
  //     setCategory({
  //       id: 0,
  //       value: "Select Group Category",
  //     });
  //     // onClearImage();
  //     setAmount("");
  //     setSubsType({
  //       id: 0,
  //       value: "Select Group Sub-Category",
  //     });
  //     setFeeDistribution({
  //       id: 0,
  //       value: "Select Fees Distribution",
  //     });

  //     navigation?.navigate("HomeScreen");
  //   } else if (createApiCalled && !createdGroupData?.data?.success) {
  //     setSubmitLoading(false);
  //     setCreateApiCalled(false);
  //     ToastMessage(
  //       createdGroupData?.data?.message
  //         ? createdGroupData?.data?.message
  //         : "Something went wrong"
  //     );
  //     setGroupName("");
  //     setDesc("");
  //     setCategory({
  //       id: 0,
  //       value: "Select Group Category",
  //     });
  //     onClearImage();
  //     setAmount("");
  //     setSubsType({
  //       id: 0,
  //       value: "Select Group Sub-Category",
  //     });
  //     setFeeDistribution({
  //       id: 0,
  //       value: "Select Fees Distribution",
  //     });
  //   }
  // }, [createdGroupData]);

  const ValidationData = () => {
    // Check if group name is empty
    if (groupName === "") {
      showToast({ type: "error", text1: "Please enter group name" });
      return false;
    }

    // Check if description is empty
    if (desc === "") {
      showToast({ type: "error", text1: "Please enter group Description" });
      return false;
    }

    // Check if category is selected
    if (category?.value?.includes("Select")) {
      showToast({ type: "error", text1: "Please Select group category" });
      return false;
    }

    // Check if image is selected
    // if (!imageFileData) {
    //   showToast({ type: "error", text1: "Please enter group logo" });
    //   return false;
    // }

    // Check for paid group type validations
    // if (groupType === "paid") {
    //   if (amount === "") {
    //     showToast({ type: "error", text1: "Please enter amount" });
    //     return false;
    //   }
    //   if (subsType.value.includes("Select")) {
    //     showToast({ type: "error", text1: "Please Select Subscription type" });
    //     return false;
    //   }
    //   if (feeDistribution?.value.includes("Select")) {
    //     showToast({ type: "error", text1: "Please Select fee distribution" });
    //     return false;
    //   }
    // }

    return true;
  };

  //API Handler
  const onSubmitGroupHandler = () => {
    // Call validation before proceeding
    if (!ValidationData()) {
      return; // Exit if validation fails
    }
    Dispatch(setLoadingData(true));
    Dispatch(
      createGroup({
        userId: userId,
        name: groupName,
        type: groupType,
        description: desc,
        category: category?.id,
        fee: "0",
        distribution: feeDistribution?.id,
        subscriptionType: subsType?.id,
        attachType: imageFileData ? "image" : "text",
        file: imageFileData,
      })
    );
    setSubmitLoading(true);
    setCreateApiCalled(true);
  };

  // if (ValidationData()) {
  //   if (groupType === 3) {
  //     if (isFullKycCompleted) {
  //       if (token !== null) {
  //         Dispatch(
  //           createGroup({
  //             token: token,
  //             id: replaceSpacesWithHyphens(groupName),
  //             title: groupName,
  //             type: groupType,
  //             description: desc,
  //             category: category?.id,
  //             fee: amount,
  //             distribution: feeDistribution?.id,
  //             subscriptionType: subsType?.id,
  //             file: selectedImage,
  //           })
  //         );
  //         setSubmitLoading(true);
  //         setCreateApiCalled(true);
  //       }
  //     } else {
  //       navigation?.navigate("ProfileVerificationScreen");
  //     }
  //   } else {
  //     Dispatch(
  //       createGroup({
  //         userId: replaceSpacesWithHyphens(groupName),
  //         name: groupName,
  //         type: groupType,
  //         description: desc,
  //         category: category?.id,
  //         fee: "",
  //         distribution: feeDistribution?.id,
  //         subscriptionType: subsType?.id,
  //         file: selectedImage,
  //         fileType: "image",
  //       })
  //     );
  //     setSubmitLoading(true);
  //     setCreateApiCalled(true);
  // }
  // }
  // };

  const onSelectTypeHandler = ({ id }) => {
    setGroupType(id);
  };

  const onEnterNameHandler = (text) => {
    setGroupName(text);
  };

  const onEnterDescHandler = (text) => {
    setDesc(text);
  };

  ///Modal Function handler
  const onPressCategory = () => {
    addChannelRef.current?.expand();
    onFetchListHandler();
  };
  const onCloseCategory = () => {
    setCategoryModal(false);
  };

  const onPressSubsType = () => {
    subsTypeRef.current?.expand();
  };
  const onCloseSubsType = () => {
    setSubsTypeModal(false);
  };

  const onPressFessDistribution = () => {
    feesDistributionRef.current?.expand();
  };
  const onCloseFessDistribution = () => {
    setFeeModal(false);
  };

  //On select  all modal data
  const onSelectCategory = (item) => {
    setCategoryModal(false);
    setCategory({
      id: item?.id,
      value: item?.category_name,
    });
  };

  const onSelectSubsType = (item) => {
    setSubsType({
      id: item?.id,
      value: item?.name,
    });
    subsTypeRef.current?.close();
  };

  const onSelectFeeDistribution = (item) => {
    // setFeeModal(false);
    setFeeDistribution(item);
    feesDistributionRef.current?.close();
  };

  //new
  const onFetchListHandler = () => {
    Dispatch(fetchPreferenceList({ userId }));
    setApiCalled(true);
    setLoading(true);
  };

  useEffect(() => {
    if (apiCalled && preferenceListResponse?.success) {
      setCategoryList(preferenceListResponse?.data);
      setApiCalled(false);
      setLoading(false);
    } else if (apiCalled && !preferenceListResponse?.success) {
      setApiCalled(false);
      setLoading(false);
    }
  }, [preferenceListResponse]);

  //image uplaod function
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
    setImageData(photo?.path);
  };

  const onPressCamera = async () => {
    try{
    imageMediaRef?.current?.close();
    // setOpenCamera(true);
    // setImageData("");
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
      setImageFileData({
        uri: selfieImageInfo.uri,
        name: asset.fileName,
        type: asset.mimeType || "application/octet-stream",
      });
      setImageData(selfieImageInfo.uri);
    }
    }catch(error){
      console.log("error",error)
    }
  };

  const onPressGallary = async () => {
    imageMediaRef?.current?.close();
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 4],
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
      setImageFileData({
        uri: imageInfo.uri,
        name: selectedImage.fileName,
        type: selectedImage.mimeType || "application/octet-stream",
      });
      setImageData(imageInfo.uri);
    } else {
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
    onEnterNameHandler,
    onEnterDescHandler,
    onSelectTypeHandler,
    groupType,
    // onChangeTextHandler,
    categoryModal,
    onPressCategory,
    onCloseCategory,
    subsTypeModal,
    subsTypeRef,
    onPressSubsType,
    onCloseSubsType,
    feeModal,
    onPressFessDistribution,
    onCloseFessDistribution,
    onSelectCategory,
    onSelectSubsType,
    onSelectFeeDistribution,
    submitLoading,
    //value
    groupName,
    desc,
    subsType,
    feeDistribution,
    category,
    amount,

    //new
    categoryList,
    onFetchListHandler,
    loading,
    addChannelRef,
    feesDistributionRef,
    //Image
    // pickerModal,
    // selectedImage,
    // onImagePickerHandler,
    // onOpenModal,

    //subscription type
    onSubmitGroupHandler,
  };
};
export default useCreateGroupViewModel;
