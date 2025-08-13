import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import Button1 from "../../../../components/buttons/Button1";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import { useLocalSearchParams } from "expo-router";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import { CheckCircleIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import useProfileViewModel from "../viewModel/ProfileViewModel";
import GradientText from "@/components/element/GradientText";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import BottomSheet from "@gorhom/bottom-sheet";
import UpdatePicture from "../component/UpdatePicture";
import BasicInfoComponent from "../component/BasicInfoComponent";
import PreferenceScreen from "../component/PreferenceScreen";
import { useScreenTracking } from "@/customHooks/useAnalytics";
import { onProfileFavouriteUpdate } from "@/redux/reducer/Profile/AddPreference";
import { useDispatch, useSelector } from "react-redux";
import { useAppStore } from "@/zustand/zustandStore";
const { height, width } = Dimensions.get("screen");

const UpdateProfileScreen = () => {
  useScreenTracking("UpdateProfileScreen");
  const params = useLocalSearchParams();
  const TopTabBar = [
    { id: 0, label: "Basic detail" },
    { id: 1, label: "Update Picture" },
    { id: 2, label: "Update Preference" },
    { id: 3, label: "Wallet Address" },
  ];

  const SelectPositionRef = useRef<BottomSheet>(null);
  const addNewCatRef = useRef<BottomSheet>(null);
  const [selectedTab, setSelectedTab] = useState(TopTabBar[0].id);
  const [select, setSelect] = useState<string>("");
  const { onUpdateBasicInfo } = useProfileViewModel();
  const dispatch = useDispatch();
  const {userId} = useAppStore();
  const profileFavouriteData = useSelector(
    (state: any) => state.profileFavouriteData
  );

  useEffect(() => {
    onUpdateProfile();
  }, []);

  const onUpdateProfile = () => {
    // @ts-ignore
    dispatch(onProfileFavouriteUpdate({ userId: userId }));
  };

  const handleTabPress = (TopTabBar) => {
    setSelectedTab(TopTabBar.id);
  };

  const TabBarItem = ({ item, onPress, isSelected }) => (
    <TouchableOpacity
      onPress={() => onPress(item)}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 5,
        margin: 4,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: isSelected
          ? globalColors.darkOrchidShade60
          : globalColors.darkOrchidShade80,
        width: width * 0.4,
      }}
    >
      <Text
        style={{
          color: globalColors.neutral10,
          fontSize: 14,
          fontFamily: fontFamilies.regular,
          textAlign: "center",
        }}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  const Buttons = () => {
    return (
      <TouchableOpacity onPress={() => addNewCatRef.current.expand()}>
        <GradientText
          style={{
            marginRight: 5,
            fontSize: 16,
            lineHeight: 21,
            fontFamily: fontFamilies.semiBold,
            color: globalColors.neutralWhite,
            alignSelf: "center",
            marginTop: 24,
          }}
        >
          {" Add new position"}
        </GradientText>
      </TouchableOpacity>
    );
  };

  const WalletAddress = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: globalColors.neutral7,
            fontSize: 24,
            fontFamily: fontFamilies.semiBold,
          }}
        >
          Pending Wallet Address
        </Text>
      </View>
    );
  };

  return (
    <ViewWrapper>
      <GoBackNavigation header="Edit profile" isDeepLink={true} />
      <View style={{ width: "90%", marginBottom: "25%" }}>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={80} // Adjust based on your header height
        >
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={selectedTab != 2}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              {TopTabBar.map((item) => (
                <TabBarItem
                  key={item.id}
                  item={item}
                  onPress={handleTabPress}
                  isSelected={item.id === selectedTab}
                />
              ))}
            </View>
            <View style={{ height: height * 0.78, marginTop: 10 }}>
              {selectedTab === 0 && (
                <BasicInfoComponent
                  fName={params?.firstName}
                  lName={params?.lastName}
                  sName={params?.socialName}
                  hline={params?.headline}
                />
              )}
              {selectedTab === 1 && (
                <UpdatePicture image={params?.profilePic} />
              )}
              {selectedTab === 2 && (
                <PreferenceScreen catIdData={profileFavouriteData?.data?.category_ids} />
              )}
              {selectedTab === 3 && <WalletAddress />}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <BottomSheetWrap bottomSheetRef={addNewCatRef}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
            }}
          >
            Add new position
          </Text>
          <TextInputComponent placeHolder="Enter new position" />
        </View>
        <Button1 isLoading={false} title="Save" />
        <TouchableOpacity onPress={() => addNewCatRef.current.close()}>
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
      </BottomSheetWrap>

      <BottomSheetWrap bottomSheetRef={SelectPositionRef}>
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
                Add new position
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setSelect("infosys")}
            style={{
              flexDirection: "row",
              marginTop: "5%",
              borderWidth: 0.3,
              borderColor: globalColors.neutral8,
              width: "100%",
              borderRadius: 5,
              justifyContent: "space-between",
              padding: "5%",
            }}
          >
            <Text style={{ color: globalColors.neutral10 }}>
              Php Developer at infosys
            </Text>
            {select === "infosys" ? (
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
            title="Save"
            onPress={() => SelectPositionRef.current.close()}
          />
          <TouchableOpacity onPress={() => SelectPositionRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
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

export default UpdateProfileScreen;
