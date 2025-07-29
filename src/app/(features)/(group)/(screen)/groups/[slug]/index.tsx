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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";

import BottomSheetWrap from "../../../../../../components/bottomSheet/BottomSheetWrap";
import {
  AddIcon,
  ArrowLeftBigIcon,
  CheckCircleIcon,
  ClaimGroupIcon,
  ClearChatIcon,
  CopyIcon,
  DeleteAccountIcon,
  GroupIcon,
  InfoIcon,
  MuteIcon,
  OptionsIcon,
  PaperPlaneIcon,
  ReportIcon,
  Share01Icon,
  ShareIcon,
  UnmuteIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useGroupsDetailViewModel from "../../../viewModel/GroupsDetailViewModel";
import GradientText from "@/components/element/GradientText";
import { showToast } from "@/components/atom/ToastMessageComponent";
import Button1 from "@/components/buttons/Button1";
import MyPostContainer from "@/components/element/MyPostContainer";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useAppStore } from "@/zustand/zustandStore";
import usePostCommentsHook from "@/customHooks/PostCommentsHook";
import CommentsBottomSheet from "../../../../(viewPost)/component/CommentsBottomSheet";
import { useChannelStore } from "@/zustand/channelStore";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import PostLoaderComponent from "@/components/element/PostLoaderComponent";
import useCreatePostViewModel from "@/viewModels/CreatePostViewModel";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { MuteGrouprequest } from "@/redux/reducer/group/MuteGroup";
import { useIsFocused } from "@react-navigation/native";
import { setPrefsValue } from "@/utils/storage";
import ViewWrapper from "@/components/ViewWrapper";
import SelectImageMediaSheet from "../../../component/BottomSheet/SelectImageMediaSheet";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import Clipboard from "@react-native-clipboard/clipboard";
import { useVideoPlayerStore } from "@/zustand/VideoPlayerStore";
import MediaPost from "@/components/MediaPost";
import { commentLoading } from "@/redux/slice/post/FetchCommentsSlice";
import { shallowEqual, useSelector } from "react-redux";
import ProgressBar from "@/components/ProgressBar";
import OptionComponent from "../../../component/OptionComponent";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { htmlTagRemove } from "@/utils/htmlTagRemove";
import useKeyboardVisible from "@/app/hooks/useKeyboardVisible";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const groups = () => {
  const { groupId, slug } = useLocalSearchParams();
  useScreenTracking("Group/" + slug);
  const { setPostId, setPostedByUserId } = usePostDetailStore();

  const { setGroupId } = useChannelStore();
  const { userId } = useAppStore();
  const isFocused = useIsFocused();

  const { userGroupRole } = useChannelStore();
  const [loadMore, setLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commentIndex, setCommentIndex] = useState(-1);

  const imageFile = {
    uri: "",
    name: "",
    type: "",
  };
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const {
    onGetGroupDetailsHandler,
    groupDetails,
    onFetchGroupPostHandler,
    feedListData,
    feedLoading,
    joinGroupHandler,
    joinLoading,
    isJoin,
    showExitModal,
    onPressExitGroup,
    onExitOptionHandler,
    onCancelExitGroup,
  }: any = useGroupsDetailViewModel();

  const groupFeedsListData = useAppSelector(
    (state) => state.groupFeedsListData
  );
  const videoRef = useVideoPlayerStore.getState().videoRef;
  const isVideoPlaying = useVideoPlayerStore.getState().isPlay;
  const { updateUserData } = UserStoreDataModel();

  //create home post
  const {
    onChangeCaptionHandler,
    desc,
    onSubmitHomePostHandler,
    onSubmitPostHandler,
    submitLoading,
    imageMediaRef,
    imageFileData,
    onTakeSelfieHandler,
    onPressCameraTwo,
    onPressGallaryTwo,
    setImageFileData,
    setSelectedVideo,
    selectedvideo,
  } = useCreatePostViewModel();
  const submitPostResponse = useSelector((state: any) => state?.createPostData,shallowEqual);
  const keyboardVisible = useKeyboardVisible();
  useEffect(() => {
    const fetchData = async () => {
      if (groupId || slug) {
        setIsLoading(true);
        await onGetGroupDetailsHandler(groupId || slug);
        setIsLoading(false);
      }
    };

    fetchData();
    updateUserData();

    const backHandler = BackHandler.addEventListener(
                  "hardwareBackPress",
                  () => {
                    if(commentIndex != -1){
                      CommentSheetRef.current?.close();
                      return true;
                    }
                    else if(keyboardVisible){
                      Keyboard.dismiss();
                      return true;
                    }
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
      setPrefsValue("notificationInfo", "");
      backHandler.remove();
      if (videoRef) {
        if (isVideoPlaying) {
          videoRef.pauseAsync(); // pause when navigating away
        }
      }
    };
  }, []);

  useEffect(() => {
    if (groupFeedsListData.isUpdated) {
      onFetchGroupPostHandler({ groupId: groupId || slug, lastCount: 0 });
    }
  }, [isFocused,groupFeedsListData.isUpdated]);
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
      // Linking.removeAllListeners("url");
    subscription.remove();
    };
  }, []);

  //comment post data
  const { onFetchCommentHandler, commentData } =
    usePostCommentsHook();

  const OptionRef = useRef(null);
  const muteNotifiRef = useRef(null);
  const ShareGroupRef = useRef(null);
  const DeleteGrpRef = useRef<BottomSheet>(null);
  const MuteUnmuteRef = useRef<BottomSheet>(null);
  //

  //Comment post
  const CommentSheetRef = useRef<BottomSheet>(null);
  const handleSharePress = useCallback(() => {
    ShareGroupRef.current?.expand();
  }, []);

  const HandleThreeOption = useCallback(() => {
    OptionRef.current?.expand();
  }, []);

  const RenderShimmer = () => (
    <View style={{ padding: "2%", marginBottom: 4 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <ShimmerPlaceholder
          style={{
            width: "100%",
            height: 100,
            borderRadius: 3,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: "4%",
          justifyContent: "space-between",
        }}
      >
        <ShimmerPlaceholder
          style={{
            width: "35%",
            height: 25,
            marginRight: "5%",
            borderRadius: 3,
          }}
        />
        <ShimmerPlaceholder
          style={{
            width: "60%",
            height: 25,
            marginRight: "7%",
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );

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
  const onShare = async (slug: any) => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/groups/${slug}`,
        url: `https://qoneqt.com/groups/${slug}`,
        title: "Share group",
      });
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const copyToClipboard = (slug: string) => {
    const profileUrl = `https://qoneqt.com/groups/${slug}`;
    Clipboard.setString(profileUrl);
    setCopiedText(profileUrl);
    showToast({ type: "success", text1: "Link copied to clipboard!" });
  };

  const [copiedText, setCopiedText] = useState("");
  const [select, setSelect] = useState(0);
  const [mute, setMute] = useState(null);
  const [role, setrole] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const [lastCount, setLastCount] = useState(0);

  const MAX_LINES = 3;

  const GroupHeaderComponent = ({
    groupId,
    groupName,
    icon,
    groupDesc,
    userCount,
    category,
    myRole,
    onPressJoin,
    groupType,
    isJoin,
  }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    const toggleCloseModal = () => {
      setModalVisible(false);
    };
    const lines: any = htmlTagRemove(groupDesc) || [];
    return (
      <View
        style={{
          borderRadius: 16,
          backgroundColor: globalColors.neutral2,
          borderColor: globalColors.neutral3,
          borderWidth: 0.5,
          padding: 8,
          marginBottom: "-2.5%",
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              left: "5%",
              backgroundColor: globalColors.neutral3,
              borderRadius: 50,
            }}
          >
            {/* Profile Picture (Small) */}
            <TouchableOpacity onPress={toggleModal}>
              <ImageFallBackUser
                imageData={icon}
                fullName={groupName}
                widths={48}
                heights={48}
                borders={24}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginLeft: "4%",
              flex: 1,
              flexShrink: 1,
            }}
          >
            <Text
              style={{
                fontSize: 19,
                letterSpacing: -0.2,
                lineHeight: 24,
                fontFamily: fontFamilies.bold,
                color: globalColors.neutralWhite,
                flexShrink: 1,
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {groupName}
            </Text>

            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                color: globalColors.neutralWhite,
                marginTop: 4,
                fontFamily: fontFamilies.regular,
              }}
              numberOfLines={2}
            >
              Category : {category}
            </Text>
            <View
              style={{
                borderRadius: 16,
                backgroundColor: globalColors.neutral3,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 6,
                paddingVertical: 2,
                width: "20%",
                marginTop: "2%",
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
                {groupType === 1
                  ? "Public"
                  : groupType === 2
                  ? "Private"
                  : groupType === 3
                  ? "Paid"
                  : null}
              </Text>
            </View>
          </View>
        </View>

        {/* Group Description */}
        <View style={{ marginLeft: "5%", width: "90%" }}>
          <Text
            numberOfLines={isExpanded ? undefined : 2}
            onTextLayout={(e) =>
              setShowReadMore(e.nativeEvent.lines.length > 2)
            }
            style={{
              fontFamily: fontFamilies.regular,
              fontSize: 14,
              color: globalColors.neutral8,
              marginTop: "5%",
              flexShrink: 1,
            }}
          >
            {lines.map((line, index) => (
                    <Text key={index}>
                      {line.trim()}
                    </Text>
                  ))}
          </Text>
        </View>

        {showReadMore ? (
          <TouchableOpacity
            onPress={() => setIsExpanded(!isExpanded)}
            style={{ alignSelf: "flex-start", left: "3%" }}
          >
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 14,
                color: globalColors.darkOrchid,
                marginTop: "1%",
                left: "3%",
              }}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </GradientText>
          </TouchableOpacity>
        ) : null}

        <View
          style={{
            borderTopWidth: 0.5,
            borderColor: "rgba(255, 255, 255, 0.15)",
            marginTop: "5%",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: "5%",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/GroupMembersScreen",
                params: { groupId: groupId },
              })
            }
            style={{
              borderRadius: 8,
              borderColor: "#3d3c4c",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <GroupIcon />
            <GradientText
              style={{
                fontSize: 12,
                color: globalColors.darkOrchid,
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 14 }}>
                {userCount} users
              </Text>
            </GradientText>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/ChannelGroupInfoScreen",
                params: { id: groupId },
              })
            }
            style={{
              flex: 1,
              borderRadius: 8,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderColor: "#3d3c4c",
              borderWidth: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 8,
              paddingVertical: 4,
              marginLeft: 16,
            }}
          >
            <GroupIcon />
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginLeft: 8,
              }}
            >
              {channelCount} Sub-groups
            </Text>
          </TouchableOpacity> */}
        </View>
        {!isJoin && (
          <LinearGradient
            colors={[
              globalColors.darkOrchidShade60,
              "transparent",
              "transparent",
              globalColors.darkOrchidShade60,
            ]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            //@ts-ignore
            style={{
              marginHorizontal: 5,
              marginTop: "6%",
              borderColor: globalColors.darkOrchidShade40,
              borderWidth: 1,
              height: 40,
              width: 100,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => onPressJoin({ groupId: groupId, isJoin: 1 })}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                  marginTop: 5,
                }}
              >
                {"Follow"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </View>
    );
  };

  const options = [
    { label: "8 hours", value: "8_hours" },
    { label: "1 week", value: "1_week" },
    { label: "Always", value: "always" },
  ];
  const renderOption = (option: {
    value: React.Key;
    label:
      | string
      | number
      | boolean
      | React.ReactElement<any, string | React.JSXElementConstructor<any>>
      | Iterable<React.ReactNode>;
  }) => {
    const isSelected = selectedOption === option.value;
    return (
      <TouchableOpacity
        key={option.value}
        style={{
          flexDirection: "row",
          marginTop: "5%",
          borderWidth: 0.3,
          borderColor: globalColors.neutral8,
          width: "100%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 5,
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onPress={() => setSelectedOption(option.value)}
      >
        <Text style={{ color: globalColors.neutral8 }}>{option.label}</Text>
        <Text style={{ color: globalColors.neutral8 }}>{option.label}</Text>
        {isSelected ? (
          <View>
            <CheckCircleIcon />
          </View>
        ) : (
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: globalColors.neutral8,
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    if (groupId || slug) {
      onGetGroupDetailsHandler(groupId || slug);
      //@ts-ignore
      setGroupId(groupId ? groupId?.toString() : slug);
      onFetchGroupPostHandler({ groupId: groupId || slug, lastCount: 0 });
    }
  }, []);

  useEffect(() => {
        if (groupFeedsListData.isUpdated) {
          onFetchGroupPostHandler({ groupId: groupId || slug, lastCount: 0 });
        }
      }, [isFocused,groupFeedsListData.isUpdated]);

  const onPressCommentHandler = (postId: any, userId: any) => {
    Dispatch(commentLoading(true));
    CommentSheetRef.current.expand();
    // setShowCommentModal(true);
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
      if (!loadMore) {
        setLoadMore(true);

        setLastCount((prev) => prev + 5);

        onFetchGroupPostHandler({
          groupId: groupId || slug,
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
  const [categoryApiCalled, setCategoryApiCalled] = useState(false);
  const [cateoryLoading, setcategoryLoading] = useState(false);
  const [mutereq, setmuteReq] = useState(false);
  const Dispatch = useAppDispatch();
  const SubmitMuteRequest = async (mute: number, muteUntill: number) => {

    const result: any = await Dispatch(
      MuteGrouprequest({
        user_id: userId,
        group_id: groupDetails.id,
        mute_status: mute,
        mute_untill: muteUntill,
      })
    );
    setCategoryApiCalled(true);
    setcategoryLoading(true);
    setmuteReq(result);
    return result;
  };

  useEffect(() => {
    try {
      const data = groupDetails?.what_am_i;

      if (data && data.mute !== undefined) {
        setMute(data.mute);
      }
    } catch (err) {
      console.error("Error in useEffect:", err);
    }
  }, [groupDetails, isFocused, mute]);

  useEffect(() => {
    if (SubmitMuteRequest) {
      onGetGroupDetailsHandler(groupId || slug);
    }
  }, [mutereq]);

  useEffect(() => {
    onGetGroupDetailsHandler(groupId || slug);
  }, [isFocused]);
  const handleMuteToggle = async () => {
    if (mute === 1) {
      SubmitMuteRequest(0, select);
      OptionRef.current.close();
    } else {
      muteNotifiRef.current.expand();
    }
  };

  const onChangeSheetIndex = (index: number) => {
    setCommentIndex(index);
  };

  return (
    <ViewWrapper>
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingVertical: "5%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (slug) {
              router.replace("/DashboardScreen");
            } else {
              router.back();
            }
          }}
        >
          <ArrowLeftBigIcon
            style={{
              marginRight: 10,
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: "10%",
            paddingVertical: "2%",
            width: "30%",
            gap: 10,
          }}
        >
          <TouchableOpacity onPress={handleSharePress}>
            <Share01Icon />
          </TouchableOpacity>
          <TouchableOpacity onPress={HandleThreeOption}>
            {/* //three dot */}
            <OptionsIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={{ width: "90%" }}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {isLoading ? (
          <RenderShimmer />
        ) : (
          <GroupHeaderComponent
            myRole={userGroupRole}
            groupId={groupDetails?.id}
            groupDesc={groupDetails?.loop_description}
            groupName={groupDetails?.loop_name}
            groupType={groupDetails?.loop_cat}
            icon={groupDetails?.loop_logo}
            // channelCount={groupDetails?.channels_aggregate?.aggregate?.count || 0}
            userCount={groupDetails?.member_count}
            category={groupDetails?.category?.category_name}
            isJoin={isJoin}
            onPressJoin={({ groupId, isJoin }) =>
              joinGroupHandler({ groupId: groupId, isJoin: isJoin })
            }
          />
        )}

        {/* for admin option */}
        {/* <AdminGroupDetail
          DeleteGrpRef={DeleteGrpRef}
          MuteUnmuteRef={MuteUnmuteRef}
        /> */}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "5%",
          }}
        >
          <Text
            style={{
              fontSize: 20,
              lineHeight: 28,
              fontFamily: "Nunito-Regular",
              color: globalColors.neutral9,
              textAlign: "left",
            }}
          >
            Group feed
          </Text>
        </View>

        {(feedLoading || (groupDetails?.loop_name == undefined)) ? (
          [1, 2, 3].map((index) => <PostLoaderComponent key={index} />)
        ) : groupFeedsListData?.UpdatedData?.length > 0 ? (
          groupFeedsListData?.UpdatedData.map((postData, index) => (
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
            />
          ))
        ) : (
          <View
            style={{
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
        )}
      </ScrollView>

      {/* Custom Exit-group Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showExitModal}
        // onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: globalColors.neutral2,
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontFamily: fontFamilies.bold,
                color: globalColors.neutralWhite,
                marginBottom: 10,
              }}
            >
              Exit group
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Are you sure exit this group?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  minWidth: 100,
                  alignItems: "center",
                  backgroundColor: globalColors.neutral4,
                }}
                onPress={onCancelExitGroup}
              >
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  minWidth: 100,
                  alignItems: "center",
                  backgroundColor: globalColors.neutral4,
                }}
                onPress={() =>
                  onExitOptionHandler({ groupId: groupId || slug, isJoin: 0 })
                }
              >
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontFamily: fontFamilies.medium,
                  }}
                >
                  Exit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <KeyboardAvoidingView
        style={{ marginBottom: 10 }} // Ensure it takes full height
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
      >
        <View>
          {submitPostResponse?.loading && (
                            <ProgressBar progress={submitPostResponse?.progress} isFailed={submitPostResponse?.isFailed} uploadPostAgain={() => onSubmitPostHandler({ groupId: groupId || slug })} />
                          )}
          {!submitPostResponse?.loading && selectedvideo && selectedvideo.length > 0 && (
            <View style={{ position: "relative", marginHorizontal: 15 }}>
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 0,
                  right: 10,
                  zIndex: 1,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 20,
                  alignSelf: "center",
                  padding: 5,
                }}
                onPress={() => {
                  setSelectedVideo([]);
                }}
              >
                <ClearChatIcon />
              </TouchableOpacity>
              <MediaPost
                source={{ uri: selectedvideo[0].uri }}
                type={"video"}
                isHome={true}
                isGroup={false}
              />
            </View>
          )}
          {!submitPostResponse?.loading && imageFileData?.length > 0 && (
            <View
              style={{
                position: "relative",
                marginHorizontal: 15,
                alignSelf: "center",
                zIndex: 1,
                width: Dimensions.get("window").width - 30,
              }}
              pointerEvents="box-none" // 💡 Add this
            >
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  zIndex: 1,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  borderRadius: 20,
                  padding: 5,
                }}
                onPress={() => setImageFileData([])}
              >
                <ClearChatIcon />
              </TouchableOpacity>

              <Image
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 15,
                  alignSelf: "center",
                }}
                source={{
                  uri:
                    imageFileData[0]?.uri || `https://cdn.qoneqt.com/${imageFileData[0]?.uri}`,
                }}
              />
            </View>
          )}

          <View
            style={{
              width: "90%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: "3%",
            }}
          >
            {/* comment acctechment */}
            <TouchableOpacity style={{}} onPress={onPressCameraTwo}>
              <AddIcon />
            </TouchableOpacity>

            <TextInput
              style={{
                fontSize: 14,
                height: 55,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                width: "78%",
                // textAlignVertical: "top",
                borderWidth: 0.6,
                borderColor: globalColors?.neutral4,
                marginLeft: 10,
                paddingTop: "5%",
                alignItems: "center",
                padding: 10,
                justifyContent: "center",
                borderRadius: 15,
              }}
              numberOfLines={6}
              placeholder={"Create Post"}
              placeholderTextColor={globalColors.neutral5}
              value={desc}
              onChangeText={(text) => onChangeCaptionHandler(text)}
            />

            {submitLoading ? (
              <ActivityIndicator
                size={"small"}
                color={globalColors?.darkOrchidShade20}
              />
            ) : (
              <TouchableOpacity
              disabled={submitPostResponse?.loading}
                style={{}}
                onPress={() => {
                  onSubmitHomePostHandler();
                  onSubmitPostHandler({ groupId: groupId || slug });
                }}
              >
                <PaperPlaneIcon />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* comment post  */}
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
      {}
      {/* upload post media */}
      <SelectImageMediaSheet
        imageMediaRef={imageMediaRef}
        imageFileData={imageFile}
        imageData={imageFile}
        onPressCamera={onTakeSelfieHandler}
        onPressGallary={onPressGallaryTwo}
      />

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={ShareGroupRef}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
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
          {/* <ShareLink /> */}
        </View>
      </BottomSheetWrap>
      <BottomSheetWrap snapPoints={["20%", "60%"]} bottomSheetRef={OptionRef}>
      <OptionComponent
        isClaim={groupDetails.user_id == 2 && userId != 2}
          mute={mute}
          onClaimPress={() => {
            router.push({
              pathname: "/ClaimGroupScreen",
              params: { groupid: groupDetails?.id || '' },
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
              params: { groupId: groupId || slug },
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
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <View>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Mute notification
              </Text>
              <View
                style={{
                  padding: "1.5%",
                  borderRadius: 10,
                  backgroundColor: globalColors.slateBlueShade60,
                }}
              >
                <Text
                  style={{
                    marginTop: "2.5%",
                    color: "gray",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  The chat stays muted privately, without alerting others, while
                  you still receive notifications if mentioned.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setSelect(1)}
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: globalColors.neutral8,
              width: "90%",
              borderRadius: 5,
              justifyContent: "space-between",
              padding: "4%",
            }}
          >
            <Text style={{ color: globalColors.neutral9 }}>8 hours</Text>
            {select === 1 ? (
              <CheckCircleIcon />
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: globalColors.neutral5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSelect(2);
            }}
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: "gray",
              width: "90%",
              borderRadius: 5,
              justifyContent: "space-between",
              padding: "4%",
            }}
          >
            <Text style={{ color: globalColors.neutral9 }}>1 week</Text>
            {select === 2 ? (
              <CheckCircleIcon />
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: globalColors.neutral5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelect(3)}
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: "gray",
              width: "90%",
              borderRadius: 5,
              justifyContent: "space-between",
              padding: "4%",
            }}
          >
            <Text style={{ color: globalColors.neutral9 }}>Always</Text>
            {select === 3 ? (
              <CheckCircleIcon />
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: globalColors.neutral5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            )}
          </TouchableOpacity>

          <Button1
            title="Mute"
            onPress={() => {
              SubmitMuteRequest(1, select);
              muteNotifiRef.current.close();
              OptionRef.current.close();
              onGetGroupDetailsHandler(groupId || slug);
            }}
            isLoading={false}
          />

          <TouchableOpacity onPress={() => muteNotifiRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                bottom: "28%",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={DeleteGrpRef}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              textAlign: "center",
              marginBottom: "5%",
            }}
          >
            Delete group
          </Text>
          <View
            style={{
              borderWidth: 0.5,
              padding: "1%",
              borderRadius: 10,
              shadowColor: "#4E4D5B",
              shadowOpacity: 0.2,
              elevation: 1,
              marginBottom: "5%",
            }}
          >
            <Text
              style={{
                color: globalColors.neutral6,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite }}>
                Are you sure you want delete “Crypto Space” group?{" "}
              </Text>
              Losing all data from the feed, announcement and events Sub-groups
              is irreversible and cannot be recovered.
            </Text>
          </View>
          <Button1
            isLoading={false}
            title="Cancel"
            onPress={() => DeleteGrpRef.current.close()}
          />
          <TouchableOpacity onPress={() => DeleteGrpRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                textAlign: "center",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Delete group
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={MuteUnmuteRef}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <View>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Mute notification
              </Text>
              <View
                style={{
                  borderRadius: 10,
                  padding: "1%",
                }}
              >
                <Text
                  style={{
                    marginTop: "2.5%",
                    color: globalColors.neutral8,
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  The chat stays muted privately, without alerting others, while
                  you still receive notifications if mentioned.
                </Text>
              </View>
            </View>
          </View>

          {options.map(renderOption)}
          <Button1
            title="Mute"
            onPress={() => {
              SubmitMuteRequest(1, select);
              MuteUnmuteRef.current.close();
            }}
            isLoading={false}
          />

          <TouchableOpacity onPress={() => MuteUnmuteRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 17,
                color: globalColors.darkOrchid,
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>
    </ViewWrapper>
  );
};
export default groups;
