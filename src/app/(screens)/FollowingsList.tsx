import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { ActivityIndicator, BackHandler, FlatList, Text, TouchableOpacity, View } from "react-native";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import ViewWrapper from "../../components/ViewWrapper";
import { VerifiedIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useFollowerListViewModel from "@/structure/viewModels/profile/FollowerListViewModel";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { router, useLocalSearchParams } from "expo-router";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { onFetchFollowings } from "@/redux/reducer/Profile/FetchFollowingList";
import { useAppStore } from "@/zustand/zustandStore";
import { loadingState } from "@/redux/slice/profile/FetchFollowingListSlice";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const renderShimmer = () => (
  <View style={{ padding: 10, marginBottom: 12 }}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ShimmerPlaceholder
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
        }}
      />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <ShimmerPlaceholder
          style={{
            width: "70%",
            height: 16,
            marginBottom: 8,
          }}
        />
        <ShimmerPlaceholder
          style={{
            width: "50%",
            height: 14,
          }}
        />
      </View>
    </View>
  </View>
);

const FollowersList = () => {
  useScreenTracking("FollowingsList");
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [lastCount, setLastCount] = useState(0); // Ensure initial value is 0
  const [isFollowing, setIsFollowing] = useState(true);
  const followingsData = useSelector((state: any) => state.followingList);
  const dispatch = useDispatch();
  const { userId } = useAppStore();

  const handleUnfollow = () => {
    setIsFollowing(false);
  };

  const FollowerItem = ({ data }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname:
              data?.user_id === params?.profileId
                ? "/ProfileScreen"
                : "/profile/[id]",
            params: { profileId: data?.user_id, id: data?.user_id, isProfile:'true', isNotification: "false" },
          });
        }}
        style={{
          borderRadius: 8,
          borderColor: globalColors.neutral3,
          borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          marginTop: "4%",
          width: "100%",
          justifyContent: "space-around",
        }}
      >
        <View style={{ width: "90%", flexDirection: "row" }}>
          <View style={{ width: "20%", right: "8%" }}>
            <ImageFallBackUser
              imageData={data?.user_details?.profile_pic}
              fullName={data?.user_details?.full_name}
              widths={48}
              heights={48}
              borders={24}
            />
          </View>
          <View style={{ flex: 1, flexDirection: "column", width: "60%", left: "5%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
              <Text
                style={{
                  fontSize: 14,
                  letterSpacing: -0.2,
                  lineHeight: 20,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                  marginRight: 2,
                }}
              >
                {data?.user_details?.full_name}
              </Text>
              {data?.user_details?.kyc_status === 1 && <VerifiedIcon />}
            </View>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.light,
                color: globalColors.neutralWhite,
              }}
            >
              {data?.user_details?.social_name || data?.user_details?.username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

const renderFooter=()=>{
 if (!listLoading) return (
      <Text>No Following</Text>
    );
    return (
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
          <ActivityIndicator size={"large"} color={globalColors.warmPink} />
      </View>
    );
}

  const { onFetchFollowingList, followingList, listLoading, hasMoreData } =
    useFollowerListViewModel();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await onFetchFollowingList({
        profileId: params?.profileId,
        lastCount: 0, 
      });
      setIsLoading(false);
    };
    fetchData();

    const backHandler = BackHandler.addEventListener(
              "hardwareBackPress",
              () => {
                if (router.canGoBack()) {
                  router.back();
                }
                else{
                  router.replace("/DashboardScreen");
                }
                return true;
              }
            );
    return () => {
      backHandler.remove();
    };
  }, []); // Trigger fetch whenever lastCount changes

  const loadeMoreData = () => {
    if((followingsData?.data?.length || 0) > 4 && followingsData?.lastData != 0 && !followingsData.isLoaded){
      dispatch(loadingState(true))
      //@ts-ignore
      dispatch(onFetchFollowings({
            userId: userId,
            profileId: Number(params?.profileId),
            lastCount: followingsData?.data?.length || 0,
          }));
    }
  };

  const ListFooterComponent = () =>{
    if(followingsData.isLoaded){
      return(
        <View style={{height: 100}}>
          <ActivityIndicator size={"large"} color={globalColors.warmPink} />
        </View>
      )
    }
    return(
      <View style={{height: 100}}/>
    )
  }
  console.log("followingsData",followingsData?.data)
  return (
    <ViewWrapper>
      <View style={{ flex: 1, width: "90%" }}>
        <GoBackNavigation header="Followings" isDeepLink={true} />
        {isLoading ? (
          <FlatList
            data={[...Array(8)]}
            renderItem={renderShimmer}
            keyExtractor={(_, index) => `shimmer-${index}`}
          />
        ) : (
          <FlatList
            data={followingsData?.data || []}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
            renderItem={({ item }) => <FollowerItem data={item} />}
            contentContainerStyle={{ paddingBottom: 16 }}
            ListEmptyComponent={
              !listLoading && (
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutralWhite,
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  No following
                </Text>
              )
            }
            onEndReached={loadeMoreData} // Trigger when end of list is reached
            onEndReachedThreshold={0.1} // Optional: 50% from the bottom of the list to trigger loading more
            ListFooterComponent={ListFooterComponent}

          />
        )}
      </View>
    </ViewWrapper>
  );
};

export default FollowersList;
