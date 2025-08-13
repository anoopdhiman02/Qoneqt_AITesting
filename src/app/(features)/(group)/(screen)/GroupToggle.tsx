import React, { useRef, useCallback, useState, useEffect } from "react";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Share,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  findNodeHandle,
  UIManager,
} from "react-native";
import BlurView from "react-native-blur-effect";
import Track_Player from "@/components/AudioPlayer/TrackPlayer";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import ViewWrapper from "../../../../components/ViewWrapper";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import {
  AddIcon,
  ClearChatIcon,
  CopyIcon,
  PaperPlaneIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useGroupsDetailViewModel from "../viewModel/GroupsDetailViewModel";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useChannelStore } from "@/zustand/channelStore";
import useCreatePostViewModel from "@/viewModels/CreatePostViewModel";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { MuteGrouprequest } from "@/redux/reducer/group/MuteGroup";
import { useIsFocused } from "@react-navigation/native";
import { setPrefsValue } from "@/utils/storage";
import MyGroupContained from "@/components/element/MyGroupContained";
import ButtonTwo from "@/components/buttons/ButtonTwo";
import Clipboard from "@react-native-clipboard/clipboard";
import { userShowPicker } from "@/zustand/ReactionModalStore";
import { onFetchGroupFeeds } from "@/redux/reducer/group/GroupFeedsListApi";
import { userShowModal } from "@/zustand/AudioPlayerStore";
import { useCameraPermission } from "react-native-vision-camera";
import { useAppStore } from "@/zustand/zustandStore";
import PostLoaderComponent from "@/components/PostLoaderComponent";
import { feedUpdatedData } from "@/redux/slice/group/GroupFeedsListSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateloader } from "@/redux/slice/post/CreatePostSlice";
import CustomOptionView from "../component/BottomSheet/CustomOptionView";
import CustomMuteNotificationView from "../component/BottomSheet/CustomMuteNotificationView";
import CustomDeleteGroup from "../component/BottomSheet/CustomDeleteGroup";
import CustomMuteUnMute from "../component/BottomSheet/CustomMuteUnMute";
import CustomAddModal from "../component/BottomSheet/CustomAddModal";
import HeaderGroupView from "../component/HeaderGroupView";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { shallowEqual, useSelector } from "react-redux";
import ProgressBar from "@/components/ProgressBar";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const GroupToggle = () => {
  useScreenTracking("GroupToggle");
  const { id, name } = useLocalSearchParams();
  const { hasPermission, requestPermission } = useCameraPermission();
  const { setShowPicker, showPicker } = userShowPicker();
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const { setGroupId } = useChannelStore();
  const { userId } = useAppStore();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const { isAddModalVisible, setIsAddModalVisible } = userShowModal();
  const [select, setSelect] = useState(0);
  const [mute, setMute] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const groupFeedsListData = useAppSelector(
    (state) => state.groupFeedsListData
  );
  const submitPostResponse = useSelector((state: any) => state?.createPostData,shallowEqual);
  const groupDetailsData: any = useAppSelector((state) => state.groupDetailsData);
  const createPost = useAppSelector((state) => state.createPostData);
  const [postData, setPostData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const OptionRef = useRef(null);
  const muteNotifiRef = useRef(null);
  const ShareGroupRef = useRef(null);
  const DeleteGrpRef = useRef<BottomSheet>(null);
  const MuteUnmuteRef = useRef<BottomSheet>(null);

  const Dispatch = useAppDispatch();
  const flatListRef = useRef<FlatList>(null);
  const scrollOffset = useRef<number>(0);
  const contentHeight = useRef<number>(0);
  const wrapperRef = useRef<View>(null);

  const options = [
    { label: "8 hours", value: "8_hours" },
    { label: "1 week", value: "1_week" },
    { label: "Always", value: "always" },
  ];


  const { onGetGroupDetailsHandler, groupDetails, onPressExitGroup }: any =
    useGroupsDetailViewModel();
  const {
    onChangeCaptionHandler,
    desc,
    imageFileData,
    onPressGallary,
    Document_Picker,
    setDownloadedAudio,

    selectedvideo,
    multiSelectImages,
    onSubmitHomePostHandler,
    onClearImageHandler,
    setSelectedVideo,
    audio,
    downloadedAudio,
    setAudio,
    onSubmitPostHandler,
  }: any = useCreatePostViewModel();
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await onGetGroupDetailsHandler(id);
      }
    };

    fetchData();
    return () => {
      setPrefsValue("notificationInfo", "");
      setIsAddModalVisible(false);
    };
  }, []);

  useEffect(() => {
    try {
        if (groupDetails.what_am_i?.mute) {
          setMute(groupDetails.what_am_i?.mute);
        }
    } catch (err) {
      console.error("err1", err);
    }
  }, [groupDetails, isFocused]);

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const referCode = url.split("groups/?");
      if (referCode[1]) {
        onGetGroupDetailsHandler(referCode[1]);
      }
    };
    const subscription = Linking.addEventListener("url", handleDeepLink);

    const initialUrl = Linking.getInitialURL();
    initialUrl.then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSharePress = useCallback(() => {
    ShareGroupRef.current?.expand();
  }, []);

  const handleGalleryPress = async (type: string) => {
    if (!hasPermission) {
      const permission = await requestPermission();
      Linking.openSettings();
      if (!permission) return;
    }
    onPressGallary(type);
  };

  const HandleThreeOption = useCallback(() => {
    OptionRef.current?.expand();
  }, []);

  const Link = () => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 8,
        borderColor: globalColors.neutral3,
        borderWidth: 1,
        borderStyle: "dashed",
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginTop: "5%",
      }}
    >
      <Text
        style={{
          fontSize: 15,
          lineHeight: 22,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutral7,
          width: "90%",
        }}
      >
        {groupDetails?.slug ? (
          `https://qoneqt.com/groups/${groupDetails?.slug}`
        ) : (
          <Text>Not Found</Text>
        )}
      </Text>
      <TouchableOpacity
        onPress={() => {
          copyToClipboard(`${groupDetails?.slug}`);
        }}
      >
        <CopyIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const copyToClipboard = (slug) => {
    const profileUrl = `https://qoneqt.com/groups/${slug}`;
    Clipboard.setString(profileUrl);
    showToast({ type: "success", text1: "Link copied to clipboard!" });
  };

  useEffect(() => {
    if (id) {
      onGetGroupDetailsHandler(id);
      setGroupId(id?.toString());
      getGroupList();
    }
  }, [id]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    getGroupList();
  };
  useEffect(() => {
    if (groupFeedsListData.isUpdated) {
      loaderGetGroupPost();
    }
  }, [isFocused,groupFeedsListData.isUpdated]);

  const loaderGetGroupPost = async () => {
    var newData = await Dispatch(
      onFetchGroupFeeds({
        userId: userId,
        groupId: id,
        lastCount: 0,
        isLightMode: true,
      })
    );
    const newDataReverse = newData?.payload?.data
      ? [...newData?.payload?.data]
      : [];
    setPostData(newDataReverse);
  }

  const getGroupList = async () => {
    if (groupDetailsData?.data.id !== id) {
      if (userId == null) {
        Dispatch(feedUpdatedData(true));
        var userData = await AsyncStorage.getItem("user-data");
        var userValue = JSON.parse(userData);
        var newData = await Dispatch(
          onFetchGroupFeeds({
            userId: userValue.userId,
            groupId: id,
            lastCount: 0,
            isLightMode: true,
          })
        );
        const newDataReverse = newData?.payload?.data
          ? [...newData?.payload?.data]
          : [];
        setPostData(newDataReverse);
        setIsRefreshing(false);

      } else {

        var newData = await Dispatch(
          onFetchGroupFeeds({
            userId: userId,
            groupId: id,
            lastCount: 0,
            isLightMode: true,
          })
        );
        const newDataReverse = newData?.payload?.data
          ? [...newData?.payload?.data]
          : [];
        setPostData(newDataReverse);
        setIsRefreshing(false);
      }
    }
  };

  const scrollToBottom = () => {
    if (flatListRef && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: false });
      }, 1000);
    }
  };

  const loadeMoreData = async () => {
    if (
      !groupFeedsListData.isLoaded &&
      groupFeedsListData.UpdatedData?.length > 3
    ) {
      Dispatch(feedUpdatedData(true));
      var newValue: any = await Dispatch(
        onFetchGroupFeeds({
          userId: userId,
          groupId: id,
          lastCount: groupFeedsListData.UpdatedData.length,
          isLightMode: true,
        })
      );
      const newDataReverse = newValue?.payload?.data
              ? [...newValue?.payload?.data]
              : [];
            setPostData((prev) => [...prev, ...newDataReverse,]);

      // if (wrapperRef.current) {
      //   const handle = findNodeHandle(wrapperRef.current);
      //   if (handle) {
      //     UIManager.measure(handle, (x, y, width, height) => {
            

      //       // setTimeout(() => {
      //       //   flatListRef.current?.scrollToOffset({
      //       //     offset: scrollOffset.current + newDataReverse.length * 100,
      //       //     animated: false,
      //       //   });
      //       // }, 50);
      //     });
      //   }
      // }
    }
  };

  const SubmitMuteRequest = (mute, muteUntill) => {
    Dispatch(
      MuteGrouprequest({
        user_id: userId,
        group_id: groupDetails.id,
        mute_status: mute,
        mute_untill: muteUntill,
      })
    );
  };

  const handleMuteToggle = () => {
    if (mute === 1) {
      SubmitMuteRequest(0, select);
    } else if (mute === 0 || mute == null) {
      if (MuteUnmuteRef.current) {
        MuteUnmuteRef.current.expand();
      }
    }
  };

  const loaderData = useCallback(() => {
    if (groupDetailsData?.data.id != id) {
      return true;
    } else {
      if (
        groupFeedsListData.isLoaded &&
        groupFeedsListData.UpdatedData?.length == 0
      ) {
        return true;
      }
      return false;
    }
  }, [groupDetailsData, id, groupFeedsListData]);

