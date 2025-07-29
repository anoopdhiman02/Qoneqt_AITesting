import { useState, useRef, useEffect, useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View, Modal } from "react-native";
import ViewWrapper from "../../../../components/ViewWrapper";
import Button1 from "../../../../components/buttons/Button1";
import BottomSheetWrap from "../../../../components/bottomSheet/BottomSheetWrap";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  AnnouncementIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  FeedIcon,
} from "@/assets/DarkIcon";
import { fontFamilies } from "@/assets/fonts";
import { globalColors } from "@/assets/GlobalColors";
import { useAppDispatch } from "@/utils/Hooks";
import ChannelDetailsTopComponent from "../component/ChannelDetailsTopComponent";
import GradientText from "@/components/element/GradientText";
import CategoryContainer from "../component/CategoryContainer";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { useAppStore } from "@/zustand/zustandStore";
import { useChannelStore } from "@/zustand/channelStore";
import useChannelGroupInfoViewModel from "../viewModel/ChannelGroupInfoViewModel";
import CategoryOptionSheet from "../component/bottomSheet/CategoryOptionSheet";
import EditCategorySheet from "../component/bottomSheet/EditCategorySheet";
import DeleteCategorySheet from "../component/bottomSheet/DeleteCategorySheet";
import AddNewCategorySheet from "../component/bottomSheet/AddNewCategorySheet";
import ChannelOptionSheet from "../component/bottomSheet/ChannelOptionSheet";
import UserProfile from "./UserProfile";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const ChannelGroupInfoScreen = () => {
  const params = useLocalSearchParams();
  const { groupId, groupDetails, userGroupRole, refreshChannel } =
    useChannelStore();
  const {
    setCategoryId,
    setCategoryDetails,
    setUserCategoryRole,
    categoryId,
    categoryDetails,
    userCategoryRole,
  } = useChannelStore();
  const {
    setChannelId,
    setChannelDetails,
    setUserChannelRole,
    channelId,
    channelDetails,
    userChannelRole,
  } = useChannelStore();
  const Dispatch = useAppDispatch();
  const { userId } = useAppStore();

  const {
    onFetchGroupInfoHandler,
    loading,
    groupData,
    deleteCatLoading,

    //category list
    onPressCategoryOption,
    onPressEditCategory,
    onSubmitEditCategoryName,
    onSubmitDeleteCategory,
    CategoryOptionRef,
    EditCategoryRef,
    DeleteCategoryRef,
    onDeleteCategoryOption,
    onFetchCategory,
    categoryList,
    selectCat,
    onSelectCategory,
    categoryLoading,
    onPressAddNewCategory,
    addNewCatNameRef,
    categoryName,
    categorySubmitLoading,
    onCreateCategoryHandler,
    onEnterCategoryHandler,

    //channel module
    onPressChannelHandler,
    onPressLongChannelHandler,
    selectedChannel,
    showChannelOption,

    onPressChannelInfoHandler,
    MoreRef,

    //role
    userGroupRoleState,
  }: any = useChannelGroupInfoViewModel();

  const SendReqRef = useRef<BottomSheet>(null);
  const MuteNotifiRef = useRef<BottomSheet>(null);
  const EditRenameRef = useRef<BottomSheet>(null);
  const ClearConRef = useRef<BottomSheet>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [select, setSelect] = useState('');

  useFocusEffect(
    useCallback(() => {
      onFetchGroupInfoHandler({ groupId: params?.id });
    }, [params?.id])
  );

  const MiddleComponent = () => {
    return (
      <View
        style={{
          borderRadius: 8,
          backgroundColor: globalColors.neutral2,
          borderStyle: "solid",
          borderColor: "#282b32",
          borderWidth: 1,
          padding: 16,
          marginTop: "10%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/groups",
              params: { groupId: groupId },
            });
          }}
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <FeedIcon />
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                left: "20%",
              }}
            >
              Feed
            </Text>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
        <View
          style={{
            borderStyle: "solid",
            borderColor: "rgba(255, 255, 255, 0.15)",
            borderTopWidth: 0.5,
            height: 1,
            marginTop: "5%",
          }}
        />
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/groups",
              params: { groupId: groupId },
            });
          }}
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            marginTop: "5%",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <AnnouncementIcon />
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 18,
                left: "20%",
              }}
            >
              Announcements
            </Text>
          </View>
          <ArrowRightIcon />
        </TouchableOpacity>
      </View>
    );
  };

  const ChannelHeader = () => {
    return (
      <Text
        style={{
          alignSelf: "stretch",
          fontSize: 20,
          fontFamily: fontFamilies.light,
          color: globalColors.neutralWhite,
          marginVertical: 16,
        }}
      >
        Sub-group Category
      </Text>
    );
  };

  const onPressCreateChannel = () => {};

  const onPressChannelOption = ({ channelId }) => {
    MoreRef?.current?.expand();
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

  return (
    <ViewWrapper>
      <ScrollView
        style={{ flex: 1, width: "90%" }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <RenderShimmer />
        ) : (
          <ChannelDetailsTopComponent
            groupId={groupId}
            name={groupData?.loop_name || ""}
            channelCount={groupData?.channels_aggregate?.aggregate?.count || 0}
            logo={groupData?.loop_logo || ""}
            memberCount={groupData?.members_aggregate?.aggregate?.count || 0}
            onCreateChannel={() => onPressCreateChannel()}
            userRole={userGroupRoleState}
          />
        )}
        {loading ? (
          <ShimmerPlaceholder
            style={{ height: 100, marginBottom: 20, width: "100%" }}
            shimmerColors={["#333", "#666", "#333"]}
            shimmerStyle={{ borderRadius: 8 }}
          />
        ) : (
          <MiddleComponent />
        )}
        {/* <ChannelHeader />
        {loading ? (
          <>
            <ShimmerPlaceholder
              style={{ height: 50, marginBottom: 10, width: "100%" }}
              shimmerColors={["#333", "#666", "#333"]}
              shimmerStyle={{ borderRadius: 8 }}
            />
            <ShimmerPlaceholder
              style={{ height: 50, marginBottom: 10, width: "100%" }}
              shimmerColors={["#333", "#666", "#333"]}
              shimmerStyle={{ borderRadius: 8 }}
            />
            <ShimmerPlaceholder
              style={{ height: 50, marginBottom: 10, width: "100%" }}
              shimmerColors={["#333", "#666", "#333"]}
              shimmerStyle={{ borderRadius: 8 }}
            />
          </>
        ) : (
          <CategoryContainer
            data={groupData?.channel_categories}
            onPressCategoryOption={onPressCategoryOption}
            //channel module
            onPressChannelHandler={onPressChannelHandler}
            onPressLongChannelHandler={onPressLongChannelHandler}
            selectedChannel={selectedChannel}
            showChannelOption={showChannelOption}
            onPressChannelOption={onPressChannelOption}
            // SendReqRef={SendReqRef}
            // DeleteCategoryRef={DeleteCategoryRef
            // MuteNotifiRef={MuteNotifiRef}
            // onPressOption={onPressChannelOption}
          />
        )} */}
      </ScrollView>
      <CategoryOptionSheet
        CategoryOptionRef={CategoryOptionRef}
        onPressEditCategory={onPressEditCategory}
        onPressDelereCategory={onDeleteCategoryOption}
        onPressClose={() => EditCategoryRef.current.close()}
      />

      <EditCategorySheet
        EditCategoryRef={EditCategoryRef}
        categoryList={categoryList}
        onSelectCategory={onSelectCategory}
        selectCat={selectCat}
        onPressAddNewCategory={onPressAddNewCategory}
        onSubmitEditCategoryName={onSubmitEditCategoryName}
      />

      <AddNewCategorySheet
        addNewCatNameRef={addNewCatNameRef}
        categoryName={categoryName}
        onEnterCategoryHandler={onEnterCategoryHandler}
        onCreateCategoryHandler={onCreateCategoryHandler}
      />

      <DeleteCategorySheet
        DeleteCategoryRef={DeleteCategoryRef}
        onSubmitDeleteCategory={onSubmitDeleteCategory}
      />

      <ChannelOptionSheet
        MoreRef={MoreRef}
        isMuted={false}
        MuteNotifiRef={MuteNotifiRef}
        ClearConRef={ClearConRef}
        onPressChannelInfo={onPressChannelInfoHandler}
      />

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={MuteNotifiRef}
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
                  padding: "1%",
                  borderRadius: 10,
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
            <Text style={{ color: "gray" }}>8 hours</Text>
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
            <Text style={{ color: "gray" }}>1 week</Text>
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
            <Text style={{ color: "gray" }}>Always</Text>
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

          <Button1 title="Mute" onPress={() => MuteNotifiRef.current.close()} />
          <TouchableOpacity onPress={() => MuteNotifiRef.current.close()}>
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

      <BottomSheetWrap snapPoints={["20%", "40%"]} bottomSheetRef={SendReqRef}>
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
                fontSize: 22,
                textAlign: "center",
              }}
            >
              Join sub-group
            </Text>
          </View>
          <Text
            style={{
              marginTop: "2.5%",
              color: globalColors.neutralWhite,
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Oops! You don't have enough perk balance to join the sub-group.
          </Text>
          <Text
            style={{
              marginTop: "1%",
              color: globalColors.neutralWhite,
              fontSize: 12,
              textAlign: "center",
            }}
          >
            <Text style={{ color: "grey" }}>
              This sub-group requires 12000 perks to
            </Text>
            {"  "}
            join.
          </Text>
          <View
            style={{ marginBottom: "-45%", marginTop: "8%", width: "100%" }}
          >
            <UserProfile />
          </View>
          <Text style={{ color: globalColors.neutralWhite, fontSize: 12 }}>
            You can request for a min of 10 to max of 100 perks a day to the
            admin.
          </Text>
          <Button1
            isLoading={false}
            title="Send request"
            onPress={() => setModalVisible(true)}
          />
          <TouchableOpacity onPress={() => SendReqRef.current.close()}>
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

      <BottomSheetWrap
        snapPoints={["20%", "40%"]}
        bottomSheetRef={EditRenameRef}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              alignItems: "center",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: globalColors.neutralWhite,
                fontSize: 20,
              }}
            >
              Edit category
            </Text>
          </View>
          <View style={{ width: "100%" }}>
            <Text
              style={{
                color: globalColors.neutralWhite,
                textAlign: "center",
                marginTop: "3%",
                fontSize: 16,
                marginBottom: "2%",
              }}
            >
              Please rename to proceed.
            </Text>
            <Text
              style={{
                color: globalColors.neutral9,
                textAlign: "center",
                fontSize: 14,
              }}
            >
              There is a sub-group category with the similar name as{" "}
              <Text style={{ color: globalColors.neutralWhite }}>"Travel"</Text>
              . It's advisable to use unique sub-group category names for better
              identification.
            </Text>
          </View>
        </View>
        <Button1
          isLoading={false}
          title="Rename"
          onPress={() => EditRenameRef.current.close()}
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

      <BottomSheetWrap snapPoints={["20%", "40%"]} bottomSheetRef={ClearConRef}>
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
              backgroundColor: globalColors.slateBlueShade40,
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
export default ChannelGroupInfoScreen;
