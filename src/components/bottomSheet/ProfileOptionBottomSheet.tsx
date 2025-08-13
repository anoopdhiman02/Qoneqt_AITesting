import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import BottomSheetWrap from "./BottomSheetWrap";
import { globalColors } from "@/assets/GlobalColors";
import {
  BlockUserIcon,
  ClearChatIcon,
  DeleteIcon,
  EditPostIcon,
  InfoIcon,
} from "@/assets/DarkIcon";
import GradientText from "../element/GradientText";
import Button1 from "../buttons/Button1";
import { fontFamilies } from "@/assets/fonts";
import { usePostDetailStore } from "@/zustand/PostDetailStore";
import { useAppStore } from "@/zustand/zustandStore";
import { checkIsExistTime } from '../../utils/dateFormat';

interface ProfileOptionBottomSheetProps {
  profileOptionRef: any;
  onPressReportOption: any;
  onPressBlockOption: any;
  screen: any;
  screen_type: any;
  onDeletePostOption: any;
  postGroupData?: any;
  userId?: any;
  postedByUserId?: any;
  isBlock?: any;
  onPressEditOption?: any;
}

const ProfileOptionBottomSheet: FC<ProfileOptionBottomSheetProps> = ({
  profileOptionRef,
  onPressReportOption,
  onPressBlockOption,
  screen,
  screen_type,
  onDeletePostOption,
  postGroupData,
  userId,
  postedByUserId,
  isBlock,
  onPressEditOption
}) => {
  const { postValue } = usePostDetailStore();
  const isExistTime = postValue?.time ? checkIsExistTime(postValue?.time) : false;
  return (
    <BottomSheetWrap
      bottomSheetRef={profileOptionRef}
      snapPoints={ screen_type == "post" ? ["20%", "40%"] : ["50%", "50%"]}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: globalColors.neutralWhite, fontSize: 22 }}>
          {`${screen} option`}
        </Text>
        {(screen !== "post" || postedByUserId != userId) && (
        <View style={{ width: "100%" }}>
          <TouchableOpacity
            onPress={onPressReportOption}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginLeft: "3%",
              marginTop: "4%",
            }}
          >
            <View
              style={{
                padding: "1%",
                borderRadius: 10,
                marginRight: "3%",
                backgroundColor: globalColors.darkOrchidShade60,
              }}
            >
              <InfoIcon />
            </View>
            <Text style={{ color: globalColors.neutralWhite, fontSize: 18 }}>
              Report
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressBlockOption}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginLeft: "3%",
              marginTop: "6%",
            }}
          >
            <View
              style={{
                padding: "1%",
                borderRadius: 10,
                marginRight: "3%",
                backgroundColor: globalColors.darkOrchidShade60,
              }}
            >
              <BlockUserIcon />
            </View>
            <Text style={{ color: globalColors.neutralWhite, fontSize: 18 }}>
              {isBlock ? "Unblock" : "Block"}
            </Text>
          </TouchableOpacity>
        </View>
        )}
        {postedByUserId == userId && isExistTime && (
          <TouchableOpacity
            onPress={onPressEditOption}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginLeft: "3%",
              marginTop: "4%",
            }}
          >
            <View
              style={{
                padding: "1%",
                borderRadius: 10,
                marginRight: "3%",
                backgroundColor: globalColors.darkOrchidShade60,
              }}
            >
              <EditPostIcon width={25} height={25} />
            </View>
            <Text style={{ color: globalColors.neutralWhite, fontSize: 18 }}>
              Edit Post
            </Text>
          </TouchableOpacity>
        )}
        {screen == "post" && (postedByUserId == userId || postGroupData?.my_role?.role == "1") && (
          <TouchableOpacity
            onPress={() => {
              onDeletePostOption();
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginLeft: "3%",
              marginTop: "6%",
            }}
          >
            <View
              style={{
                padding: "1%",
                borderRadius: 10,
                marginRight: "3%",
                backgroundColor: globalColors.darkOrchidShade60,
              }}
            >
              <DeleteIcon width={25} height={25} />
            </View>
            <Text style={{ color: globalColors.neutralWhite, fontSize: 18 }}>
              Delete Post
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </BottomSheetWrap>
  );
};

const ChatOptionBottomSheet = ({
  profileOptionRef,
  onPressReportOption,
  onPressBlockOption,
  onPressClearOption,
  screen,
  block = true
}) => {
  return (
    <BottomSheetWrap
      bottomSheetRef={profileOptionRef}
      snapPoints={["20%", "35%"]}
    >
      <View style={{ alignItems: "center" }}>
        <Text style={{ color: globalColors.neutralWhite, fontSize: 22 }}>
          {`${screen} option`}
        </Text>
        <TouchableOpacity
          onPress={() => onPressReportOption()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginLeft: "3%",
            top: "8%",
          }}
        >
          <View
            style={{
              padding: "1%",
              borderRadius: 10,
              marginRight: 10,
              backgroundColor: globalColors.neutral3,
            }}
          >
            <InfoIcon />
          </View>

          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              marginTop: "1%",
            }}
          >
            Report
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onPressBlockOption()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginLeft: "3%",
            top: "12%",
          }}
        >
          <View
            style={{
              padding: "1%",
              borderRadius: 10,
              marginRight: 10,
              backgroundColor: globalColors.neutral3,
            }}
          >
            <BlockUserIcon />
          </View>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              marginTop: "1%",
            }}
          >
            {block ? "Block" : "Unblock"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPressClearOption()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            marginLeft: "3%",
            marginTop: "3%",
            top: "12%",
          }}
        >
          <View
            style={{
              padding: "1%",
              borderRadius: 10,
              marginRight: 10,
              backgroundColor: globalColors.neutral3,
            }}
          >
            <ClearChatIcon />
          </View>
          <Text
            style={{
              color: globalColors.neutralWhite,
              fontSize: 18,
              marginTop: "1%",
            }}
          >
            Clear Chat
          </Text>
        </TouchableOpacity>
      </View>
    </BottomSheetWrap>
  );
};

const DeleteMessageBottomSheet = ({
  DeleteMessageRef,
  handleDeleteMessage,
}) => {
  return (
    <BottomSheetWrap
      bottomSheetRef={DeleteMessageRef}
      snapPoints={["15%", "40%"]}
    >
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
            }}
          >
            Delete message
          </Text>
        </View>
        <View
          style={{
            padding: "1%",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            Are you sure you want to delete this message?
          </Text>
        </View>

        <Button1
          isLoading={false}
          title="Delete"
          onPress={handleDeleteMessage}
        />
        <TouchableOpacity
          onPress={() => {
            DeleteMessageRef.current.close();
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
            <Text style={{ color: globalColors.neutralWhite, fontSize: 17 }}>
              Cancel
            </Text>
          </GradientText>
        </TouchableOpacity>
      </View>
    </BottomSheetWrap>
  );
};

export default ProfileOptionBottomSheet;

export { ChatOptionBottomSheet, DeleteMessageBottomSheet };

const styles = StyleSheet.create({});
