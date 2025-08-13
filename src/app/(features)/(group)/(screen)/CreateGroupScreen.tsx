import React, { useRef, useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import Button1 from "../../../../components/buttons/Button1";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import BottomSheet from "@gorhom/bottom-sheet";
import { ArrowUpIcon, CameraIcon, CheckCircleIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import useCreateGroupViewModel from "@/structure/viewModels/group/CreateGroupViewModel";
import {
  Camera,
  useCameraFormat,
  useCameraPermission,
} from "react-native-vision-camera";
import { Image } from "expo-image";
import CameraPermissionComponent from "@/app/(kycOnboarding)/component/CameraPermissionComponent";
import SubscriptionTypeSheet from "../component/BottomSheet/SubscriptionTypeSheet";
import FeeDistributionsSheet from "../component/BottomSheet/FeeDistributionsSheet";
import SelectImageMediaSheet from "../component/BottomSheet/SelectImageMediaSheet";
import { useAppSelector } from "@/utils/Hooks";
import { useScreenTracking } from "@/customHooks/useAnalytics";

const { width, height } = Dimensions.get("window");

const EmptyImageComponent = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      borderRadius: 16,
      backgroundColor: globalColors.neutral4,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      padding: 36,
      width: 120,
      height: 120,
    }}
  >
    <CameraIcon color={globalColors.neutralWhite} />
  </TouchableOpacity>
);

const groupList = [
  {
    id: 2,
    name: "Private group",
    description:
      "Only you can add people or accept requests to join this group.",
  },
  {
    id: 1,
    name: "Public group",
    description:
      "Anybody can join this group and any participants can add people to this group.",
  },
  // {
  //   id: 3,
  //   name: "Paid group",
  //   description:
  //     "Only you can add people or accept requests to join this group. The subscription fees can be collected by your choice of preference.",
  // },
];

