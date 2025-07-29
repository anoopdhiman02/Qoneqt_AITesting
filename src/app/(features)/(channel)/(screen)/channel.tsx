import { useEffect, useRef, useState } from "react";
import { Image } from "expo-image";
import {
  Linking,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import Button1 from "../../../../components/buttons/Button1";
import BottomSheet from "@gorhom/bottom-sheet";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CameraIcon,
  ChatIcon,
  CheckCircleIcon,
  ClearChatIcon,
  CloseIcon,
  CopyIcon,
  DeleteAccountIcon,
  DeleteIcon,
  EditIcon,
  FlashIcon,
  GroupIcon,
  MuteIcon,
  OptionsIcon,
  PhotoIcon,
  ShareIcon,
  UnmuteIcon,
  UserIcon,
  VerifiedIcon,
} from "@/assets/DarkIcon";
import GradientText from "@/components/element/GradientText";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useChannelInfoViewModel from "../viewModel/ChannelInfoViewModel";
import { useChannelStore } from "@/zustand/channelStore";
import { router, useLocalSearchParams } from "expo-router";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import Clipboard from "@react-native-clipboard/clipboard";
import { setPrefsValue } from "@/utils/storage";

const ChannelDetailScreen = () => {
  const params = useLocalSearchParams();
  const {
    setCategoryId,
    setCategoryDetails,
    setUserCategoryRole,
    categoryId,
    categoryDetails,
    userCategoryRole,
    channelId,
    channelDetails,
    userChannelRole,
  } = useChannelStore();

  const { channelData, onFetchChannelInfoHandler, loading }: any =
    useChannelInfoViewModel();

  useEffect(() => {
    const handleDeepLink = ({ url }: { url: string }) => {
      const referCode = url.split("channel/");
      if (referCode[1]) {
        const newRefCode = referCode[1].split("/");
        onFetchChannelInfoHandler({ channelId: newRefCode[0] });
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

  useEffect(() => {
    if (params?.channelId) {
      onFetchChannelInfoHandler({ channelId: params?.channelId });
    }

    return () => {
      setPrefsValue("notificationInfo", "");
    };
  }, []);
  const UserPrifle = () => {
    return (
      <View
        style={{
          alignSelf: "stretch",
          borderRadius: 8,
          backgroundColor: globalColors.neutral2,
          borderStyle: "solid",
          borderColor: globalColors.neutral4,
          borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: "6%",
          padding: "3%",
          marginTop: "2.8%",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "flex-start",
          }}
        >
          {channelData?.created_by?.profile_pic ? (
            <Image
              style={{
                borderRadius: 24,
                width: 48,
                height: 48,
                marginTop: 8,
              }}
              contentFit="contain"
              source={{
                uri: ImageUrlConcated(channelData?.created_by?.profile_pic),
              }}
            />
          ) : (
            <Image
              style={{
                borderRadius: 24,
                width: 48,
                height: 48,
                marginTop: 8,
              }}
              contentFit="cover"
              source={require("@/assets/image/EmptyProfileIcon.webp")}
            />
          )}
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  letterSpacing: -0.2,
                  lineHeight: 20,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                }}
              >
                {channelData?.created_by?.full_name}
              </Text>
              {channelData?.created_by?.kyc_status === 1 ? (
                <VerifiedIcon style={{ left: "15%" }} />
              ) : null}
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 16,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                  borderRadius: 16,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: 12,
                }}
              >
                Admin
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                }}
              >
                @{channelData?.created_by?.social_name}
              </Text>

              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: globalColors.neutral7,
                  marginLeft: 8,
                }}
              />
              {channelData?.creatorPerks?.perks ? (
                <TouchableOpacity
                  onPress={() => SocialTokenRef.current.expand()}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 8,
                  }}
                >
                  <FlashIcon />
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 18,
                      fontFamily: fontFamilies.light,
                      color: globalColors.neutralWhite,
                      marginLeft: 4,
                    }}
                  >
                    {channelData.creatorPerks?.perks} perks
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const Guides = () => {
    return (
      <View
        style={{
          borderRadius: 16,
          backgroundColor: globalColors.neutral2,
          borderColor: globalColors.neutral4,
          borderWidth: 0.5,
          flexDirection: "column",
          padding: "5%",
          width: "100%",
        }}
      >
        <View
          style={{
            alignSelf: "stretch",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => mediaLink.current.expand()}>
            <Image
              style={{
                borderRadius: 5,
                width: 55,
                height: 55,
                marginRight: 3,
              }}
              contentFit="cover"
              source={
                channelData?.channel_image
                  ? { uri: ImageUrlConcated(channelData?.channel_image) }
                  : require("@/assets/image/EmptyProfileIcon.webp")
              }
            />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              marginLeft: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: -0.2,
                  lineHeight: 28,
                  textTransform: "capitalize",
                  fontFamily: fontFamilies.bold,
                  color: globalColors.neutralWhite,
                }}
              >
                #{channelData?.channel_name}
              </Text>

              <TouchableOpacity
                onPress={() => console.log("Channel Type Clicked")}
                style={{
                  borderRadius: 16,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
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
                  {channelData?.channel_type === 0 ? "Public" : "Private"}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",

                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutralWhite,
                  }}
                >
                  Group :
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamilies.light,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {" "}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamilies.light,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {channelData?.group?.loop_name}
                </Text>
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,

                  marginLeft: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutralWhite,
                  }}
                >
                  Category :
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamilies.light,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {" "}
                </Text>
                <Text
                  style={{
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {channelData?.group?.slug}
                </Text>
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            alignSelf: "stretch",
            borderStyle: "solid",
            borderColor: globalColors.neutral4,
            borderTopWidth: 0.5,
            height: 1,
            marginTop: "5%",
          }}
        />
        <TouchableOpacity
          onPress={() => router.push("/GroupMembersScreen")}
          // onPress={() => {
          //   router.push({
          //     pathname: "/GroupMembersScreen",
          //     params: { groupId: members?.id },
          //   });
          // }}
          style={{
            height: 24,
            flexDirection: "row",
            alignItems: "center",
            marginTop: "5%",
            left: "10%",
          }}
        >
          <GroupIcon
            style={{
              marginRight: "3%",
            }}
          />
          <Text
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: fontFamilies.regular,
              color: globalColors.slateBlueTint20,
            }}
          >
            {channelData?.members?.id} Users
            {/* Uncomment and use this if needed: 
        {channelData?.members_aggregate?.aggregate?.count || 987} */}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CreatedBy = () => {
    return (
      <Text
        style={{
          alignSelf: "stretch",
          marginTop: "2.8%",
          fontSize: 20,
          fontFamily: fontFamilies.regular,
          color: globalColors.neutral9,
        }}
      >
        Created by
      </Text>
    );
  };

  const onShare = async (unique_id) => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/channel/${unique_id}`,
        // http://localhost:3000/CH8281391708518967/info
        // url: `https://qoneqt.com/channel/${unique_id}`,
        title: "Share Channel",
      });
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const copyToClipboard = (unique_id) => {
    const profileUrl = `https://qoneqt.com/channel/${unique_id}/info`;
    Clipboard.setString(profileUrl);
    setCopiedText(profileUrl);

    showToast({ type: "success", text1: "Link copied to clipboard!" });
  };

  const ShareLink = (unique_id) => {
    const profileUrl = `https://qoneqt.com/channel/${unique_id}/info`;

    return (
      <View
        style={{
          alignSelf: "stretch",
          borderRadius: 8,
          backgroundColor: globalColors.neutral2,
          borderColor: globalColors.neutral4,
          borderStyle: "solid",
          borderWidth: 1,
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "5%",
          marginTop: 16,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            // paddingVertical: 12,
            // paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral9,
              flex: 1, // Allow text to take available space
              marginRight: 8, // Add spacing between text and icons
            }}
          >
            Share this link to join this channel
          </Text>

          <TouchableOpacity
            onPress={() => onShare(channelData?.unique_id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <ShareIcon height={24} width={24} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => copyToClipboard(channelData?.unique_id)}
          >
            <CopyIcon />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => copyToClipboard(unique_id)}
          style={{ marginTop: 8 }}
        >
          <Text
            style={{
              alignSelf: "stretch",
              fontSize: 14,
              lineHeight: 16,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              textDecorationLine: "underline",
            }}
          >
            {profileUrl}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const MediaLink = () => {
    return (
      <TouchableOpacity
        style={{
          borderRadius: 8,
          backgroundColor: globalColors.neutral2,
          borderColor: globalColors.neutral4,
          borderWidth: 0.5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 16,
          marginTop: 16,
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <PhotoIcon />
          <Text
            style={{
              fontSize: 16,
              lineHeight: 20,
              color: globalColors.neutralWhite,
              marginLeft: 12,
              fontFamily: fontFamilies.regular,
            }}
          >
            Media, Links and Docs
          </Text>
        </View>
        <View>
          <ArrowRightIcon />
        </View>
      </TouchableOpacity>
    );
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    MuteNotifyRef.current.close();
  };

  const UserHandleButton = () => {
    return (
      <View
        style={{
          borderRadius: 8,
          backgroundColor: globalColors.neutral2,
          borderColor: globalColors.neutral4,
          borderWidth: 0.5,
          padding: 16, // Fixed padding for consistency
          marginTop: 16, // Fixed margin for alignment
        }}
      >
        {/* Mute/Unmute Section */}
        <TouchableOpacity
          onPress={() => MuteNotifyRef.current.expand()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between", // Proper spacing between text and icon
            marginBottom: 12, // Added spacing between sections
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isMuted ? <UnmuteIcon /> : <MuteIcon />}
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                color: globalColors.neutralWhite,
                marginLeft: 12,
              }}
            >
              {isMuted ? "Mute" : "Unmute"}
            </Text>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: globalColors.neutral4,
            marginVertical: 12,
          }}
        />

        <TouchableOpacity
          onPress={() => ClearConRef.current.expand()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ClearChatIcon />
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                color: globalColors.neutralWhite,
                marginLeft: 12,
              }}
            >
              Clear Chat
            </Text>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const AdminHandleButton = () => {
    return (
      <View
        style={{
          borderRadius: 8,
          backgroundColor: globalColors.neutral2,
          borderColor: globalColors.neutral4,
          borderWidth: 0.5,
          padding: 16,
          marginTop: 16,
        }}
      >
        {/* Mute/Unmute Section */}
        <TouchableOpacity
          onPress={() => MuteNotifyRef.current.expand()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {isMuted ? <UnmuteIcon /> : <MuteIcon />}
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                color: globalColors.neutralWhite,
                marginLeft: 12,
              }}
            >
              {isMuted ? "Mute" : "Unmute"}
            </Text>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>

        <View
          style={{
            height: 1,
            backgroundColor: globalColors.neutral4,
            marginVertical: 12,
          }}
        />

        <TouchableOpacity
          onPress={() => ClearConRef.current.expand()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <ClearChatIcon />
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                color: globalColors.neutralWhite,
                marginLeft: 12,
              }}
            >
              Clear Chat
            </Text>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
        <View
          style={{
            height: 1,
            backgroundColor: globalColors.neutral4,
            marginVertical: 12,
          }}
        />

        <TouchableOpacity
          onPress={() => DeleteChannelRef.current.expand()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <DeleteIcon />
            <Text
              style={{
                fontSize: 16,
                lineHeight: 18,
                color: globalColors.warning,
                marginLeft: 12,
              }}
            >
              Delete Channel
            </Text>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const UserMember = () => {
    return (
      <View>
        <View
          style={{
            borderRadius: 8,
            borderStyle: "solid",
            borderColor: globalColors.neutral4,
            borderWidth: 1,
            flexDirection: "row",
            alignItems: "center",
            padding: "5%",
            marginBottom: "50%",
          }}
        >
          {channelData?.created_by?.profile_pic ? (
            <Image
              style={{
                borderRadius: 24,
                width: 48,
                height: 48,
                marginRight: 12,
              }}
              contentFit="cover"
              source={{
                uri: ImageUrlConcated(channelData?.created_by?.profile_pic),
              }}
            />
          ) : (
            <Image
              style={{
                borderRadius: 24,
                width: 48,
                height: 48,
                marginRight: 12,
              }}
              contentFit="cover"
              source={require("@/assets/image/EmptyProfileIcon.webp")}
            />
          )}
          <View
            style={{
              flexDirection: "column",
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  letterSpacing: -0.1,
                  lineHeight: 20,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                  marginRight: 8,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {channelData?.created_by?.full_name}
              </Text>
              {channelData?.created_by?.kyc_status === 1 && (
                <VerifiedIcon style={{ marginRight: 8 }} />
              )}
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 16,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutralWhite,
                  borderRadius: 16,
                  backgroundColor: globalColors.neutral4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                Admin
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral9,
                  marginRight: 8,
                }}
              >
                @ {channelData?.created_by?.social_name}
              </Text>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: globalColors.neutral7,
                  marginRight: 8,
                }}
              />
              {channelData?.creatorPerks?.perks && (
                <TouchableOpacity
                  onPress={() => SocialTokenRef.current.expand()}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FlashIcon />
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 18,
                      fontFamily: fontFamilies.light,
                      color: globalColors.neutralWhite,
                      marginLeft: 2,
                    }}
                  >
                    {channelData?.creatorPerks?.perks} perks
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => removeMemberRef.current.expand()}
            style={{ padding: "2%", left: "7%" }}
          >
            <OptionsIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          style={{
            alignSelf: "center",
            width: "100%",
          }}
          // Open Bottom Sheet on Click
        >
          <GradientText
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 17,
              color: globalColors.darkOrchid,
              textAlign: "center",
            }}
          >
            <Text>View all requests</Text>
            <ArrowUpIcon />
          </GradientText>
        </TouchableOpacity> */}
      </View>
    );
  };

  const PerkReqUser = () => {
    return (
      <TouchableOpacity
        onPress={() => PerkRequestRef.current.expand()}
        style={{
          borderRadius: 8,
          backgroundColor: globalColors.slateBlueShade80,
          flexDirection: "row",
          alignItems: "center",
          padding: "5%",
          marginTop: "5%",
          borderWidth: 0.5,
          borderColor: globalColors.neutral4,
        }}
      >
        {channelData?.created_by?.profile_pic ? (
          <Image
            style={{
              borderRadius: 24,
              width: 48,
              height: 48,
              marginRight: 12,
            }}
            contentFit="cover"
            source={{
              uri: ImageUrlConcated(channelData?.created_by?.profile_pic),
            }}
          />
        ) : (
          <Image
            style={{
              borderRadius: 24,
              width: 48,
              height: 48,
              marginRight: 12,
            }}
            contentFit="cover"
            source={require("@/assets/image/EmptyProfileIcon.webp")}
          />
        )}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: 16,
                letterSpacing: -0.2,
                lineHeight: 20,
                fontFamily: fontFamilies.semiBold,
                color: globalColors.neutral9,
                marginRight: 8,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {channelData?.created_by?.full_name}
            </Text>
            {channelData?.created_by?.kyc_status === 1 && (
              <VerifiedIcon style={{ marginRight: 8 }} />
            )}
            <Text
              style={{
                fontSize: 10,
                lineHeight: 16,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                borderRadius: 16,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              Admin
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutral9,
                marginRight: 8,
              }}
            >
              @ {channelData?.created_by?.social_name}
            </Text>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: globalColors.neutral7,
                marginRight: 8,
              }}
            />
            {channelData?.creatorPerks?.perks && (
              <TouchableOpacity
                onPress={() => SocialTokenRef.current.expand()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FlashIcon />
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: fontFamilies.light,
                    color: globalColors.neutralWhite,
                    marginLeft: 4,
                  }}
                >
                  {channelData?.creatorPerks?.perks} perks
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const Option = ({
    Icon,
    text,
    onPress,
    textColor = globalColors.neutralWhite,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingVertical: "3%",
      }}
    >
      <Icon width={24} height={24} color={globalColors.neutralWhite} />
      <Text
        style={{
          color: textColor,
          fontSize: 16,
          marginLeft: "5%",
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  const PerkRequestRef = useRef<BottomSheet>(null);
  const RemoveChannelImg = useRef<BottomSheet>(null);
  const mediaLink = useRef<BottomSheet>(null);
  const EditChanNameRef = useRef<BottomSheet>(null);
  const EditChanImageRef = useRef<BottomSheet>(null);
  const removeMemberRef = useRef<BottomSheet>(null);
  const ShareViaRef = useRef<BottomSheet>(null);
  const SocialTokenRef = useRef<BottomSheet>(null);
  const ClearMemberRef = useRef<BottomSheet>(null);
  const MuteNotifyRef = useRef<BottomSheet>(null);
  const ClearConRef = useRef<BottomSheet>(null);
  const DeleteChannelRef = useRef<BottomSheet>(null);

  const [select, setSelect] = useState<string>("");
  const [copiedText, setCopiedText] = useState<string>("");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (channelId) {
      onFetchChannelInfoHandler({ channelId: channelId });
    }
  }, []);

  return (
    <ViewWrapper>
      <View style={{ marginTop: "5%", width: "90%", marginBottom: "20%" }}>
        <GoBackNavigation header="Channel info" isDeepLink={true} />
        <TouchableOpacity
          onPress={() => EditChanImageRef.current.expand()}
          style={{ left: "38%", bottom: "4%" }}
        >
          <GradientText
            style={{
              fontFamily: fontFamilies.bold,
              fontSize: 17,
              color: globalColors.darkOrchid,
            }}
          >
            {"Edit channel"}
          </GradientText>
        </TouchableOpacity>
        <Guides />
        <ScrollView>
          <CreatedBy />
          <UserPrifle />
          <ShareLink ShareViaRef={ShareViaRef} />
          <MediaLink />
          <AdminHandleButton />
          <UserHandleButton />
          {/* <Text
            style={{
              fontSize: 20,
              marginTop: "2.8%",
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral9,
            }}
          >
            Perks request({channelData?.perk})
          </Text> */}

          {/* <PerkReqUser /> */}

          <Text
            style={{
              fontSize: 20,
              marginTop: "2.8%",
              marginBottom: "2.8%",
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral9,
            }}
          >
            {channelData?.members_aggregate?.aggregate?.count} members
          </Text>
          <UserMember />
        </ScrollView>
      </View>
      {/* 1 */}
      <BottomSheetWrap bottomSheetRef={removeMemberRef}>
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
                fontFamily: fontFamilies.regular,
              }}
            >
              Remove member
            </Text>
          </View>
          <View style={{ width: "100%" }}>
            <PerkReqUser />
          </View>
          <View
            style={{
              padding: "3%",
              borderRadius: 5,
              shadowOpacity: 0.2,
              backgroundColor: globalColors.slateBlueShade80,
              marginTop: "5%",
              width: "100%",
              borderColor: globalColors.neutral4,
              borderWidth: 0.3,
            }}
          >
            <Text
              style={{
                color: globalColors.neutral7,
                fontSize: 14,
                textAlign: "center",
                fontFamily: fontFamilies.regular,
              }}
            >
              {channelData?.created_by?.full_name} must accumulate{" "}
              {channelData?.creatorPerks?.perks} perks to become a member of
              your channel.
            </Text>
          </View>

          <Button1
            isLoading={false}
            title="Cancel"
            onPress={() => removeMemberRef.current.close()}
          />
          <TouchableOpacity onPress={() => removeMemberRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 17,
                color: globalColors.warmPink,
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 17,
                  fontFamily: fontFamilies.regular,
                }}
              >
                Remove
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      {/* 2 */}
      <BottomSheetWrap bottomSheetRef={EditChanImageRef}>
        <View style={{ paddingHorizontal: "5%", paddingVertical: "5%" }}>
          <TouchableOpacity
            onPress={() => EditChanNameRef.current.expand()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                backgroundColor: globalColors.neutral2,
                padding: 4,
                borderRadius: 6,
                marginRight: 12,
              }}
            >
              <EditIcon />
            </View>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 16,
                fontFamily: fontFamilies.regular,
              }}
            >
              Edit channel name
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => mediaLink.current.expand()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                backgroundColor: globalColors.neutral2,
                padding: 4,
                borderRadius: 6,
                marginRight: 12,
              }}
            >
              <PhotoIcon />
            </View>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 16,
                fontFamily: fontFamilies.regular,
              }}
            >
              Edit channel image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => RemoveChannelImg.current.expand()}
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: globalColors.neutral2,
                padding: 4,
                borderRadius: 6,
                marginRight: 12,
              }}
            >
              <DeleteAccountIcon />
            </View>
            <Text
              style={{
                color: globalColors.warning,
                fontSize: 16,
                fontFamily: fontFamilies.regular,
              }}
            >
              Remove channel image
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      {/* 3 */}
      <BottomSheetWrap bottomSheetRef={EditChanNameRef}>
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
                fontFamily: fontFamilies.bold,
              }}
            >
              Edit channel name
            </Text>
          </View>
          <TextInput
            placeholder="Search"
            placeholderTextColor={globalColors.neutral7}
            style={{
              fontSize: 16,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              width: "100%",
              height: 48,
              borderRadius: 10,
              paddingHorizontal: 15,
              borderWidth: 1,
              borderColor: globalColors.neutral3,
              alignSelf: "center",
              top: "5%",
            }}
          />
          <View
            style={{
              padding: "1%",
              borderRadius: 10,
              marginTop: "5%",
            }}
          >
            <Text
              style={{
                marginTop: "2.5%",
                color: globalColors.neutral7,
                fontSize: 14,
                fontFamily: fontFamilies.regular,
                textAlign: "center",
              }}
            >
              Losing all Sub-groups data from the above selected category is
              irreversible and cannot be recovered.
            </Text>
          </View>

          <Button1
            title="Save"
            onPress={() => EditChanNameRef.current.close()}
          />
          <TouchableOpacity onPress={() => EditChanNameRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 17,
                  fontFamily: fontFamilies.regular,
                }}
              >
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      {/* 4 */}
      <BottomSheetWrap bottomSheetRef={mediaLink}>
        <View
          style={{
            left: "5%",
          }}
        >
          <Option
            Icon={PhotoIcon}
            text="Choose from gallery"
            onPress={() => console.log("Choose from gallery")}
          />
          <Option
            Icon={CameraIcon}
            text="Take a picture"
            onPress={() => console.log("Take a picture")}
          />
          <Option
            Icon={ChatIcon}
            text="Remove channel image"
            onPress={() => console.log("Remove channel image")}
            textColor={globalColors.warning}
          />
        </View>
        <Button1
          isLoading={false}
          title="Cancel"
          onPress={() => mediaLink.current.close()}
        />
      </BottomSheetWrap>

      {/* 5 */}
      <BottomSheetWrap bottomSheetRef={RemoveChannelImg}>
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
                  fontFamily: fontFamilies.regular,
                }}
              >
                Remove channel image
              </Text>
              <View
                style={{
                  padding: "1%",
                  borderRadius: 10,
                  marginTop: "3%",
                }}
              >
                <Text
                  style={{
                    marginTop: "2.5%",
                    color: globalColors.neutral7,
                    fontSize: 14,
                    textAlign: "center",
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  Are you sure you want to remove your channel image and reset
                  to default?
                </Text>
              </View>
            </View>
          </View>
          <Button1
            isLoading={false}
            title="Cancel"
            onPress={() => RemoveChannelImg.current.close()}
          />
          <TouchableOpacity onPress={() => RemoveChannelImg.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 17,
                color: globalColors.warmPink,
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 17,
                  fontFamily: fontFamilies.regular,
                }}
              >
                Remove
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      {/* 6 */}
      <BottomSheetWrap bottomSheetRef={PerkRequestRef}>
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
                fontFamily: fontFamilies.regular,
              }}
            >
              Perk Request
            </Text>
          </View>

          <View style={{ width: "100%" }}>
            <UserMember />
          </View>
          <View
            style={{
              padding: "1%",
              borderRadius: 10,
              marginTop: "-45%",
            }}
          >
            <Text
              style={{
                color: globalColors.neutral7,
                fontSize: 14,
                textAlign: "center",
                fontFamily: fontFamilies.regular,
              }}
            >
              Deekshith must accumulate 1000 perks to become a member of your
              channel.
            </Text>
          </View>
          <View style={{ width: "100%" }}>
            <TextInputComponent placeHolder="11000" />
          </View>
          <Text
            style={{
              color: globalColors.warning,
              width: "100%",
              marginTop: "3%",
              fontSize: 12,
              fontFamily: fontFamilies.regular,
            }}
          >
            Insufficient balance detected
          </Text>
          <Text
            style={{
              color: globalColors.neutral7,
              fontFamily: fontFamilies.regular,
              width: "100%",
              marginTop: "3%",
            }}
          >
            Available balance : 10500 perks
          </Text>

          <Button1
            title="Accept"
            isLoading={false}
            onPress={() => PerkRequestRef.current.close()}
          />
          <TouchableOpacity onPress={() => PerkRequestRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 17,
                  fontFamily: fontFamilies.regular,
                }}
              >
                Reject
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      {/* 7 */}
      <BottomSheetWrap bottomSheetRef={ShareViaRef}>
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
                fontFamily: fontFamilies.regular,
              }}
            >
              Share group info
            </Text>
          </View>
          <ShareLink />
        </View>
      </BottomSheetWrap>

      {/* 8 */}
      <BottomSheetWrap bottomSheetRef={SocialTokenRef}>
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
                fontFamily: fontFamilies.regular,
              }}
            >
              Social token details
            </Text>
          </View>

          <View style={{ marginTop: "5%", width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 18,
                  justifyContent: "space-around",
                  fontFamily: fontFamilies.regular,
                }}
              >
                Token name
              </Text>
              <Text
                style={{
                  color: globalColors.neutral10,
                  fontSize: 18,
                  left: "200%",
                  fontFamily: fontFamilies.regular,
                }}
              >
                Beta Inu
              </Text>
            </View>
          </View>

          <View style={{ marginTop: "5%", width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 18,
                  justifyContent: "space-around",
                  fontFamily: fontFamilies.regular,
                }}
              >
                Token symbol
              </Text>
              <View style={{ width: "23%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: globalColors.neutral10,
                    fontSize: 18,
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  BINU
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: "5%", width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 18,
                  justifyContent: "space-around",
                  fontFamily: fontFamilies.regular,
                }}
              >
                Token supply
              </Text>
              <Text
                style={{
                  color: globalColors.neutral10,
                  fontSize: 18,
                  left: "200%",
                  fontFamily: fontFamilies.regular,
                }}
              >
                10000
              </Text>
            </View>
          </View>

          <View style={{ marginTop: "5%", width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 18,
                  justifyContent: "space-around",
                  fontFamily: fontFamilies.regular,
                }}
              >
                Token address
              </Text>
              <View style={{ width: "40%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: globalColors.neutral10,
                    fontSize: 18,
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  0x65d4808...
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: "5%", width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 18,
                  justifyContent: "space-around",
                  fontFamily: fontFamilies.regular,
                }}
              >
                Chain
              </Text>
              <View style={{ width: "65%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: globalColors.neutral10,
                    fontSize: 18,
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  Matic Testnet
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: "5%", width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 18,
                  justifyContent: "space-around",
                  fontFamily: fontFamilies.regular,
                }}
              >
                Token creator
              </Text>
              <View style={{ width: "60%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: globalColors.neutral10,
                    fontSize: 18,
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  Nirmal (23237532...)
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: "5%", width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 18,
                  justifyContent: "space-around",
                  fontFamily: fontFamilies.regular,
                }}
              >
                Admin address
              </Text>
              <View style={{ width: "40%", alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: globalColors.neutral10,
                    fontSize: 18,
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  0x65d4808...
                </Text>
              </View>
            </View>
          </View>

          <Button1
            isLoading={false}
            title="Transfer ownership"
            onPress={() => SocialTokenRef.current.close()}
          />
        </View>
      </BottomSheetWrap>

      {/* 9 */}
      <BottomSheetWrap bottomSheetRef={ClearMemberRef}>
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <TouchableOpacity
            onPress={() => removeMemberRef.current.expand()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              borderRadius: 8,
            }}
          >
            <View
              style={{
                padding: 6,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: globalColors.slateBlueShade60,
              }}
            >
              <ClearChatIcon />
            </View>
            <Text
              style={{
                color: globalColors.warning,
                fontSize: 18,
                marginLeft: 12,
                fontFamily: fontFamilies.semiBold,
              }}
            >
              Remove member
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      {/* 10 */}
      <BottomSheetWrap bottomSheetRef={MuteNotifyRef}>
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
                  fontFamily: fontFamilies.regular,
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
                    color: globalColors.neutral7,
                    fontSize: 14,
                    textAlign: "center",
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  The chat stays muted privately, without alerting others, while
                  you still receive notifications if mentioned.
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setSelect("8 hours")}
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
            <Text
              style={{
                color: globalColors.neutral7,
                fontFamily: fontFamilies.regular,
              }}
            >
              8 hours
            </Text>
            {select === "8 hours" ? (
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
            onPress={() => setSelect("1 week")}
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
            <Text
              style={{
                color: globalColors.neutral7,
                fontFamily: fontFamilies.regular,
              }}
            >
              1 week
            </Text>
            {select === "1 week" ? (
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
            onPress={() => setSelect("Always")}
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
            <Text
              style={{
                color: globalColors.neutral7,
                fontFamily: fontFamilies.regular,
              }}
            >
              Always
            </Text>
            {select === "Always" ? (
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

          <Button1 title="Mute" onPress={toggleMute} />
          <TouchableOpacity onPress={() => MuteNotifyRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 17,
                  fontFamily: fontFamilies.regular,
                }}
              >
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      {/* 11 */}
      <BottomSheetWrap bottomSheetRef={ClearConRef}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              textAlign: "center",
              marginBottom: "5%",
              fontFamily: fontFamilies.regular,
            }}
          >
            Clear conversation
          </Text>
          <View
            style={{
              padding: "3%",
              borderRadius: 10,
              backgroundColor: "#2B0A6E",
              marginBottom: "5%",
            }}
          >
            <Text
              style={{
                color: globalColors.neutral7,
                fontSize: 14,
                textAlign: "center",
                fontFamily: fontFamilies.regular,
              }}
            >
              This conversation will be deleted from your inbox. Other people in
              the conversation will still be able to see it.
            </Text>
          </View>

          <Button1
            isLoading={false}
            title="Clear chat"
            onPress={() => ClearConRef.current.close()}
          />
          <TouchableOpacity onPress={() => ClearConRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                marginTop: "2%",
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 17,
                  fontFamily: fontFamilies.regular,
                }}
              >
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      {/* 12 */}
      <BottomSheetWrap bottomSheetRef={DeleteChannelRef}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              textAlign: "center",
              marginBottom: "5%",
              fontFamily: fontFamilies.regular,
            }}
          >
            Delete Channel
          </Text>
          <View
            style={{
              borderWidth: 0.5,
              padding: "2%",
              borderRadius: 10,
              marginBottom: "5%",
              backgroundColor: globalColors.darkOrchidShade60,
            }}
          >
            <Text
              style={{
                color: globalColors.neutral6,
                fontSize: 14,
                textAlign: "center",
                fontFamily: fontFamilies.regular,
              }}
            >
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontFamily: fontFamilies.regular,
                }}
              >
                Are you sure you want delete “Crypto Space” channel?
              </Text>
              Only admins will be notified that you left the channel
            </Text>
          </View>
          <Button1
            isLoading={false}
            title="Cancel"
            onPress={() => DeleteChannelRef.current.close()}
          />
          <TouchableOpacity onPress={() => DeleteChannelRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
                color: globalColors.darkOrchid,
                textAlign: "center",
              }}
            >
              {"Delete"}
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>
    </ViewWrapper>
  );
};

export default ChannelDetailScreen;
