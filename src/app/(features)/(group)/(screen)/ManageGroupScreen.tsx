import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import Button1 from "../../../../components/buttons/Button1";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CameraIcon,
  ChatIcon,
  DeleteAccountIcon,
  InfoIcon,
  ManageGroupIcon,
  MuteIcon,
  PhotoIcon,
  SocialTokenIcon,
} from "@/assets/DarkIcon";
import BottomSheetWrap from "@/components/bottomSheet/BottomSheetWrap";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const ManageGroupScreen = () => {
  useScreenTracking("ManageGroupScreen");
  const addChannelRef = useRef<BottomSheet>(null);
  const addNewCatRef = useRef<BottomSheet>(null);

  const renderImageSection = () => (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: globalColors.neutral3,
        overflow: "hidden",
        flexDirection: "row",
        padding: "15%",
        marginTop: "10%",
        width: "40%",
        alignSelf: "center",
      }}
    >
      <CameraIcon />
    </View>
  );

  const renderManageMembersButton = () => (
    <TouchableOpacity
      onPress={() => router.push("/ManageMemberScreen")}
      style={{
        borderRadius: 8,
        backgroundColor: globalColors.darkOrchidShade60,
        borderColor: globalColors.neutral4,
        borderWidth: 1,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "2.8%",
        marginTop: "5%",
      }}
    >
      <PhotoIcon />
      <Text
        style={{
          fontSize: 16,
          lineHeight: 18,
          color: globalColors.neutralWhite,
          marginRight: "35%",
        }}
      >
        Manage members
      </Text>
      <ArrowRightIcon />
    </TouchableOpacity>
  );

  return (
    <ViewWrapper>
      <View style={{ width: "90%" }}>
        <GoBackNavigation header="Manage group" isDeepLink={true}/>
        {renderImageSection()}
        <TextInputComponent
          header="Group name"
          placeHolder="Enter Group name"
        />
        <Text
          style={{
            color: globalColors.neutral9,
            marginTop: "2.5%",
          }}
        >
          Group category
        </Text>
        <TouchableOpacity
          onPress={() => addChannelRef.current.expand()}
          style={{
            borderWidth: 0.5,
            borderRadius: 8,
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderStyle: "solid",
            borderColor: globalColors.neutral4,
            padding: "2%",
            marginTop: 12,
          }}
        >
          <Text
            style={{
              color: globalColors.neutral4,
              left: "5%",
              marginTop: "2.5%",
            }}
          >
            Group category
          </Text>
          <ArrowUpIcon style={{ left: "90%", marginTop: "-7%" }} />
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: "stretch",
            fontSize: 12,
            lineHeight: 20,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutral9,
            marginTop: "7%",
          }}
        >
          A category purpose describes your channel and lets people know what to
          expect
        </Text>
        <TextInputComponent
          header="Group description"
          placeHolder="All crypto related news updates will be posted here."
        />
        {renderManageMembersButton()}
        <Button1
          title="Save"
          onPress={() => router.push("/groups")}
          isLoading={false}
        />
      </View>
      <BottomSheetWrap
        snapPoints={["20%", "30%"]}
        bottomSheetRef={addChannelRef}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
            }}
          >
            Select or add your channel category
          </Text>
          <Text
            style={{
              marginTop: "2.5%",
              color: "gray",
              fontSize: 13,
            }}
          >
            You can add only one category per group
          </Text>
          <View style={{ width: "100%", marginTop: "10%" }}></View>
          <TouchableOpacity onPress={() => addNewCatRef.current.expand()}>
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
                  fontSize: 18,
                  right: "25%",
                  marginTop: "7%",
                }}
              >
                Add new category
              </Text>
            </GradientText>
          </TouchableOpacity>

          <Button1
            isLoading={false}
            title="Save"
            onPress={() => addChannelRef.current.close()}
          />
          <TouchableOpacity onPress={() => addChannelRef.current.close()}>
            <GradientText
              style={{
                fontFamily: fontFamilies.semiBold,
                fontSize: 17,
                color: globalColors.warmPink,
              }}
            >
              <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
                Cancel
              </Text>
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      <BottomSheetWrap bottomSheetRef={addNewCatRef}>
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
            }}
          >
            Add new category
          </Text>
          <TextInputComponent placeHolder="Crypto space" />
        </View>
        <Button1
          isLoading={false}
          title="Save"
          onPress={() => addNewCatRef.current.close()}
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
    </ViewWrapper>
  );
};

export default ManageGroupScreen;
