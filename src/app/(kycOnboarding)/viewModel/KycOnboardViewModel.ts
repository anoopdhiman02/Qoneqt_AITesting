import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { useAppStore } from "@/zustand/zustandStore";
import { router } from "expo-router";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { onSubmitPanKyc } from "@/redux/reducer/kyc/SubmitPanKyc";
import { Alert } from "react-native";
import { fetchMyProfileDetails } from "@/redux/reducer/Profile/FetchProfileDetailsApi";


const useKycOnboardViewModel = () => {
  const { userId } =
    useAppStore();
  const Dispatch = useAppDispatch();
  const submitPanResponse = useAppSelector((state) => state.submitPanData);
  //pan kyc submit
  const [submitPanCalled, setSubmitPanCalled] = useState(false);
  const [panloading, setPanLoading] = useState(false);


  //submit pan card api
  useEffect(() => {
    if (submitPanCalled && submitPanResponse?.success) {
      setSubmitPanCalled(false);
      setPanLoading(false);
      router.replace("/ProfileScreen");
      showToast({ type: "success", text1: submitPanResponse?.message });
    } else if (submitPanCalled && !submitPanResponse?.success) {
      setSubmitPanCalled(false);
      setPanLoading(false);
      router.replace("/ProfileScreen");
      showToast({
        type: "error",
        text1: submitPanResponse?.message || "something went wrong",
      });
    }
  }, [submitPanResponse]);

  const onSubmitPanHandler = async ({ panCard, isSelfie, selfieFile }) => {

    var panCardFile: any = await Dispatch(onSubmitPanKyc({
      userId: userId,
      pan_card_front: panCard,
      with_profile: isSelfie,
      profile_verification: selfieFile,
    }));
    if(panCardFile?.payload?.success){
      Alert.alert(
        "PAN Card Submitted Successfully",
        "Thank you for submitting your PAN card details. Our team will review and approve your document within 72 hours (3 business days). You will receive a notification once the verification process is completed.",
        [
          {
            text: "Understood",
            style: "default",
            onPress:()=>{
              Dispatch(fetchMyProfileDetails({ userId }));
              backToPreviousScreen();
            }
          }
        ]
      );
    }
    else {
      backToPreviousScreen();
      showToast({
        type: "error",
        text1: panCardFile?.payload?.message || "something went wrong",
      });
    }
    
  };

  const backToPreviousScreen = () => {
    if(router.canGoBack()){
      router.back();
    }
    else {
      router.replace("/ProfileScreen");
    }
    
  }

  const onPressVerifyDocument = () => {
    router.push({
      pathname: "/KycOnboardHoc",
      params: { kycStepData: 0, type: 0 },
    });
  };


  return {
    onPressVerifyDocument,
    onSubmitPanHandler,
    panloading,
  };
};

export default useKycOnboardViewModel;
