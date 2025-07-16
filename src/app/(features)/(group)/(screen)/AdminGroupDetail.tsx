import { View, Text, ScrollView, TouchableOpacity, Share } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CameraIcon,
  ChatIcon,
  CheckCircleIcon,
  ClaimGroupIcon,
  CopyIcon,
  DeleteIcon,
  ExitGroupIcon,
  GroupIcon,
  InfoIcon,
  MuteIcon,
  PhotoIcon,
  ReportIcon,
  ShareIcon,
  UnmuteIcon,
} from "@/assets/DarkIcon";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import useGroupsDetailViewModel from "../viewModel/GroupsDetailViewModel";
import InvitedUser from "../component/InvitedUser";
import GradientText from "@/components/element/GradientText";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import Button1 from "@/components/buttons/Button1";
import { UserProfile } from "./SuggestedGrpList";
import { showToast } from "@/components/atom/ToastMessageComponent";
import ViewWrapper from "@/components/ViewWrapper";
import { Image } from "expo-image";
import { ImageUrlConcated } from "@/utils/ImageUrlConcat";
import GoBackNavigation from "@/components/Header/GoBackNavigation";
import { useAppStore } from "@/zustand/zustandStore";
import { GrounInforeq } from "@/redux/reducer/group/GroupInfo";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { useSelector } from "react-redux";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { MuteGrouprequest } from "@/redux/reducer/group/MuteGroup";
import { useIsFocused } from "@react-navigation/native";
import { deletegroupReq } from "@/redux/reducer/group/DeleteGroup";
import Clipboard from "@react-native-clipboard/clipboard";
import { onJoinRequestList } from "@/redux/reducer/group/JoinRequestList";
import { onJoinRequestUpdate } from "@/redux/reducer/group/JoinRequestUpdate";
import { updateJoinRequestList } from "@/redux/slice/group/JoinRequestListSlice";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { htmlTagRemove } from "@/utils/htmlTagRemove";

