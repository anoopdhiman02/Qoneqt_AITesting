import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../utils/Hooks";
import { fetchProfileDetails } from "../../../redux/reducer/Profile/FetchProfileDetailsApi";
import { GetUserTokenStorage } from "../../../utils/localDb/localStorage";
import ToastMessage from "../../../components/atoms/ToastMessage";
import { useNavigation } from "@react-navigation/native";
import { onFollowUser } from "../../../redux/reducer/Profile/FollowUser";
import GlobalContext from "../../../contexts/GlobalContext";
import { onBlockUser } from "../../../redux/reducer/Profile/BlockUser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const useUserProfileViewModel = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const Dispatch = useAppDispatch();
  const { isPartialKyc, isFullKycCompleted, userId, onSetRefreshProfileFunc } =
    useContext(GlobalContext);
  const profileDetailsData = useAppSelector(
    (state) => state.fetchProfileDetails
  );
  const followUserData = useAppSelector((state) => state.followUserData);

  const blockUserData = useAppSelector((state) => state.blockUserData);

  //User Details
  const [profileApiCalled, setProfileApiCalled] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [profileDetails, setProfileDetails] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  //Follow user
  const [followApiCalled, setFollowApiCalled] = useState(false);

  //block user
  const [blockApiCalled, setBlockApiCalled] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  const onFetchProfileDetails = (profileId) => {
    GetUserTokenStorage().then((token) => {
      Dispatch(
        fetchProfileDetails({
          token: token,
          id: profileId,
        })
      );
      setProfileApiCalled(true);
      setProfileLoading(true);
    });
  };

  useEffect(() => {
    if (profileApiCalled && profileDetailsData?.success) {
      const {
        full_name,
        phone,
        email,
        country,
        city,
        website,
        about,
        user_block,
        msg_blocked,
        msg_disabled,
        followers_disabled,
        following,
      } = profileDetailsData?.data?.user;

      let tempData = {
        full_name,
        phone,
        email,
        country,
        city,
        website,
        about,
      };

      let tempData2 = {
        user_block,
        msg_blocked,
        msg_disabled,
        followers_disabled,
        following,
      };

      const convertedData = {};
      for (const key in tempData2) {
        convertedData[key] = Boolean(parseInt(tempData2[key]));
      }

      Object.assign(tempData, convertedData);

      setProfileDetails(tempData);
      //Setting Data

      setUserDetails(profileDetailsData?.data?.user);
      setProfileApiCalled(false);
      setProfileLoading(false);
      onSetRefreshProfileFunc(false);
    } else if (profileApiCalled && !profileDetailsData?.success) {
      setProfileApiCalled(false);
      setProfileLoading(false);
      ToastMessage("something went wrong");
    }
  }, [profileDetailsData]);

  //Follow user function

  useEffect(() => {
    if (followApiCalled && followUserData.data?.success) {
      ToastMessage(followUserData.data?.message);

      setFollowApiCalled(false);
      onSetRefreshProfileFunc(true);
    } else if (followApiCalled && !followUserData.data?.success) {
      setFollowApiCalled(false);
      ToastMessage(followUserData.data?.message);
    }
  }, [followUserData]);

  const onPressFollow = (props) => {
    if (isPartialKyc || isFullKycCompleted) {
      GetUserTokenStorage().then((token) => {
        Dispatch(
          onFollowUser({
            token: token,
            uid: userId,
            user: props?.userId,
            isFollow: props?.isFollow,
          })
        );
        setFollowApiCalled(true);
      });
    } else {
      navigation.navigate("ProfileVerificationScreen");
    }
  };

  //Other Option
  const onPressMessage = () => {
    navigation?.navigate("ChatBoxScreen", {
      userData: {
        userId: userDetails?.id,
        userName: userDetails?.full_name,
        userProfile: userDetails?.profile_pic,
        isVerified: userDetails?.Kyc,
        isBlocked: false,
      },
    });
  };

  //Block user
  useEffect(() => {
    if (blockApiCalled && blockUserData?.data?.success) {
      onSetRefreshProfileFunc(true);
      setFollowApiCalled(false);
      setBlockLoading(false);
      ToastMessage(blockUserData.data?.message);
    } else if (blockApiCalled && !blockUserData?.data?.success) {
      onSetRefreshProfileFunc(true);
      setFollowApiCalled(false);
      setBlockLoading(false);
      ToastMessage(blockUserData.data?.message);
    }
  }, [blockUserData]);

  const onPressBlockHandler = ({ userId, isBlock }) => {
    if (isPartialKyc || isFullKycCompleted) {
      GetUserTokenStorage().then((token) => {
        Dispatch(onBlockUser({ token: token, user: userId, isBlock: isBlock }));
        setBlockApiCalled(true);
        setBlockLoading(true);
      });
    } else {
      navigation.navigate("ProfileVerificationScreen");
    }
  };
  const onPressReport = (userData) => {
    navigation.navigate("ReportScreen", { userData: userData });
  };

  return {
    onFetchProfileDetails,
    userDetails,
    profileLoading,
    profileDetails,
    onPressMessage,
    onPressFollow,
    onPressBlockHandler,
    onPressReport,
  };
};

export default useUserProfileViewModel;
