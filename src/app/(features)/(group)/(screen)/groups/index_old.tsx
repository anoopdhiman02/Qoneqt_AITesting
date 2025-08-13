import React, { useRef, useCallback, useState, useEffect } from "react";
import { Image } from "expo-image";
import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import ViewWrapper from "../../../../../components/ViewWrapper";
import BottomSheetWrap from "../../../../../components/bottomSheet/BottomSheetWrap";
import {
  AddIcon,
  ArrowLeftBigIcon,
  ClearChatIcon,
  CopyIcon,
  GroupIcon,
  OptionsIcon,
  PaperPlaneIcon,
  Share01Icon,
  ShareIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useGroupsDetailViewModel from "../../viewModel/GroupsDetailViewModel";
import GradientText from "@/components/element/GradientText";
import { showToast } from "@/components/atom/ToastMessageComponent";
import MyPostContainer from "@/components/element/MyPostContainer";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useAppStore } from "@/zustand/zustandStore";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import CommentsBottomSheet from "../../../(viewPost)/component/CommentsBottomSheet";
import { useChannelStore } from "@/zustand/channelStore";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { LinearGradient } from "expo-linear-gradient";
import PostLoaderComponent from "@/components/element/PostLoaderComponent";
import useCreatePostViewModel from "@/viewModels/CreatePostViewModel";
import SelectImageMediaSheet from "../../component/BottomSheet/SelectImageMediaSheet";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { MuteGrouprequest } from "@/redux/reducer/group/MuteGroup";
import { useIsFocused } from "@react-navigation/native";
import { setPrefsValue } from "@/utils/storage";
import Clipboard from "@react-native-clipboard/clipboard";
import MuteUnmuteComponent from "../../component/MuteUnmuteComponent";
import DeleteGroupComponent from "../../component/DeleteGroupComponent";
import MuteNotificationComponent from "../../component/MuteNotificationComponent";
import OptionComponent from "../../component/OptionComponent";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import { shallowEqual, useSelector } from "react-redux";
import ProgressBar from "@/components/ProgressBar";
import RenderShimmerComponent from "../../component/RenderShimmerComponent";
import LinkView from "../LinkView";
import GroupHeaderComponent from "../GroupHeaderComponent";
import ShareLink from "./ShareLink";
import Track_Player from "@/components/AudioPlayer/TrackPlayer";
import { updateloader } from "@/redux/slice/post/CreatePostSlice";
import { userShowModal } from "@/zustand/AudioPlayerStore";
import CustomAddModal from "../../component/BottomSheet/CustomAddModal";
import ButtonTwo from "@/components/buttons/ButtonTwo";
import { useCameraPermission } from "react-native-vision-camera";
import TrackPlayer, { State } from "react-native-track-player";
import { feedUpdatedData } from "@/redux/slice/group/GroupFeedsListSlice";
import { groupDetailsLoading } from "@/redux/slice/group/GroupDetailsSlice";
import { ResizeMode, Video } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import ExitModalView from "../ExitModalView";
import GroupHeader from "./GroupHeader";
import useKeyboardVisible from "@/app/hooks/useKeyboardVisible";
const { width, height } = Dimensions.get("window");

