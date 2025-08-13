import React, { useContext, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { fetchProfileDetails } from "../../../../redux/reducer/Profile/FetchProfileDetailsApi";
import GlobalContext from "../../../../contexts/GlobalContext";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { onFollowUser } from "@/redux/reducer/Profile/FollowUser";
import { useAppStore } from "@/zustand/zustandStore";
import { router } from "expo-router";
import { onBlockUser } from "@/redux/reducer/Profile/BlockUser";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ProfileDetailsProps {
  id: number;
  username: string;
  full_name: string;
  social_name: string;
  email: string;
  ccode: number;
  phone: string;
  profile_pic: string;
  kyc_status: number;
  wallet_balance: string;
  seller_balance: string;
  default_currency: string;
  login_otp: string;
  fav_categories: FavCategories;
  followers_count_aggregate: CountAggregate;
  follows_count_aggregate: CountAggregate;
  post_count_aggregate: CountAggregate;
}

interface FavCategories {
  category_ids: string;
}

interface CountAggregate {
  aggregate: Aggregate;
}

interface Aggregate {
  count: number;
}

const useUserProfileViewModel = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const profileDetailResponse = useAppSelector(
    (state) => state.fetchProfileDetails
  );

  //User Details
  const [profileApiCalled, setProfileApiCalled] = useState(false);
  const [userDetails, setUserDetails] = useState<ProfileDetailsProps>();
  const [profileDetails, setProfileDetails] = useState<any>({});
  const [profileLoading, setProfileLoading] = useState(false);
  const [isFollow, setIsFollow] = useState(false);

  const onFetchProfileDetails = async (profileId) => {
    // GetUserTokenStorage().then((token) => {
      setProfileDetails({})
    if (userId == null) {
      var userData = await AsyncStorage.getItem("user-data");
      var userValue = JSON.parse(userData);
      fetchData({ profileId: profileId, userId: userValue.userId });
    } else {
      fetchData({ profileId: profileId, userId: userId });
    }

    // });
  };

  const fetchData = (data) => {
    Dispatch(
      fetchProfileDetails({
        profile: data.profileId,
        userId: data.userId,
      })
    );
    setProfileApiCalled(true);
    setProfileLoading(true);
  };

  useEffect(() => {
    if (profileApiCalled && profileDetailResponse?.success) {
      setProfileDetails(profileDetailResponse?.data);
      if (
        profileDetailResponse?.data?.follow_by_me == 1
      ) {
        setIsFollow(true);
      } else {
        setIsFollow(false);
      }

      setProfileApiCalled(false);
      setProfileLoading(false);
    } else if (profileApiCalled && !profileDetailResponse?.success) {
      setProfileApiCalled(false);
      setProfileLoading(false);
      // ToastMessage("something went wrong");
    }
  }, [profileDetailResponse]);

  //Other Option
  const onPressMessage = (profile) => {
    router.push({
      pathname: "/UserChatScreen",
      params: {
        id: profile?.id,
        from: 1,
        isNotification: "false",
        name: profile?.full_name,
        logo: profile?.profile_pic,
        kyc: profile?.kyc_status || 0,
      },
    });
  };


  const onPressBlockHandler = async ({ profileId, isBlock }) => {
   var blockData: any = await Dispatch(
      onBlockUser({ userId: userId, profileId: profileId, isBlock: isBlock })
    );

    if(blockData?.payload?.success){
      showToast({ type: "success", text1: blockData?.payload?.message });
    }else{
      showToast({ type: "error", text1: blockData?.payload?.message });
    }

  };
  const onPressReport = (userData) => {
    // navigation.navigate('ReportScreen', {userData: userData});
  };

  return {
    onFetchProfileDetails,
    profileDetails,
    userDetails,
    profileLoading,
    isFollow,
    onPressMessage,
    onPressBlockHandler,
    blockLoading: false,
    onPressReport,
    setIsFollow,
  };
};

export default useUserProfileViewModel;
