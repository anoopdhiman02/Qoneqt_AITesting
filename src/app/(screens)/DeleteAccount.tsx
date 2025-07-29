import { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import ViewWrapper from "../../components/ViewWrapper";
import Button1 from "../../components/buttons/Button1";
import { router } from "expo-router";
import GoBackNavigation from "../../components/Header/GoBackNavigation";
import BottomSheet from "@gorhom/bottom-sheet";
import BottomSheetWrap from "../../components/bottomSheet/BottomSheetWrap";
import { CheckCircleIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import { useAppDispatch, useAppSelector } from "@/utils/Hooks";
import { onDeleteAccount } from "@/redux/reducer/Profile/setting/DeleteAccount";
import { useAppStore } from "@/zustand/zustandStore";
import { showToast } from "@/components/atom/ToastMessageComponent";
import { clearUserData } from "@/localDB/LocalStroage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OnLogoutReq } from "@/redux/reducer/login/LogoutReq";
import { getRefreshToken } from "@/localDB/TokenManager";

const Caption = () => (
  <View>
    <Text
      style={{
        marginTop: 15,
        fontSize: 14,
        lineHeight: 21,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutralWhite,
        marginBottom: 16,
      }}
    >
      You will lose all of your data by deleting your account. This action
      cannot be undone.
    </Text>
    <Text
      style={{
        alignSelf: "stretch",
        fontSize: 14,
        lineHeight: 21,
        fontFamily: fontFamilies.regular,
        color: globalColors.neutralWhite,
        marginBottom: 16,
      }}
    >
      Please state a reason for deleting your account. Your feedback will help
      us improve. Thank you.
    </Text>
  </View>
);

const reasons = [
  {
    id: 1,
    title: "Difficulty of use",
    description: "Finding it hard to navigate through the app",
  },
  {
    id: 2,
    title: "Using other product",
    description: "Using a similar product",
  },
  {
    id: 3,
    title: "Missing functionality",
    description: "Seems not to have what I’m looking for",
  },
  {
    id: 4,
    title: "Prefer not to say",
    description: "I’ll keep it to myself",
  },
];

const ReasonItem = ({ reason, isSelected, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        alignSelf: "stretch",
        borderRadius: 8,
        borderColor: isSelected ? globalColors.neutralWhite : "#282b32",
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        padding: "5%",
        marginTop: "5%",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            lineHeight: 20,
            color: globalColors.neutralWhite,
          }}
        >
          {reason.title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: globalColors.neutral9,
            marginTop: "3%",
          }}
        >
          {reason.description}
        </Text>
      </View>
      {isSelected && <CheckCircleIcon />}
    </View>
  </TouchableOpacity>
);

const DeleteAccount = () => {
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();
  const [selectedReason, setSelectedReason] = useState(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const refreshToken = getRefreshToken();

  const onDeleteAccountHandler = async () => {
    var deleteAccountData = await Dispatch(
      onDeleteAccount({ userId: userId, reason: selectedReason?.title })
    );
    if (deleteAccountData?.payload?.success) {
      showToast({
        type: "success",
        text1: deleteAccountData?.payload?.message,
      });
      await clearUserData();
      var ref_token = await AsyncStorage.getItem("ref_token");
      Dispatch(
        OnLogoutReq({ user_id: userId, token: ref_token || refreshToken })
      );
      Dispatch({ type: "LOGOUT" });
      router.dismissAll();
      router.replace("/LoginScreen");
    } else {
      showToast({ type: "error", text1: deleteAccountData?.payload?.message });
    }
  };

  return (
    <ViewWrapper>
      <View style={{ width: "90%" }}>
        <GoBackNavigation header="Delete account" isDeepLink={true} />
        <Caption />
        {reasons.map((reason) => (
          <ReasonItem
            key={reason.id}
            reason={reason}
            isSelected={selectedReason?.id === reason.id}
            onPress={() => setSelectedReason(reason)}
          />
        ))}
        <Button1
          isLoading={false}
          title="Cancel"
          onPress={() => router.push("/SettingScreen")}
        />
        <TouchableOpacity onPress={() => bottomSheetRef.current.expand()}>
          <GradientText
            style={{
              fontFamily: fontFamilies.semiBold,
              fontSize: 17,
              color: globalColors.warmPink,
            }}
          >
            {"Delete Account"}
          </GradientText>
        </TouchableOpacity>
      </View>
      <BottomSheetWrap
        snapPoints={["20%", "30%"]}
        bottomSheetRef={bottomSheetRef}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 22,
              textAlign: "center",
            }}
          >
            Delete Account
          </Text>
          <Text
            style={{
              color: "grey",
              marginTop: "1%",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Are you sure you want to delete your account?
          </Text>
          <Button1
            isLoading={false}
            title="Cancel"
            onPress={() => bottomSheetRef.current.close()}
          />
          <TouchableOpacity onPress={onDeleteAccountHandler}>
            <GradientText
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 17,
                color: globalColors.warmPink,
              }}
            >
              <Text style={{ fontSize: 17 }}> Delete Account</Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>
    </ViewWrapper>
  );
};

export default DeleteAccount;
