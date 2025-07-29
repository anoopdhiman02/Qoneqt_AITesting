import { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import TextInputComponent from "../../../../components/element/TextInputComponent";
import Button1 from "../../../../components/buttons/Button1";
import { router, useLocalSearchParams } from "expo-router";
import GoBackNavigation from "../../../../components/Header/GoBackNavigation";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import { ArrowUpIcon, CameraIcon, CheckCircleIcon } from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import GradientText from "@/components/element/GradientText";
import {
  requestCameraPermission,
  checkCameraPermission,
  getCameraDevice,
  takeImageFromCamera,
  pickImageFromGallery,
  getCameraFormat,
} from "@/utils/ImageHelper";
import { Image } from "expo-image";
import useCreateChannelViewModel from "@/structure/viewModels/channel/CreateChannelViewModel";
import { Camera, useCameraPermission } from "react-native-vision-camera";
import SelectGroupTypeComponent from "../component/createChannel/SelectGroupTypeComponent";
import useCreateCategoryViewModel from "@/structure/viewModels/channel/CreateCategoryViewModel";
import SelectImageMediaSheet from "../../(group)/component/BottomSheet/SelectImageMediaSheet";
import CameraPermissionComponent from "@/app/(kycOnboarding)/component/CameraPermissionComponent";
import { useChannelStore } from "@/zustand/channelStore";

const groupList = [
  {
    id: 1,
    name: "Public sub-group",
    description:
      "Anybody can join this sub-group and any participants can \nadd people to this group.",
  },
  {
    id: 2,
    name: "Private sub-group",
    description:
      "Only you can add people or accept request to join this \nsub-group.",
  },
];

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

const { width, height } = Dimensions.get("window");
const CreateChannelScreen = () => {
  const params = useLocalSearchParams();
  const { refreshCategory } = useChannelStore();
  const {
    onPressUploadImage,
    imageMediaRef,
    onPressCamera,
    onPressGallary,
    onCaptureImage,
    imageData,
    openCamera,
    device,
    camera,
    format,
    // imageMediaRef,
    channelName,
    onChannelNamehandler,
    onFetchCategory,
    categoryLoading,
    categoryList,
    selectCat,
    onSelectCategory,
    perk,
    onPerkhandler,
    channelLoading,

    uploadImageRef,
    addChannelRef,
    addNewCatRef,
    groupType,
    handleSelectType,
    onCreateChannelHandler,
    onPressAddCategory,
  } = useCreateChannelViewModel();

  const {
    onEnterCategoryHandler,
    categoryName,
    categorySubmitLoading,
    onCreateCategoryHandler,
  } = useCreateCategoryViewModel();

  const onPressSelectCategory = () => {
    onFetchCategory(params?.groupId);
    addChannelRef.current.expand();
  };

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

  useEffect(() => {
    if (refreshCategory) {
      onFetchCategory(params?.groupId);
      addNewCatRef.current.close();
    }
  }, []);
  return (
    <ViewWrapper>
      <View
        style={{
          width: "90%",
          // marginTop: "10%",
          marginBottom: "20%",
        }}
      >
        <GoBackNavigation header="Create Sub-Group" isDeepLink={true} />
        <ScrollView showsVerticalScrollIndicator={false}>
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

          <TextInputComponent
            header="Sub-group name"
            placeHolder="Enter sub-group here"
            value={channelName}
            onChangeText={(text) => onChannelNamehandler(text)}
          />
          <TouchableOpacity
            onPress={() => onPressSelectCategory()}
            style={{
              borderWidth: 0.5,
              borderRadius: 8,
              borderColor: globalColors.neutral4,
              padding: "2.5%",
              marginTop: 12,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: globalColors.neutral1,
            }}
          >
            <Text style={{ color: globalColors.neutral6 }}>
              {selectCat?.category.length === 0
                ? "Select Category"
                : selectCat?.category}
            </Text>
            <ArrowUpIcon />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 13,
              lineHeight: 20,
              fontFamily: fontFamilies.regular,
              color: globalColors.neutral9,
              marginTop: "5%",
            }}
          >
            A category purpose describes your sub-group and lets people know
            what to expect.
          </Text>
          <SelectGroupTypeComponent
            groupList={groupList}
            groupType={groupType}
            onSelectType={handleSelectType}
          />
          {/* {groupType === 2 && (
            <TextInputComponent
              keyboardType={"number-pad"}
              header="Add Perks"
              placeHolder="Enter Perks"
              value={perk}
              onChangeText={(text) => onPerkhandler(text)}
            />
          )} */}
          <Button1
            isLoading={channelLoading}
            title="Continue"
            onPress={() => onCreateChannelHandler({ groupId: params?.groupId })}
          />
        </ScrollView>
      </View>

      <SelectImageMediaSheet
        imageMediaRef={imageMediaRef}
        imageFileData={imageData}
        imageData={imageData}
        onPressCamera={onPressCamera}
        onPressGallary={onPressGallary}
      />

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={addChannelRef}
      >
        <View
          style={{
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              fontFamily: fontFamilies.semiBold,
              textAlign: "center",
            }}
          >
            Select or add your sub-group category
          </Text>
          <Text
            style={{
              color: "gray",
              fontSize: 13,
              textAlign: "center",
              // marginBottom: 16,
            }}
          >
            You can add only one category per group
          </Text>

          <ScrollView
            style={{
              width: "100%",
              marginTop: "2%",
              height: 220,
            }}
          >
            {categoryList && categoryList.length > 0 ? (
              categoryList.map((item) => {
                return (
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
                      backgroundColor: "rgba(255, 255, 255, 0.05)", // Slight background color for hover effect
                    }}
                  >
                    {/* Selection Icon */}
                    {selectCat?.id === item.id ? (
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

                    {/* Category Name */}
                    <Text
                      style={{
                        color: globalColors.neutralWhite,
                        fontSize: 14,
                        marginLeft: 12, // Space between icon and text
                        fontFamily: fontFamilies.regular,
                      }}
                    >
                      {item.category}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text
                style={{
                  color: globalColors.neutral6,
                  alignSelf: "center",
                  marginTop: "7%",
                }}
              >
                No categories available
              </Text>
            )}
          </ScrollView>

          <TouchableOpacity onPress={onPressAddCategory}>
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 17,
                // marginTop: "5%",
              }}
            >
              Add new Category
            </Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <Button1
            isLoading={false}
            title="Save"
            onPress={() => addChannelRef.current.close()}
            style={{
              // marginTop: 20,
              // marginBottom: 8,
              width: "90%",
            }}
          />
          <TouchableOpacity
            onPress={() => addChannelRef.current.close()}
            style={{ marginTop: -5 }}
          >
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
      </BottomSheetWrap>

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={addNewCatRef}
      >
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 20,
            }}
          >
            Add new category
          </Text>
          <TextInputComponent
            placeHolder="Enter Category Name"
            value={categoryName}
            onChangeText={(text) => onEnterCategoryHandler(text)}
          />
        </View>
        <Button1
          isLoading={false}
          title="Save"
          onPress={() => {
            onCreateCategoryHandler({ groupId: params?.groupId }),
              addNewCatRef.current.close();
          }}
        />
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
    </ViewWrapper>
  );
};

export default CreateChannelScreen;
