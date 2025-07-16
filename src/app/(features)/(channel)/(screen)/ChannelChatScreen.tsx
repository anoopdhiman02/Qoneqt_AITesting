import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";

import TextInputComponent from "../../../../components/element/TextInputComponent";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import Button1 from "../../../../components/buttons/Button1";
import { showToast } from "@/components/atom/ToastMessageComponent";
import {
  AddIcon,
  ArrowLeftBigIcon,
  ArrowLeftIcon,
  CameraIcon,
  ChatIcon,
  CloseIcon,
  DeleteAccountIcon,
  DeleteIcon,
  DocumentIcon,
  FlashIcon,
  InfoIcon,
  MicrophoneIcon,
  MuteIcon,
  OptionsIcon,
  PaperPlaneIcon,
  PhotoIcon,
  PlayIcon,
  ReplyMessageIcon,
  UserIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useAppStore } from "@/zustand/zustandStore";
import { R2_PUBLIC_URL } from "@/utils/constants";
import ViewWrapper from "@/components/ViewWrapper";
import moment from "moment";
import ProfileOptionBottomSheet from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";
import { useReportStore } from "@/zustand/reportStore";
import useBlockUserHook from "@/customHooks/BlockUserHook";
import SelectMediaBottomSheet from "@/components/bottomSheet/SelectMediaBottomSheet";
import useUserChatDetailViewModel from "../../(chat)/viewModel/UserChatDetailViewModel";
import useMessageSupabaseViewModel from "../../(chat)/viewModel/MessageSupabaseViewModel";
import { LinearGradient } from "expo-linear-gradient";
import { setPrefsValue } from "@/utils/storage";
import { useDispatch } from "react-redux";
import { onFetchChannelInfo } from "@/redux/reducer/channel/ChannelInfo";
import { useAppSelector } from "@/utils/Hooks";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import { onFetchChannelAllMembers } from "@/redux/reducer/channel/ChannelMembers";
import DeletePostModal from "@/components/modal/DeletePostModal";

