import { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Keyboard,
} from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import Button1 from "../../../../components/buttons/Button1";
import { showToast } from "@/components/atom/ToastMessageComponent";
import {
  AddIcon,
  ArrowLeftBigIcon,
  CloseIcon,
  OptionsIcon,
  PaperPlaneIcon,
  PlayIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import { useAppStore } from "@/zustand/zustandStore";
import { R2_PUBLIC_URL } from "@/utils/constants";
import { uploadToR2 } from "@/utils/r2Uploads";
import ViewWrapper from "@/components/ViewWrapper";
import useMessageSupabaseViewModel from "../viewModel/MessageSupabaseViewModel";
import useUserChatDetailViewModel from "../viewModel/UserChatDetailViewModel";
import moment from "moment";
import {
  ChatOptionBottomSheet,
  DeleteMessageBottomSheet,
} from "@/components/bottomSheet/ProfileOptionBottomSheet";
import BlockUserBottomSheet from "@/components/bottomSheet/BlockUserBottomSheet";
import { useReportStore } from "@/zustand/reportStore";
import useBlockUserHook from "@/customHooks/BlockUserHook";
import SelectMediaBottomSheet from "@/components/bottomSheet/SelectMediaBottomSheet";
import { ImageFallBackUser } from "@/utils/ImageUrlConcat";
import { setPrefsValue } from "@/utils/storage";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
import { useIsFocused } from '@react-navigation/native';
import { useScreenTracking } from "@/customHooks/useAnalytics";
const { width, height } = Dimensions.get("window");

const UserChatScreen = () => {
  useScreenTracking("UserChatScreen");
  const { id, from, name, logo, isNotification } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const userId = useAppStore((state) => state.userId);
  const { setReportUserDetails } = useReportStore();
  const {
    fetchMessagesSupabase,
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

  const {
    onFetchUserMessageHandler,
    chatUserDetails,
    onPressGallary,
    onCaptureImage,
    imageData,
    imageFileData,
    setImageFileData,
    setImageData,
    onTakeSelfieHandler,
  } = useUserChatDetailViewModel();

  const { blockLoading, onPressBlockHandler } = useBlockUserHook();
  const [chatText, setChatText] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const isFocused = useIsFocused()

  let r2UploadResult = null;

  const determineAttachmentType = (name: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const audioExtensions = ["mp3", "wav", "ogg"];
    const videoExtensions = ["mp4", "avi", "mov"];

    const extension = name ?  name.split(".").pop().toLowerCase() :'jpg';

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
    updateUserData();
  }, []);

  useEffect(() => {
    fetchMessagesSupabase();
    updateSeen();
  }, [id]);

  useEffect(() => {
    if(isFocused){
      onFetchUserMessageHandler({ userId: userId, profileId: id });
    }
    return () => {
      setPrefsValue("notificationInfo", "");
    };
  }, [id, isFocused]);

  const handleOnPress = (text) => {
    setChatText(text);
  };

  const onSend = useCallback((messages = []) => {
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages)
    // );
  }, []);

  const onMessageSend = async (text: string) => {
    const message = text;
    setChatText("");
    if ((text === "" || text === null) && !imageData) {
      showToast({ type: "error", text1: "Please enter message" });
      return;
    }
    // comment media file
    if (imageData) {
      const attachmentType = determineAttachmentType(imageFileData.name);
      if (attachmentType != "image") {
        showToast({ type: "error", text1: "Please select proper image" });
        return null;
      }
      try {
        r2UploadResult = await uploadToR2(
          imageFileData,
          "chat",
          "message/" + userId + "-" + id + "/"
        );
      } catch (error) {
        console.error("Error uploading to R2:", error);
        return null;
      }
      insertMessage({message, attach: r2UploadResult.key, type: "image", notificationType:"personal_chat"});
      setImageFileData(null);
      setImageData("");
    } else {
      insertMessage({message:text, notificationType:"personal_chat", attach:''});
      setChatText("");
    }
  };

  const handleRemoveImage = () => {
    setImageData("");
    setImageFileData(null);
  };

  //clear chat function
  const clearChatConfirm = () => {
    //@ts-ignore
    clearChat({ uids: userId, receiverIds: id });
    setSelectedMessage(null);
    showToast({ type: "success", text1: "Chat Cleared" });
    ClearConRef.current.close();
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
        date,
        chats: (chats as any[]).sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      })
    );
    return sortedGroupedChats;
  };
  const profilePress = () => {
    chatUserDetails?.id === userId
      ? router.push({
          pathname: "/ProfileScreen",
          params: { profileId: chatUserDetails?.id },
        })
      : router.push({
          pathname: "/profile/[id]",
          params: { id: chatUserDetails?.id, isProfile: "true", isNotification: "false" },
        });
  };

  const Header = () => {
    // console.log("chatUserDetails", chatUserDetails);
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 10,
          paddingHorizontal: 15,
          width: "90%",
          left: "3%",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            // marginTop: "3%",
          }}
          disabled={chatUserDetails?.id == undefined}
          onPress={() => {
            profilePress();
          }}
        >
          <TouchableOpacity
          disabled={chatUserDetails?.id == undefined}
            onPress={() => {
              profilePress();
            }}
          >
            <ImageFallBackUser
              imageData={chatUserDetails?.profile_pic}
              fullName={
                from === "1" ? chatUserDetails?.full_name || "Delete User" : `# ${params?.name}`
              }
              widths={35}
              heights={35}
              borders={16}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
              marginLeft: 8,
              marginRight: 3,
            }}
          >
            {from === "1" ? chatUserDetails?.full_name || "Delete User" : `# ${params?.name}`}
          </Text>
          {chatUserDetails?.kyc_status == 1 && <VerifiedIcon />}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => profileOptionRef.current.expand()}>
          <OptionsIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
    );
  };

  const Chats = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleModal = (imageUri) => {
      if (imageUri) {
        setSelectedImage(imageUri);
        setModalVisible(true);
      }
    };

    const toggleCloseModal = () => {
      setModalVisible(false);
      setSelectedImage(null);
    };

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
                backgroundColor: globalColors.neutral5,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2%",
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
                key={`${item._id}-${itemIndex}`} // Ensure uniqueness
                style={{
                  alignSelf: "stretch",
                  flexDirection: "column",
                  alignItems:
                    item?.receiverId != userId ? "flex-end" : "flex-start",
                  justifyContent: "center",
                  marginTop: 8,
                }}
              >
                <TouchableOpacity
                  onLongPress={() => handleLongPress(item, item._id)}
                  activeOpacity={0.8}
                  delayLongPress={300}
                >
                  <View
                    style={{
                      borderRadius: 16,
                      backgroundColor:
                        item?.receiverId != userId
                          ? "#52348f"
                          : "rgba(255, 255, 255, 0.1)",
                      padding: 12,
                    }}
                  >
                    {item?.message && (
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 20,
                          color: "#fff",
                          textAlign:
                            item?.receiverId != userId ? "right" : "left",
                        }}
                      >
                        {item?.message}
                      </Text>
                    )}

                    {/* Image Preview - Click to Expand */}
                    {item?.fileType === "image" && (
                      <TouchableOpacity
                        onPress={() =>
                          toggleModal(R2_PUBLIC_URL + item?.attachment)
                        }
                      >
                        <Image
                          source={{ uri: R2_PUBLIC_URL + item?.attachment }}
                          // style={{ width: 100, height: 100, borderRadius: 10 }}
                          style={{
                            width: width * 0.4,
                            height: height * 0.2,
                            resizeMode: "contain",
                            borderRadius: 5,
                          }}
                          contentFit="cover"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Timestamp */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      margin: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#fff",
                        textAlign: "right",
                      }}
                    >
                      {moment
                        .utc(item?.created_at)
                        .utcOffset("+05:30")
                        .format("h:mm A")}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}

            {/* Fullscreen Image Modal */}
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={toggleCloseModal}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.9)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={toggleCloseModal}
                activeOpacity={1}
              >
                {selectedImage && (
                  <Image
                    source={{ uri: selectedImage }}
                    style={{
                      width: width * 0.9,
                      height: height * 0.7,
                      resizeMode: "contain",
                      borderRadius: 10,
                    }}
                  />
                )}
              </TouchableOpacity>
            </Modal>
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
        <TouchableOpacity onPress={() => console.log("image")}>
          {/* {chatUserDetails?.profile_pic ? (
            <Image
              source={{ uri: R2_PUBLIC_URL + chatUserDetails?.profile_pic }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          ) : (
            <UserIcon />
          )} */}

          <ImageFallBackUser
            widths={40}
            imageData={chatUserDetails?.profile_pic}
            fullName={chatUserDetails?.full_name}
            heights={40}
            borders={20}
          />
        </TouchableOpacity>
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
  const { updateUserData } = UserStoreDataModel();
  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: false });
  };

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
    BlockUserRef.current.expand();
  };

  const onSubmitBlockHandler = ({ profileId, isBlock }) => {
    BlockUserRef.current.close();
    onPressBlockHandler({ profileId: profileId, isBlock: isBlock });
  };

  const backPre = () => {
    if (isNotification == "true") {
      router.replace("/DashboardScreen");
    } else {
      router.back();
    }
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
          <TouchableOpacity
            onPress={() => backPre()}
            // style={{ right: "45%", marginTop: "3%" }}
          >
            <ArrowLeftBigIcon style={{ left: "25%" }} />
          </TouchableOpacity>
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
          {imageData ? (
            <TouchableOpacity
              style={{}}
              onPress={() => PhotoRef.current.expand()}
            >
              <View style={styles.imageWrapper}>
                <Image source={{ uri: imageData }} style={styles.image} />
                <TouchableOpacity
                  onPress={handleRemoveImage}
                  style={styles.closeButton}
                >
                  <View style={styles.closeCircle}>
                    <CloseIcon />
                  </View>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{}}
              onPress={() =>{
                Keyboard.dismiss();
                PhotoRef.current.expand()
              }}
            >
              <AddIcon />
            </TouchableOpacity>
          )}
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
        {/* <AudioMessage /> */}
        {/* <BottomSearch /> */}
        {/* <GiftedChat
          messages={supabaseChat}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
        /> */}

        {/* temp */}
        <ChatOptionBottomSheet
          profileOptionRef={profileOptionRef}
          screen={"Chat"}
          onPressReportOption={() =>
            onPressReportOption({
              reportId: chatUserDetails?.id,
              name: chatUserDetails?.full_name,
              ProfilePic: chatUserDetails?.profile_pic,
            })
          }
          onPressBlockOption={onPressBlockOption}
          onPressClearOption={() => {
            profileOptionRef.current.close();
            ClearConRef.current.expand();
          }}
        />
        {/* 4  onSelect Block option from profile option sheet*/}
        <BlockUserBottomSheet
          BlockUserRef={BlockUserRef}
          onPressBlockButton={() =>
            onSubmitBlockHandler({
              profileId: chatUserDetails?.id,
              isBlock: 1,
            })
          }
          loading={blockLoading}
        />

        {/* 1 */}
        <SelectMediaBottomSheet
          mediaRef={PhotoRef}
          onPressCamera={onTakeSelfieHandler}
          onPressGallary={onPressGallary}
          onCaptureImage={onCaptureImage}
          //@ts-ignore
          imageData={imageData}
          imageFileData={imageFileData}
        />

        {/* 2 */}
        {/* <BottomSheetWrap bottomSheetRef={MoreRef}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 23,
              textAlign: "center",
              fontFamily: fontFamilies.semiBold,
            }}
          >
            More
          </Text>

          <TouchableOpacity
            onPress={() => {
              MoreRef.current.close();
              MuteNotifiRef.current.expand();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: 12,
              paddingHorizontal: 16,
              right: "5%",
            }}
          >
            <MuteIcon />
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                marginLeft: 10, // Space between icon and text
              }}
            >
              Mute notifications
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/ReportUser")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: 12,
              paddingHorizontal: 16,
              right: "5%",
            }}
          >
            <InfoIcon />
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                marginLeft: 10, // Space between icon and text
              }}
            >
              Report user
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              MoreRef.current.close();
              removeMemberRef.current.expand();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: 12,
              paddingHorizontal: 16,
              right: "5%",
            }}
          >
            <ChatIcon />
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                marginLeft: 10, // Space between icon and text
              }}
            >
              Block user
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              MoreRef.current.close();
              ClearConRef.current.expand();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              paddingVertical: 12,
              paddingHorizontal: 16,
              right: "5%",
            }}
          >
            <DeleteAccountIcon />
            <Text
              style={{
                color: "red",
                fontSize: 18,
                marginLeft: 10, // Space between icon and text
              }}
            >
              Clear conversation
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap> */}

        {/* 3 */}
        {/* <BottomSheetWrap bottomSheetRef={MuteNotifiRef}>
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
                  borderWidth: 0.5,
                  borderColor: "#212121",
                  padding: "1%",
                  borderRadius: 10,
                  // shadowColor: "#4E4D5B",
                  // shadowOpacity: 0.2,
                  // elevation: 1,
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
          <View
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: "gray",
              width: "100%",
              paddingHorizontal: "40%",
              paddingVertical: "4%",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "gray", right: "400%" }}>8 hours</Text>
            <Image
              style={{
                width: 20,
                height: 25,
                overflow: "hidden",
                marginLeft: "150%",
              }}
              contentFit="cover"
              source={require("@/assets/image/radio-botton1.png")}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: "gray",
              width: "100%",
              paddingHorizontal: "40%",
              paddingVertical: "4%",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "gray", right: "400%" }}>1 week</Text>
            <Image
              style={{
                width: 20,
                height: 25,
                overflow: "hidden",
                marginLeft: "150%",
              }}
              contentFit="cover"
              source={require("@/assets/image/radio-botton1.png")}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: "gray",
              width: "100%",
              paddingHorizontal: "40%",
              paddingVertical: "4%",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "gray", right: "400%" }}>Always</Text>
            <Image
              style={{
                width: 20,
                height: 25,
                overflow: "hidden",
                marginLeft: "150%",
              }}
              contentFit="cover"
              source={require("@/assets/image/radio-botton1.png")}
            />
          </View>

          <Button1
            isLoading={false}
            title="Mute"
            // onPress={() => router.push("UserChatScreen")}
          />
          <TouchableOpacity onPress={() => MuteNotifiRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                textAlign: "center",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap> */}

        {/* 4 */}
        {/* <BottomSheetWrap bottomSheetRef={removeMemberRef}>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
              marginBottom: "5%",
            }}
          >
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Block user
            </Text>
          </View>
          <View style={{ width: "100%" }}>
            <UserProfile />
          </View>
          <View
            style={{
              borderWidth: 0.5,
              padding: "1%",
              borderRadius: 10,
              // shadowColor: "#4E4D5B",
              // shadowOpacity: 0.2,
              // elevation: 1,
              marginTop: "-45%",
            }}
          >
            <Text
              style={{
                color: "gray",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              This individual won’t be able to send you direct messages and you
              cannot find their messages on channel chat.
            </Text>
          </View>

          <Button1 isLoading={false} title="Block" />
          <TouchableOpacity onPress={() => removeMemberRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                textAlign: "center",
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap> */}

        {/* 5 */}
        <BottomSheetWrap
          bottomSheetRef={ClearConRef}
          snapPoints={["20%", "40%"]}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
                marginBottom: "5%",
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Clear conversation
              </Text>
            </View>
            <View
              style={{
                padding: "3%",
                borderRadius: 10,
                backgroundColor: "#2B0A6E",
              }}
            >
              <Text
                style={{
                  color: "gray",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                This conversation will be deleted from your inbox. Other people
                in the conversation will still be able to see it.
              </Text>
            </View>

            <Button1
              isLoading={false}
              title="Clear chat"
              onPress={() => clearChatConfirm()}
            />
            <TouchableOpacity onPress={() => ClearConRef.current.close()}>
              <GradientText
                style={{
                  fontFamily: fontFamilies.bold,
                  fontSize: 17,
                  color: globalColors.darkOrchid,
                  textAlign: "center",
                }}
              >
                <Text
                  style={{ color: globalColors.neutralWhite, fontSize: 17 }}
                >
                  Cancel
                </Text>
              </GradientText>
            </TouchableOpacity>
          </View>
        </BottomSheetWrap>
      </ViewWrapper>

      <DeleteMessageBottomSheet
        DeleteMessageRef={DeleteMessageRef}
        handleDeleteMessage={handleDeleteMessage}
      />
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: 40,
    height: 45,
    borderRadius: 7,
  },
  closeButton: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  closeCircle: {
    width: 18,
    height: 18,
    backgroundColor: "#000",
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: globalColors.neutralWhite,
  },
  closeInner: {
    width: 8,
    height: 8,
    backgroundColor: "lime",
    borderRadius: 4,
  },
});
export default UserChatScreen;
