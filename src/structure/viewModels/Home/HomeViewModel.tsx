import { useContext, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GlobalContext from "../../../contexts/GlobalContext";

const useHomeViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { isPartialKyc } =
    useContext(GlobalContext);

  //Bottom sheet
  const actionSheetRef = useRef<any>(null);
  const homePostActionSheetRef = useRef<any>(null);



  const onCreateFeedsHandler = (item) => {
    if (isPartialKyc) {
      navigation?.navigate("CreateFeedScreen", {
        groupName: item?.title,
        groupId: item?.id,
      });
    } else {
      navigation?.navigate("ProfileVerificationScreen");
    }
  };

  //Header Icon
  const onReferHandler = () => {
    navigation?.navigate("ReferralScreen");
  };

  const onNotificationHandler = () => {
    navigation?.navigate("NotificationScreen");
  };

  //Post Details APi

  const onPressPostHandler = (props) => {
    navigation?.navigate("PostDetailsScreen", { postData: props });
  };

  //Group
  const onPressGroupHandler = (props) => {
    navigation?.navigate("groups", { groupId: props });
  };


  const onPressHomePostFilter = () => {
    actionSheetRef?.current?.show();
  };

  //PostHeader
  const onPressPostAction = (data) => {
    if (isPartialKyc) {
      homePostActionSheetRef?.current?.show();
    } else {
      navigation?.navigate("ProfileVerificationScreen");
    }
  };

  const onPressMessageHandler = (userData) => {
    navigation?.navigate("ChatBoxScreen", {
      userData: {
        userId: userData?.user?.id,
        userName: userData?.user?.first_name,
        userProfile: userData?.user?.avatar,
        isVerified: userData?.Kyc,
        isBlocked: userData?.user?.blocked,
      },
    });
    homePostActionSheetRef?.current?.hide();
  };
  const onPressReportHandler = (userData) => {
    navigation.navigate("ReportScreen", { userData: userData });
    homePostActionSheetRef?.current?.hide();
  };

  return {
    onReferHandler,
    onNotificationHandler,
    onCreateFeedsHandler,
    onPressGroupHandler,
    onPressPostHandler,
    onPressHomePostFilter,
    actionSheetRef,
    onPressPostAction,
    homePostActionSheetRef,
    onPressMessageHandler,
    onPressReportHandler,
  };
};

export default useHomeViewModel;
