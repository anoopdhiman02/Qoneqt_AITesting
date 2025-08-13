import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import { ArrowLeftIcon, CloseIcon, SearchIcon } from "@/assets/DarkIcon";
import useSearchViewModel from "@/structure/viewModels/SearchViewModel";
import SearchPostItemComponent from "@/components/searchScreenComponent/SearchPostItemComponent";
import SearchSuggestItemComponent from "@/components/searchScreenComponent/SearchSuggestItemComponent";
import SearchProfileItemComponent from "@/components/searchScreenComponent/SearchProfileItemComponent";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import SearchHashtagItemComponent from "@/components/searchScreenComponent/SearchHashtagItemComponent";
import { router } from "expo-router";
import DynamicContentModal from "@/components/modal/DynamicContentModal";
import { useAppSelector } from "@/utils/Hooks";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import { useAppStore } from "@/zustand/zustandStore";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getLoggedMobile, storeUserKycStatus } from "@/localDB/LocalStroage";
import { logEvent, useScreenTracking } from "@/customHooks/useAnalytics";
import TrackPlayer from "react-native-track-player";
import { upgradePostData } from "@/redux/slice/post/PostDetailSlice";

const { height, width } = Dimensions.get("screen");

const categories = [
  { id: 1, name: "Profiles" },
  { id: 3, name: "Groups" },
  { id: 2, name: "Posts" },
  { id: 4, name: "#hashtag" },
];

const CategoryItem = ({ item, onPress, isSelected }) => (
  <TouchableOpacity
    onPress={() => onPress(item)}
    style={{
      paddingHorizontal: 10,
      // paddingVertical: 8,
      borderRadius: 20,
      margin: 4,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isSelected
        ? globalColors.slateBlueTint20
        : globalColors.darkOrchidShade80,
      width: 90,
      bottom: 5,
      borderWidth: 1,
      borderColor: globalColors.subgroupBorder,
    }}
  >
    <Text
      style={{
        color: globalColors.neutral10,
        fontSize: 14,
        fontFamily: fontFamilies.regular,
        textAlign: "center",
      }}
    >
      {item.name}
    </Text>
  </TouchableOpacity>
);

