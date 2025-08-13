import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Dimensions,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { AddIcon, ClearChatIcon, PaperPlaneIcon } from "@/assets/DarkIcon";
import { globalColors } from "@/assets/GlobalColors";
import { fontFamilies } from "@/assets/fonts";
import MediaPost from "@/components/MediaPost";
import ProgressBar from "@/components/ProgressBar";

interface CreatePostProps {
  onPressCameraTwo: () => void;
  imageFileData: any;
  onChangeCaptionHandler: (text: string) => void;
  desc: string;
  onSubmitHomePostHandler: (data: any) => void;
  onSubmitPostHandler: (data: any) => void;
  selectedvideo: any;
  setSelectedVideo: any;
  setImageFileData: any;
  progressVisible: boolean;
  progressValue: number;
  isCreatePostFailed: boolean;
}

const CreatePostComponent: React.FC<CreatePostProps> = ({
  onPressCameraTwo,
  imageFileData,
  onChangeCaptionHandler,
  desc,
  onSubmitHomePostHandler,
  selectedvideo,
  setSelectedVideo,
  setImageFileData,
  onSubmitPostHandler,
  progressVisible,
  progressValue,
  isCreatePostFailed,
}) => {
  return (
    <KeyboardAvoidingView
      style={{ marginBottom: 10 }} // Ensure it takes full height
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
    >
      <View>
      {progressVisible && (
        <ProgressBar progress={progressValue} isFailed={isCreatePostFailed} uploadPostAgain={() => onSubmitPostHandler({groupId: "", isProfile: true})} />
      )}
        { !progressVisible && selectedvideo && selectedvideo.length > 0 && (
          <View style={{ position: "relative", marginHorizontal: 15 }}>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                right: 10,
                zIndex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 20,
                alignSelf: "center",
                padding: 5,
              }}
              onPress={() => {
                setSelectedVideo([]);
              }}
            >
              <ClearChatIcon />
            </TouchableOpacity>
            <MediaPost
              source={{ uri: selectedvideo[0].uri }}
              type={"video"}
              isHome={true}
              isGroup={false}
              display_height={[]}
            />
          </View>
        )}
        {!progressVisible && imageFileData?.length > 0 && (
          <View
            style={{
              position: "relative",
              marginHorizontal: 15,
              alignSelf: "center",
              zIndex: 1,
              width: Dimensions.get("window").width - 30,
            }}
            pointerEvents="box-none" // 💡 Add this
          >
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                borderRadius: 20,
                padding: 5,
              }}
              onPress={() => setImageFileData([])}
            >
              <ClearChatIcon />
            </TouchableOpacity>

            <Image
              style={{
                width: "100%",
                height: 200,
                borderRadius: 15,
                alignSelf: "center",
              }}
              source={{
                uri: imageFileData[0]?.uri || `https://cdn.qoneqt.com/${item}`,
              }}
            />
          </View>
        )}

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: "3%",
            paddingHorizontal: "4%",
          }}
        >
          {/* comment acctechment */}
          <TouchableOpacity style={{}} onPress={onPressCameraTwo}>
            <AddIcon />
          </TouchableOpacity>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                borderColor: globalColors.neutral7,
                borderWidth: 1,
                borderRadius: 12,
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 15,
                // marginBottom: 15,
              }}
            >
              <TextInput
                value={desc}
                onChangeText={(text) => onChangeCaptionHandler(text)}
                placeholder="Create Post"
                placeholderTextColor={globalColors.neutral5}
                style={{
                  flex: 0.8,
                  color: globalColors.neutralWhite,
                  fontSize: 16,
                  height: 42,
                  fontFamily: fontFamilies.regular,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          <TouchableOpacity
          disabled={progressVisible}
            style={{}}
            onPress={() => {
              onSubmitHomePostHandler({ groupId: "", isProfile: true });
              onSubmitPostHandler({ groupId: "", isProfile: true });
            }}
          >
            <PaperPlaneIcon accentHeight={10} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreatePostComponent;
