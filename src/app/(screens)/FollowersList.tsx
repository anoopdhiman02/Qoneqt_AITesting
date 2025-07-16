import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import ViewWrapper from "../../components/ViewWrapper";
import { VerifiedIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useFollowerListViewModel from "@/structure/viewModels/profile/FollowerListViewModel";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { useDispatch, useSelector } from "react-redux";
import { onGetFollowers } from "@/redux/reducer/Profile/GetFollowerList";
import { useAppStore } from "@/zustand/zustandStore";
import { loadingFollowerState } from "@/redux/slice/profile/GetFollowerListSlice";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const renderShimmer = () => (
  <View style={{ padding: 10, marginBottom: 12 }}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ShimmerPlaceholder style={{ width: 50, height: 50, borderRadius: 25 }} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <ShimmerPlaceholder
          style={{ width: "70%", height: 16, marginBottom: 8 }}
        />
        <ShimmerPlaceholder style={{ width: "50%", height: 14 }} />
      </View>
    </View>
  </View>
);

const FollowersList = () => {
  useScreenTracking("FollowersList");
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const followersListData = useSelector((state: any) => state.getFollowerListData);
  const dispatch = useDispatch();
  const { userId } = useAppStore();


  const { onFetchFollowerList, listLoading } =
    useFollowerListViewModel();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await onFetchFollowerList({ profileId: params?.profileId, lastCount:0 });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const loadMoreData = () => {
    if(followersListData.data.length > 4 && followersListData.lastData != 0 && !followersListData.isLoaded){
      dispatch(loadingFollowerState(true))
     //@ts-ignore
    dispatch(onGetFollowers({ profileId: params?.profileId, userId: userId, lastCount: followersListData.data.length || 0 }));
    }

  };


  return (
    <ViewWrapper>
      <View style={{ flex: 1, width: "90%" }}>
        <GoBackNavigation header="Followers" isDeepLink={true} />
        {isLoading ? (
          <FlatList
            data={[...Array(5)]}
            renderItem={renderShimmer}
            keyExtractor={(_, index) => `shimmer-${index}`}
          />
        ) : (
          <FlatList
            data={followersListData?.data || []}
            keyExtractor={(item,index) =>
              index.toString()
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname:"/profile/[id]",
                    params: { profileId: item?.user_details?.id, id: item?.user_details?.id, isProfile:'true', isNotification: "false" },
                  })
                }
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
                <View style={{ width: "80%", flexDirection: "row" }}>
                  <View style={{ width: "20%", right: "8%" }}>
                    <ImageFallBackUser
                      imageData={item.user_details?.profile_pic}
                      fullName={item.user_details?.full_name}
                      widths={48}
                      heights={48}
                      borders={24}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      width: "60%",
                      left: "5%",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: fontFamilies.regular,
                          color: globalColors.neutralWhite,
                          marginRight: 2,
                        }}
                      >
                        {item?.user_details?.full_name}
                      </Text>
                      {item?.user_details?.kyc_status === 1 && <VerifiedIcon />}
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: fontFamilies.light,
                        color: globalColors.neutralWhite,
                      }}
                    >
                      {item?.user_details?.social_name || item?.user_details?.username}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
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
                  No followers
                </Text>
              )
            }
            onEndReached={loadMoreData}
          />
        )}
      </View>
    </ViewWrapper>
  );
};

export default FollowersList;