;

  const renderItem = useCallback(
    ({ item, index }) => {
      return (
        <MyGroupContained
          key={item.id || index}
          data={item}
          index={index}
          isPlaying={currentPlaying === item.id}
          setCurrentPlaying={setCurrentPlaying}
          PostData={postData}
          setPost={setPostData}
        />
      );
    },
    [currentPlaying, setCurrentPlaying]
  );

  const renderVideoItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          key={`video-${index}`}
          style={{
            position: "relative",
            marginHorizontal: 15,
            alignSelf: "center",
            zIndex: 1,
            width: 80,
          }}
          pointerEvents="box-none" // 💡 Add this
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              zIndex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 20,
              padding: 5,
            }}
            onPress={() => setSelectedVideo([])}
          >
            <ClearChatIcon width={15} height={15} />
          </TouchableOpacity>

          <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 5,
              alignSelf: "center",
            }}
            source={{
              uri: "https://play-lh.googleusercontent.com/oB12-6RptJzx0x4fwhQr7CvhlTUSTdU2T9nczVHA9tIqzoOqayWz8mYM74ywoUYjIEo",
            }}
          />
        </View>
      );
    },
    [selectedvideo]
  );
  const renderAudioItem = useCallback(() => {
    if (!downloadedAudio || downloadedAudio.length === 0) return null;

    return (
      <View
        key="audio-player"
        style={{
          position: "relative",

          width: "100%",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: 10,
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            zIndex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 20,
            padding: 5,
          }}
          onPress={() => {
            setDownloadedAudio([]);
          }}
        >
          <ClearChatIcon width={15} height={15} />
        </TouchableOpacity>

        <Track_Player
          Type={downloadedAudio[0]?.uri}
          id={"audio"}
          isPlaying={false}
          setCurrentPlaying={setCurrentPlaying}
          isCreatePost={true}
        />
      </View>
    );
  }, [downloadedAudio, setAudio, Document_Picker, setCurrentPlaying]);

  const renderImageItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          key={`image-${index}`}
          style={{
            position: "relative",
            marginHorizontal: 15,
            alignSelf: "center",
            zIndex: 1,
            width: 80,
          }}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 2,
              right: 2,
              zIndex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 20,
              padding: 5,
            }}
            onPress={() => onClearImageHandler(index)}
          >
            <ClearChatIcon width={15} height={15} />
          </TouchableOpacity>

          <Image
            style={{
              width: 80,
              height: 80,
              borderRadius: 5,
              alignSelf: "center",
            }}
            source={{ uri: item.uri }}
          />
        </View>
      );
    },
    [multiSelectImages, onClearImageHandler]
  );

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "50%",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            lineHeight: 28,
            fontFamily: "Nunito-Regular",
            color: globalColors.neutral7,
            textAlign: "center",
          }}
        >
          No feed
        </Text>
      </View>
    );
  };

  const ListFooterComponent = () => {
    if (groupFeedsListData?.isLoaded) {
      return (
        <View
          style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "50%",
          }}
        >
  <ActivityIndicator size={"large"}
                      color={globalColors?.darkOrchidShade20}/>
        </View>
      );
    }
    return null;
  };
  return (
    <View
      ref={wrapperRef}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LinearGradient
        start={{ x: 0.1, y: 0.5 }}
        end={{ x: -0.1, y: -2 }}
        style={{
          flex: 1,
          width: "100%",
          paddingTop: "10%",
          alignItems: "center",
        }}
        colors={["#020015", "#492E98"]}
      >
        <HeaderGroupView
          name={name}
          handleSharePress={handleSharePress}
          HandleThreeOption={HandleThreeOption}
          backPress={() => router.back()}
        />
        {loaderData() ? (
          <View style={{ width: "90%" }}>
            {[1, 2, 3].map((_, index) => (
              <PostLoaderComponent key={`post-loader-${index}`} />
            ))}
          </View>
        ) : (
          <FlatList
          style={{ width: "90%" }}
          contentContainerStyle={{ flexGrow: 1 }}
          data={postData}
          renderItem={renderItem}
          keyExtractor={(item: any) =>
            item?.id?.toString() || Math.random().toString()
          }
          onEndReached={loadeMoreData}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing} // Add this
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          />
        )}
        <KeyboardAvoidingView
          style={{ marginBottom: 10, width: "100%" }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {groupDetails?.what_am_i ? (
            <View style={{ width: "100%" }}>
              {submitPostResponse?.loading && (
        <ProgressBar progress={submitPostResponse?.progress} isFailed={submitPostResponse?.isFailed} uploadPostAgain={() => onSubmitPostHandler({groupId: groupDetails.id, isLightMode: true})} />
      )}
              {(multiSelectImages?.length > 0 ||
                selectedvideo?.length > 0 ||
                downloadedAudio?.length > 0) && !submitPostResponse?.loading && (
                <View
                  style={{
                    marginBottom: 10,
                    paddingHorizontal: "5%",
                    padding: 5,
                  }}
                >
                  {(multiSelectImages?.length > 0 ||
                    selectedvideo?.length > 0) && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ paddingVertical: 10 }}
                    >
                      {multiSelectImages?.length > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          {multiSelectImages.map((item, index) => (
                            <React.Fragment key={`image-item-${index}`}>
                              {renderImageItem({ item, index })}
                            </React.Fragment>
                          ))}
                        </View>
                      )}
                      {selectedvideo?.length > 0 && (
                        <View
                          style={{
                            flexDirection: "row",
                            marginLeft: multiSelectImages?.length > 0 ? 10 : 0,
                          }}
                        >
                          {selectedvideo.map((item, index) => (
                            <React.Fragment key={`video-item-${index}`}>
                              {renderVideoItem({ item, index })}
                            </React.Fragment>
                          ))}
                        </View>
                      )}
                    </ScrollView>
                  )}

                  {downloadedAudio?.length > 0 && renderAudioItem()}
                </View>
              )}

              <View style={styles.GroupName}>
                <TouchableOpacity
                  onPress={() => {
                    setIsAddModalVisible(true);
                  }}
                >
                    <AddIcon />
                </TouchableOpacity>

                <TextInput
                  style={styles.textInput}
                  numberOfLines={6}
                  placeholder={"Create Post"}
                  placeholderTextColor={globalColors.neutral5}
                  value={desc}
                  onChangeText={(text) => onChangeCaptionHandler(text)}
                />

                {createPost.isLoaded ? (
                  <ActivityIndicator
                    size={"small"}
                    color={globalColors?.darkOrchidShade20}
                  />
                ) : (
                  <TouchableOpacity
                  disabled={submitPostResponse?.loading}
                    onPress={() => {
                      if (!desc) {
                        showToast({
                          type: "error",
                          text1: "Please enter Description",
                        });
                      } else {
                        onSubmitHomePostHandler({
                          groupId: groupDetails.id,
                        });
                        onSubmitPostHandler({ groupId: groupDetails.id, isLightMode: true });
                        Dispatch(updateloader(true));
                      }
                    }}
                  >
                    <PaperPlaneIcon />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <ButtonTwo label="JOIN" style={{ alignSelf: "center" }} />
          )}
        </KeyboardAvoidingView>
        <BottomSheetWrap
          snapPoints={["20%", "20%"]}
          bottomSheetRef={ShareGroupRef}
        >
          <View style={{ alignItems: "center" }}>
            <View style={styles.BottomSheetWrap}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Share group info
              </Text>
            </View>
            <Link />
          </View>
        </BottomSheetWrap>

        <BottomSheetWrap snapPoints={["20%", "70%"]} bottomSheetRef={OptionRef}>
          <CustomOptionView
           isClaim={groupDetailsData?.data.user_id == 2 && userId != 2}
            handleMuteToggle={handleMuteToggle}
            infoIconPress={() => {
              router.push({
                pathname: "/AdminGroupDetail",
                params: {
                  groupId: groupDetails.id || groupDetailsData?.data.id,
                },
              });
              OptionRef.current.close();
            }}
            exitGroup={() => {
              onPressExitGroup();
              OptionRef.current.close();
            }}
            claimGroup={() => {
              router.push({
                pathname: "/ClaimGroupScreen",
                params: { groupid: groupDetails.id },
              });
              OptionRef.current.close();
            }}
            reportGroup={() => {
              router.push("/ReportGroupScreen");
              OptionRef.current.close();
            }}
            mute={mute}
          />
        </BottomSheetWrap>

        <BottomSheetWrap
          snapPoints={["20%", "75%"]}
          bottomSheetRef={muteNotifiRef}
        >
          <CustomMuteNotificationView
            select={select}
            setSelect={setSelect}
            mutePress={() => {
              SubmitMuteRequest(1, select);
              muteNotifiRef.current.close();
            }}
            cancelPress={() => {
              muteNotifiRef.current.close();
            }}
          />
        </BottomSheetWrap>

        <BottomSheetWrap
          snapPoints={["20%", "40%"]}
          bottomSheetRef={DeleteGrpRef}
        >
          <CustomDeleteGroup
            cancelPress={() => DeleteGrpRef.current.close()}
            deletePress={() => DeleteGrpRef.current.close()}
          />
        </BottomSheetWrap>

        <BottomSheetWrap
          snapPoints={["20%", "40%"]}
          bottomSheetRef={MuteUnmuteRef}
        >
          <CustomMuteUnMute
            cancelPress={() => MuteUnmuteRef.current.close()}
            mutePress={() => MuteUnmuteRef.current.close()}
            options={options}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
          />
        </BottomSheetWrap>

        {showPicker && (
          <BlurView
            backgroundColor="rgba(255, 255, 255, 0.9)"
            blurRadius={1.5}
          />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isAddModalVisible}
          onRequestClose={() => {
            setIsAddModalVisible(false);
          }}
        >
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => setIsAddModalVisible(false)}
          >
            <CustomAddModal
              onClose={() => setIsAddModalVisible(false)}
              videoPress={() => {
                hasPermission ? onPressGallary("1") : handleGalleryPress("1");
                setIsAddModalVisible(false);
              }}
              galleryPress={() => {
                hasPermission ? onPressGallary("2") : handleGalleryPress("2");
                setIsAddModalVisible(false);
              }}
              musicPress={() => {
                Document_Picker();
                setIsAddModalVisible(false);
              }}
            />
          </TouchableWithoutFeedback>
        </Modal>
      </LinearGradient>
      <StatusBar style="light" />
    </View>
  );
};
export default GroupToggle;

const styles = StyleSheet.create({
  GroupName: {
    width: "100%",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    alignItems: "center",
  },
  textInput: {
    fontSize: 14,
    height: 55,
    fontFamily: fontFamilies.regular,
    color: globalColors.neutralWhite,
    width: "78%",
    borderWidth: 0.6,
    borderColor: globalColors?.neutral4,
    marginLeft: 10,
    paddingTop: "5%",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
    borderRadius: 15,
  },
  BottomSheetWrap: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
});