const groups = () => {
  const { groupId } = useLocalSearchParams();
  const { setPostId, setPostedByUserId } = usePostDetailStore();

  const { setGroupId } = useChannelStore();
  const { userId } = useAppStore();
  const isFocused = useIsFocused();

  const { userGroupRole, refreshGroup } = useChannelStore();
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const groupDetailsData: any = useAppSelector((state) => state.groupDetailsData);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const imageFile = {
    uri: "",
    name: "",
    type: "",
  };

  const groupFeedsListData = useAppSelector(
    (state) => state.groupFeedsListData
  );

  const {
    onGetGroupDetailsHandler,
    groupDetails,
    onFetchGroupPostHandler,
    feedLoading,
    joinGroupHandler,
    isJoin,
    showExitModal,
    onPressExitGroup,
    onExitOptionHandler,
    onCancelExitGroup,
  }: any = useGroupsDetailViewModel();
  const { hasPermission, requestPermission } = useCameraPermission();
  //create home post
  const {
    onChangeCaptionHandler,
    desc,
    onSubmitHomePostHandler,
    submitLoading,
    imageMediaRef,
    imageFileData,
    onTakeSelfieHandler,
    onPressCameraTwo,
    onPressGallaryTwo,
    selectedvideo,
    setSelectedVideo,
    setImageFileData,
    onSubmitPostHandler,
    multiSelectImages,
    downloadedAudio,
    onClearImageHandler,
    setDownloadedAudio,
    Document_Picker,
    setAudio,
    onPressGallary,
  }: any = useCreatePostViewModel();
  const submitPostResponse = useSelector(
    (state: any) => state?.createPostData,
    shallowEqual
  );
  const videoRef = useVideoPlayerStore.getState().videoRef;
  const selectedvideoRef = useRef(null);
  const isVideoPlaying = useVideoPlayerStore.getState().isPlay;
  const createPost = useAppSelector((state) => state.createPostData);
  const { isAddModalVisible, setIsAddModalVisible } = userShowModal();
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const Dispatch = useAppDispatch();
  console.log(groupId , groupDetailsData?.data?.id, groupId != groupDetailsData?.data?.id)
  useEffect(() => {
    const fetchData = async () => {
      if (groupId != groupDetailsData?.data?.id) {
        setIsLoading(true);
        await onGetGroupDetailsHandler(groupId);
        setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      setPrefsValue("notificationInfo", "");
      if (videoRef) {
        if (isVideoPlaying) {
          videoRef.pauseAsync(); // pause when navigating away
        }
      }
    };
  }, []);
  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
  }, [groupDetails]);

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const referCode = url.split("groups/");
      if (referCode[1]) {
        onGetGroupDetailsHandler(referCode[1]);
      }
    };
    // Add event listener for deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check for any deep link URL when the app starts
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

  const handleGalleryPress = async (type: string) => {
    if (!hasPermission) {
      const permission = await requestPermission();
      Linking.openSettings();
      if (!permission) return;
    }
    onPressGallary(type);
  };

  //comment post data
  const { onFetchCommentHandler, commentData } = usePostCommentsHook();

  const OptionRef = useRef(null);
  const muteNotifiRef = useRef(null);
  const ShareGroupRef = useRef(null);
  const DeleteGrpRef = useRef<BottomSheet>(null);
  const MuteUnmuteRef = useRef<BottomSheet>(null);
  const [commentIndex, setCommentIndex] = useState(-1);

  //Comment post
  const CommentSheetRef = useRef<BottomSheet>(null);
  const handleSharePress = useCallback(() => {
    ShareGroupRef.current?.expand();
  }, []);

  const HandleThreeOption = useCallback(() => {
    OptionRef.current?.expand();
  }, []);
  const onShare = async (slug) => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/groups/${slug}`,
        url: `https://qoneqt.com/groups/${slug}`,
        title: "Share group",
      });
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      console.error(error?.message);
    }
  };

  const copyToClipboard = (slug) => {
    const profileUrl = `https://qoneqt.com/groups/${slug}`;
    Clipboard.setString(profileUrl);
    showToast({ type: "success", text1: "Link copied to clipboard!" });
  };

  const [select, setSelect] = useState(0);
  const [mute, setMute] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [lastCount, setLastCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const options = [
    { label: "8 hours", value: "8_hours" },
    { label: "1 week", value: "1_week" },
    { label: "Always", value: "always" },
  ];
  const keyboardVisible = useKeyboardVisible();

  useEffect(() => {
    if (groupId) {
      // Dispatch(groupDetailsLoading(true));
      // onGetGroupDetailsHandler(groupId);
      setGroupId(groupId?.toString());
      Dispatch(feedUpdatedData(groupId != groupDetailsData?.data?.id));
      onFetchGroupPostHandler({ groupId: groupId, lastCount: 0 });
    }
    const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          () => {
            if(keyboardVisible){
              Keyboard.dismiss();
              return true;
            }
            if(commentIndex == -1){
              // setCommentIndex(1);
              CommentSheetRef.current?.close();
              return true;
            }
          }
        );
        return () => {
          backHandler.remove();
        };
  }, []);

  useEffect(() => {
    if (groupFeedsListData.isUpdated) {
      onFetchGroupPostHandler({ groupId: groupId, lastCount: 0 });
    }
  }, [isFocused, groupFeedsListData.isUpdated]);
  const onPressCommentHandler = (postId: any, userId: any) => {
    Dispatch(commentLoading(true));
    CommentSheetRef.current.expand();
    onFetchCommentHandler(postId, 0);
    setPostId(postId);
    setPostedByUserId(userId);
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedEndReached = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (groupFeedsListData?.UpdatedData?.length != 0) {
        setLoadMore(true);

        setLastCount((prev) => prev + 5);

        onFetchGroupPostHandler({
          groupId: groupId,
          lastCount: groupFeedsListData?.UpdatedData?.length,
        });
        // Simulating API call
        setTimeout(() => setLoadMore(false), 1000);
      }
    }, 300);
  }, [isLoading, lastCount]);

  const handleScroll = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
      const paddingToBottom = 20;
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      ) {
        debouncedEndReached();
      }
    },
    [debouncedEndReached]
  );

  const SubmitMuteRequest = (mute, muteUntill) => {
    setMute(mute);
    Dispatch(
      MuteGrouprequest({
        user_id: userId,
        group_id: groupDetailsData?.data.id,
        mute_status: mute,
        mute_untill: muteUntill,
      })
    );
    onGetGroupDetailsHandler(groupDetailsData?.data.id);
  };

  useEffect(() => {
    try {
      if (isFocused) {
        const data = groupDetailsData?.data?.what_am_i;

        if (data && data.mute !== undefined) {
          setMute(data[0].mute);
        }
      }
    } catch (err) {
      console.error("Error in useEffect:", err);
    }
  }, []);

  // useEffect(() => {
  //   onGetGroupDetailsHandler(groupId);
  // }, [isFocused]);

  const handleMuteToggle = async () => {
    if (mute === 1) {
      SubmitMuteRequest(0, select);
      OptionRef.current.close();
    } else {
      muteNotifiRef.current.expand();
    }
  };

  const handleClearAudio = useCallback(async () => {
    try {
      console.log("handleClearAudio");
      setAudio([]);
      setDownloadedAudio([]);

      // Stop TrackPlayer if initialized and ready
      try {
        const state: any = await TrackPlayer.getPlaybackState();
        if (state === State.Playing || state === State.Paused) {
          await TrackPlayer.pause();
        }
      } catch (trackError) {
        console.log("TrackPlayer pause error:", trackError);
        // Continue with other cleanup even if TrackPlayer fails
      }
    } catch (error) {
      console.log("Error clearing audio:", error);
    }
  }, [setAudio, setDownloadedAudio]);

  const renderVideoItem = useCallback(
    ({ item, index }) => {
      return (
        <TouchableOpacity
          key={`video-${index}`}
          activeOpacity={1}
          style={{
            position: "relative",
            marginHorizontal: 15,
            alignSelf: "center",
            zIndex: 1,
            width: 80,
          }}
          onPress={() => setIsVideoVisible(true)}
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
        </TouchableOpacity>
      );
    },
    [selectedvideo]
  );
  const renderAudioItem = useCallback(() => {
    if (!downloadedAudio || downloadedAudio.length === 0) return null;
    return (
      <View
        style={{
          backgroundColor: "#2C2C2C",
          borderRadius: 25,
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 20,
          position: "relative",
        }}
      >
        <View style={{ flex: 1 }}>
          <Track_Player
            Type={downloadedAudio[0]?.uri}
            id="1"
            isPlaying={isPlaying}
            isCreatePost={true}
            setCurrentPlaying={setCurrentPlaying}
          />
        </View>
        <View
          style={{
            right: "10%",
            justifyContent: "center",
            flex: 0.1,
          }}
        >
          <TouchableOpacity onPress={handleClearAudio}>
            <Image
              style={{
                width: 30,
                height: 30,
                tintColor: globalColors.neutralWhite,
              }}
              source={require("../../../../../assets/image/delete.png")}
            />
          </TouchableOpacity>
        </View>
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
            // activeOpacity={1}
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

  const togglePlayPause = async () => {
    try {
      if (selectedvideoRef?.current) {
        if (isPlaying) {
          await selectedvideoRef?.current?.pauseAsync();
        } else {
          await selectedvideoRef?.current?.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const videoView = useCallback(() => {
    if (selectedvideo.length === 0) return null;

    return (
      <TouchableWithoutFeedback
        style={{ width: width * 0.98, height: height }}
        onPress={() => setIsVideoVisible(false)}
      >
        <View
          style={{
            width: width * 0.98,
            height: height,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.bgMedia}>
            <Video
              ref={selectedvideoRef}
              source={{
                uri:
                  typeof selectedvideo[0]?.uri === "string"
                    ? selectedvideo[0].uri.startsWith("file")
                      ? selectedvideo[0].uri
                      : `https://cdn.qoneqt.com/${selectedvideo[0].uri}`
                    : selectedvideo[0].uri,
              }}
              style={{ ...styles.media, height: height * 0.9 }}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              // shouldPlay={false}
              onLoadStart={() => setIsLoading(true)}
              onLoad={() => setIsLoading(false)}
              onError={() => {}}
              onPlaybackStatusUpdate={(status) => {
                if (!status?.isLoaded) return;

                if (
                  status.didJustFinish &&
                  selectedvideoRef.current?.setPositionAsync &&
                  selectedvideoRef.current?.playAsync
                ) {
                  selectedvideoRef.current
                    .setPositionAsync(0)
                    .then(() => selectedvideoRef.current?.playAsync())
                    .then(() => {
                      setIsPlaying(true);
                      // setIsPlay(true);
                    })
                    .catch((e) => console.warn("Replay error:", e.message));
                }
              }}
            />
            {!isPlaying && (
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePlayPause}
              >
                <Ionicons name="play" size={32} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [selectedvideo, togglePlayPause, setIsVideoVisible, isVideoVisible]);

  const onChangeSheetIndex = (index: number) => {
    setCommentIndex(index);
  };

  return (
    <ViewWrapper>
      {/* Header */}
      <GroupHeader
        handleSharePress={handleSharePress}
        HandleThreeOption={HandleThreeOption}
      />
      {/* Main Content */}
      <ScrollView
        style={styles.scrollContainer}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {isLoading ||
        groupDetailsData.isLoaded ||
        groupDetailsData?.data?.id != groupId ? (
          <RenderShimmerComponent />
        ) : (
          <GroupHeaderComponent
            groupId={groupDetailsData?.data?.id || ""}
            groupDesc={groupDetailsData?.data?.loop_description || ""}
            groupName={groupDetailsData?.data?.loop_name || ""}
            groupType={groupDetailsData?.data?.loop_cat || ""}
            icon={groupDetailsData?.data?.loop_logo || ""}
            channelCount={
              groupDetailsData?.data?.channels_aggregate?.aggregate?.count || 0
            }
            userCount={
              groupDetailsData?.data?.member_count || 0
            }
            category={groupDetailsData?.data?.category?.category_name || ""}
            isJoin={isJoin}
            onPressJoin={({ groupId, isJoin }) =>
              joinGroupHandler({ groupId: groupId, isJoin: isJoin })
            }
            setShowReadMore={setShowReadMore}
            setIsExpanded={setIsExpanded}
            showReadMore={showReadMore}
            isExpanded={isExpanded}
          />
        )}

        {/* Group Feed Header */}
        <View style={styles.feedHeaderContainer}>
          <Text style={styles.feedHeaderText}>Group feed</Text>
        </View>

        {/* Feed Content */}
        {(feedLoading || groupFeedsListData?.isLoaded || groupDetailsData?.data?.id != groupId) ? (
          [1, 2, 3].map((index) => <PostLoaderComponent key={index} />)
        ) : groupFeedsListData?.UpdatedData?.length > 0 ? (
          groupFeedsListData?.UpdatedData?.map((postData, index) => (
            <MyPostContainer
              key={index}
              data={postData}
              index={index}
              isGroup={true}
              onPressComment={(postId, userId) =>
                onPressCommentHandler(postId, userId)
              }
              isPlaying={currentPlaying === postData.id}
              setCurrentPlaying={setCurrentPlaying}
              currentUserID={'00000'}
            />
          ))
        ) : (
          <View style={styles.noFeedContainer}>
            <Text style={styles.noFeedText}>No feed</Text>
          </View>
        )}
      </ScrollView>

      {/* Exit Group Modal */}
      <Modal animationType="fade" transparent={true} visible={showExitModal}>
        <ExitModalView onCancelExitGroup={onCancelExitGroup} onPress={()=>onExitOptionHandler({ groupId: groupId, isJoin: 0 })}/>
      </Modal>

      {/* Post Creation Section */}
      <KeyboardAvoidingView
        style={{ marginBottom: 10, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {groupDetailsData?.data?.what_am_i ? (
          <View style={{ width: "100%" }}>
            {submitPostResponse?.loading && (
              <ProgressBar
                progress={submitPostResponse?.progress}
                isFailed={submitPostResponse?.isFailed}
                uploadPostAgain={() =>
                  onSubmitPostHandler({
                    groupId: groupDetailsData?.data.id,
                    isLightMode: true,
                  })
                }
              />
            )}
            {(multiSelectImages?.length > 0 ||
              selectedvideo?.length > 0 ||
              downloadedAudio?.length > 0) &&
              !submitPostResponse?.loading && (
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
                    onSubmitHomePostHandler({
                      groupId: groupDetailsData?.data.id,
                    });
                    onSubmitPostHandler({
                      groupId: groupDetailsData?.data.id,
                      isLightMode: true,
                    });
                    Dispatch(updateloader(true));
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

      {/* Bottom Sheets */}
      <CommentsBottomSheet
        onOpenSheet={CommentSheetRef}
        commentData={commentData}
        onPress={(id) => {
          CommentSheetRef.current.close();
          router.push({
            pathname: "/profile/[id]",
            params: { id: id, isProfile: "false" },
          });
        }}
        setIndex={onChangeSheetIndex}

      />

      <SelectImageMediaSheet
        imageMediaRef={imageMediaRef}
        imageFileData={imageFile}
        imageData={imageFile}
        onPressCamera={onTakeSelfieHandler}
        onPressGallary={onPressGallaryTwo}
      />

      <BottomSheetWrap
        snapPoints={["20%", "30%"]}
        bottomSheetRef={ShareGroupRef}
      >
        <View style={styles.shareSheetContainer}>
          <View style={styles.shareSheetHeader}>
            <Text style={styles.shareSheetTitle}>Share group info</Text>
          </View>
          <LinkView
            groupDetails={groupDetailsData?.data}
            copyToClipboard={copyToClipboard}
          />
        </View>
      </BottomSheetWrap>
      <BottomSheetWrap snapPoints={["20%", "60%"]} bottomSheetRef={OptionRef}>
        <OptionComponent
        isClaim={groupDetailsData?.data.user_id == 2 && userId != 2}
          mute={mute}
          onClaimPress={() => {
            router.push({
              pathname: "/ClaimGroupScreen",
              params: { groupid: groupDetailsData?.data?.id || '' },
            });
            OptionRef.current.close();
          }}
          onExitPress={() => {
            onPressExitGroup();
            OptionRef.current.close();
          }}
          onGroupInfoPress={() => {
            router.push({
              pathname: "/AdminGroupDetail",
              params: { groupId: groupId },
            });
            OptionRef.current.close();
          }}
          onReportPress={() => {
            router.push("/ReportGroupScreen");
            OptionRef.current.close();
          }}
          handleMuteToggle={handleMuteToggle}
        />
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "65%"]}
        bottomSheetRef={muteNotifiRef}
      >
        <MuteNotificationComponent
          select={select}
          setSelect={setSelect}
          onCancelPress={() => {
            muteNotifiRef.current.close();
          }}
          onMutePress={() => {
            SubmitMuteRequest(1, select);
            muteNotifiRef.current.close();
            OptionRef.current.close();
            onGetGroupDetailsHandler(groupId);
          }}
        />
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={DeleteGrpRef}
      >
        <DeleteGroupComponent
          onCancelPress={() => {
            DeleteGrpRef.current.close();
          }}
          onDeletePress={() => {
            DeleteGrpRef.current.close();
          }}
        />
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={MuteUnmuteRef}
      >
        <MuteUnmuteComponent
          options={options}
          onCancelPress={() => {
            MuteUnmuteRef.current.close();
          }}
          onMutePress={() => {
            SubmitMuteRequest(1, select);
            MuteUnmuteRef.current.close();
          }}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      </BottomSheetWrap>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={isVideoVisible}
        onRequestClose={() => {
          setIsVideoVisible(false);
        }}
      >
        {videoView()}
      </Modal>
    </ViewWrapper>
  );
};

const styles = StyleSheet.create({
  bgMedia: {
    width: width * 0.98,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "1%",
  },
  media: {
    width: width * 0.98,
    borderRadius: 11,
  },
  playPauseButton: {
    position: "absolute",
    backgroundColor: globalColors.darkOrchidShade60,
    borderRadius: 24,
    padding: 8,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  GroupName: {
    width: "100%",
    paddingHorizontal: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    alignItems: "center",
  },
  // Scroll Container
  scrollContainer: {
    width: "100%",
    paddingHorizontal: "2%",
  },

  // Feed Header
  feedHeaderContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "5%",
  },
  feedHeaderText: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Nunito-Regular",
    color: globalColors.neutral9,
    textAlign: "left",
  },

  // No Feed
  noFeedContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "50%",
  },
  noFeedText: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: "Nunito-Regular",
    color: globalColors.neutral7,
    textAlign: "center",
  },

  

  // Post Creation Styles
  keyboardAvoidingView: {
    marginBottom: 10,
  },
  mediaPreviewContainer: {
    position: "relative",
    marginHorizontal: 15,
  },
  clearButton: {
    position: "absolute",
    top: 0,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    alignSelf: "center",
    padding: 5,
  },
  imagePreviewContainer: {
    position: "relative",
    marginHorizontal: 15,
    alignSelf: "center",
    zIndex: 1,
    width: width - 30,
  },
  imageClearButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    alignSelf: "center",
  },
  postInputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: "2%",
    paddingVertical: "3%",
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
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
    borderRadius: 15,
  },

  // Share Sheet Styles
  shareSheetContainer: {
    alignItems: "center",
  },
  shareSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  shareSheetTitle: {
    color: globalColors.neutralWhite,
    fontSize: 20,
    textAlign: "center",
  },
});

export default groups;