const AdminGroupDetail = () => {
  useScreenTracking("AdminGroupDetail");
  const { groupId } = useLocalSearchParams();
  const Dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const { onGetGroupDetailsHandler, groupDetails }: any =
    useGroupsDetailViewModel();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const { userId } = useAppStore();

  const groupInfoData: any = useAppSelector((state) => state?.groupInfoSlice);
  const [Group_Name, setgroup_Name] = useState("");
  const [groupID, setgroupID] = useState("");
  const [loading, setloading] = useState(true);
  const [mute, setMute] = useState(null);

  const [categoryName, setCategoryName] = useState("");
  const [loopDescription, setLoopDescription] = useState("");
  const [loopCat, setLoopCat] = useState("");
  const [role, setrole] = useState(null);
  const [count, setCount] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [memberFee, setmemberFee] = useState("");
  const [select, setSelect] = useState(0);
  const [Slug, setSlug] = useState("");

  const [feeDistribution, setFeeDistribution] = useState("");
  const [inviteCount, setInviteCount] = useState("");
  const joinRequestListData = useAppSelector((state) => state?.joinRequestListData);
  useEffect(() => {
    try {
      if (
        groupInfoData &&
        groupInfoData?.data
      ) {
        if(groupInfoData?.data?.what_am_i?.id){
          Dispatch(onJoinRequestList({user_id: userId, groupId: groupInfoData?.data.id}));
        }
        const { loop_name } = groupInfoData?.data;
        const { slug } = groupInfoData?.data;
        const { role } = groupInfoData?.data?.what_am_i;
        const { id } = groupInfoData?.data;
        const { category_name } = groupInfoData?.data?.category;
        const { loop_description } = groupInfoData?.data;
        const { loop_cat } = groupInfoData?.data;
        const { count } = groupInfoData?.data?.member_count;
        const { subscription_type } = groupInfoData?.data;
        const { fee_distribution } = groupInfoData?.data;
        const { member_fee } = groupInfoData?.data;
        const Member_Count = groupInfoData?.data?.members?.length;
        
        setloading(false);
        setgroupID(id);
        setSlug(slug);
        setgroup_Name(loop_name ? loop_name : "");
        setCategoryName(category_name ? category_name : "");
        setLoopDescription(loop_description ? loop_description : "");
        setLoopCat(
          loop_cat && loop_cat === 1
            ? "Public"
            : loop_cat === 2
            ? "Private"
            : loop_cat === 3 ? "paid" : null
        );
        setrole(role ? role : "");
        setCount(count ? count : "");
        setSubscriptionType(subscription_type ? subscription_type : "-");
        setmemberFee(member_fee ? member_fee : "-");
        setFeeDistribution(fee_distribution ? fee_distribution : "-");
        setInviteCount(Member_Count ? Member_Count : "");
      } else {
        setloading(false);
      }
    } catch (err) {
      setloading(false);
      console.error(err);
    }
  }, [groupInfoData]);

  const [mutereq, setmuteReq] = useState(false);

  const SubmitMuteRequest = async (mute, muteUntill) => {
    const result: any = await Dispatch(
      MuteGrouprequest({
        user_id: userId,
        group_id: groupDetails.id,
        mute_status: mute,
        mute_untill: muteUntill,
      })
    );
    setmuteReq(result);
    return result;
  };

  useEffect(() => {
    try {
      const data: any = groupDetails?.what_am_i;
        setMute(data?.mute || data[0].mute || null);
    } catch (err) {
      console.error("Error in useEffect:", err);
    }
  }, [groupDetails, isFocused, mute]);

  useEffect(() => {
    if (SubmitMuteRequest) {
      onGetGroupDetailsHandler(groupId || groupInfoData?.data.id);
    }
  }, [mutereq, mute]);

  const deleteGroup = async () => {
    if (userId && (groupId || groupInfoData?.data.id)) {
      var response = await Dispatch(
        deletegroupReq({
          group_id: (groupId || groupInfoData?.data.id) as any,
          user_id: userId,
        })
      );

      if(response.payload.success){
if(router.canGoBack()){
      router.back();
    }
    else{
      router.replace("/DashboardScreen");
    }
      }
      else {
        showToast({type: "error", text1: response.payload.message || ''})
      }
    }
  };

  const RenderShimmer = () => (
    <View
      style={{
        width: "100%",
        height: 200,
        marginHorizontal: 5,
        marginBottom: 10,
        padding: 8,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <ShimmerPlaceholder
        style={{
          width: "18%",
          height: "40%",
          borderRadius: 5,
          marginBottom: "4%",
          left: "5%",
        }}
        shimmerColors={[
          globalColors.neutral3,
          globalColors.neutral5,
          globalColors.neutral4,
        ]}
      />
      <View style={{ flexDirection: "column" }}>
        <ShimmerPlaceholder
          style={{
            width: "70%",
            height: 25,
            borderRadius: 3,
            marginBottom: 16,
            left: "7%",
          }}
          shimmerColors={[
            globalColors.neutral3,
            globalColors.neutral5,
            globalColors.neutral4,
          ]}
        />
        <View style={{ flexDirection: "row" }}>
          <ShimmerPlaceholder
            style={{
              width: "25%",
              height: 25,
              borderRadius: 3,
              marginBottom: 10,
              left: "45%",
            }}
            shimmerColors={[
              globalColors.neutral3,
              globalColors.neutral5,
              globalColors.neutral4,
            ]}
          />
          <ShimmerPlaceholder
            style={{
              width: "50%",
              height: 25,
              borderRadius: 3,
              marginBottom: 10,
              left: "70%",
            }}
            shimmerColors={[
              globalColors.neutral3,
              globalColors.neutral5,
              globalColors.neutral4,
            ]}
          />
        </View>
      </View>
      <ShimmerPlaceholder
        style={{
          width: "15%",
          height: "30%",
          borderRadius: 5,
          marginBottom: "6%",
          right: "15%",
        }}
        shimmerColors={[
          globalColors.neutral3,
          globalColors.neutral5,
          globalColors.neutral4,
        ]}
      />
    </View>
  );
  const MAX_LINES = 3;
  const GroupHeaderComponent = useCallback(
    ({}: any) => {
      const lines: any = htmlTagRemove(loopDescription) || [];
      return (
        <View
          style={{
            borderRadius: 16,
            backgroundColor: globalColors.neutral2,
            borderColor: globalColors.neutral3,
            borderWidth: 0.5,
            padding: 8,
            marginBottom: "-2.5%",
            top: "1%",
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
                padding: "5%",
                backgroundColor: globalColors.neutral3,
                borderRadius: 50,
              }}
            >
              {groupInfoData?.data?.loop_logo && groupInfoData?.data?.loop_logo?.length > 0 ? (
                <Image
                  style={{
                    borderRadius: 24,
                    width: 58,
                    height: 58,
                    backgroundColor: globalColors?.neutralWhite,
                  }}
                  contentFit="cover"
                  source={{ uri: ImageUrlConcated(groupInfoData?.data?.loop_logo) }}
                />
              ) : (
                <Image
                  style={{ borderRadius: 40, width: 34, height: 34 }}
                  contentFit="cover"
                  source={require("./../../../../assets/image/EmptyProfileIcon.webp")}
                />
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text
                style={{
                  fontSize: 20,
                  letterSpacing: -0.2,
                  lineHeight: 28,
                  fontFamily: fontFamilies.bold,
                  color: globalColors.neutral_white["100"],
                }}
                numberOfLines={2}
              >
                {Group_Name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 20,
                  color: globalColors.neutral_white["300"],
                  fontFamily: fontFamilies.regular,
                }}
              >
                Category: {categoryName}
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
                  {loopCat}
                </Text>
              </View>
            </View>
          </View>

          <Text
            numberOfLines={isExpanded ? undefined : 3}
            onTextLayout={(e) => {
              setShowReadMore(e.nativeEvent.lines.length > MAX_LINES);
            }}
            style={{
              fontFamily: fontFamilies.regular,
              fontSize: 14,
              color: globalColors.neutral8,
              marginTop: "5%",
              marginLeft: "3%",
            }}
          >
            {lines.map((line: any, index: any) => (
                    <Text key={index}>
                      {line.trim()}
                    </Text>
                  ))}
          </Text>
          {showReadMore ? (
            <TouchableOpacity
              style={{ alignSelf: "flex-start", left: "4%" }}
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <GradientText
                style={{
                  fontFamily: fontFamilies.bold,
                  fontSize: 14,
                  color: globalColors.darkOrchid,
                  marginTop: "1%",
                }}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </GradientText>
            </TouchableOpacity>
          ) : null}

          <View
            style={{
              borderTopWidth: 0.2,
              borderColor: "rgba(255, 255, 255, 0.15)",
              marginTop: "5%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: "3%",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/GroupMembersScreen",
                  params: { groupId: groupId || groupInfoData?.data.id },
                });
              }}
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
                  {count} Users
                </Text>
              </GradientText>
            </TouchableOpacity>

            {/* <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/ChannelGroupInfoScreen",
                params: { id: groupId || groupInfoData?.data.id },
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
              {groupDetails?.channels_aggregate?.aggregate?.count || ''}Sub-groups
            </Text>
          </TouchableOpacity> */}
          </View>
        </View>
      );
    },
    [groupInfoData?.data, Group_Name]
  );

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
            color: isDestructive
              ? globalColors.warning
              : globalColors.neutralWhite,
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

  const InfoItem = ({ text }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: "2.8%",
        width: "100%",
        bottom: "3%",
      }}
    >
      <View
        style={{
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          alignItems: "center",
          justifyContent: "center",
          padding: "2%",
        }}
      >
        <GroupIcon />
      </View>
      <Text
        numberOfLines={2}
        style={{
          fontSize: 14,
          lineHeight: 20,
          fontFamily: fontFamilies.regular,
          color: globalColors.neutralWhite,
          left: "20%",
        }}
      >
        {text}
      </Text>
    </View>
  );

  const UserOption =  [
    {
      icon: mute === 0 ? <MuteIcon /> : <UnmuteIcon />,
      text: mute === 1 ? "Unmute" : "Mute",
      onPress: () => handleMuteToggle(),

      isDestructive: false,
    },
    ...((groupInfoData?.data.user_id == 2 && userId != 2)?[{
      icon: <ClaimGroupIcon />,
      text: "Claim group",
      onPress: () => router.push("/ClaimGroupScreen"),
      isDestructive: false,
    }]:[]),
    {
      icon: <ReportIcon />,
      text: "Report group",
      onPress: () => router.push("/ReportProfileScreen"),
      isDestructive: false,
    },
    {
      icon: <ExitGroupIcon />,
      text: "Exit group",
      onPress: () => ExitGroupRef.current.expand(),
      isDestructive: true,
    },
  ];

  const AdminOption = [
    {
      icon: mute === 0 ? <MuteIcon /> : <UnmuteIcon />,
      text: mute === 1 ? "Unmute" : "Mute",
      onPress: () => handleMuteToggle(),

      isDestructive: false,
    },
    ...((groupInfoData?.data.user_id == 2 && userId != 2)?[{
      icon: <ClaimGroupIcon />,
      text: "Claim group",
      onPress: () => router.push("/ClaimGroupScreen"),
      isDestructive: false,
    }]:[]),
    {
      icon: <DeleteIcon />,
      text: "Delete group",
      onPress: () => DeleteGrpRef.current.expand(),
      isDestructive: true,
    },
  ];

  const MuteClaimComp = () => {
    const optionList = role === 1 ? AdminOption : UserOption;
    return (
      <View
        style={{
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: globalColors.neutral2,
          borderWidth: 1,
          padding: "6%",
          marginTop: "2.8%",
        }}
      >
        {optionList.map((item, index) => (
          <View key={index}>
            <OptionItem
              icon={item.icon}
              text={item.text}
              onPress={item.onPress}
              isDestructive={item.isDestructive}
            />
            {index < optionList.length - 1 && (
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

  const groupInfoDatareq = () => {
    if (groupId != groupInfoData?.data?.id) {
      setloading(true);
      Dispatch(
        GrounInforeq({
          user_id: userId,
          groupId: groupId || groupInfoData?.data?.id,
          fromApp: 1,
        })
      );
    }
  };

  useEffect(() => {
    groupInfoDatareq();
  }, [userId, groupId]);

  const MediaLink = () => (
    <TouchableOpacity
      onPress={() => console.log(" Media, Links and Docs was clicked")}
      style={{
        borderRadius: 8,
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        borderColor: "#282b32",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5%",
        marginTop: "2.8%",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <PhotoIcon />
        <Text
          style={{
            fontSize: 14,
            lineHeight: 18,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            marginLeft: 8,
          }}
        >
          Media, Links and Docs
        </Text>
      </View>
      <ArrowRightIcon />
    </TouchableOpacity>
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `https://qoneqt.com/groups/${Slug}`,
        title: "Share Profile",
      });
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const profileUrl = `https://qoneqt.com/groups/${Slug}`;
  const copyToClipboard = () => {
    Clipboard.setString(profileUrl);
    showToast({ type: "success", text1: "Link copied to clipboard!" });
  };

  const ShareLink = () => {
    return (
      <View
        style={{
          alignSelf: "stretch",
          borderRadius: 8,
          backgroundColor: globalColors.neutral2,
          borderStyle: "solid",
          borderColor: "#282b32",
          borderWidth: 1,
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "5%",
          marginTop: "2.3%",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral9,
            }}
          >
            Share this link to join this channel
          </Text>
          <TouchableOpacity style={{ left: "10%" }} onPress={onShare}>
            <ShareIcon height={24} width={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={copyToClipboard}>
            <CopyIcon />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onShare}>
          <Text
            style={{
              alignSelf: "stretch",
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutralWhite,
              marginTop: 8,
              textDecorationLine: "underline",
            }}
          >
            {`https://qoneqt.com/groups/${Slug}`}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const SubcriptionDetail = () => {
    return (
      <>
        <Text
          style={{
            fontSize: 20,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutralWhite,
            marginTop: "2.8%",
          }}
        >
          Subscription details
        </Text>
        <View
          style={{
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderColor: globalColors.neutral2,
            borderWidth: 1,
            padding: "5%",
            marginTop: "2.5%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Text style={{ color: globalColors.neutralWhite, fontSize: 16 }}>
              Subscription Type{"                      "}
            </Text>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 16,
                left: "100%",
              }}
            >
              {subscriptionType}
            </Text>
          </View>
          <View
            style={{
              borderColor: "rgba(255, 255, 255, 0.15)",
              borderTopWidth: 0.5,
              height: 1,
              marginTop: "5%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              marginTop: "4%",
            }}
          >
            <Text style={{ color: globalColors.neutralWhite, fontSize: 16 }}>
              Member Fee{"                      "}
            </Text>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 16,
                left: "240%",
              }}
            >
              {memberFee} ₹{" "}
            </Text>
          </View>
          <View
            style={{
              borderColor: "rgba(255, 255, 255, 0.15)",
              borderTopWidth: 0.5,
              height: 1,
              marginTop: "5%",
            }}
          />
          <View
            style={{
              flexDirection: "row",
              marginTop: "4%",
            }}
          >
            <Text style={{ color: globalColors.neutralWhite, fontSize: 16 }}>
              Fee Distribution{"                      "}
            </Text>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 16,
                left: "100%",
              }}
            >
              {feeDistribution}
            </Text>
          </View>
        </View>
      </>
    );
  };

  const AcceptReqRef = useRef<BottomSheet>(null);
  const mediaLinkRef = useRef<BottomSheet>(null);
  const MuteNotifiRef = useRef<BottomSheet>(null);
  const removeMemberRef = useRef<BottomSheet>(null);
  const ClearConRef = useRef<BottomSheet>(null);
  const ShareViaRef = useRef<BottomSheet>(null);
  const UserRequestRef = useRef<BottomSheet>(null);
  const ExitGroupRef = useRef<BottomSheet>(null);
  const DeleteGrpRef = useRef<BottomSheet>(null);
  const MuteUnmuteRef = useRef<BottomSheet>(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = [
    { label: "8 hours", value: 1 },
    { label: "1 week", value: 2 },
    { label: "Always", value: 3 },
  ];

  const [isViewAllRequest, setIsViewAllRequest] = useState(false);

  const filteredData = useMemo(() => {
    if (joinRequestListData?.data?.length == 0) return [];
    
    const filteredMembers = joinRequestListData?.data || []
    
    // If isViewAllRequest is false, show only first 3 items
    return isViewAllRequest ? filteredMembers : filteredMembers.slice(0, 3);
  }, [joinRequestListData, isViewAllRequest]);

  const renderOption = (option) => {
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
    onGetGroupDetailsHandler(groupId || groupInfoData?.data.id);
  }, [mutereq, mute]);

  const handleMuteToggle = async () => {
    if (mute === 1) {
      SubmitMuteRequest(0, selectedOption);
      MuteUnmuteRef.current.close();
    } else {
      MuteUnmuteRef.current.expand();
    }
  };
  const isAdmin = groupInfoData?.data
    ? groupInfoData?.data.length > 0 &&
      groupInfoData?.data.what_am_i.length > 0 &&
      groupInfoData?.data.what_am_i.role == 1
    : false;

    const sendRequestHandler = async ({member, change}: any) => {
      const reqData: any = {
        user_id: userId,
        group_id: groupId || groupInfoData?.data.id,
        change: change,
        join_uid: member.id,
        fromApp: 1,
      }
      console.log("reqData", reqData, member);
      const result = await Dispatch(
        onJoinRequestUpdate(reqData)
      );
      if(result.payload.success){
        showToast({ type: "success", text1: result.payload.message });
        var joinData = joinRequestListData?.data?.filter((item: any) => item.id !== member.id);
        Dispatch(updateJoinRequestList(joinData));
      }
      else{
        showToast({ type: "error", text1: result.payload.message });
      } 
    }

    const backPress = () => {
      router.back();
    }
  return (
    <ViewWrapper>
      {loading ? (
        <RenderShimmer />
      ) : (
        <View style={{ width: "95%" }}>
          <GoBackNavigation header="Group Info" isBack backPress={backPress} isDeepLink={"false"} />
          <GroupHeaderComponent />
          <ScrollView
            style={{ marginBottom: "100%", marginTop: "8%" }}
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                marginTop: "2.8%",
              }}
            >
              Manage group
            </Text>
            <ShareLink />
            <MuteClaimComp />

            {isAdmin && (
              <>
                {loopCat == "paid" && <SubcriptionDetail />}
                {joinRequestListData?.data?.length > 0 && (
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutral8,
                    marginTop: "2.8%",
                  }}
                >
                  {joinRequestListData?.data?.length > 0 ? "Invitations" : "Invitations"} ({joinRequestListData?.data?.length})
                </Text>
                )}
                {filteredData.map(
                    (member) =>
                        <InvitedUser
                          key={member.id}
                          userName={member.user.username || ''}
                          socialName={member.user.social_name || member.user.full_name}
                          profilePic={member.user.profile_pic}
                          NotifiRef={MuteNotifiRef}
                          acceptPress={() => sendRequestHandler({member, change: 1})}
                          rejectPress={() => sendRequestHandler({member, change: 2})}
                        />

                  )}
                {groupInfoData.data.members.length > 3 && (
                <TouchableOpacity
                  style={{
                    marginTop: "3%",
                    justifyContent: "center",
                    width: "100%",
                    flexDirection: "row",
                  }}
                  onPress={() => setIsViewAllRequest(true)} // Open Bottom Sheet on Click
                >
                  <GradientText
                    style={{
                      fontFamily: fontFamilies.bold,
                      fontSize: 18,
                      color: globalColors.darkOrchidShade20,
                      letterSpacing: 0.3,
                      marginTop: "10%",
                      alignSelf: "center",
                    }}
                  >
                    {isViewAllRequest ? "Hide request" : "View all request"}
                  </GradientText>
                  <ArrowUpIcon style={{ top: "3%" }} />
                </TouchableOpacity>
                )}
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: fontFamilies.regular,
                    color: globalColors.neutral8,
                    marginTop: "2.8%",
                  }}
                >
                  Other information
                </Text>
                <InfoItem
                  text={
                    "Only group members can access and \nengage in posts and channels"
                  }
                />
                <InfoItem
                  text={"This is a Public group. Anyone can join this \ngroup."}
                />
                <InfoItem
                  text={
                    "Group rules are enforced by Group admins \nand are in addition to Qoneqt’s rules."
                  }
                />
              </>
            )}
          </ScrollView>

          <BottomSheetWrap bottomSheetRef={AcceptReqRef}>
            <View style={{ width: "100%", justifyContent: "center" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Request perks
              </Text>
            </View>
            <Text
              style={{
                color: globalColors.neutralWhite,
                marginTop: "8%",
                textAlign: "center",
              }}
            >
              You can request for a min of 10 to max of 100 perks a day to the
              admin.
            </Text>
            <View style={{ width: "100%", marginTop: "5%" }}>
              {groupDetails?.members?.map(
                (member) =>
                  member?.details && (
                    <InvitedUser
                      key={member.user_id}
                      userName={member.details.username}
                      socialName={member.details.social_name}
                      profilePic={member.details.profile_pic}
                      AcceptReqRef={AcceptReqRef}
                    />
                  )
              )}
            </View>
            <Button1
              isLoading={false}
              title="Send request"
              onPress={() => AcceptReqRef.current.close()}
            />
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

          </BottomSheetWrap>
          <BottomSheetWrap bottomSheetRef={mediaLinkRef}>
            <View style={{ alignItems: "center", marginLeft: "1%" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "6%",
                }}
              >
                <PhotoIcon />
                <Text
                  style={{ color: globalColors.neutralWhite, fontSize: 16 }}
                >
                  Choose from gallery
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "6%",
                }}
              >
                <CameraIcon />
                <Text
                  style={{ color: globalColors.neutralWhite, fontSize: 16 }}
                >
                  Take a picture
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "6%",
                }}
              >
                <ChatIcon />
                <Text style={{ color: globalColors.warning, fontSize: 16 }}>
                  Remove channel image
                </Text>
              </View>
              <Button1
                isLoading={false}
                title="Cancel"
                onPress={() => mediaLinkRef.current.close()}
              />
            </View>
          </BottomSheetWrap>
          <BottomSheetWrap bottomSheetRef={ExitGroupRef}>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                  marginBottom: "5%",
                }}
              >
                Exit Group
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
                  }}
                >
                  <Text style={{ color: globalColors.neutralWhite }}>
                    Are you sure you want delete “Crypto Space” group?
                  </Text>
                  Only admins will be notified that you left the group
                </Text>
              </View>
              <Button1
                isLoading={false}
                title="Cancel"
                onPress={() => ExitGroupRef.current.close()}
              />
              <TouchableOpacity onPress={() => router.push("/ExitModal")}>
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
                    Exit
                  </Text>
                </GradientText>
              </TouchableOpacity>
            </View>
          </BottomSheetWrap>
          <BottomSheetWrap bottomSheetRef={MuteNotifiRef}>
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 23,
                  textAlign: "center",
                  marginBottom: 20,
                  fontWeight: "600",
                }}
              >
                More
              </Text>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                }}
              >
                <InfoIcon />
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontSize: 18,
                    marginLeft: 15,
                  }}
                >
                  Group info
                </Text>
              </TouchableOpacity>

              {(groupInfoData?.data.user_id == 2 && userId != 2) && <TouchableOpacity
                onPress={() => router.push("/ClaimGroupScreen")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                }}
              >
                <ClaimGroupIcon />
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontSize: 18,
                    marginLeft: 15,
                  }}
                >
                  Claim group
                </Text>
              </TouchableOpacity>}

              <TouchableOpacity
                onPress={() => router.push("/ReportUser")}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                }}
              >
                <ReportIcon />
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontSize: 18,
                    marginLeft: 15,
                  }}
                >
                  Report group
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => ExitGroupRef.current.expand()}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                }}
              >
                <ExitGroupIcon />
                <Text
                  style={{
                    color: globalColors.warning,
                    fontSize: 18,
                    marginLeft: 15,
                  }}
                >
                  Exit group
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetWrap>
          <BottomSheetWrap bottomSheetRef={removeMemberRef}>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                  marginBottom: "5%",
                }}
              >
                Block user
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
                    color: "gray",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  This individual won’t be able to send you direct messages and
                  you cannot find their messages on channel chat.
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
                  <Text
                    style={{ color: globalColors.neutralWhite, fontSize: 17 }}
                  >
                    Cancel
                  </Text>
                </GradientText>
              </TouchableOpacity>
            </View>
          </BottomSheetWrap>
          <BottomSheetWrap bottomSheetRef={ClearConRef}>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                  marginBottom: "5%",
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
                    color: "gray",
                    fontSize: 14,
                    textAlign: "center",
                  }}
                >
                  This conversation will be deleted from your inbox. Other
                  people in the conversation will still be able to see it.
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
          <BottomSheetWrap
            bottomSheetRef={MuteUnmuteRef}
            snapPoints={["20%", "70%"]}
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
                      The chat stays muted privately, without alerting others,
                      while you still receive notifications if mentioned.
                    </Text>
                  </View>
                </View>
              </View>

              {options.map(renderOption)}

              <Button1
                title="Mute"
                onPress={() => {
                  SubmitMuteRequest(1, selectedOption);
                  MuteUnmuteRef.current.close();
                }}
              />
              <TouchableOpacity onPress={() => MuteUnmuteRef.current.close()}>
                <GradientText
                  style={{
                    fontFamily: fontFamilies.semiBold,
                    fontSize: 17,
                    color: globalColors.darkOrchid,
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
                  }}
                >
                  Share group info
                </Text>
              </View>
              <ShareLink />
            </View>
          </BottomSheetWrap>
          <BottomSheetWrap bottomSheetRef={UserRequestRef}>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: globalColors.neutralWhite,
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Accept request
              </Text>
              <View style={{ width: "100%", marginTop: 16 }}>
                <UserProfile />
              </View>
              <View
                style={{
                  width: "100%",
                  marginTop: 16,
                  backgroundColor: globalColors.slateBlueShade60,
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  To approve Deekshith request, please click "accept."
                </Text>
              </View>
              <Button1
                title="Accept"
                onPress={() => UserRequestRef.current.close()}
              />
              <TouchableOpacity onPress={() => UserRequestRef.current.close()}>
                <GradientText
                  style={{
                    fontFamily: fontFamilies.bold,
                    fontSize: 17,
                    color: globalColors.darkOrchid,
                  }}
                >
                  <Text
                    style={{ color: globalColors.neutralWhite, fontSize: 17 }}
                  >
                    Reject
                  </Text>
                </GradientText>
              </TouchableOpacity>
            </View>
          </BottomSheetWrap>
          <BottomSheetWrap bottomSheetRef={DeleteGrpRef}>
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
                    Are you sure you want delete "{Group_Name}" group?{" "}
                  </Text>
                  Losing all data from the feed, announcement and events
                  channels is irreversible and cannot be recovered.
                </Text>
              </View>
              <Button1
                isLoading={false}
                title="Cancel"
                onPress={() => DeleteGrpRef.current.close()}
              />
              <TouchableOpacity
                onPress={() => {
                  deleteGroup();
                  router.push("/DashboardScreen");
                  DeleteGrpRef.current.close();
                }}
              >
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
                    Delete group
                  </Text>
                </GradientText>
              </TouchableOpacity>
            </View>
          </BottomSheetWrap>
        </View>
      )}
    </ViewWrapper>
  );
};

export default AdminGroupDetail;
