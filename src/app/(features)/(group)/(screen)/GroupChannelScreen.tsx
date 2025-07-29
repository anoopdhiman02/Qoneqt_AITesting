import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useRef, useState } from "react";
import ViewWrapper from "@/components/ViewWrapper";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClearChatIcon,
  EventsIcon,
  GroupIcon,
  MuteIcon,
  OptionsIcon,
  Share01Icon,
  SocialTokenIcon,
  UserIcon,
} from "@/assets/DarkIcon";
import GradientText from "@/components/element/GradientText";
import { router } from "expo-router";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { icons } from "@/components/atom/BottomTab/TabIcons";
import BottomSheet from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import Button1 from "@/components/buttons/Button1";
import ButtonTwo from "@/components/buttons/ButtonTwo";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const GroupChannelScreen = () => {
  useScreenTracking("GroupChannelScreen");
  const MuteUnmuteRef = useRef<BottomSheet>(null);
  const TokenGeneratorRef = useRef<BottomSheet>(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const OptionItem = ({ icon, text, onPress, isDestructive }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: "4%",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon}
        <Text
          style={{
            color: isDestructive ? "red" : globalColors.neutralWhite,
            fontSize: 16,
            marginLeft: "5%",
          }}
        >
          {text}
        </Text>
      </View>
      <ArrowRightIcon />
    </TouchableOpacity>
  );

  const HeaderComponent = () => {
    return (
      <>
        <TouchableOpacity
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: "5%",
          }}
          onPress={() => router.back()}
        >
          <ArrowLeftIcon
            style={{
              marginRight: 10,
              marginTop: "3%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 5,
              width: "40%",
            }}
          >
            <TouchableOpacity>
              <Share01Icon />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/GroupChannelScreen")}
            >
              <GroupIcon />
            </TouchableOpacity>
            <TouchableOpacity>
              <OptionsIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View
          style={{
            borderRadius: 16,
            backgroundColor: "#1b1a2c",
            borderColor: "#282b32",
            borderWidth: 0.5,
            padding: 8,
            marginTop: "5%",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity>
              {icons ? (
                <UserIcon style={{ borderRadius: 24, width: 68, height: 68 }} />
              ) : (
                <Image
                  style={{ borderRadius: 24, width: 48, height: 48 }}
                  // contentFit="cover"
                  source={{ uri: "YOUR_DEFAULT_ICON_URL" }}
                />
              )}
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 20,
                    letterSpacing: -0.2,
                    lineHeight: 28,
                    fontFamily: fontFamilies.bold,
                    color: globalColors.neutralWhite,
                  }}
                >
                  Crypto Space
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  borderRadius: 16,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  marginLeft: "20%",
                  width: "20%",
                }}
              >
                <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 10,
                      lineHeight: 16,
                      fontFamily: fontFamilies.regular,
                      color: globalColors.neutralWhite,
                    }}
                  >
                    Public
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  color: globalColors.neutralWhite,
                  marginTop: "2%",
                }}
              >
                <Text style={{ fontFamily: fontFamilies.regular }}>
                  Group :NEWS
                </Text>
              </Text>
            </View>
          </View>
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
            }}
          >
            <TouchableOpacity
              onPress={() => router.push("/GroupMembersScreen")}
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
                <Text
                  style={{ color: globalColors.neutralWhite, fontSize: 14 }}
                >
                  03 users
                </Text>
              </GradientText>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
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
                02 Sub-groups
              </Text>
            </TouchableOpacity>
          </View>
          <ButtonTwo
            leftIcon={<SocialTokenIcon />}
            label={"Social token"}
            onPress={() => TokenGeneratorRef.current.expand()}
          />
        </View>
      </>
    );
  };

  const UserScreen = [
    {
      icon: <MuteIcon />,
      text: "Feed",
      onPress: () => MuteUnmuteRef.current.expand(),
      isDestructive: false,
    },
    {
      icon: <ClearChatIcon />,
      text: "Announcements",
      onPress: () => router.push("/ClaimGroupScreen"),
      isDestructive: false,
    },
    {
      icon: <EventsIcon />,
      text: "Events",
      onPress: () => router.push("/ReportProfileScreen"),
      isDestructive: false,
    },
  ];

  const MuteClaimComp = () => {
    return (
      <View
        style={{
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: globalColors.neutral2,
          borderWidth: 1,
          padding: "6%",
          marginTop: "5%",
        }}
      >
        {UserScreen.map((item, index) => (
          <View key={index}>
            <OptionItem
              icon={item.icon}
              text={item.text}
              onPress={item.onPress}
              isDestructive={item.isDestructive}
            />
            {index < UserScreen.length - 1 && (
              <View
                style={{
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  borderTopWidth: 0.5,
                  height: 1,
                  marginTop: "5%",
                }}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const options = [
    { label: "8 hours", value: "8_hours" },
    { label: "1 week", value: "1_week" },
    { label: "Always", value: "always" },
  ];

  const TokenData = [
    {
      id: 1,
      icon: <SocialTokenIcon />,
      text: "Social Token",
      text2: "Connect to your MetaMask wallet.",
      onPress: () => {
        TokenGeneratorRef.current.expand();
      },
    },
    {
      id: 2,
      icon: <SocialTokenIcon />,
      text: "  WalletConnect",
      text2: "Connect to your MetaMask wallet.",
      onPress: () => TokenGeneratorRef.current.expand(),
    },
  ];
  const renderOption = (option) => {
    const isSelected = selectedOption === option.value;

    return (
      <TouchableOpacity
        key={option.value}
        onPress={() => setSelectedOption(option.value)}
        style={{
          backgroundColor: isSelected ? "#3d3c4c" : "transparent",
          borderRadius: 8,
          borderColor: "#3d3c4c",
          borderWidth: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginTop: 16,
          width: "100%",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: globalColors.neutralWhite,
            fontFamily: fontFamilies.regular,
          }}
        >
          {option.label}
        </Text>
        {isSelected && <ArrowRightIcon />}
      </TouchableOpacity>
    );
  };

  return (
    <ViewWrapper>
      <View style={{ width: "90%" }}>
        <HeaderComponent />
        <MuteClaimComp />
      </View>
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
                  borderWidth: 0.5,
                  borderColor: "#212121",
                  padding: "1%",
                  borderRadius: 10,
                  shadowColor: "#4E4D5B",
                  shadowOpacity: 0.2,
                  elevation: 1,
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

          {options.map(renderOption)}

          <Button1 title="Mute" onPress={() => MuteUnmuteRef.current.close()} />
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
      <BottomSheetWrap bottomSheetRef={TokenGeneratorRef}>
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
                Token generator
              </Text>
              <View
                style={{
                  borderRadius: 10,
                  padding: "1%",
                  width: "100%",
                  right: "28%",
                }}
              >
                <Text
                  style={{
                    marginTop: "2.5%",
                    color: globalColors.neutral7,
                    fontSize: 16,
                  }}
                >
                  Please rename to proceed.
                </Text>
              </View>
            </View>
          </View>

          {TokenData.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                borderRadius: 8,
                borderColor: "#3d3c4c",
                borderWidth: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 8,
                marginTop: 16,
                width: "100%",
              }}
            >
              <View
                style={{
                  backgroundColor: globalColors.neutral3,

                  padding: "5%",
                  borderRadius: 15,
                }}
              >
                {item.icon}
              </View>
              <View style={{ padding: "5%" }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: globalColors.neutralWhite,
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  {item.text}
                </Text>
                <Text>{item.text2}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <Button1
            title="Mute"
            onPress={() => TokenGeneratorRef.current.close()}
          />
          <TouchableOpacity onPress={() => TokenGeneratorRef.current.close()}>
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

export default GroupChannelScreen;
