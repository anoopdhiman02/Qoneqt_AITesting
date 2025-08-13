import { Image } from "expo-image";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  Dimensions,
  BackHandler,
} from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import Button1 from "../../components/buttons/Button1";
import { CopyIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import StepIndicator from "./StepIndicator";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { useEffect, useRef, useState } from "react";
import { ImageFallBackUser, ImageUrlConcated } from "@/utils/ImageUrlConcat";
import moment from "moment";
import Clipboard from "@react-native-clipboard/clipboard";
import { setPrefsValue } from "@/utils/storage";
import { useAppSelector } from "@/utils/Hooks";
import RadioButton from "@/components/RadioButton";
import { useDispatch } from "react-redux";
import { onFetchReferral } from "@/redux/reducer/Transaction/FetchReferral";
import { useAppStore } from "@/zustand/zustandStore";
import { router, useLocalSearchParams } from "expo-router";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import UserStoreDataModel from "@/viewModels/UserStoreDataModal";
const { width, height } = Dimensions.get("window");

const ReferralScreen = () => {
  useScreenTracking("ReferralScreen");
  const [atBottom, setAtBottom] = useState(false);
  const [isSendInvite, setIsSendInvite] = useState(false);
  const [isRefStatus, setIsRefStatus] = useState(false);
  const [isYourRef, setIsYourRef] = useState(true);
  const scrollRef: any = useRef(null);
  const referralResponse: any = useAppSelector((state) => state.fetchReferralData);
  const list = referralResponse?.data?.list || [];
  const dispatch = useDispatch();
  const { userId } = useAppStore();
  const params = useLocalSearchParams();
   const { updateUserData } = UserStoreDataModel();
  useEffect(() => {
    //@ts-ignore
    dispatch(onFetchReferral({ userId: userId }));
    const backHandler = BackHandler.addEventListener(
              "hardwareBackPress",
              () => {
                if (router.canGoBack()) {
                  router.back();
                }
                else{
                  updateUserData();
                  router.replace("/DashboardScreen");
                }
                return true;
              }
            );
    return () => {
      backHandler.remove();
      setPrefsValue("notificationInfo", "");
    };
  }, []);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  // Check if user is at bottom
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    setAtBottom(isBottom);
  };

  const ReferredUser = ({ referredData = [] }) => (
    <View style={{ marginTop: "3%", marginVertical: "100%" }}>
      <TouchableOpacity onPress={()=>setIsYourRef(!isYourRef)} style={{flexDirection: 'row', alignItems:'center', marginBottom: "2.8%",width: '100%', justifyContent: 'space-between'}}>
      <Text
        style={{
          fontSize: 20,
          // lineHeight: 21,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutralWhite,
          marginLeft: "2%",
          
        }}
      >
        Your Referral
      </Text>
      <RadioButton isActive={isYourRef}/>
      </TouchableOpacity>
      {isYourRef && (<View>
      {list.length > 0 ? (
        list.map((user) => (
          <View
            key={user.id}
            style={{
              borderRadius: 8,
              backgroundColor: globalColors.neutral2,
              borderColor: globalColors.neutral3,
              borderWidth: 1,
              padding: 16,
              marginBottom: 16,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <ImageFallBackUser
                imageData={user.profile_pic}
                fullName={user.full_name}
                widths={width * 0.1}
                heights={width * 0.1}
                borders={width * 0.1}
              />
              <View
                style={{
                  marginLeft: 8,
                  width: width * 0.3,
                  overflow: "hidden",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: fontFamilies.semiBold,
                    color: globalColors.neutralWhite,
                  }}
                >
                  {user.full_name || "Unknown User"}
                </Text>
                {/* <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 4,
                  }}
                >
                  <CryptoCurrencyIcon />
                  <Text
                    style={{
                      fontSize: 14,
                      lineHeight: 18,
                      fontFamily: fontFamilies.semiBold,
                      color: globalColors.neutral7,
                      marginLeft: 4,
                    }}
                  >
                    {`${user.wallet_balance} coins`}
                  </Text>
                </View> */}
                <Text
                  style={{
                    fontSize: 14,
                    lineHeight: 18,
                    fontFamily: fontFamilies.semiBold,
                    color:
                      user.kyc_status == 1
                        ? globalColors.success
                        : globalColors.pendingInProgress,
                  }}
                >
                  {`${user.kyc_status == 1 ? "Verified" : "Pending"}`}
                </Text>
              </View>
            </View>
            <View style={{ width: width * 0.35 }}>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.regular,
                  color: globalColors.neutral7,
                }}
              >
                Referred on:
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 18,
                  fontFamily: fontFamilies.semiBold,
                  color: globalColors.neutralWhite,
                  marginTop: 4,
                }}
              >
                {moment
                  .utc(user.time)
                  .utcOffset("+05:30")
                  .format("h:mm A, MMM D YYYY")}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <Text
          style={{
            fontSize: 17,
            color: globalColors.neutral7,
            textAlign: "center",
            fontFamily: fontFamilies.semiBold,
            marginTop: "5%",
          }}
        >
          No referrals yet
        </Text>
      )}
      </View>) }
      
    </View>
  );

  const ReferralStatus = () => (
    <View style={{ marginTop: "3%" }}>
      <TouchableOpacity onPress={()=>setIsRefStatus(!isRefStatus)} style={{flexDirection: 'row', alignItems:'center', marginBottom: "2.8%", width: '100%', justifyContent: 'space-between'}}>
      
      <Text
        style={{
          fontSize: 20,
          fontFamily: fontFamilies.semiBold,
          color: globalColors.neutralWhite,
          marginLeft: "2%",
          
        }}
      >
        Referral Status
      </Text>
      <RadioButton isActive={isRefStatus}/>
      </TouchableOpacity>
      {isRefStatus && (<View
        style={{
          borderRadius: 8,
          backgroundColor: globalColors.neutral2,
          borderColor: globalColors.neutral3,
          borderWidth: 1,
          padding: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
          }}
        >
          Referral
        </Text>
        <View
          style={{
            borderTopWidth: 0.5,
            borderColor: globalColors.neutral4,
            marginBottom: "2.8%",
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral7,
            }}
          >
            Verified Referrals
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
            }}
          >
            {referralResponse.data?.kycApprovedCount}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral7,
            }}
          >
            Referral Earnings
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
            }}
          >
            {referralResponse?.data?.refEarnApproved}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral7,
            }}
          >
            Referral Pending
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 18,
              fontFamily: fontFamilies.semiBold,
              color: globalColors.neutralWhite,
            }}
          >
            {referralResponse?.data?.refEarnPending}
          </Text>
        </View>
      </View>) }
      
    </View>
  );

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: referralResponse?.data?.refer_link,
        title: "Share Invite",
      });
      if (result.action === Share.sharedAction) {
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const copyToClipboard = () => {
    const profileUrl =
      referralResponse?.data?.refer_link ||
      "http://www.qoneqt.com/testReferral";
    Clipboard.setString(profileUrl);
    showToast({ type: "success", text1: "Link copied to clipboard!" });
  };

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
        {referralResponse?.data?.refer_link
          ? referralResponse?.data?.refer_link
          : null}
      </Text>
      <TouchableOpacity onPress={() => copyToClipboard()}>
        <CopyIcon />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const ReferFriend = () => (
    <View style={{ alignItems: "center", marginVertical: 24 }}>
      <Text
        style={{
          fontSize: 22,
          lineHeight: 24,
          fontFamily: fontFamilies.bold,
          color: globalColors.neutralWhite,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Refer friends and earn!
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 18,
          fontFamily: fontFamilies.regular,
          color: globalColors.neutral7,
          textAlign: "center",
        }}
      >
        For every referral you and your{"\n"}friends get{" "}
        <Text
          style={{
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
          }}
        >
          ₹83
        </Text>
      </Text>
    </View>
  );

  const handleBackPress = () => {
    if(router.canGoBack()){
      router.back();
    }
    else{
      updateUserData();
      router.replace("/DashboardScreen");
    }
  };

  return (
    <ViewWrapper>
      <View style={{  width: "90%", flex:1 }}>
        <GoBackNavigation header="Refer & earn" 
        isDeepLink={params.isNotification}
        isHome={params.isNotification == "true"}
        isBack={params.isNotification != "true"}
        backPress={handleBackPress} 
         />
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          bounces={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <TouchableOpacity activeOpacity={1}>
          <Image
            style={{
              width: width *0.8,
              height: height *0.4,
              alignSelf: "center",
              marginTop: "5%",
            }}
            contentFit="cover"
            source={require("@/assets/image/image4.png")}
          />
          <ReferFriend />
          <Link />
          <Button1
            isLoading={false}
            title="Share Invite"
            onPress={() => onShare()}
          />
          <StepIndicator isActive={isSendInvite} onPress={()=>setIsSendInvite(!isSendInvite)} />
          <ReferralStatus />
          <ReferredUser />
          {/* <View style={{height:Dimensions.get("window").height * 0.01}}/> */}
          </TouchableOpacity>
        </ScrollView>
        {!atBottom && (
          <TouchableOpacity
            style={{
              padding: 10,
              position: "absolute",
              bottom: 10,
              alignSelf: "center",
            }}
            onPress={scrollToBottom}
          >
            <Image
              style={{ width: 30, height: 30 }}
              source={require("../../assets/image/down_arrow.png")}
            />
          </TouchableOpacity>
        )}
      </View>
    </ViewWrapper>
  );
};

export default ReferralScreen;