const SearchScreen = () => {
  useScreenTracking("SearchScreen");
  // State to show loader at the bottom when fetching more
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { userId, onSetUserFromType, setIsVerified, onSetShowKycModalStore } =
    useAppStore();
  const {
    onSearchInputHandler,
    onClearSearchHandler,
    searchQuery,
    searchLoading,
    postsData,
    groupsData,
    usersData,
    hashtagsList,
    onReachEndHandler,
    selectedCategory,
    setSelectedCategory,
    onSearchData,
    onTapPress,
  } = useSearchViewModel();

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.id);
    onTapPress(category.id);
  };

  const handleGoBack = () => {
    router?.back();
  };

  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();
  const dynamiContentStatus: any = useAppSelector(
    (state) => state?.dynamicContentStatusSlice
  );
  const videoRef = useVideoPlayerStore.getState().videoRef;
  const isVideoPlaying = useVideoPlayerStore.getState().isPlay;
  const myProfileData = useSelector(
    (state: any) => state.myProfileData,
    shallowEqual
  );
  const isLoginMobile = getLoggedMobile();

  useEffect(() => {
    return () => {
      if (videoRef && isVideoPlaying) {
        videoRef.pauseAsync(); // pause when navigating away
      }
    };
  }, []);

  useEffect(() => {
    if (
      dynamiContentStatus &&
      dynamiContentStatus.data &&
      dynamiContentStatus?.data?.status
    ) {
      setStatus(dynamiContentStatus?.data?.status);
    }
  }, [dynamiContentStatus]);

  const onPressPost = (data: any) => {
    logEvent("search_post_click", {
      post_id: data?.id,
      type: "Search Post",
    });

    if (data.file_type == "video") {
      TrackPlayer.stop();
    }

    dispatch(upgradePostData(data));
    router.push({
      pathname: "/post/[id]",
      params: { id: data.id, isNotification: "false" },
    });
  };

  const renderItem = ({ item, index }) => {
    if (selectedCategory === 1) {
      return <SearchProfileItemComponent profileData={item} index={index} />;
    } else if (selectedCategory === 2) {
      return (
        <SearchPostItemComponent
          onPressPost={() => onPressPost(item)}
          post={item}
        />
      );
    } else if (selectedCategory === 3) {
      return <SearchSuggestItemComponent postData={item} index={index} />;
    } else if (selectedCategory === 4) {
      return <SearchHashtagItemComponent item={item} onPressPost={() => onPressPost(item)} />;
    }
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{ height: 100, justifyContent: "center", alignItems: "center" }}
      >
        <Text
          style={{
            color: globalColors.neutral7,
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {`${
            selectedCategory === 1
              ? "No profiles found"
              : selectedCategory === 2
              ? "No Posts found"
              : selectedCategory === 3
              ? "No groups found"
              : "No #hashTag found"
          }`}
        </Text>
      </View>
    );
  };

  const onEndReached = async () => {
    var newData =
      selectedCategory === 1
        ? usersData
        : selectedCategory === 2
        ? postsData
        : selectedCategory === 3
        ? groupsData
        : selectedCategory === 4
        ? hashtagsList
        : [];
    if (newData.length > 3 && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        // Ensure onReachEndHandler is async
        if (onReachEndHandler.constructor.name === "AsyncFunction") {
          await onReachEndHandler();
        } else {
          await new Promise((resolve) => {
            onReachEndHandler();
            setTimeout(resolve, 1000); // fallback wait
          });
        }
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  const onKycPress = async () => {
    const kycData = myProfileData?.data?.kyc_details || {};
    const type = myProfileData?.data?.type || 0;
    const contact = isLoginMobile === 0 ? kycData.temp_email : kycData.phone;
    const kycStatus = myProfileData?.data?.kyc_details?.status || myProfileData?.data?.kyc_status;
    const stepStatus = Number(
      myProfileData?.data?.kyc_details?.finished_step
    );
    const stepType = myProfileData?.data?.kyc_details?.identification_type;
    const handleKycCompletion = async (path, params = {}) => {
      onSetShowKycModalStore(false);
      await storeUserKycStatus(1);
      setIsVerified(1);
      router.push({ pathname: path, params });
    };
    onSetUserFromType(stepType === "google_auth" ? "google" : stepType);
    if (myProfileData?.data?.kyc_details?.id) {
      const path = isLoginMobile === 0 ? "/SelectSocialkyc" : "/KycOnboardHoc";
      switch (kycStatus) {
        case 0: // Need OTP Verification
          onSetUserFromType(stepType === "google_auth" ? "google" : stepType);

          if (stepStatus === 1 || stepStatus === 2) {
            router.push({
              pathname: "/KycOnboardHoc",
              params: { kycStepData: stepStatus },
            });
          } else {
            console.log("contact", userId, contact, stepStatus);
            //@ts-ignore
            dispatch(onKycSendOtp({ userId, contact }));
          }
          break;

        case 6: // Onboarding
          router.push("/KycOnboardHoc");
          break;

        case 2: // Pending
          await handleKycCompletion("/SuccessfullVerificationModal", {
            status: "pending",
          });
          break;

        case -1: // Declined
          router.push({
            pathname: path,
            params: { kycStepData: 0 },
          });
          break;

        case 3: // Rejected
          router.push({
            pathname: "/SuccessfullVerificationModal",
            params: { status: "reject" },
          });
          break;

        case 5: // PAN Pending
          await handleKycCompletion("/SuccessfullVerificationModal", {
            status: "panPending",
          });
          break;

        case 1: // Verified
          await handleKycCompletion("/DashboardScreen");
          break;

        case 4: // Selfie / Additional Step
          await handleKycCompletion("/KycOnboardHoc", {
            kycStepData: myProfileData?.data?.kyc_details?.ask_profile ? 6 : 5,
            type,
          });
          break;
        default:
          router.replace("/DashboardScreen");
      }
    } else {
      // Fallback if not successful → Step-based handling
      let kycStepData = 0;
      if (stepStatus === 1) {
        kycStepData = 1;
      } else if (stepStatus === 2) {
        kycStepData = stepType === "event" ? 3 : 2;
      }

      const stepParams = { kycStepData, type };

      const path = isLoginMobile === 0 ? "/SelectSocialkyc" : "/KycOnboardHoc";
      console.log("stepParams", stepParams);
      router.push({ pathname: path, params: stepParams });
    }
  };

  return (
    <ViewWrapper isBottomTab={true}>
      <View style={{ width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "94%",
            backgroundColor: globalColors.darkOrchidShade80,
            borderRadius: 15,
            paddingHorizontal: 6,
            marginTop: "5%",
            marginHorizontal: "3%",
            borderWidth: 1,
            borderColor: globalColors.subgroupBorder,
          }}
        >
          <TouchableOpacity onPress={handleGoBack}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <SearchIcon style={{ marginRight: 10 }} />
          <TextInput
            autoCapitalize="none"
            value={searchQuery}
            onChangeText={(text) => {
              onSearchInputHandler({ query: text });
            }}
            placeholder="Search"
            returnKeyType="search"
            placeholderTextColor={globalColors.neutral7}
            style={{
              fontSize: 14,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              width: "70%",
              height: 48,
            }}
            onSubmitEditing={(e) => {
              onSearchData(selectedCategory);
            }}
          />
          {searchQuery?.length > 0 ? (
            <TouchableOpacity onPress={onClearSearchHandler}>
              <CloseIcon />
            </TouchableOpacity>
          ) : null}
        </View>
        {dynamiContentStatus?.data?.status === 1 && (
          <DynamicContentModal
            onPressModal={() => {}}
            onPress={() => {
              onKycPress();
            }}
          />
        )}
        <FlatList
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          style={{ marginTop: "5%", height: 48 }}
          data={categories}
          renderItem={({ item }) => (
            <CategoryItem
              item={item}
              onPress={handleCategoryPress}
              isSelected={item.id === selectedCategory}
            />
          )}
          keyExtractor={(item) => item.id?.toString()}
          horizontal
        />
        <View style={{ height: (height * 78) / 100 }}>
          <FlatList
            key={selectedCategory === 3 ? "grid" : "list"}
            bounces={false}
            data={
              selectedCategory === 1
                ? usersData
                : selectedCategory === 2
                ? postsData
                : selectedCategory === 3
                ? groupsData
                : selectedCategory === 4
                ? hashtagsList
                : []
            }
            contentContainerStyle={{ paddingBottom: "30%" }}
            numColumns={selectedCategory === 3 ? 2 : 1}
            style={{ marginBottom: "15%" }}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.3}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={(() => {
              if (isLoadingMore || searchLoading) {
                return (
                  <View
                    style={{
                      alignSelf: "center",
                      backgroundColor: "rgba(0,0,0,0.2)",
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <ActivityIndicator size="large" color={"white"} />
                  </View>
                );
              }
              return null;
            })()}
          />
        </View>
      </View>
    </ViewWrapper>
  );
};

export default SearchScreen;
