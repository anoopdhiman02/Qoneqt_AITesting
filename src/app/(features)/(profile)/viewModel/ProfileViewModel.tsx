import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import {
  fetchMyProfileDetails,
  fetchProfileDetails,
} from "../../../../redux/reducer/Profile/FetchProfileDetailsApi";

import { onSaveBasicInfo } from "@/redux/reducer/Profile/saveBasicInfo";

import { router } from "expo-router";
import { useAppStore } from "@/zustand/zustandStore";
import { useProfileDetailsStore } from "@/zustand/ProfileStore";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { onUpdateProfilePicture } from "@/redux/reducer/Profile/UpdateProfilePicture";
import { onSavePersonalDetails } from "@/redux/reducer/Profile/savePersonalDetails";
import { updateProfileData } from "@/redux/slice/profile/ProfileMyDetailsSlice";
import { updateLoginData } from "@/redux/slice/login/LoginUserSlice";
import { useSelector } from "react-redux";
import { setMyUserFeedData } from "@/redux/slice/profile/ProfileMyFeedsSlice";

interface ProfileDetailsProps {
  id: number;
  username: string;
  full_name: string;
  social_name: string;
  email: string;
  ccode: number;
  time: number;
  phone: string;
  profile_pic: string;
  kyc_status: number;
  userBalance: string;
  wallet_balance: string;
  leaderboard: number;
  seller_balance: string;
  default_currency: string;
  login_otp?: string;
  fav_categories: FavCategories;
  about: string;
  website: string;
  country: string;
  city: string;
  follow_by_me: any[];
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

const useProfileViewModel = () => {
  const dispatch = useAppDispatch();
  const { userId } = useAppStore();
  
  // Memoize the profile store functions to prevent unnecessary re-renders
  const profileStore = useProfileDetailsStore();
  const {
    setFullName,
    setProfilePic,
    setUsername,
    setSocialName,
    setPhone,
    setKycStatus,
    setWalletBalance,
    setSellerBalance,
    setDefaultCurrency,
    setAbout,
    setWebsite,
    setCountry,
    setCity,
    setEthereumWalletAddress,
    setFollowersCount,
    setFollowsCount,
    setPostCount,
    setJoinDate,
    country,
    city,
    website,
  } = profileStore;

  // Memoize selectors to prevent unnecessary re-renders
  const profileDetailResponse = useAppSelector(
    (state) => state.fetchProfileDetails
  );
  const myProfileData: any = useAppSelector((state) => state.myProfileData);
  const updatePicture = useAppSelector(
    (state) => state.updateProfilePictureData
  );
  const userData = useSelector((state: any) => state?.loginUserApi);
  const postDetailResponse = useAppSelector((state) => state.myFeedData);

  // State management
  const [profileApiCalled, setProfileApiCalled] = useState(false);
  const [profileDetails, setProfileDetails] = useState<ProfileDetailsProps>();
  const [profileLoading, setProfileLoading] = useState(false);
  const [basicLoading, setBasicLoading] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [picApiCalled, setPicApiCalled] = useState(false);
  const [picLoading, setPicLoading] = useState(false);

  // Memoize the fetch profile function
  const onFetchProfileDetails = useCallback(() => {
    dispatch(
      fetchProfileDetails({
        profile: userId,
        userId: userId,
      })
    );
    setProfileApiCalled(true);
    setProfileLoading(true);
  }, [dispatch, userId]);

  // Initialize profile store values only once
  useEffect(() => {
    setWebsite(website);
    setCountry(country);
    setCity(city);
  }, []); // Remove dependencies to run only once

  // Memoize profile data processing
  const processedProfileData = useMemo(() => {
    if (!profileDetailResponse?.success || !profileDetailResponse?.data) {
      return null;
    }

    const {
      followers_count_aggregate,
      follows_count_aggregate,
      post_count_aggregate,
    }: any = profileDetailResponse.data;

    return {
      profileData: profileDetailResponse.data,
      counts: {
        followers: followers_count_aggregate?.aggregate?.count || 0,
        follows: follows_count_aggregate?.aggregate?.count || 0,
        posts: post_count_aggregate?.aggregate?.count || 0,
      }
    };
  }, [profileDetailResponse]);

  // Handle profile response with memoized data
  useEffect(() => {
    if (profileApiCalled) {
      if (processedProfileData) {
        const { profileData, counts }: any = processedProfileData;
        
        setProfileDetails(profileData);
        
        // Batch all store updates
        setFullName(profileData.full_name);
        setProfilePic(profileData.profile_pic);
        setUsername(profileData.username);
        setJoinDate(profileData.joinDate);
        setPhone(profileData.phone);
        setKycStatus(profileData.kyc_status);
        setWalletBalance(profileData.wallet_balance);
        setSellerBalance(profileData.seller_balance);
        setDefaultCurrency(profileData.default_currency);
        setAbout(profileData.about);
        setWebsite(profileData.website);
        setCountry(profileData.country);
        setCity(profileData.city);
        setEthereumWalletAddress(profileData.ethureum_wallet_address);
        setFollowersCount(counts.followers);
        setFollowsCount(counts.follows);
        setPostCount(counts.posts);
        setSocialName(profileData.social_name);

        setProfileApiCalled(false);
        setProfileLoading(false);
      } else if (profileDetailResponse && !profileDetailResponse.success) {
        setProfileApiCalled(false);
        setProfileLoading(false);
      }
    }
  }, [profileApiCalled, processedProfileData, profileDetailResponse]);

  // Memoize callback functions
  const onPressProfilePic = useCallback(() => {
    // Implementation here
  }, []);

  const onPressFollower = useCallback(({ profileId }: { profileId: string }) => {
    router.push({
      pathname: "/FollowersList",
      params: { profileId },
    });
  }, []);

  const onPressFollowing = useCallback(({ profileId }: { profileId: string }) => {
    router.push({
      pathname: "/FollowingsList", 
      params: { profileId },
    });
  }, []);


  // Memoize picture update handler
  const onUpdatePictureHandler = useCallback(async ({ data }: { data: any }) => {
    try{
    setPicLoading(true);
    var updatePictureData =  await dispatch(onUpdateProfilePicture({ userId, file: data }));
    setPicLoading(false);
    if (updatePictureData?.payload?.success) {
      showToast({ text1: updatePictureData?.payload?.message, type: "success" });
      // Update profile data
      const updatedProfileData = {
        ...myProfileData,
        data: {
              ...myProfileData.data,
              profile_pic: updatePictureData?.payload.data,
        },
      };

      // Update login data
      const updatedLoginData = {
        ...userData,
        data: {
          ...userData.data,
          profile_pic: updatePictureData?.payload.data,
        },
      };

      // Update profile screen data
      const updateProfileScreenData = postDetailResponse.updatedData.map(
        (item: any) => ({
          ...item,
          post_by: {
            ...item.post_by,
            profile_pic: updatePictureData?.payload.data,
          },
        })
      );
      router.back();
      // Batch dispatch updates
      dispatch(updateProfileData(updatedProfileData));
      dispatch(updateLoginData(updatedLoginData));
      dispatch(setMyUserFeedData(updateProfileScreenData));
    }
    else {
      showToast({type: "error", text1: updatePictureData?.payload?.message || 'Profile image not update!'})
    }

    // setPicApiCalled(true);
  }
  catch(err){
    setPicLoading(false);
    showToast({type: "error", text1: err?.message || 'Profile image not update!'})
  }
    
  }, [dispatch, userId, myProfileData, userData, postDetailResponse]);

  // Memoize basic info update
  const onUpdateBasicInfo = useCallback(async ({ 
    fname, 
    lname, 
    socail, 
    headline 
  }: { 
    fname?: string; 
    lname?: string; 
    socail?: string; 
    headline?: string; 
  }) => {
    try{
    setBasicLoading(true);
   var saveBasicInfoData: any = await dispatch(
      onSaveBasicInfo({
        firstName: fname || "",
        lastName: lname || "",
        headline: headline || "",
        socialName: socail || "",
        userId,
      })
    );
    if(saveBasicInfoData?.payload?.success){
      setBasicLoading(false);
      const updatedProfileDatas: any = {
        ...myProfileData,
        data: {
              ...myProfileData.data,
              about: headline,
              social_name: socail,
              full_name: fname + " " + lname,
        },
      };
      dispatch(updateProfileData(updatedProfileDatas));
      showToast({ type: "success", text1: saveBasicInfoData?.payload?.message });
      router.back();
    }
    else{
      setBasicLoading(false);
      showToast({ type: "error", text1: saveBasicInfoData?.payload?.message });
    }
    }catch(error){
      console.log("error", error);
      setBasicLoading(false);
    }    
  }, [dispatch, userId]);


  // Memoize contact info update
  const onUpdateContactInfo = useCallback(async ({  
    city, 
    country, 
    website 
  }: {  
    city?: any; 
    country?: any; 
    website?: any; 
  }) => {
    try {
      const contactUpdate = await dispatch(
        onSavePersonalDetails({
          userId,
          city,
          country,
          website,
        })
      );
      
      if (contactUpdate?.payload?.success) {
        showToast({ text1: contactUpdate.payload.message, type: "success" });
        router.back();
        dispatch(fetchMyProfileDetails({ profile: userId, userId }));
      } else {
        showToast({ text1: contactUpdate?.payload?.message, type: "error" });
      }
    } catch (error) {
      showToast({ text1: "An error occurred while updating contact info", type: "error" });
    }
  }, [dispatch, userId]);

  // Return memoized object to prevent unnecessary re-renders
  return useMemo(() => ({
    onFetchProfileDetails,
    onUpdateBasicInfo,
    onUpdateContactInfo,
    contactLoading,
    basicLoading,
    profileDetails,
    onPressProfilePic,
    onPressFollower,
    onPressFollowing,
    onUpdatePictureHandler,
    picLoading,
  }), [
    onFetchProfileDetails,
    onUpdateBasicInfo,
    onUpdateContactInfo,
    contactLoading,
    basicLoading,
    profileDetails,
    onPressProfilePic,
    onPressFollower,
    onPressFollowing,
    onUpdatePictureHandler,
    picLoading,
  ]);
};

export default useProfileViewModel;