const SelectGroupComponent = ({ groupType, handleSelect }) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{
          fontSize: 16,
          fontFamily: fontFamilies.medium,
          color: globalColors.neutralWhite,
          marginBottom: 10,
        }}
      >
        Select group type
      </Text>
      {groupList.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={{
            marginBottom: 15,
            backgroundColor: globalColors.slateBlueShade80,
            borderRadius: 8,
            padding: 12,
          }}
          onPress={() => handleSelect({ id: item.id })}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            {groupType === item.id ? (
              <CheckCircleIcon color={globalColors.darkOrchid} />
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: globalColors.neutral5,
                }}
              />
            )}
            <Text
              style={{
                marginLeft: 10,
                fontSize: 14,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,
              }}
            >
              {item.name}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral8,
              marginLeft: 30,
            }}
          >
            {item.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CreateGroupScreen = () => {
  useScreenTracking("CreateGroupScreen");
  const {
    onPressUploadImage,
    imageMediaRef,
    onEnterNameHandler,
    onEnterDescHandler,
    onSelectTypeHandler,
    groupType,
    onPressCategory,
    onCloseCategory,
    subsTypeModal,
    subsTypeRef,
    onPressSubsType,
    onCloseSubsType,
    feeModal,
    onPressFessDistribution,
    onCloseFessDistribution,
    onSelectCategory,
    onSelectSubsType,
    onSelectFeeDistribution,
    submitLoading,
    groupName,
    desc,
    subsType,
    feeDistribution,
    category,
    amount,
    categoryList,
    onFetchListHandler,
    loading,
    addChannelRef,
    onPressCamera,
    onPressGallary,
    onCaptureImage,
    imageData,
    openCamera,
    device,
    format,
    camera,
    feesDistributionRef,

    onSubmitGroupHandler,
  }: any = useCreateGroupViewModel();

  const addNewCatRef = useRef<BottomSheet>(null);
  const createdGroupData = useAppSelector((state) => state.createGroupData);

  const { hasPermission, requestPermission } = useCameraPermission();

  const [permission, setPermission] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      setPermission(false);

      // return <CameraPermissionComponent onPress={requestPermission} />;
    } else {
      setPermission(true);
    }
  }, []);

  return (
    <ViewWrapper>
      {/* <LinearGradient
        colors={[globalColors.slateBlueShade80, globalColors.neutral1]}
        style={{ flex: 1, padding: 20 }}
      > */}
      <GoBackNavigation header="Create Groups" isDeepLink={true} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={{ width: "90%" }}
      >
        <View style={{ alignItems: "center", marginVertical: 20 }}>
          {hasPermission ? (
            imageData.length === 0 ? (
              openCamera ? (
                <View
                  style={{
                    width: "90%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Camera
                    style={{
                      width: (width * 80) / 100,
                      height: (width * 80 * (120 / 180)) / 100,
                      borderRadius: 15,
                      overflow: "hidden",
                      backgroundColor: globalColors.bgDark2,
                      // marginTop: "10%",
                    }}
                    device={device}
                    isActive={true}
                    ref={camera}
                    photo={true}
                    // format={format}
                  />
                  <Button1 title="Capture" onPress={onCaptureImage} />
                </View>
              ) : (
                <EmptyImageComponent onPress={onPressUploadImage} />
              )
            ) : (
              <TouchableOpacity onPress={onPressUploadImage}>
                <Image
                  style={{
                    width: (width * 80) / 100,
                    height: (width * 80 * (120 / 180)) / 100,
                    borderRadius: 15,
                  }}
                  contentFit="cover"
                  source={{ uri: `file://${imageData}` }}
                />
              </TouchableOpacity>
            )
          ) : (
            // <PermissionComponent onPress={requestPermission} />
            <TouchableOpacity
              onPress={() => requestPermission()}
              style={{
                borderRadius: 16,
                backgroundColor: globalColors.bgDark3,
                overflow: "hidden",
                alignItems: "center",
                padding: "12%",
                width: 120,
                height: 120,
              }}
            >
              <CameraIcon />
            </TouchableOpacity>
          )}
        </View>
        <Text style={{ alignItems:"center", color:globalColors.neutralWhite,alignSelf:"center",fontSize:17}}>Upload Logo</Text>

        <TextInputComponent
          style={{ marginBottom: 15 ,}}
          header="Group name"
          placeHolder="Enter Group name"
          onChangeText={(text) => onEnterNameHandler(text)}
          value={groupName}
          textColor={globalColors.neutralWhite}
          placeholderTextColor={globalColors.neutral4}
        />

        <TouchableOpacity
          onPress={onPressCategory}
          style={{
            borderWidth: 1,
            borderRadius: 8,
            borderColor: globalColors.neutral4,
            padding: 12,
            marginBottom: 10,
            marginTop: "5%",
          }}
        >
          <Text style={{ color: globalColors.neutral4 }}>
            {category ? category.value : "Group category"}
          </Text>
          <ArrowUpIcon style={{ position: "absolute", right: 12, top: 5 }} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 12,
            fontFamily: fontFamilies.regular,
            color: globalColors.neutral8,
            marginBottom: 15,
          }}
        >
          A category purpose describes your group and lets people know what to
          expect.
        </Text>

        <TextInputComponent
          style={{ marginBottom: 15 }}
          header="Group description"
          placeHolder="Add a small description for your group..."
          onChangeText={(text) => onEnterDescHandler(text)}
          value={desc}
          textColor={globalColors.neutralWhite}
          placeholderTextColor={globalColors.neutral4}
        />

        <SelectGroupComponent
          groupType={groupType}
          handleSelect={onSelectTypeHandler}
        />

        {groupType === 3 && (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: fontFamilies.medium,
                color: globalColors.neutralWhite,
                marginBottom: 10,
              }}
            >
              Subscription type
            </Text>
            <TouchableOpacity
              onPress={onPressSubsType}
              style={{
                borderWidth: 1,
                borderRadius: 8,
                borderColor: globalColors.neutral4,
                padding: 12,
              }}
            >
              <Text style={{ color: globalColors.neutral4 }}>
                {subsType.value}
              </Text>
              <ArrowUpIcon
                style={{ position: "absolute", right: 12, top: 12 }}
              />
            </TouchableOpacity>

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%" }}
            >
              <TextInputComponent
                keyboardType={"numeric"}
                header="Member fee"
                placeHolder="Enter Member fee"
                onChangeText={(text) => onEnterNameHandler(text)}
                value={groupName}
              />
            </KeyboardAvoidingView>

            <Text
              style={{
                fontSize: 14,
                lineHeight: 18,
                fontFamily: fontFamilies.regular,
                color: globalColors.neutralWhite,
                display: "flex",
                alignItems: "center",
                width: "100%",
                marginTop: "5%",
              }}
            >
              Fee distribution
            </Text>
            <TouchableOpacity
              onPress={onPressFessDistribution}
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
                {feeDistribution.name}
              </Text>
              <ArrowUpIcon style={{ left: "90%", marginTop: "-7%" }} />
            </TouchableOpacity>
          </View>
        )}

        <Button1
          containerStyle={{ marginTop: "10%" }}
          isLoading={createdGroupData?.isLoaded}
          title="Continue"
          onPress={onSubmitGroupHandler}
        />
      </ScrollView>
      {/* </LinearGradient> */}

      <SelectImageMediaSheet
        imageMediaRef={imageMediaRef}
        imageFileData={imageData}
        imageData={imageData}
        onPressCamera={onPressCamera}
        onPressGallary={onPressGallary}
      />

      <BottomSheetWrap bottomSheetRef={addChannelRef}>
        <View style={{ flex: 1, paddingTop: "7%" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              width: "100%",
            }}
          >
            Select category
          </Text>
          <Text
            style={{
              color: globalColors.neutral6,
              fontSize: 16,
              marginTop: "2%",
            }}
          >
            You can add only one category per group
          </Text>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingTop: "10%" }}
          >
            {categoryList.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => onSelectCategory(item)}
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  marginBottom: 8,
                  borderRadius: 8,
                  borderColor: globalColors.slateBlueShade60,
                  borderWidth: 1,
                }}
              >
                {category?.id === item.id ? (
                  <CheckCircleIcon color={globalColors.darkOrchid} />
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
                <Text
                  style={{
                    color: globalColors.neutralWhite,
                    fontSize: 14,
                    marginLeft: 12,
                    fontFamily: fontFamilies.regular,
                  }}
                >
                  {item.category_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{ marginTop: 20 }}>
            <Button1
              isLoading={false}
              title="Save"
              onPress={() => addChannelRef.current.close()}
            />
            <TouchableOpacity
              onPress={() => addChannelRef.current.close()}
              style={{ marginTop: 10, alignItems: "center" }}
            >
              <GradientText
                style={{
                  fontFamily: fontFamilies.semiBold,
                  fontSize: 17,
                }}
              >
                Cancel
              </GradientText>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "30%"]}
        bottomSheetRef={addNewCatRef}
      >
        <View style={{ alignItems: "center", padding: 20 }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
              marginBottom: 20,
            }}
          >
            Add new category
          </Text>
          <TextInputComponent placeHolder="Crypto space" />
          <Button1
            containerStyle={{ marginTop: 20 }}
            isLoading={false}
            title="Save"
            onPress={() => addNewCatRef.current.close()}
          />
          <TouchableOpacity
            onPress={() => addNewCatRef.current.close()}
            style={{ marginTop: 10 }}
          >
            <GradientText
              style={{
                fontFamily: fontFamilies.bold,
                fontSize: 17,
              }}
            >
              Cancel
            </GradientText>
          </TouchableOpacity>
        </View>
      </BottomSheetWrap>

      <SubscriptionTypeSheet
        subsTypeRef={subsTypeRef}
        onSelectSubsType={onSelectSubsType}
        selectedSubsType={subsType}
      />

      <FeeDistributionsSheet
        feesDistributionRef={feesDistributionRef}
        onSelectFeeDistribution={onSelectFeeDistribution}
        feeDistribution={feeDistribution}
      />
    </ViewWrapper>
  );
};

export default CreateGroupScreen;
