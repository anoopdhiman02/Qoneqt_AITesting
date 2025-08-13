import React, { useEffect, useState, useCallback } from "react";
import { Image } from "expo-image";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import { router } from "expo-router";
import {
  ArrowLeftIcon,
  ArrowUpSmallIcon,
  CloseIcon,
  SearchIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { onFetchChannelList } from "@/redux/reducer/channel/ChannelList";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { showToast } from "@/components/atom/ToastMessageComponent";
import moment from "moment";

import { debounce } from "lodash";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useAppStore } from "@/zustand/zustandStore";
import DynamicContentModal from "@/components/modal/DynamicContentModal";
import EmptyChannelModal from "../(features)/(channel)/component/EmptyChannelModal";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ChannelListScreen = () => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [listData, setListData] = useState([]);
  const [filteredListData, setFilteredListData] = useState([]);
  const [listApiCalled, setListApiCalled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const GetChannelsListResponse = useAppSelector(
    (state) => state.GetChannelsList
  );

  const handleSearchIconPress = () => setIsInputVisible(true);
  const [status, setStatus] = useState(null);

  const dynamiContentStatus: any = useAppSelector(
    (state) => state?.dynamicContentStatusSlice
  );
  useEffect(() => {
    if (
      dynamiContentStatus &&
      dynamiContentStatus.data &&
      dynamiContentStatus?.data?.status
    ) {
      setStatus(dynamiContentStatus?.data?.status);
    }
  }, [dynamiContentStatus]);
  const onFetchChannelListHandler = () => {
    Dispatch(onFetchChannelList({ userId: userId, lastCount: 0, type: 0 }));
    setListApiCalled(true);
    setIsLoading(true);
  };

  useEffect(() => {
    if (listApiCalled && GetChannelsListResponse?.success) {
      setListData(GetChannelsListResponse.data);
      setFilteredListData(GetChannelsListResponse.data);
      setIsLoading(false);
      setListApiCalled(false);
    } else if (listApiCalled && !GetChannelsListResponse?.success) {
      showToast({
        type: "error",
        text1: GetChannelsListResponse?.message || "something went wrong",
      });
      setIsLoading(false);
      setListApiCalled(false);
    }
  }, [GetChannelsListResponse]);

  useEffect(() => {
    onFetchChannelListHandler();
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim() === "") {
        setFilteredListData(listData);
      } else {
        const filtered = listData.filter(
          (item) =>
            item.group.name.toLowerCase().includes(query.toLowerCase()) ||
            item.channel.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredListData(filtered);
      }
    }, 300),
    [listData]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (text: string) => setSearchQuery(text);

  const RenderItemComponent = React.memo(({ data }: any) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/ChannelGroupInfoScreen",
          params: { id: data?.group?.id },
        })
      }
      style={{
        borderRadius: 8,
        borderWidth: 1,
        borderColor: globalColors.neutral3,
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
        marginBottom: 12,
        backgroundColor: "transparent",
      }}
    >
      <View
        style={{ flexDirection: "row", width: "75%", alignItems: "center" }}
      >
        {data?.group?.groupImg.length > 0 ? (
          <Image
            source={{ uri: ImageUrlConcated(data?.group?.groupImg) }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 5,
              backgroundColor: globalColors.neutralWhite,
            }}
            contentFit="contain"
          />
        ) : (
          <Image
            source={require("@/assets/image/emptyGroupIcon.png")}
            style={{ height: 50, width: 50, borderRadius: 5 }}
            contentFit="contain"
          />
        )}

        <View style={{ marginLeft: 10, flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutralWhite,
                flexShrink: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {data.group?.name}
            </Text>
            {/* <View
              style={{
                borderRadius: 16,
                backgroundColor: globalColors.darkOrchidShade80,
                paddingHorizontal: 6,
                paddingVertical: 2,
                marginLeft: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 16,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                {data?.myGroup ? "My Group" : "Following group"}
              </Text>
            </View> */}
          </View>
          <View
              style={{
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 16,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                {data?.myGroup ? "My Group" : "Following group"}
              </Text>
            </View>
          {/* <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.light,
                color: globalColors.neutralWhite,
              }}
            >
              #{data?.channel.name} :
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginLeft: 8,
                width: "60%",
              }}
            >
              {data.last_msg}
            </Text>
          </View> */}
        </View>
      </View>

      <View style={{ width: 60, alignItems: "flex-end" }}>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            lineHeight: 16,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
          }}
        >
          {moment.utc(data.created_at).utcOffset("+05:30").format("h:mm A")}
        </Text>
        {data.seen > 10 ? (
          <View
            style={{
              borderRadius: 16,
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              paddingHorizontal: 6,
              paddingVertical: 2,
              marginTop: 4,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
              }}
            >
              {"+" + data.seen}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  ));

  const renderShimmer = () => (
    <View style={{ padding: 10, marginBottom: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ShimmerPlaceholder
          style={{
            width: 50,
            height: 50,
            borderRadius: 5,
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

  const onPressCreateGroup = () => {
    router.push("/GroupsListScreen");
  };

  const onPressJoinGroup = () => {};

  const handleOnOption = () => {
    setModalVisible(false);
  };

  const HeaderModal = () => {
    return (
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            marginTop: "32%",
            alignItems: "center",
            backgroundColor: "transparent",
            width: "100%",
          }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{
              width: "35%",
              backgroundColor: globalColors.darkOrchidShade60,
              borderRadius: 10,
              right: "25%",
            }}
          >
            <TouchableOpacity
              onPress={handleOnOption}
              style={{
                marginTop: "5%",
                paddingVertical: 5,
                paddingHorizontal: 10,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                  textAlign: "center",
                }}
              >
                My Following
              </Text>
            </TouchableOpacity>
            <View
              style={{
                left: "10%",
                width: "80%",
                backgroundColor: globalColors.darkOrchidShade20,
                height: 0.5,
                marginTop: "3%",
                marginBottom: "-4%",
              }}
            />
            <TouchableOpacity
              onPress={handleOnOption}
              style={{
                marginTop: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                  textAlign: "center",
                }}
              >
                My Group
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  const HeaderSection = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        width: "100%",
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: globalColors.neutral2,
          borderRadius: 8,
          paddingHorizontal: "2%",
          paddingVertical: "2%",
          width: "30%",
          justifyContent: isInputVisible ? "center" : "flex-end",
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
          }}
        >
          All groups
        </Text>
        <ArrowUpSmallIcon />
      </TouchableOpacity>
      {dynamiContentStatus?.data?.status === 1 && (
        <DynamicContentModal onPressModal={() => {}}  onPress={()=>{}} />
      )}
      {isInputVisible ? (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: globalColors.neutral2,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginLeft: 12,
          }}
        >
          <SearchIcon style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Search"
            placeholderTextColor={globalColors.neutral7}
            style={{
              flex: 1,
              color: globalColors.neutralWhite,
              fontFamily: fontFamilies.regular,
              fontSize: 14,
            }}
            autoFocus={true} // Automatically focus when search is opened
          />
          <TouchableOpacity
            onPress={() => {
              setSearchQuery("");
              if (!searchQuery) {
                setIsInputVisible(false);
              }
            }}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={{
            backgroundColor: globalColors.neutral2,
            borderRadius: 8,
            padding: 10,
          }}
          onPress={handleSearchIconPress}
        >
          <SearchIcon />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ViewWrapper>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 10 }}
        >
          <ArrowLeftIcon />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
          }}
        >
          My Groups
        </Text>
      </View>

      {/* HeaderTab and Search Section */}
      {/* <HeaderSection /> */}

      {/* HeaderTab Modal Section */}
      <HeaderModal />

      {/* Channel List */}
      <View
        style={{ width: "90%", flex: 1, marginTop: 16, alignSelf: "center" }}
      >
        {isLoading ? (
          <FlatList
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            renderItem={renderShimmer}
            keyExtractor={(item) => item.toString()}
          />
        ) : (
          <FlatList
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            data={filteredListData}
            renderItem={({ item }) => <RenderItemComponent data={item} />}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              searchQuery ? (
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    textAlign: "center",
                    marginTop: 20,
                  }}
                >
                  No results found
                </Text>
              ) : (
                <EmptyChannelModal
                  onPressCreateGroup={onPressCreateGroup}
                  onPressJoinGroup={onPressJoinGroup}
                />
              )
            }
          />
        )}
      </View>
    </ViewWrapper>
  );
};

export default ChannelListScreen;