const UserChatScreen = () => {
  const { id, from, name, logo, isNotification } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const userId = useAppStore((state) => state.userId);
  const { setReportUserDetails } = useReportStore();
  const dispatch = useDispatch();
  const channelInfoResponse = useAppSelector(
      (state) => state.channelInfoResponse
    );
  // const { supabaseChatUser, supabaseChatUserFetch } = useSupabaseChatUserFetch();
  const {
    fetchChannelMessagesSupabase,
    supabaseChat,
    clearChat,
    deleteMessage,
    updateSeen,
    insertMessage,
  } = useMessageSupabaseViewModel({
    uid: userId,
    receiverId: id,
    messageType: from,
  });

  const { onFetchUserMessageHandler, isLoading, chatUserDetails } =
    useUserChatDetailViewModel();
  const { blockLoading, onPressBlockHandler } = useBlockUserHook();
  const [chatText, setChatText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isPhotoModal, setIsPhotoModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  let r2UploadResult = null;

  const {updateUserData} =UserStoreDataModel()

  const determineAttachmentType = (name: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const audioExtensions = ["mp3", "wav", "ogg"];
    const videoExtensions = ["mp4", "avi", "mov"];

    const extension = name.split(".").pop().toLowerCase();

    if (imageExtensions.includes(extension)) return "image";
    if (audioExtensions.includes(extension)) return "audio";
    if (videoExtensions.includes(extension)) return "video";
    if (
      !imageExtensions.includes(extension) &&
      !audioExtensions.includes(extension) &&
      !videoExtensions.includes(extension)
    ) {
      return "null";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchChannelMessagesSupabase(),
          onFetchUserMessageHandler({ userId, profileId: id }),
          //@ts-ignore
          dispatch(onFetchChannelAllMembers({ userId, channelId: id })),
          //@ts-ignore
          dispatch(onFetchChannelInfo({ userId, channelId: id }))
        ]);
        updateSeen();
      } catch (error) {
        console.error("Error fetching Channel data:", error);
      }
    };
  
    fetchData();
  
    return () => {
      setPrefsValue("notificationInfo", "");
    };
  }, [id]);

  const handleOnPress = (text) => {
    setChatText(text);
  };

  const onMessageSend = async (text: string) => {
    if (text === "" || text === null) {
      showToast({ type: "error", text1: "Please enter message" });
      return;
    }
    insertMessage({message:text, notificationType:"channel_chat"});
    setChatText("");
  };

  //clear chat function
  const clearChatConfirm = () => {
    clearChat();
    setSelectedMessage(null);
    showToast({ type: "success", text1: "Chat Cleared" });
    ClearConRef.current.close();
  };

  //handle long press function for delete and reply message
  const handleLongPressMain = (message: { receiverId: any }, id: any) => {
    setSelectedMessage(id);
    message.receiverId != userId
      ? OptionsSenderRef.current.expand()
      : OptionsMessageRef.current.expand();
  };

  const handleLongPress = (message: { receiverId: any }, id: any) => {
    message.receiverId != userId
      ? setSelectedMessage(id)
      : setSelectedMessage(null);
    message.receiverId != userId ? DeleteMessageRef.current.expand() : null;
  };

  //delete message function
  const handleDeleteMessage = () => {
    if (selectedMessage) {
      deleteMessage(selectedMessage);
      setSelectedMessage(null);
      DeleteMessageRef.current.close();
    }
  };

  //group chats by date
  const groupChatsByDate = (chats: any[]) => {
    const groupedChats = chats.reduce((acc, chat) => {
      const date = new Date(chat.created_at).toDateString(); // Group by date only
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(chat);
      return acc;
    }, {});

    const sortedGroupedChats = Object.entries(groupedChats).map(
      ([date, chats]) => ({
        date: moment(date).format("ddd, DD MMM’YY"),
        chats: (chats as any[]).sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      })
    );
    return sortedGroupedChats;
  };

  const Header = () => {
    return (
      <LinearGradient
        style={{
          overflow: "hidden",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: 5,
          borderBottomWidth: 0.3,
          borderColor: globalColors.neutral7,
        }}
        locations={[0, 0.4, 0.6, 1]}
        colors={[
          globalColors.slateBlueShade20,
          globalColors.slateBlueShade40,
          globalColors.slateBlueShade60,
          globalColors.slateBlueShade80,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: 5,
          }}
        >
          <TouchableOpacity onPress={() => {
            if(isNotification){
              updateUserData();
              router.replace("/DashboardScreen");
            }
            else {
              router.back()
            }
          }}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ right: "30%" }}
            onPress={() => router.push("/channel")}
          >
            {from === "1" &&
              (chatUserDetails?.profile_pic ? (
                <Image
                  contentFit="contain"
                  source={{ uri: R2_PUBLIC_URL + chatUserDetails?.profile_pic }}
                  style={{
                    borderRadius: 5,
                    width: 42,
                    height: 42,
                  }}
                />
              ) : (
                <Image
                  contentFit="contain"
                  style={{
                    borderRadius: 5,
                    width: 42,
                    height: 42,
                  }}
                  source={require("@/assets/image/EmptyProfileIcon.webp")}
                />
              ))}
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "column",
              right: "150%",
            }}
          >
            <View
              style={{
                alignSelf: "stretch",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => router.push("/channel")}>
                <Text
                  style={{
                    fontSize: 16,
                    textTransform: "capitalize",
                    fontFamily: fontFamilies.bold,
                    color: globalColors.neutralWhite,
                    // right: "50%",
                  }}
                >
                  {from === "1"
                    ? chatUserDetails?.full_name
                    : `# ${channelInfoResponse?.data?.channel_name || params?.name || "Qoneqt"}`}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => profileOptionRef.current.expand()}>
            <OptionsIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  };

  const Chats = () => {
    const sortedGroupedChats = groupChatsByDate(supabaseChat);

    return (
      <View
        style={{
          alignSelf: "stretch",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "5%",
        }}
      >
        {sortedGroupedChats.map((group, groupIndex) => (
          <View key={`group-${groupIndex}`} style={{ width: "100%" }}>
            <View
              style={{
                borderRadius: 24,
                backgroundColor: globalColors.neutral4,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1%",
                width: "50%",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  position: "relative",
                  fontSize: 14,
                  lineHeight: 20,
                  fontFamily: fontFamilies.light,
                  color: globalColors.neutralWhite,
                  textAlign: "center",
                }}
              >
                {group.date}
              </Text>
            </View>
            {group.chats.map((item, itemIndex) => (
              <View
                key={`${item._id}-${itemIndex}`} // Combine _id with index for uniqueness
                style={{
                  alignSelf: "stretch",
                  flexDirection: "column",
                  alignItems:
                    item?.sender_id != userId ? "flex-end" : "flex-start",
                  justifyContent:
                    item?.sender_id != userId ? "flex-start" : "center",
                  marginTop: 8,
                }}
              >
                <TouchableOpacity
                  onLongPress={() => {
                    handleLongPress(item, item._id);
                  }}
                  activeOpacity={0.8}
                  delayLongPress={300}
                >
                  <View
                    style={{
                      alignSelf: "stretch",
                      flexDirection: "column",
                      alignItems:
                        item?.sender_id != userId ? "flex-end" : "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        borderTopLeftRadius:
                          item?.sender_id != userId ? 16 : 24,
                        borderTopRightRadius:
                          item?.sender_id != userId ? 16 : 24,
                        borderBottomLeftRadius:
                          item?.sender_id != userId ? 16 : 0,
                        borderBottomRightRadius:
                          item?.sender_id != userId ? 0 : 24,
                        backgroundColor:
                          item?.sender_id != userId
                            ? "#52348f"
                            : "rgba(255, 255, 255, 0.1)",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        padding: 12,
                      }}
                    >
                      <Text
                        style={{
                          position: "relative",
                          fontSize: 14,
                          lineHeight: 20,
                          fontFamily: fontFamilies.light,
                          color: globalColors.neutralWhite,
                          textAlign:
                            item?.sender_id != userId ? "right" : "left",
                        }}
                      >
                        {item?.message}
                      </Text>
                      {item?.fileType == "image" && (
                        <Image
                          contentFit="contain"
                          source={{ uri: R2_PUBLIC_URL + item?.attachment }}
                          style={{ width: 100, height: 100 }}
                        />
                      )}
                      {item?.fileType == "audio" && (
                        <View
                          style={{
                            borderRadius: 24,
                            backgroundColor: "rgba(137, 84, 246, 0.09)",
                            borderStyle: "solid",
                            borderColor: "rgba(226, 122, 248, 0.3)",
                            borderWidth: 0.5,
                            width: 269,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            marginTop: 4,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => console.log("Audio Play Clicked")}
                          >
                            {/* <PlayIcon /> */}
                          </TouchableOpacity>

                          <View
                            style={{
                              borderStyle: "solid",
                              borderColor: "#8954f6",
                              borderRightWidth: 2,
                              width: 2,
                              height: 15,
                              left: -80,
                            }}
                          />
                        </View>
                      )}
                      {/* {item?.fileType == "video" && <VideoMessage />} */}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        marginTop: 4,
                      }}
                    ></View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingHorizontal: 8,
                        paddingVertical: 0,
                        marginTop: 8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: fontFamilies.light,
                          color: globalColors.neutralWhite,
                          textAlign: "right",
                          bottom: "5%",
                        }}
                      >
                        {moment
                          .utc(item?.created_at)
                          .utcOffset("+05:30")
                          .format("h:mm A")}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const AudioMessage = () => {
    return (
      <View
        style={{
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderBottomLeftRadius: 16,
          backgroundColor: "#52348f",
          padding: "10%",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginTop: "5%",
        }}
      >
        <View
          style={{
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            backgroundColor: globalColors.neutralWhite,
            width: "2%",
            height: "100%",
          }}
        />
        <View
          style={{
            flex: 1,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 12,
          }}
        >
          <Text
            style={{
              position: "relative",
              fontSize: 16,
              letterSpacing: -0.2,
              lineHeight: 20,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
            }}
          >
            Pooja
          </Text>

          <View
            style={{
              borderRadius: 16,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <PlayIcon />
              <Text
                style={{
                  position: "relative",
                  fontSize: 10,
                  lineHeight: 13,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                  marginLeft: 8,
                }}
              >
                1:00
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const BottomSearch = () => {
    return (
      <View
        style={{ backgroundColor: "pink", width: "90%", alignSelf: "center" }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "90%",
          }}
        >
          <TextInput
            style={{
              fontSize: 14,
              height: 45,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              width: "100%",
              textAlignVertical: "top",
              borderWidth: 0.6,
              borderColor: globalColors?.neutral4,
              marginRight: "3%",
              alignItems: "center",
              padding: 14,
              justifyContent: "center",
              borderRadius: 15,
              position: "absolute",
              bottom: 10,
            }}
            numberOfLines={6}
            placeholder={"Enter Comment..."}
            placeholderTextColor={globalColors.neutral5}
            onChangeText={(text) => handleOnPress(text)}
            value={chatText}
          />

          {/* <TextInputComponent
            placeHolder="Message"
            style={{ width: "70%",  }}
            // onChangeText={(text) => setChatText(text)}
            value={chatText}
            onChangeText={(text) => handleOnPress(text)}
          /> */}

          {/* <TouchableOpacity style={{}} onPress={() => onMessageSend(chatText)}>
            <MicrophoneIcon />
          
          </TouchableOpacity> */}
        </View>
      </View>

      // <>
      //   {/* {imageFileData && (
      //     <View
      //       style={{
      //         padding: "3%",
      //         flexDirection: "row",
      //         alignItems: "center",
      //         width: "100%",
      //         borderWidth: 1,
      //         borderColor: "#565957",
      //         borderRadius: 10,
      //         marginBottom: "-5%",
      //         marginTop: "2%",
      //       }}
      //     >
      //       <PhotoIcon />
      //       <Text
      //         style={{
      //           color: globalColors.neutralWhite,
      //           fontSize: 12,
      //           marginTop: "1%",
      //           marginLeft: "2%",
      //         }}
      //       >
      //         {imageFileData.name}
      //       </Text>
      //       <View
      //         style={{
      //           flex: 1,
      //           alignItems: "flex-end",
      //         }}
      //       >
      //         <TouchableOpacity onPress={() => setImageFileData(null)}>
      //           <CloseIcon />
      //         </TouchableOpacity>
      //       </View>
      //     </View>
      //   )} */}
      //   <View
      //     style={{
      //       flexDirection: "row",
      //       backgroundColor: "red",
      //       width: "90%",
      //     }}
      //   >

      //     <View style={{}}>
      //
      //     </View>

      //   </View>
      // </>
    );
  };

  const UserProfile = () => {
    return (
      <View
        style={{
          borderRadius: 8,
          borderStyle: "solid",
          borderColor: "#565957",
          borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          padding: "4%",
          marginBottom: "50%",
        }}
      >
        {chatUserDetails?.profile_pic ? (
          <Image
            contentFit="contain"
            source={{ uri: R2_PUBLIC_URL + chatUserDetails?.profile_pic }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        ) : (
          <UserIcon />
        )}
        <View
          style={{
            flexDirection: "column",
            marginLeft: 12,
          }}
        >
          <View
            style={{
              alignSelf: "stretch",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => console.log("Deekshith")}>
              <Text
                style={{
                  fontSize: 14,
                  letterSpacing: -0.1,
                  lineHeight: 20,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                }}
              >
                {chatUserDetails?.full_name}
              </Text>
            </TouchableOpacity>
            <VerifiedIcon />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              @{chatUserDetails?.social_name || chatUserDetails?.username}
            </Text>
            {/*  <View
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: globalColors.neutral7,
                    marginLeft: 8,
                  }}
                />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 8,
              }}
            >
              <FlashIcon />
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.light,
                  color: globalColors.neutralWhite,
                  marginLeft: 4,
                }}
              >
                {chatUserDetails?.points } perks
              </Text>
            </View> */}
          </View>
        </View>
      </View>
    );
  };
  const PhotoRef = useRef<BottomSheet>(null);
  const MoreRef = useRef<BottomSheet>(null);
  const MuteNotifiRef = useRef<BottomSheet>(null);
  const removeMemberRef = useRef<BottomSheet>(null);
  const ClearConRef = useRef<BottomSheet>(null);
  const OptionsSenderRef = useRef<BottomSheet>(null);
  const OptionsMessageRef = useRef<BottomSheet>(null);
  const DeleteMessageRef = useRef<BottomSheet>(null);

  //temp
  const BlockUserRef = useRef<BottomSheet>(null);
  const profileOptionRef = useRef<BottomSheet>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  };
  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [supabaseChat]);

  const onPressReportOption = ({ reportId, name, ProfilePic }) => {
    setReportUserDetails({
      reportId: reportId,
      name: name,
      profilePic: ProfilePic,
      reportType: "profile",
    });
    profileOptionRef.current.close();
    router.push("/ReportProfileScreen");
  };
  const onPressBlockOption = () => {
    profileOptionRef.current.close();
    if(isBlock){
      onPressBlockHandler({ profileId: chatUserDetails?.id, isBlock: 0 });
      setIsBlock(false);
    }
    else {
      BlockUserRef.current.expand();
    }
    
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    BlockUserRef.current.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
    setIsBlock(true);
  };

  const onPressDeleteOption = () => {
    // setDeletePostModal(true);
    profileOptionRef.current.close();
  };

  const deletePostHandler = () => {
    setIsDeleteModal(false);
    profileOptionRef.current.close();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
    >
      <ViewWrapper>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* <TouchableOpacity
            onPress={() => router.back()}
          >
            <ArrowLeftBigIcon style={{ left: "25%" }} />
          </TouchableOpacity> */}
          <Header />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          style={{
            flex: 1,
            width: "90%",
          }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end", // This will push content to the bottom
          }}
          onContentSizeChange={scrollToBottom} // Scroll to bottom when content size changes
          onLayout={scrollToBottom} // Scroll to bottom on initial layout
        >
          <Chats />
        </ScrollView>

        {/* new haroon */}
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "5%",
          }}
        >
          {/* comment acctechment */}
          {/* <TouchableOpacity style={{}} onPress={() => PhotoRef.current.expand()}>
          <AddIcon />
        </TouchableOpacity> */}

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
            // numberOfLines={6}
            placeholder={"Message..."}
            placeholderTextColor={globalColors.neutral5}
            value={chatText}
            onChangeText={(text) => handleOnPress(text)}
            // onSubmitEditing={() => onMessageSend(chatText)}

            // keyboardType={keyboardType ? keyboardType : "default"}
          />

          <TouchableOpacity style={{}} onPress={() => onMessageSend(chatText)}>
            <PaperPlaneIcon />
          </TouchableOpacity>
        </View>
        <ProfileOptionBottomSheet
          profileOptionRef={profileOptionRef}
          screen={"Chat"}
          screen_type={"post"}
          onPressReportOption={() =>
            onPressReportOption({
              reportId: chatUserDetails?.id,
              name: chatUserDetails?.full_name,
              ProfilePic: chatUserDetails?.profile_pic,
            })
          }
          onPressBlockOption={onPressBlockOption}
          onDeletePostOption={onPressDeleteOption}
          userId={userId}
          postedByUserId={chatUserDetails?.id}
          isBlock={isBlock}
        />
        {/* 4  onSelect Block option from profile option sheet*/}
        <BlockUserBottomSheet
          BlockUserRef={BlockUserRef}
          onPressBlockButton={() =>
            onSubmitBlockHandler({ profileId: chatUserDetails?.id, isBlock: 1 })
          }
          loading={blockLoading}
        />

        {/* 1 */}
        <SelectMediaBottomSheet mediaRef={PhotoRef} />

        <Modal
              animationType="slide"
              transparent={true}
              visible={isDeleteModal}
              onRequestClose={() => setIsDeleteModal(false)}
            >
              <DeletePostModal
                setDeletePostModal={setIsDeleteModal}
                deletePostHandler={deletePostHandler}
              />
            </Modal>
      </ViewWrapper>
    </KeyboardAvoidingView>
  );
};

export default UserChatScreen;
